'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, StatsCard } from '../../components/ui/Card';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { AccuracyChart } from '../../components/charts/AccuracyChart';
import { ConfusionMatrix } from '../../components/charts/ConfusionMatrix';
import { FeatureImportance } from '../../components/charts/FeatureImportance';
import { Activity, Target, TrendingUp, Zap, Brain, BarChart3 } from 'lucide-react';

export default function InsightsPage() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.getMetrics(),
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['metrics', 'history'],
    queryFn: () => api.getAccuracyHistory(),
  });

  if (metricsLoading || historyLoading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-light/20 via-background-card to-accent/10 border border-slate-700/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-light/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-primary-light to-accent rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">ML Model Insights</h1>
            <p className="text-text-muted mt-1">Performance metrics and analysis</p>
          </div>
        </div>
      </div>

      {metrics && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Accuracy"
              value={`${(metrics.accuracy * 100).toFixed(1)}%`}
              icon={<Target className="h-6 w-6" />}
              color="accent"
            />
            <StatsCard
              title="Precision"
              value={`${(metrics.precision * 100).toFixed(1)}%`}
              icon={<Activity className="h-6 w-6" />}
              color="success"
            />
            <StatsCard
              title="Recall"
              value={`${(metrics.recall * 100).toFixed(1)}%`}
              icon={<TrendingUp className="h-6 w-6" />}
              color="warning"
            />
            <StatsCard
              title="F1 Score"
              value={`${(metrics.f1Score * 100).toFixed(1)}%`}
              icon={<Zap className="h-6 w-6" />}
              color="danger"
            />
          </div>

          {/* Accuracy Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Model Accuracy Over Time</CardTitle>
                  <p className="text-sm text-text-muted mt-0.5">30-day performance trend</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {history && <AccuracyChart data={history} />}
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Confusion Matrix</CardTitle>
                <p className="text-sm text-text-muted mt-0.5">Model prediction distribution</p>
              </CardHeader>
              <CardContent>
                <ConfusionMatrix matrix={metrics.confusionMatrix} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Importance</CardTitle>
                <p className="text-sm text-text-muted mt-0.5">Impact of each input feature</p>
              </CardHeader>
              <CardContent>
                <FeatureImportance data={metrics.featureImportance} />
              </CardContent>
            </Card>
          </div>

          {/* Model Info Card */}
          <Card className="bg-gradient-to-r from-background-card to-background-hover">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Model Information</h3>
                <p className="text-sm text-text-muted mt-1">
                  Ensemble model combining Random Forest and Gradient Boosting classifiers
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-background rounded-xl border border-slate-700/50">
                  <span className="text-xs text-text-muted">Version</span>
                  <p className="text-sm font-semibold text-text-primary">{metrics.modelVersion}</p>
                </div>
                <div className="px-4 py-2 bg-background rounded-xl border border-slate-700/50">
                  <span className="text-xs text-text-muted">Last Updated</span>
                  <p className="text-sm font-semibold text-text-primary">
                    {new Date(metrics.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-2 bg-risk-low/20 rounded-xl border border-risk-low/30">
                  <span className="text-xs text-risk-low">Status</span>
                  <p className="text-sm font-semibold text-risk-low">Active</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}