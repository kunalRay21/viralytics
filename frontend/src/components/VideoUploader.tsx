import React, { useState, useRef } from 'react';
import { UploadCloud, FileVideo, AlertCircle, X, Play } from 'lucide-react';

interface VideoUploaderProps {
  onFileSelected: (filename: string, sizeBytes: number, durationSeconds: number) => void;
}

export function VideoUploader({ onFileSelected }: VideoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; rawSize: number; objectUrl: string } | null>(null);
  const [duration, setDuration] = useState<number>(30); // Default to 30s
  const [warning, setWarning] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('video/')) {
      setWarning('Please upload a valid video file (MP4, MOV, WEBM)');
      return;
    }
    
    // Warning for files > 200MB as specified (soft cap, warn don't block)
    const maxSize = 200 * 1024 * 1024;
    if (file.size > maxSize) {
      setWarning('Warning: File size exceeds 200MB. This might take longer to process.');
    } else {
      setWarning(null);
    }

    const objectUrl = URL.createObjectURL(file);
    setFileInfo({
      name: file.name,
      size: formatBytes(file.size),
      rawSize: file.size,
      objectUrl
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.round(videoRef.current.duration) || 30;
      setDuration(dur);
    }
  };

  const handleClear = () => {
    if (fileInfo?.objectUrl) {
      URL.revokeObjectURL(fileInfo.objectUrl);
    }
    setFileInfo(null);
    setWarning(null);
    setDuration(30);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = () => {
    if (fileInfo) {
      onFileSelected(fileInfo.name, fileInfo.rawSize, duration);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!fileInfo ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`glass-panel border-2 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-80 ${
            dragActive 
              ? 'border-violet-500 bg-violet-600/5 shadow-[0_0_20px_rgba(124,58,237,0.15)]' 
              : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={handleInputChange}
          />
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/5 mb-4 text-violet-400 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Drag and drop your video here</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm">
            Or <span className="text-violet-400 font-semibold underline">browse files</span> from your computer
          </p>
          <span className="text-xs text-slate-500 font-medium">
            Supported formats: MP4, MOV, WEBM · Max size 200MB
          </span>

          {warning && (
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{warning}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                <FileVideo className="w-6 h-6" />
              </div>
              <div className="max-w-md truncate">
                <h4 className="text-sm font-bold text-white truncate">{fileInfo.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{fileInfo.size} · {duration} seconds</p>
              </div>
            </div>
            <button 
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-white/5 hover:border-red-500/20 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-6 flex items-center justify-center">
            <video
              ref={videoRef}
              src={fileInfo.objectUrl}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-contain"
            />
          </div>

          {warning && (
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{warning}</span>
            </div>
          )}

          <button
            onClick={handleStartAnalysis}
            className="w-full py-4.5 bg-violet-600 hover:bg-violet-500 active:scale-98 text-white text-sm font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Viral Potential Analysis
          </button>
        </div>
      )}
    </div>
  );
}
