export interface VideoAnalysis {
  hookStrength: number;         // 0-100
  retentionPotential: number;   // 0-100
  shareability: number;         // 0-100
  engagementPotential: number;  // 0-100
  trendAlignment: number;       // 0-100
  contentQuality: number;       // 0-100
  audioVisualQuality: number;   // 0-100
}

export interface HookAnalysis {
  score: number;
  timeline: { second: number; engagementPotential: number }[];
  firstVisualChangeSeconds: number;
  firstSpeechMomentSeconds: number;
  curiositySignal: 'Low' | 'Medium' | 'High';
  movementDetection: 'Low' | 'Medium' | 'High';
  timeToValueSeconds: number;
  insight: string;
  recommendation: string;
}

export interface RetentionPoint {
  second: number;
  retentionPercent: number;
}

export interface TimedNote {
  second: number;
  note: string;
}

export interface EmotionPoint {
  second: number;
  curiosity: number;
  excitement: number;
  humor: number;
  surprise: number;
}

export interface ShareabilityDetail {
  score: number;
  relatability: number;
  friendSendPotential: number;
  conversationPotential: number;
  emotionalTrigger: number;
  utility: number;
  primaryMechanism: 'RELATABILITY' | 'HUMOR' | 'SURPRISE' | 'UTILITY' | 'CONTROVERSY' | 'ASPIRATION';
}

export interface AudioDetail {
  audioQuality: number;
  voiceClarity: number;
  energy: number;
  backgroundNoise: number;
  beatSync: number;
  trendAlignment: number;
}

export interface AnalysisResult {
  id: string;
  vpi: number;
  classification: 'HIGH' | 'MODERATE' | 'LOW_MODERATE' | 'LOW';
  category: string;
  scores: VideoAnalysis;             // the 7 weighted inputs
  breakdown: {                        // the 8 displayed metric cards
    hookStrength: number;
    retentionPotential: number;
    shareability: number;
    emotionalImpact: number;
    trendAlignment: number;
    visualQuality: number;
    audioQuality: number;
    engagementPotential: number;
  };
  hook: HookAnalysis;
  retention: {
    points: RetentionPoint[];
    dropOffPoints: TimedNote[];
    strongPoints: TimedNote[];
  };
  emotions: EmotionPoint[];
  shareability: ShareabilityDetail;
  trendAlignment: {
    topCategory: string;
    categories: { name: string; alignmentScore: number }[];
  };
  audio: AudioDetail;
  videoDoctor: {
    diagnosis: { label: string; rating: string }[];
    prescription: string[];
  };
  recommendations: string[];
  caption: {
    current: string;
  };
  createdAt: string; // ISO
}
