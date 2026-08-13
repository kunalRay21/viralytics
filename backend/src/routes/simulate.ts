import { Router, Request, Response } from 'express';
import { analysesRepo } from '../db/repositories';
import { runVPISimulation } from '../services/simulatorService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { analysisId, adjustments } = req.body;
  
  if (!analysisId) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'analysisId is required' }
    });
  }

  try {
    const dbAnalysis = await analysesRepo.get(analysisId);
    
    if (!dbAnalysis) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Analysis not found' }
      });
    }

    const originalScores = dbAnalysis.analysis_json.scores;
    const { simulatedScores, simulatedVpi } = runVPISimulation(originalScores, adjustments || {});
    
    const originalVpi = dbAnalysis.analysis_json.vpi;
    const delta = Math.round((simulatedVpi - originalVpi) * 10) / 10;

    return res.json({
      originalVpi,
      simulatedVpi,
      delta,
      simulatedScores
    });
  } catch (err: any) {
    console.error('Error in simulate route:', err);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to execute simulation' }
    });
  }
});

export default router;
