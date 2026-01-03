'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent, StatsCard } from '../../components/ui/Card';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { ScatterPlot } from '../../components/charts/ScatterPlot';
import { 
  Database, 
  Users, 
  Activity, 
  TrendingUp, 
  BarChart3,
  Heart,
  Gauge,
  Target,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function DataPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['data', 'samples'],
    queryFn: () => api.getDatasetSamples(100),
  });

  if (isLoading) return <PageLoader />;

  // Dataset statistics (from the actual training data)
  const datasetStats = {
    totalSamples: 70000,
    trainingSamples: 56000,
    testSamples: 14000,
    features: 11,
    classes: 2,
  };

  const featureStats = [
    { name: 'Age', type: 'Numeric', range: '29-65 years', importance: 'High' },
    { name: 'Gender', type: 'Categorical', range: 'Male/Female', importance: 'Medium' },
    { name: 'Height', type: 'Numeric', range: '55-250 cm', importance: 'Low' },
    { name: 'Weight', type: 'Numeric', range: '10-200 kg', importance: 'Medium' },
    { name: 'Systolic BP', type: 'Numeric', range: '70-240 mmHg', importance: 'High' },
    { name: 'Diastolic BP', type: 'Numeric', range: '40-150 mmHg', importance: 'High' },
    { name: 'Cholesterol', type: 'Ordinal', range: '1-3 (Normal to High)', importance: 'Medium' },
    { name: 'Glucose', type: 'Ordinal', range: '1-3 (Normal to High)', importance: 'Medium' },
    { name: 'Smoking', type: 'Binary', range: 'Yes/No', importance: 'Medium' },
    { name: 'Alcohol', type: 'Binary', range: 'Yes/No', importance: 'Low' },
    { name: 'Physical Activity', type: 'Binary', range: 'Yes/No', importance: 'Medium' },
  ];

  const qualityMetrics = [
    { label: 'Missing Values', value: '0%', status: 'good' },
    { label: 'Duplicate Records', value: '0.02%', status: 'good' },
    { label: 'Class Balance', value: '50.4% / 49.6%', status: 'good' },
    { label: 'Data Quality Score', value: '98.5%', status: 'good' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-risk-medium/20 via-background-card to-risk-low/10 border border-slate-700/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-risk-medium/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-risk-medium to-risk-low rounded-xl">
            <Database className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Data Explorer</h1>
            <p className="text-text-muted mt-1">Dataset overview and analysis</p>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Records"
          value="70,000"
          icon={<Users className="h-6 w-6" />}
          color="accent"
        />
        <StatsCard
          title="Features"
          value="11"
          icon={<Layers className="h-6 w-6" />}
          color="success"
        />
        <StatsCard
          title="Training Set"
          value="80%"
          icon={<TrendingUp className="h-6 w-6" />}
          color="warning"
        />
        <StatsCard
          title="Test Set"
          value="20%"
          icon={<Target className="h-6 w-6" />}
          color="danger"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Feature Overview</CardTitle>
                <p className="text-sm text-text-muted mt-0.5">Input variables used for prediction</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-2 text-text-muted font-medium">Feature</th>
                    <th className="text-left py-3 px-2 text-text-muted font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-text-muted font-medium hidden md:table-cell">Range</th>
                    <th className="text-left py-3 px-2 text-text-muted font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {featureStats.map((feature, index) => (
                    <tr key={feature.name} className="border-b border-slate-700/30 hover:bg-background-hover/50 transition-colors">
                      <td className="py-2.5 px-2 text-text-primary font-medium">{feature.name}</td>
                      <td className="py-2.5 px-2 text-text-secondary">{feature.type}</td>
                      <td className="py-2.5 px-2 text-text-muted hidden md:table-cell">{feature.range}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feature.importance === 'High' 
                            ? 'bg-risk-high/20 text-risk-high' 
                            : feature.importance === 'Medium'
                            ? 'bg-risk-medium/20 text-risk-medium'
                            : 'bg-risk-low/20 text-risk-low'
                        }`}>
                          {feature.importance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Data Quality Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-risk-low/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-risk-low" />
              </div>
              <div>
                <CardTitle>Data Quality</CardTitle>
                <p className="text-sm text-text-muted mt-0.5">Dataset health metrics</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-4 bg-background-hover rounded-xl">
                  <span className="text-text-secondary">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-semibold">{metric.value}</span>
                    <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overall Score */}
            <div className="mt-6 p-6 bg-gradient-to-r from-risk-low/10 to-accent/10 rounded-2xl border border-risk-low/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-text-muted">Overall Quality</span>
                <span className="text-3xl font-bold text-risk-low">98.5%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-gradient-to-r from-risk-low to-accent h-2 rounded-full" style={{ width: '98.5%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization */}
      {data && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light/20 rounded-lg">
                <Activity className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <CardTitle>Feature Distribution</CardTitle>
                <p className="text-sm text-text-muted mt-0.5">Scatter plot showing age vs cholesterol by risk</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScatterPlot
              data={data}
              xKey="cholesterol"
              yKey="age"
              xLabel="Cholesterol Level (mg/dL)"
              yLabel="Age (years)"
            />
          </CardContent>
        </Card>
      )}

      {/* Dataset Info Card */}
      <Card className="bg-gradient-to-r from-background-card to-background-hover">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-primary-light/20 rounded-xl">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Cardiovascular Disease Dataset</h3>
              <p className="text-sm text-text-muted mt-1">
                Source: Kaggle • 70,000 patient records • 11 risk factors
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-background rounded-xl border border-slate-700/50">
              <span className="text-xs text-text-muted">Binary Classification</span>
              <p className="text-sm font-semibold text-text-primary">CVD Risk</p>
            </div>
            <div className="px-4 py-2 bg-background rounded-xl border border-slate-700/50">
              <span className="text-xs text-text-muted">Train/Test Split</span>
              <p className="text-sm font-semibold text-text-primary">80% / 20%</p>
            </div>
            <div className="px-4 py-2 bg-risk-low/20 rounded-xl border border-risk-low/30">
              <span className="text-xs text-risk-low">Status</span>
              <p className="text-sm font-semibold text-risk-low">Production Ready</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}