import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import dashboardRouter from './routes/dashboard';
import analyzeRouter from './routes/analyze';
import analysisRouter from './routes/analysis';
import simulateRouter from './routes/simulate';
import captionRouter from './routes/caption';
import trendsRouter from './routes/trends';

import { analysesRepo } from './db/repositories';
import { seedDemoData } from './db/seedDemoAnalyses';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/caption', captionRouter);
app.use('/api/trends', trendsRouter);

// Basic health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred on the server'
    }
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Viralytics Express Server running on http://localhost:${PORT}`);
  
  // Wait for the postgres status check to complete, then seed if empty
  setTimeout(async () => {
    try {
      const list = await analysesRepo.list();
      if (list.length === 0) {
        console.log('No analyses found in database/memory. Auto-seeding 5 demo records...');
        await seedDemoData();
      } else {
        console.log(`Loaded repository containing ${list.length} existing analyses.`);
      }
    } catch (err) {
      console.error('Failed to execute startup seeding check:', err);
    }
  }, 4000);
});
