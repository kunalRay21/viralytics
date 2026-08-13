import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../animations/variants';

interface AnalysisCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function AnalysisCard({ title, icon, children, id, className = '' }: AnalysisCardProps) {
  return (
    <motion.div
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`glass-panel p-6 md:p-8 relative overflow-hidden ${className}`}
    >
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-glow-blue pointer-events-none rounded-full" />
      
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        {icon && <div className="text-violet-400">{icon}</div>}
        <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">{title}</h3>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
