// src/components/charts/RiskGauge.tsx - Animated risk gauge chart

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const colors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
  };

  const rotation = (animatedScore / 100) * 180 - 90;

  return (
    <div className="relative w-64 mx-auto">
      {/* Gauge Container */}
      <div className="relative w-64 h-32">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 220 110" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path
            d="M 30 85 A 80 80 0 0 1 190 85"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 30 85 A 80 80 0 0 1 190 85"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(animatedScore / 100) * 251} 251`}
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute left-1/2 bottom-0 w-1 h-20 bg-text-primary rounded-full origin-bottom"
          style={{
            transformOrigin: 'bottom center',
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Center Circle */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-text-primary" />
      </div>

      {/* Score Display - Positioned below gauge */}
      <div className="mt-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold"
          style={{ color: colors[level] }}
        >
          {Math.round(animatedScore)}%
        </motion.div>
        <div className="text-xs text-text-muted uppercase mt-1">
          {level} Risk
        </div>
      </div>
    </div>
  );
}