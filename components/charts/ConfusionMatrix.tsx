// src/components/charts/ConfusionMatrix.tsx

'use client';

interface ConfusionMatrixProps {
  matrix: number[][];
  labels?: string[];
}

export function ConfusionMatrix({ matrix, labels = ['Negative', 'Positive'] }: ConfusionMatrixProps) {
  const maxValue = Math.max(...matrix.flat());

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.7) return 'bg-accent';
    if (intensity > 0.4) return 'bg-accent/70';
    if (intensity > 0.2) return 'bg-accent/40';
    return 'bg-accent/20';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="w-24" />
            {labels.map((label) => (
              <div key={label} className="w-24 text-center text-sm font-medium text-text-muted">
                Predicted<br />{label}
              </div>
            ))}
          </div>
          
          {matrix.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <div className="w-24 flex items-center justify-end pr-4 text-sm font-medium text-text-muted">
                Actual {labels[i]}
              </div>
              {row.map((value, j) => (
                <div
                  key={j}
                  className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center ${getColor(value)} transition-all duration-300 hover:scale-105`}
                >
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-white/80">
                    {((value / row.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/20" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/70" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent" />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}