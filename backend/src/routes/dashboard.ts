import { Router, Request, Response } from 'express';
import { analysesRepo } from '../db/repositories';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const list = await analysesRepo.list();

    if (list.length === 0) {
      return res.json({
        totalVideosAnalyzed: 0,
        averageVpi: 0,
        highestVpi: 0,
        videosThisWeek: 0,
        bestCategory: { name: 'N/A', averageVpi: 0 },
        vpiTrend: [],
        recentAnalyses: []
      });
    }

    // 1. Core aggregates
    const totalVideosAnalyzed = list.length;
    const sumVpi = list.reduce((sum, a) => sum + a.vpi, 0);
    const averageVpi = Math.round((sumVpi / totalVideosAnalyzed) * 10) / 10;
    const highestVpi = Math.max(...list.map(a => a.vpi));

    // 2. Videos this week
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const videosThisWeek = list.filter(a => new Date(a.created_at) >= sevenDaysAgo).length;

    // 3. Best Category (highest average VPI)
    const catMap: Record<string, { sum: number; count: number }> = {};
    for (const a of list) {
      const cat = a.analysis_json.category;
      if (!catMap[cat]) {
        catMap[cat] = { sum: 0, count: 0 };
      }
      catMap[cat].sum += a.vpi;
      catMap[cat].count += 1;
    }
    
    let bestCategoryName = 'N/A';
    let maxAvg = 0;
    for (const [name, data] of Object.entries(catMap)) {
      const avg = data.sum / data.count;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestCategoryName = name;
      }
    }
    const bestCategory = {
      name: bestCategoryName,
      averageVpi: Math.round(maxAvg * 10) / 10
    };

    // 4. VPI Trend (grouped by day, sorted chronologically)
    const trendMap: Record<string, { sum: number; count: number }> = {};
    for (const a of list) {
      const dateStr = a.created_at.split('T')[0];
      if (!trendMap[dateStr]) {
        trendMap[dateStr] = { sum: 0, count: 0 };
      }
      trendMap[dateStr].sum += a.vpi;
      trendMap[dateStr].count += 1;
    }
    const vpiTrend = Object.entries(trendMap)
      .map(([date, data]) => ({
        date,
        vpi: Math.round((data.sum / data.count) * 10) / 10
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. Recent analyses (limit to 10 for dashboard preview)
    const recentAnalyses = list.slice(0, 10).map(a => ({
      id: a.id,
      filename: a.filename || 'video.mp4',
      vpi: a.vpi,
      classification: a.classification,
      category: a.analysis_json.category,
      createdAt: a.created_at
    }));

    return res.json({
      totalVideosAnalyzed,
      averageVpi,
      highestVpi,
      videosThisWeek,
      bestCategory,
      vpiTrend,
      recentAnalyses
    });
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Could not load dashboard stats' }
    });
  }
});

export default router;
