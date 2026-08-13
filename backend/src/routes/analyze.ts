import { Router, Request, Response } from 'express';
import { MockAnalysisProvider } from '../services/mockAnalysisProvider';
import { usersRepo, videosRepo, analysesRepo } from '../db/repositories';

const router = Router();
const provider = new MockAnalysisProvider();

router.post('/', async (req: Request, res: Response) => {
  const { filename, sizeBytes, durationSeconds } = req.body;
  
  if (!filename) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Filename is required' }
    });
  }

  const size = sizeBytes || 5 * 1024 * 1024; // Default to 5MB

  try {
    const demoUser = await usersRepo.getOrCreateDemoUser();
    
    // Generate analysis using seeded PRNG
    const analysisResult = await provider.analyze({
      filename,
      sizeBytes: size,
      durationSeconds
    });

    // Save records
    const video = await videosRepo.create(demoUser.id, filename, durationSeconds || 30);
    const dbAnalysis = await analysesRepo.create(
      video.id,
      analysisResult.vpi,
      analysisResult.classification,
      analysisResult
    );

    // Return the JSON content directly
    return res.status(201).json(dbAnalysis.analysis_json);
  } catch (err: any) {
    console.error('Error during video analysis route:', err);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Failed to analyze video' }
    });
  }
});

export default router;
