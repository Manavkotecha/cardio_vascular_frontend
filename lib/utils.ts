// src/lib/utils.ts

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRiskColor(riskLevel: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'text-risk-low',
    medium: 'text-risk-medium',
    high: 'text-risk-high',
  };
  return colors[riskLevel] || colors.low;
}

export function getRiskBgColor(riskLevel: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-risk-low/20',
    medium: 'bg-risk-medium/20',
    high: 'bg-risk-high/20',
  };
  return colors[riskLevel] || colors.low;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function calculateBMI(weight: number, heightInMeters: number): number {
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}