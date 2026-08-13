import React from 'react';

interface SimulatorSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  suffix?: string;
}

export function SimulatorSlider({ label, value, min, max, onChange, suffix = '' }: SimulatorSliderProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-300 tracking-wide">{label}</span>
        <span className="font-extrabold text-violet-400 bg-violet-500/10 border border-violet-500/10 px-2 py-0.5 rounded-lg text-xs min-w-10 text-center">
          {value}{suffix}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-slate-600 font-bold">{min}{suffix}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
        />
        <span className="text-[10px] text-slate-600 font-bold">{max}{suffix}</span>
      </div>
    </div>
  );
}
