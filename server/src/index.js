import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import askRouter from './routes/ask.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Configure CORS
app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'bhumi-vikas-sahayak-server',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// Mount /api routes
app.use('/api', askRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the server.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Bhumi Vikas Sahayak Backend] Running on http://localhost:${PORT}`);
  console.log(`[CORS] Allowed origin: ${FRONTEND_ORIGIN}`);
  console.log(`[Health check] http://localhost:${PORT}/api/health`);
});

export default app;
