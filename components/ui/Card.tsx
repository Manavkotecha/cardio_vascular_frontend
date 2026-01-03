// src/components/ui/Card.tsx - Enhanced Card with glassmorphism

'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', variant = 'default', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variants = {
      default: 'bg-background-card border border-slate-700/50',
      glass: 'glass',
      gradient: 'gradient-border',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variants[variant],
          paddings[padding],
          hover && 'card-hover cursor-pointer',
          'shadow-lg shadow-black/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 mb-4', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold text-text-primary', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-text-muted', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

// Stats Card - A specialized card for displaying metrics
interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'accent' | 'success' | 'warning' | 'danger';
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, icon, trend, color = 'accent', className, ...props }, ref) => {
    const colors = {
      accent: { bg: 'bg-accent/20', text: 'text-accent', glow: 'group-hover:shadow-accent/20' },
      success: { bg: 'bg-risk-low/20', text: 'text-risk-low', glow: 'group-hover:shadow-risk-low/20' },
      warning: { bg: 'bg-risk-medium/20', text: 'text-risk-medium', glow: 'group-hover:shadow-risk-medium/20' },
      danger: { bg: 'bg-risk-high/20', text: 'text-risk-high', glow: 'group-hover:shadow-risk-high/20' },
    };

    const colorStyle = colors[color];

    return (
      <Card
        ref={ref}
        hover
        className={cn('group transition-all duration-300', colorStyle.glow, className)}
        {...props}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className={cn(
              'p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
              colorStyle.bg
            )}>
              <div className={colorStyle.text}>{icon}</div>
            </div>
          )}
          <div className="flex-1">
            <div className="text-2xl font-bold text-text-primary">{value}</div>
            <div className="text-sm text-text-muted">{title}</div>
          </div>
          {trend && (
            <div className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-risk-low' : 'text-risk-high'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </Card>
    );
  }
);

StatsCard.displayName = 'StatsCard';