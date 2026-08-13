import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { VideoUploader } from '../components/VideoUploader';
import { ProcessingPipeline } from '../components/ProcessingPipeline';
import { ProgressBar } from '../components/ProgressBar';
import { apiService } from '../services/api';

type AnalyzeState = 'idle' | 'uploading' | 'processing' | 'error';

export function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>('idle');
  const [uploadPercent, setUploadPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Triggered when a file is selected and "Start Analysis" is clicked
  const handleFileSelected = async (filename: string, sizeBytes: number, durationSeconds: number) => {
    try {
      // 1. Shift to uploading state
      setState('uploading');
      setUploadPercent(0);
      setErrorMsg(null);

      // Simulate upload bar progress over 1.5s
      const uploadInterval = setInterval(() => {
        setUploadPercent(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      // Call API in parallel
      const resultPromise = apiService.analyzeVideo(filename, sizeBytes, durationSeconds);
      
      // Wait for upload animation to complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearInterval(uploadInterval);
      setUploadPercent(100);

      // 2. Shift to processing state
      setState('processing');

      // Fetch the API analysis result
      const analysisResult = await resultPromise;
      setAnalysisId(analysisResult.id);
      
    } catch (err: any) {
      console.error('Error during video upload / analyze fetch:', err);
      setErrorMsg(err.message || 'An error occurred during analysis request');
      setState('error');
    }
  };

  // Callback when 10 stages processing completes
  const handlePipelineComplete = () => {
    if (analysisId) {
      navigate(`/analysis/${analysisId}`);
    } else {
      // If API hasn't resolved yet (should have resolved, but handle defensively)
      const checkInterval = setInterval(async () => {
        if (analysisId) {
          clearInterval(checkInterval);
          navigate(`/analysis/${analysisId}`);
        }
      }, 500);
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-[75vh] justify-center">
      {state === 'idle' && (
        <>
          <PageHeader 
            title="Analyze Your Video" 
            subtitle="Upload a short-form draft to generate viral potential scores and optimization tips"
          />
          <div className="mt-4">
            <VideoUploader onFileSelected={handleFileSelected} />
          </div>
        </>
      )}

      {state === 'uploading' && (
        <div className="w-full max-w-md mx-auto glass-panel p-8 text-center flex flex-col items-center">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-2">Network Transmission</span>
          <h3 className="text-lg font-bold text-white mb-6">Uploading Video Metadata</h3>
          
          <div className="w-full mb-4">
            <ProgressBar value={uploadPercent} colorFrom="from-violet-500" colorTo="to-indigo-500" />
          </div>
          <span className="text-xs text-slate-400 font-semibold">{uploadPercent}% uploaded</span>
        </div>
      )}

      {state === 'processing' && (
        <ProcessingPipeline onComplete={handlePipelineComplete} />
      )}

      {state === 'error' && (
        <div className="w-full max-w-md mx-auto glass-panel p-8 text-center flex flex-col items-center border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Analysis Failed</h3>
          <p className="text-sm text-slate-400 mb-8 max-w-xs leading-relaxed">{errorMsg}</p>
          
          <button
            onClick={() => setState('idle')}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </button>
        </div>
      )}
    </div>
  );
}
