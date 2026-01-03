// src/components/RecentPredictions.tsx - Recent predictions sidebar component

'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { SkeletonCard } from './ui/LoadingSpinner';
import { formatDateTime, getRiskColor, getRiskBgColor } from '../lib/utils';
import { Activity } from 'lucide-react';

export function RecentPredictions() {
  const { data, isLoading } = useQuery({
    queryKey: ['predictions', 'recent'],
    queryFn: () => api.getPredictionHistory({ limit: 5, page: 1 }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="space-y-3">
            {data.data.map((prediction) => (
              <Link
                key={prediction.id}
                href="/history"
                className="block p-3 bg-background rounded-lg border border-slate-700 hover:border-accent transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium text-text-secondary">
                      Patient {prediction.input.age}y, {prediction.input.gender}
                    </div>
                    <div className="text-xs text-text-muted">
                      {formatDateTime(prediction.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getRiskBgColor(
                      prediction.riskLevel
                    )} ${getRiskColor(prediction.riskLevel)}`}
                  >
                    {prediction.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="text-xl font-bold text-accent">
                  {prediction.riskScore}% Risk
                </div>
              </Link>
            ))}
            <Link
              href="/history"
              className="block text-center text-sm text-accent hover:underline mt-4"
            >
              View All Assessments →
            </Link>
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No assessments yet</p>
            <p className="text-xs mt-1">Complete your first risk assessment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}