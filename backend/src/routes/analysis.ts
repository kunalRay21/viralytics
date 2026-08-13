import { Router, Request, Response } from 'express';
import { analysesRepo } from '../db/repositories';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const dbAnalysis = await analysesRepo.get(id);
    
    if (!dbAnalysis) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Analysis not found' }
      });
    }

    return res.json(dbAnalysis.analysis_json);
  } catch (err: any) {
    console.error(`Error retrieving analysis ${id}:`, err);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve analysis' }
    });
  }
});

export default router;
