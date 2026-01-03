// src/components/ui/ErrorBoundary.tsx - Error boundary component

'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-risk-high/20 rounded-full">
                <AlertTriangle className="h-8 w-8 text-risk-high" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-text-muted mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}