// src/components/ui/Input.tsx - Enhanced Input and Select components

'use client';

import { InputHTMLAttributes, forwardRef, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, icon, rightIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
            {props.required && <span className="text-risk-high ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full px-4 py-3 bg-background-card rounded-xl border text-text-primary',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
              'hover:border-slate-500',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600',
              error 
                ? 'border-risk-high focus:ring-risk-high/50 focus:border-risk-high' 
                : 'border-slate-600',
              icon ? 'pl-12' : '',
              rightIcon ? 'pr-12' : '',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
          {/* Focus glow effect */}
          <div className={cn(
            'absolute inset-0 rounded-xl opacity-0 pointer-events-none transition-opacity duration-200',
            'group-focus-within:opacity-100',
            error ? 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'shadow-[0_0_15px_rgba(99,102,241,0.15)]'
          )} />
        </div>
        {error && (
          <p className="mt-2 text-sm text-risk-high flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-2 text-sm text-text-muted">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helpText, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
            {props.required && <span className="text-risk-high ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-background-card rounded-xl border text-text-primary appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
              'hover:border-slate-500',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'cursor-pointer',
              error 
                ? 'border-risk-high focus:ring-risk-high/50 focus:border-risk-high' 
                : 'border-slate-600',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-background-card">
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-focus-within:text-accent transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {/* Focus glow effect */}
          <div className={cn(
            'absolute inset-0 rounded-xl opacity-0 pointer-events-none transition-opacity duration-200',
            'group-focus-within:opacity-100',
            error ? 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'shadow-[0_0_15px_rgba(99,102,241,0.15)]'
          )} />
        </div>
        {error && (
          <p className="mt-2 text-sm text-risk-high flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-2 text-sm text-text-muted">{helpText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Textarea component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helpText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
            {props.required && <span className="text-risk-high ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          <textarea
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-background-card rounded-xl border text-text-primary',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
              'hover:border-slate-500',
              'transition-all duration-200 resize-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error 
                ? 'border-risk-high focus:ring-risk-high/50 focus:border-risk-high' 
                : 'border-slate-600',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-risk-high">{error}</p>
        )}
        {helpText && !error && (
          <p className="mt-2 text-sm text-text-muted">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Checkbox component with enhanced styling
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className={cn(
        'flex items-start gap-3 p-4 bg-background-card rounded-xl border border-slate-600',
        'cursor-pointer transition-all duration-200',
        'hover:border-accent/50 hover:bg-background-hover',
        'has-[:checked]:border-accent has-[:checked]:bg-accent/10',
        className
      )}>
        <input
          ref={ref}
          type="checkbox"
          className="mt-0.5 flex-shrink-0"
          {...props}
        />
        <div className="flex-1">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          {description && (
            <p className="text-xs text-text-muted mt-1">{description}</p>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';