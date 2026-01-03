// src/components/PredictionForm.tsx - Enhanced prediction form with better UX

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PredictionFormData, predictionSchema } from '../lib/validations';
import { api } from '../lib/api';
import { Input, Select, Checkbox } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Modal } from './ui/Modal';
import { RiskGauge } from './charts/RiskGauge';
import { AlertCircle, TrendingUp, CheckCircle2, Heart, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { PredictionResult } from '../types';

export function PredictionForm() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PredictionFormData>({ 
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      gender: 'male',
      smoking: false,
      diabetes: false,
      familyHistory: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PredictionFormData) => api.createPrediction(data),
    onSuccess: (data) => {
      setResult(data);
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      toast.success('Risk assessment completed!', {
        icon: '🎯',
        style: {
          background: '#111827',
          color: '#f8fafc',
          border: '1px solid #334155',
        },
      });
      // Reset form to empty values after closing modal
    },
    onError: (error: Error) => {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction. Please check if the backend is running.', {
        style: {
          background: '#111827',
          color: '#f8fafc',
          border: '1px solid #334155',
        },
      });
    },
  });

  const onSubmit = (data: PredictionFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-accent/10 via-background-card to-primary-light/10 px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-xl">
              <Stethoscope className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl">Risk Assessment</CardTitle>
              <p className="text-text-muted text-sm mt-0.5">Enter patient information to calculate cardiovascular risk</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">1</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  error={errors.age?.message}
                  helpText="Patient's age in years (18-120)"
                  required
                />

                <Select
                  label="Gender"
                  {...register('gender')}
                  error={errors.gender?.message}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  required
                />
              </div>
            </div>

            {/* Clinical Measurements Section */}
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">2</span>
                Clinical Measurements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Total Cholesterol"
                  type="number"
                  {...register('cholesterol', { valueAsNumber: true })}
                  error={errors.cholesterol?.message}
                  helpText="mg/dL (Normal: <200)"
                  required
                />

                <Input
                  label="Systolic BP"
                  type="number"
                  {...register('bloodPressureSystolic', { valueAsNumber: true })}
                  error={errors.bloodPressureSystolic?.message}
                  helpText="mmHg (Normal: <120)"
                  required
                />

                <Input
                  label="Diastolic BP"
                  type="number"
                  {...register('bloodPressureDiastolic', { valueAsNumber: true })}
                  error={errors.bloodPressureDiastolic?.message}
                  helpText="mmHg (Normal: <80)"
                  required
                />

                <Input
                  label="BMI"
                  type="number"
                  step="0.1"
                  {...register('bmi', { valueAsNumber: true })}
                  error={errors.bmi?.message}
                  helpText="kg/m² (Normal: 18.5-24.9)"
                />
              </div>
            </div>

            {/* Risk Factors Section */}
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">3</span>
                Risk Factors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Checkbox
                  label="Smoker"
                  description="Current or former smoker"
                  {...register('smoking')}
                />

                <Checkbox
                  label="Diabetes"
                  description="Type 1 or Type 2 diabetes"
                  {...register('diabetes')}
                />

                <Checkbox
                  label="Family History"
                  description="CVD in first-degree relatives"
                  {...register('familyHistory')}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
              <Button
                type="submit"
                variant="primary"
                loading={mutation.isPending}
                fullWidth
                icon={<TrendingUp className="h-5 w-5" />}
                className="order-1 sm:order-2 sm:flex-1"
              >
                Calculate Risk Score
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                className="order-2 sm:order-1"
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result Modal */}
      <Modal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Risk Assessment Result"
        size="lg"
      >
        {result && (
          <div className="space-y-6">
            {/* Risk Gauge */}
            <div className="py-4">
              <RiskGauge score={result.riskScore} level={result.riskLevel} />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card padding="sm" className="text-center">
                <div className="text-3xl font-bold text-text-primary">{result.riskScore}%</div>
                <div className="text-xs text-text-muted mt-1">10-Year Risk</div>
              </Card>
              <Card padding="sm" className="text-center">
                <div className={`text-3xl font-bold capitalize ${
                  result.riskLevel === 'low' ? 'text-risk-low' :
                  result.riskLevel === 'medium' ? 'text-risk-medium' : 'text-risk-high'
                }`}>
                  {result.riskLevel}
                </div>
                <div className="text-xs text-text-muted mt-1">Risk Level</div>
              </Card>
              <Card padding="sm" className="text-center">
                <div className="text-3xl font-bold text-accent">{result.modelVersion}</div>
                <div className="text-xs text-text-muted mt-1">Model Version</div>
              </Card>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="p-4 bg-risk-low/10 rounded-xl border border-risk-low/30">
                <h4 className="text-lg font-semibold text-risk-low mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-risk-low mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Factors */}
            {result.factors && result.factors.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-risk-medium" />
                  Contributing Risk Factors
                </h4>
                <div className="space-y-3">
                  {result.factors.map((factor, idx) => (
                    <div key={idx} className="p-4 bg-background rounded-xl border border-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-text-primary">{factor.name}</span>
                        <span className={`text-sm font-bold ${
                          factor.impact > 20 ? 'text-risk-high' :
                          factor.impact > 10 ? 'text-risk-medium' : 'text-risk-low'
                        }`}>
                          +{factor.impact}%
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">{factor.description}</p>
                      {/* Impact Bar */}
                      <div className="mt-2 h-1.5 bg-background-hover rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            factor.impact > 20 ? 'bg-risk-high' :
                            factor.impact > 10 ? 'bg-risk-medium' : 'bg-risk-low'
                          }`}
                          style={{ width: `${Math.min(factor.impact * 3, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <Button
              variant="primary"
              onClick={() => {
                setShowResult(false);
                reset(); // Reset form when closing modal
              }}
              fullWidth
              icon={<Heart className="h-5 w-5" />}
            >
              Close & Start New Assessment
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}