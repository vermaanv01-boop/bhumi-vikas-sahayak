# Bhumi Vikas Sahayak - Backend Server

Express backend and RAG ingestion pipeline for Bhumi Vikas Sahayak.

## Structure
```
server/
  package.json
  .env.example
  .env
  .gitignore
  README.md
  src/
    index.js
    routes/
      ask.js
    services/
      ragService.js
    scripts/
      ingestRules.js
```

## Setup Instructions

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Ensure `.env` exists with your private credentials (never committed to git):
   ```env
   PORT=5000
   FRONTEND_ORIGIN=http://localhost:5173
   MISTRAL_API_KEY=your_mistral_api_key_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

4. **Run the server**:
   - Production mode:
     ```bash
     npm start
     ```
   - Development mode with auto-reload (Node.js `--watch`):
     ```bash
     npm run dev
     ```

## Ingestion Pipeline (`src/scripts/ingestRules.js`)

### Database Prerequisite (Unique Constraint)
To ensure repeatable upsert operations without creating duplicate entries in `public.building_rules`, ensure `rule_number` has a unique constraint in Supabase SQL editor:
```sql
ALTER TABLE public.building_rules
ADD CONSTRAINT building_rules_rule_number_unique UNIQUE (rule_number);
```

### Dry-Run (Schema Validation without API calls)
```bash
npm run ingest:dry-run
# or: node src/scripts/ingestRules.js --dry-run
```

### Live Ingestion (Generate Embeddings & Upsert to Supabase)
```bash
npm run ingest
# or: node src/scripts/ingestRules.js
```
