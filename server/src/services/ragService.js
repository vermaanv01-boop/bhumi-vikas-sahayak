import 'dotenv/config';
import { Mistral } from '@mistralai/mistralai';
import { createClient } from '@supabase/supabase-js';

// Configuration
const EMBEDDING_MODEL = 'mistral-embed';
const CHAT_MODEL = process.env.MISTRAL_CHAT_MODEL || 'ministral-8b-latest';
const SIMILARITY_THRESHOLD = 0.58;
const TOP_K = 4;

// Cache of building rules in memory for fast fallback retrieval
let cachedRules = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Calculate cosine similarity between two numeric vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieve top matching rules via Supabase RPC or vector fallback
 */
async function retrieveTopRules(supabase, queryEmbedding, topK = TOP_K) {
  // Attempt 1: Try database RPC function if installed
  try {
    const { data: rpcMatches, error: rpcError } = await supabase.rpc('match_building_rules', {
      query_embedding: queryEmbedding,
      match_threshold: SIMILARITY_THRESHOLD,
      match_count: topK
    });

    if (!rpcError && Array.isArray(rpcMatches) && rpcMatches.length > 0) {
      return rpcMatches;
    }
  } catch (e) {
    // Fall back to direct table retrieval
  }

  // Attempt 2: High-performance in-memory cosine matching across 106 rules
  const now = Date.now();
  if (!cachedRules || now - cacheTimestamp > CACHE_TTL_MS) {
    const { data: rows, error: fetchErr } = await supabase
      .from('building_rules')
      .select('id, rule_number, title, content, part, page_start, page_end, document_name, embedding');

    if (fetchErr) {
      throw new Error(`Failed to query building_rules from Supabase: ${fetchErr.message}`);
    }

    cachedRules = (rows || []).map((r) => ({
      ...r,
      parsedVector: typeof r.embedding === 'string' ? JSON.parse(r.embedding) : r.embedding
    }));
    cacheTimestamp = now;
  }

  // Rank cached rules by cosine similarity
  const scoredRules = cachedRules
    .map((r) => ({
      ...r,
      similarity: cosineSimilarity(queryEmbedding, r.parsedVector)
    }))
    .filter((r) => r.similarity >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.similarity - a.similarity);

  return scoredRules.slice(0, topK);
}

/**
 * Execute real RAG query for Bhumi Vikas Sahayak
 *
 * @param {Object} params
 * @param {string} params.question - Validated natural language query
 * @param {string} [params.language='en'] - 'en' or 'hi'
 * @param {string} [params.location='bhopal'] - Municipal jurisdiction
 * @returns {Promise<{
 *   question: string,
 *   answer: string,
 *   language: string,
 *   status: 'answered' | 'insufficient_evidence' | 'error',
 *   sources: Array<Object>
 * }>}
 */
export async function executeRagQuery({ question, language = 'en', location = 'bhopal' }) {
  const mistralApiKey = process.env.MISTRAL_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!mistralApiKey || !supabaseUrl || !supabaseKey) {
    return {
      question,
      answer: 'Backend configuration incomplete: API keys or Supabase connection missing.',
      language,
      status: 'error',
      sources: []
    };
  }

  const mistral = new Mistral({ apiKey: mistralApiKey });
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    // 1. Generate query embedding with mistral-embed (1024 dims)
    const embeddingRes = await mistral.embeddings.create({
      model: EMBEDDING_MODEL,
      inputs: [question]
    });

    const queryEmbedding = embeddingRes.data[0]?.embedding;
    if (!queryEmbedding || queryEmbedding.length !== 1024) {
      throw new Error('Failed to generate valid 1024-dimension query embedding');
    }

    // 2. Vector search for relevant building rules
    const topRules = await retrieveTopRules(supabase, queryEmbedding, TOP_K);

    if (!topRules || topRules.length === 0) {
      return {
        question,
        answer: language === 'hi'
          ? 'समेकित मध्य प्रदेश भूमि विकास नियमों (6 मार्च 2025 तक) में इस विशिष्ट प्रश्न के लिए पर्याप्त वैधानिक संदर्भ नहीं मिला। कृपया सेटबैक, भवन ऊंचाई, या भूखंड आवश्यकताओं से संबंधित विशिष्ट शब्द खोजें।'
          : 'No directly applicable provisions were found in the indexed Madhya Pradesh Bhumi Vikas Niyam (amended through 6 March 2025). Please refine your query using standard planning terms such as setbacks, permissible height, FAR, or plot requirements.',
        language,
        status: 'insufficient_evidence',
        sources: []
      };
    }

    // 3. Format statutory context for grounded answer generation
    const contextText = topRules
      .map(
        (r) => `[Rule ${r.rule_number}: ${r.title} (Pages ${r.page_start}–${r.page_end})]\n${r.content}`
      )
      .join('\n\n---\n\n');

    const systemPrompt = `You are "Bhumi Vikas Sahayak", a specialized legal research assistant for the Madhya Pradesh Bhumi Vikas Niyam, 2012 (consolidated amendments up to 6 March 2025).

Your duties:
1. Answer the user's question accurately, concisely, and strictly grounded in the provided statutory context.
2. Explicitly cite relevant Rule numbers (e.g., Rule 53, Rule 55) and statutory requirements.
3. Never invent, hallucinate, or fabricate rule provisions, numbers, or dimensions.
4. Mention that these rules apply to ${location === 'bhopal' ? 'Bhopal' : location} planning jurisdiction as applicable under the MP Nagar Tatha Gram Nivesh Adhiniyam, 1973.
5. If the user asks in Hindi or language is 'hi', provide the answer in professional, clear Hindi. Otherwise, answer in clear English.
6. Clearly convey that this is an assistive research summary and not an official sanctioned clearance.`;

    const userPrompt = `Context Rules from MP Bhumi Vikas Niyam, 2012:
${contextText}

User Inquiry:
"${question}"

Provide a structured, authoritative, and helpful answer citing the exact rule numbers.`;

    // 4. Generate grounded answer with Mistral
    let generatedAnswer = '';
    try {
      const chatResponse = await mistral.chat.complete({
        model: CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        maxTokens: 1200
      });

      generatedAnswer = chatResponse.choices[0]?.message?.content?.trim() || '';
    } catch (chatErr) {
      // If primary chat model encounters rate-limit, fallback to ministral-3b-latest
      if (CHAT_MODEL !== 'ministral-3b-latest') {
        const fallbackRes = await mistral.chat.complete({
          model: 'ministral-3b-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          maxTokens: 1200
        });
        generatedAnswer = fallbackRes.choices[0]?.message?.content?.trim() || '';
      } else {
        throw chatErr;
      }
    }

    // 5. Structure formatted sources matching frontend contract
    const sources = topRules.map((r) => ({
      ruleNumber: `Rule ${r.rule_number}`,
      title: r.title,
      sourceText: r.content.length > 280 ? r.content.slice(0, 280) + '...' : r.content,
      pageStart: r.page_start,
      pageEnd: r.page_end,
      documentName: r.document_name || 'MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf'
    }));

    return {
      question,
      answer: generatedAnswer,
      language,
      status: 'answered',
      sources
    };
  } catch (err) {
    console.error('Error in executeRagQuery:', err);
    return {
      question,
      answer: language === 'hi'
        ? 'नियमों की पुनर्प्राप्ति अथवा उत्तर निर्माण के दौरान त्रुटि उत्पन्न हुई।'
        : `An error occurred while retrieving statutory rules or generating the answer: ${err.message}`,
      language,
      status: 'error',
      sources: []
    };
  }
}
