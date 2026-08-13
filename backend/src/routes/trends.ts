import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const categories = [
    { name: 'AI', alignmentScore: 92 },
    { name: 'Programming', alignmentScore: 88 },
    { name: 'Comedy', alignmentScore: 84 },
    { name: 'Finance', alignmentScore: 78 },
    { name: 'Fitness', alignmentScore: 72 },
    { name: 'Education', alignmentScore: 68 },
    { name: 'Gaming', alignmentScore: 65 },
    { name: 'Lifestyle', alignmentScore: 60 }
  ];
  
  return res.json({ categories });
});

export default router;
