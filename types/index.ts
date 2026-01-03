// src/types/index.ts - Complete type definitions

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
}

export interface PredictionInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  height?: number;  // in cm - optional, defaults to 170
  weight?: number;  // in kg - optional, calculated from BMI if not provided
  cholesterol: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  smoking: boolean;
  diabetes: boolean;
  bmi?: number;
  familyHistory?: boolean;
}

export interface PredictionResult {
  id: string;
  userId: string;
  input: PredictionInput;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  factors: Array<{
    name: string;
    impact: number;
    description: string;
  }>;
  modelVersion: string;
  createdAt: string;
}

export interface MLMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  featureImportance: Array<{
    feature: string;
    importance: number;
  }>;
  modelVersion: string;
  lastUpdated: string;
}

export interface HistoryFilters {
  startDate?: string;
  endDate?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface DataPoint {
  age: number;
  cholesterol: number;
  risk: number;
  gender: string;
}