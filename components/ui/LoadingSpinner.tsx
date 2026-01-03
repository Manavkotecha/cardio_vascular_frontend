// src/components/ui/LoadingSpinner.tsx - Enhanced Loading states

'use client';

import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-accent/30 border-t-accent',
        sizes[size],
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full animate-ping bg-accent/20" />
        {/* Main spinner */}
        <div className="relative">
          <LoadingSpinner size="lg" />
        </div>
      </div>
      <p className="text-text-muted text-sm animate-pulse">Loading...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-4 bg-background-card rounded-xl border border-slate-700/50 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded skeleton" />
          <div className="h-3 w-1/2 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded skeleton',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-slate-700">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 h-4 rounded skeleton" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 py-3">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="flex-1 h-4 rounded skeleton" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Pulse dot loader
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Progress bar
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'accent',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    accent: 'bg-gradient-to-r from-accent to-primary-light',
    success: 'bg-gradient-to-r from-risk-low to-emerald-400',
    warning: 'bg-gradient-to-r from-risk-medium to-amber-400',
    danger: 'bg-gradient-to-r from-risk-high to-red-400',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-muted">Progress</span>
          <span className="text-text-primary font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-background-hover rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}