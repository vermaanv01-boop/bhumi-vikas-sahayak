import { Router } from 'express';
import { executeRagQuery } from '../services/ragService.js';

const router = Router();

/**
 * POST /api/ask
 * Accepts:
 * {
 *   "question": "user question",
 *   "language": "en",       // optional, defaults to 'en'
 *   "location": "bhopal"    // optional, defaults to 'bhopal'
 * }
 */
router.post('/ask', async (req, res) => {
  try {
    const { question, language = 'en', location = 'bhopal' } = req.body || {};

    // Validate request body
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: "Field 'question' is required and must be a non-empty string.",
        status: 'error'
      });
    }

    if (typeof language !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: "Field 'language' must be a string (e.g., 'en' or 'hi').",
        status: 'error'
      });
    }

    const trimmedQuestion = question.trim();

    // Call dedicated RAG service
    const response = await executeRagQuery({
      question: trimmedQuestion,
      language: language.trim() || 'en',
      location: typeof location === 'string' ? location.trim() : 'bhopal'
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error('Error handling /api/ask request:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing the request.',
      status: 'error'
    });
  }
});

export default router;
