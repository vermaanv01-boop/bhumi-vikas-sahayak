-- ==============================================================================
-- Madhya Pradesh Bhumi Vikas Niyam, 2012 - pgvector RPC Search Function
-- ==============================================================================
-- Run this in your Supabase SQL Editor if you wish to use native Postgres
-- vector similarity search instead of in-memory fallback.
--
-- Note: Embeddings are generated with mistral-embed (1024 dimensions).
-- ==============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ensure unique constraint on rule_number for idempotent upserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'building_rules_rule_number_unique'
  ) THEN
    ALTER TABLE public.building_rules
    ADD CONSTRAINT building_rules_rule_number_unique UNIQUE (rule_number);
  END IF;
END $$;

-- 3. Match building rules RPC function
CREATE OR REPLACE FUNCTION match_building_rules (
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  rule_number text,
  title text,
  content text,
  part text,
  page_start integer,
  page_end integer,
  document_name text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    br.id,
    br.rule_number,
    br.title,
    br.content,
    br.part,
    br.page_start,
    br.page_end,
    br.document_name,
    (1 - (br.embedding <=> query_embedding))::float AS similarity
  FROM public.building_rules br
  WHERE (1 - (br.embedding <=> query_embedding)) >= match_threshold
  ORDER BY br.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;
