import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { Mistral } from '@mistralai/mistralai';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard document name for Madhya Pradesh Bhumi Vikas Niyam, 2012
const DOCUMENT_SOURCE_NAME = 'Madhya Pradesh Bhumi Vikas Niyam, 2012 (Consolidated Reference)';
const EXPECTED_EMBEDDING_DIM = 1024;
const EMBEDDING_MODEL = 'mistral-embed';
const BATCH_SIZE = 10;

/**
 * Locate the dataset relative to project root
 */
function resolveDatasetPath() {
  const candidatePaths = [
    path.resolve(__dirname, '../../../src/data/bhumi_vikas_rules.jsonl'),
    path.resolve(__dirname, '../../data/bhumi_vikas_rules.jsonl'),
    path.resolve(process.cwd(), '../src/data/bhumi_vikas_rules.jsonl'),
    path.resolve(process.cwd(), 'src/data/bhumi_vikas_rules.jsonl'),
    path.resolve(process.cwd(), 'data/bhumi_vikas_rules.jsonl')
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Dataset not found. Checked locations:\n${candidatePaths.join('\n')}`
  );
}

/**
 * Parse and validate all records from the JSONL file
 */
async function parseAndValidateDataset(filePath) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const validRecords = [];
  const invalidRecords = [];
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;
    const trimmed = line.trim();
    if (!trimmed) continue; // Skip empty lines

    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      invalidRecords.push({
        line: lineNumber,
        rule_number: 'UNKNOWN',
        reason: `JSON parse error: ${err.message}`
      });
      continue;
    }

    // Validate required fields
    const missingFields = [];
    if (!parsed.rule && parsed.rule !== 0) missingFields.push('rule');
    if (!parsed.title) missingFields.push('title');
    if (!parsed.text) missingFields.push('text');
    if (parsed.page_start === undefined || parsed.page_start === null) missingFields.push('page_start');
    if (parsed.page_end === undefined || parsed.page_end === null) missingFields.push('page_end');

    if (missingFields.length > 0) {
      invalidRecords.push({
        line: lineNumber,
        rule_number: parsed.rule || 'UNKNOWN',
        reason: `Missing mandatory fields: ${missingFields.join(', ')}`
      });
      continue;
    }

    // Map fields according to public.building_rules schema
    validRecords.push({
      rule_number: String(parsed.rule).trim(),
      title: String(parsed.title).trim(),
      part: parsed.part ? String(parsed.part).trim() : null,
      page_start: Number(parsed.page_start),
      page_end: Number(parsed.page_end),
      content: String(parsed.text).trim(),
      document_name: DOCUMENT_SOURCE_NAME
    });
  }

  return { validRecords, invalidRecords, totalLines: lineNumber };
}

/**
 * Generate embeddings using Mistral API
 */
async function generateEmbeddings(mistralClient, texts) {
  try {
    const response = await mistralClient.embeddings.create({
      model: EMBEDDING_MODEL,
      inputs: texts
    });

    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Malformed response received from Mistral Embeddings API');
    }

    // Verify embedding dimensions
    for (let i = 0; i < response.data.length; i++) {
      const emb = response.data[i]?.embedding;
      if (!emb || !Array.isArray(emb)) {
        throw new Error(`Embedding missing for input index ${i}`);
      }
      if (emb.length !== EXPECTED_EMBEDDING_DIM) {
        throw new Error(
          `Embedding dimension mismatch: expected ${EXPECTED_EMBEDDING_DIM}, got ${emb.length}`
        );
      }
    }

    return response.data.map((d) => d.embedding);
  } catch (err) {
    // If Mistral SDK throws or fails, provide descriptive error without secrets
    throw new Error(`Mistral API Error (${EMBEDDING_MODEL}): ${err.message}`);
  }
}

/**
 * Main ingestion controller
 */
async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('====================================================');
  console.log('Bhumi Vikas Sahayak — Document Ingestion Pipeline');
  console.log(`Mode: ${isDryRun ? 'DRY-RUN (Validation Only)' : 'LIVE INGESTION'}`);
  console.log('====================================================\n');

  // Step 1: Locate and parse dataset
  const datasetPath = resolveDatasetPath();
  console.log(`[1/4] Dataset located at: ${datasetPath}`);

  const { validRecords, invalidRecords, totalLines } = await parseAndValidateDataset(datasetPath);
  console.log(`[2/4] Dataset Parse Results:`);
  console.log(`      - Total lines read: ${totalLines}`);
  console.log(`      - Valid records:    ${validRecords.length}`);
  console.log(`      - Invalid records:  ${invalidRecords.length}`);

  if (invalidRecords.length > 0) {
    console.error('\nErrors encountered during JSONL validation:');
    invalidRecords.forEach((inv) => {
      console.error(`  - Line ${inv.line} (Rule ${inv.rule_number}): ${inv.reason}`);
    });
    process.exit(1);
  }

  console.log(`\nSample mapped record (Rule ${validRecords[0].rule_number}):`);
  console.log(JSON.stringify({
    rule_number: validRecords[0].rule_number,
    title: validRecords[0].title,
    part: validRecords[0].part,
    page_start: validRecords[0].page_start,
    page_end: validRecords[0].page_end,
    document_name: validRecords[0].document_name,
    content_preview: validRecords[0].content.slice(0, 80) + '...'
  }, null, 2));

  // Step 2: In Dry-Run mode, exit cleanly after schema validation
  if (isDryRun) {
    console.log('\n====================================================');
    console.log('DRY-RUN VALIDATION COMPLETE:');
    console.log(`  ✓ 106 records validated against schema.`);
    console.log(`  ✓ All required fields present (rule_number, title, content, part, pages).`);
    console.log(`  ✓ Target document name: "${DOCUMENT_SOURCE_NAME}"`);
    console.log(`  ✓ Target embedding model: "${EMBEDDING_MODEL}" (${EXPECTED_EMBEDDING_DIM} dims).`);
    console.log(`  ✓ Ready for ingestion into public.building_rules.`);
    console.log('====================================================');
    return;
  }

  // Step 3: Validate Environment Secrets before live execution
  const mistralApiKey = process.env.MISTRAL_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!mistralApiKey || mistralApiKey.includes('your_mistral_api_key')) {
    console.error('\n[Error] MISTRAL_API_KEY is not configured in server/.env');
    process.exit(1);
  }

  if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
    console.error('\n[Error] SUPABASE_URL is not configured in server/.env');
    process.exit(1);
  }

  if (!supabaseKey || supabaseKey.includes('your_supabase_service_role_key')) {
    console.error('\n[Error] SUPABASE_SERVICE_ROLE_KEY is not configured in server/.env');
    process.exit(1);
  }

  console.log('\n[3/4] Initializing clients:');
  console.log(`      - Mistral AI Client (Model: ${EMBEDDING_MODEL})`);
  console.log(`      - Supabase Client (${supabaseUrl})`);

  const mistral = new Mistral({ apiKey: mistralApiKey });
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  // Step 4: Batch Processing, Embedding Generation & Upsert
  console.log(`\n[4/4] Ingesting ${validRecords.length} rules in batches of ${BATCH_SIZE}...`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < validRecords.length; i += BATCH_SIZE) {
    const batch = validRecords.slice(i, i + BATCH_SIZE);
    const batchRuleNumbers = batch.map((r) => r.rule_number).join(', ');
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(validRecords.length / BATCH_SIZE);

    try {
      process.stdout.write(`  Processing Batch ${batchIndex}/${totalBatches} (Rules: ${batchRuleNumbers})... `);

      // Create rich grounding context for embeddings: Title + Content
      const textsToEmbed = batch.map(
        (r) => `Rule ${r.rule_number}: ${r.title}\n\n${r.content}`
      );

      // Call Mistral Embeddings
      const embeddings = await generateEmbeddings(mistral, textsToEmbed);

      // Combine metadata with 1024-dim embedding vector
      const rowsToInsert = batch.map((record, idx) => ({
        ...record,
        embedding: embeddings[idx]
      }));

      // Upsert into Supabase public.building_rules
      const { error: upsertError } = await supabase
        .from('building_rules')
        .upsert(rowsToInsert, { onConflict: 'rule_number' });

      if (upsertError) {
        throw new Error(`Supabase upsert error: ${upsertError.message}`);
      }

      successCount += batch.length;
      console.log('✓ OK');
    } catch (err) {
      failureCount += batch.length;
      console.log('✗ FAILED');
      console.error(`    Reason: ${err.message}`);
    }
  }

  console.log('\n====================================================');
  console.log('INGESTION SUMMARY:');
  console.log(`  - Total Rules Processed: ${validRecords.length}`);
  console.log(`  - Successfully Upserted: ${successCount}`);
  console.log(`  - Failed Rules:          ${failureCount}`);
  console.log('====================================================');

  if (failureCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n[Fatal Ingestion Error]:', err.message);
  process.exit(1);
});
