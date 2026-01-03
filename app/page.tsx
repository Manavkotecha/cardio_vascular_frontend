// src/app/page.tsx - Enhanced Dashboard page

'use client';

import { useQuery } from '@tanstack/react-query';
import { PredictionForm } from '@/components/PredictionForm';
import { Card, CardHeader, CardTitle, CardContent, StatsCard } from '@/components/ui/Card';
import { PageLoader, SkeletonCard } from '@/components/ui/LoadingSpinner';
import { Activity, Users, TrendingUp, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDateTime, getRiskColor, getRiskBgColor } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  // Fetch all predictions to get accurate counts
  const { data: allPredictions, isLoading: loadingAll } = useQuery({
    queryKey: ['predictions', 'all'],
    queryFn: () => api.getPredictionHistory({ limit: 1000 }), // Get all for counting
  });

  const { data: history, isLoading } = useQuery({
    queryKey: ['predictions', 'recent'],
    queryFn: () => api.getPredictionHistory({ limit: 5 }),
  });

  // Calculate dynamic stats
  const totalAssessments = allPredictions?.total || 0;
  const highRiskCases = allPredictions?.data?.filter(p => p.riskLevel === 'high').length || 0;
  const mediumRiskCases = allPredictions?.data?.filter(p => p.riskLevel === 'medium').length || 0;
  const uniquePatients = totalAssessments; // Each assessment is a unique patient scenario

  const stats = [
    {
      name: 'Total Assessments',
      value: totalAssessments,
      icon: <Activity className="h-6 w-6" />,
      color: 'accent' as const,
    },
    {
      name: 'High Risk Cases',
      value: highRiskCases,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'danger' as const,
    },
    {
      name: 'Medium Risk',
      value: mediumRiskCases,
      icon: <Users className="h-6 w-6" />,
      color: 'success' as const,
    },
    {
      name: 'Model Accuracy',
      value: '74%',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-background-card to-primary-light/10 border border-slate-700/50 p-6 md:p-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-light/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-accent mb-3">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">AI-Powered Assessment</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
            Cardiovascular Risk
            <span className="block gradient-text">Assessment Platform</span>
          </h1>
          <p className="text-text-muted max-w-xl text-lg">
            Predict 10-year cardiovascular disease risk using advanced machine learning models trained on extensive clinical data.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <div className="lg:col-span-2">
          <PredictionForm />
        </div>

        {/* Recent Predictions */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recent Assessments</CardTitle>
                <Link 
                  href="/history" 
                  className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : history && history.data.length > 0 ? (
                <div className="space-y-3">
                  {history.data.map((prediction, index) => (
                    <Link
                      key={prediction.id}
                      href={`/history`}
                      className="block p-4 bg-background rounded-xl border border-slate-700/50 hover:border-accent/50 hover:bg-background-hover transition-all duration-200 group animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                            Patient {prediction.input.age}y, {prediction.input.gender}
                          </div>
                          <div className="text-xs text-text-muted mt-0.5">
                            {formatDateTime(prediction.createdAt)}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getRiskBgColor(
                            prediction.riskLevel
                          )} ${getRiskColor(prediction.riskLevel)}`}
                        >
                          {prediction.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-accent">
                          {prediction.riskScore}%
                        </span>
                        <span className="text-sm text-text-muted">Risk</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-background-hover rounded-2xl mb-4">
                    <Activity className="h-10 w-10 text-text-muted" />
                  </div>
                  <p className="text-text-secondary font-medium mb-1">No assessments yet</p>
                  <p className="text-sm text-text-muted">
                    Complete your first risk assessment to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Info */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Cardiovascular Risk</CardTitle>
          <p className="text-text-muted text-sm mt-1">
            Learn about risk levels and recommended actions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-risk-low/10 border border-risk-low/30 hover:border-risk-low/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-risk-low/20 rounded-lg">
                  <svg className="w-5 h-5 text-risk-low" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-risk-low">Low Risk (&lt;10%)</h4>
              </div>
              <p className="text-sm text-text-muted">
                Continue healthy lifestyle habits. Regular check-ups recommended annually.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-risk-medium/10 border border-risk-medium/30 hover:border-risk-medium/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-risk-medium/20 rounded-lg">
                  <svg className="w-5 h-5 text-risk-medium" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-risk-medium">Medium Risk (10-20%)</h4>
              </div>
              <p className="text-sm text-text-muted">
                Consider lifestyle modifications. More frequent monitoring may be beneficial.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-risk-high/10 border border-risk-high/30 hover:border-risk-high/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-risk-high/20 rounded-lg">
                  <svg className="w-5 h-5 text-risk-high" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-risk-high">High Risk (&gt;20%)</h4>
              </div>
              <p className="text-sm text-text-muted">
                Immediate medical consultation recommended. Aggressive risk factor management needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}