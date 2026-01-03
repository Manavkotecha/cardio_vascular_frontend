// src/components/ui/Button.tsx - Enhanced Button with gradients and effects

'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  as?: React.ElementType;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    children, 
    disabled,
    as: Component = 'button',
    fullWidth = false,
    ...props 
  }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-[0.98]'
    );
    
    const variants = {
      primary: cn(
        'bg-gradient-to-r from-accent to-primary-light text-white',
        'hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.02]',
        'focus:ring-accent'
      ),
      secondary: cn(
        'bg-background-card text-text-secondary border border-slate-600',
        'hover:bg-background-hover hover:border-slate-500',
        'focus:ring-accent'
      ),
      danger: cn(
        'bg-gradient-to-r from-risk-high to-red-600 text-white',
        'hover:shadow-lg hover:shadow-risk-high/30 hover:scale-[1.02]',
        'focus:ring-risk-high'
      ),
      ghost: cn(
        'text-text-secondary',
        'hover:bg-background-hover hover:text-text-primary',
        'focus:ring-accent'
      ),
      outline: cn(
        'border-2 border-accent text-accent bg-transparent',
        'hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20',
        'focus:ring-accent'
      ),
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size], 
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={cn('flex-shrink-0', iconSizes[size])}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className={cn('flex-shrink-0', iconSizes[size])}>{icon}</span>
            )}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

// Icon Button - A smaller button for icon-only actions
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string; // For accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', label, children, ...props }, ref) => {
    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    };

    const variants = {
      primary: 'bg-accent/20 text-accent hover:bg-accent/30',
      secondary: 'bg-background-card text-text-secondary hover:bg-background-hover',
      danger: 'bg-risk-high/20 text-risk-high hover:bg-risk-high/30',
      ghost: 'text-text-muted hover:text-text-primary hover:bg-background-hover',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';