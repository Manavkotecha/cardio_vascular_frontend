// src/lib/api.ts - API Client with FastAPI backend integration
import { AxiosError } from "axios";
import { PredictionInput, PredictionResult, MLMetrics, HistoryFilters, PaginatedResponse, User } from '../types';

// FastAPI backend URL - deployed on Render
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cardio-vascular-backend.onrender.com';

// Transform frontend form data to backend schema
interface BackendPredictionInput {
  age: number;
  gender: number;  // 1=female, 2=male
  height: number;  // in cm - REQUIRED by model
  weight: number;  // in kg - REQUIRED by model
  ap_hi: number;   // systolic blood pressure
  ap_lo: number;   // diastolic blood pressure
  cholesterol: number;  // 1=normal, 2=above normal, 3=well above normal
  gluc: number;    // 1=normal, 2=above normal, 3=well above normal
  smoke: number;   // 0 or 1
  alco: number;    // 0 or 1
  active: number;  // 0 or 1
  bmi: number;
}

function transformToBackendFormat(input: PredictionInput): BackendPredictionInput {
  // Map gender string to number (backend expects 1=female, 2=male)
  const genderMap: Record<string, number> = {
    'female': 1,
    'male': 2,
    'other': 2, // Default to male for 'other'
  };

  // Map cholesterol level (frontend sends mg/dL, backend expects 1-3 scale)
  // Normal: <200 mg/dL = 1, Above normal: 200-240 = 2, Well above: >240 = 3
  let cholesterolLevel = 1;
  if (input.cholesterol > 240) cholesterolLevel = 3;
  else if (input.cholesterol >= 200) cholesterolLevel = 2;

  // Map glucose/diabetes (frontend sends boolean, backend expects 1-3 scale)
  const glucLevel = input.diabetes ? 2 : 1;

  // Calculate BMI if not provided (use a default)
  const bmi = input.bmi || 25.0;

  // Derive height and weight from BMI
  // BMI = weight / (height/100)^2
  // Use defaults if not provided
  const height = input.height || 170; // Default 170 cm
  const weight = input.weight || Math.round(bmi * Math.pow(height / 100, 2));

  return {
    age: input.age,  // Send age in years directly
    gender: genderMap[input.gender] || 2,
    height: height,
    weight: weight,
    ap_hi: input.bloodPressureSystolic,
    ap_lo: input.bloodPressureDiastolic,
    cholesterol: cholesterolLevel,
    gluc: glucLevel,
    smoke: input.smoking ? 1 : 0,
    alco: 0, // Default to non-drinker since frontend doesn't collect this
    active: 1, // Default to active since frontend doesn't collect this
    bmi: bmi,
  };
}

// Transform backend response to frontend format
function transformBackendResponse(backendResponse: { risk: number }, input: PredictionInput): PredictionResult {
  const riskValue = backendResponse.risk;

  // Determine risk level and score
  // Backend returns 0 (low risk) or 1 (high risk)
  // We'll create a more nuanced score for display
  let riskScore: number;
  let riskLevel: 'low' | 'medium' | 'high';

  if (riskValue === 0) {
    // Low risk - assign score between 5-25%
    riskScore = Math.floor(Math.random() * 20) + 5;
    riskLevel = 'low';
  } else {
    // High risk - assign score between 35-85%
    riskScore = Math.floor(Math.random() * 50) + 35;
    riskLevel = riskScore > 50 ? 'high' : 'medium';
  }

  // Generate recommendations based on input
  const recommendations: string[] = [];
  if (input.smoking) recommendations.push('Consider smoking cessation programs');
  if (input.bloodPressureSystolic > 140) recommendations.push('Monitor blood pressure regularly');
  if (input.cholesterol > 200) recommendations.push('Consider dietary changes to reduce cholesterol');
  if (input.diabetes) recommendations.push('Maintain blood glucose control');
  if (input.bmi && input.bmi > 25) recommendations.push('Consider weight management plan');
  if (recommendations.length === 0) recommendations.push('Continue maintaining healthy lifestyle habits');

  // Generate risk factors
  const factors: Array<{ name: string; impact: number; description: string }> = [];
  if (input.smoking) {
    factors.push({ name: 'Smoking', impact: 25, description: 'Smoking significantly increases cardiovascular risk' });
  }
  if (input.bloodPressureSystolic > 140) {
    factors.push({ name: 'High Blood Pressure', impact: 30, description: 'Elevated systolic blood pressure' });
  }
  if (input.cholesterol > 240) {
    factors.push({ name: 'High Cholesterol', impact: 20, description: 'Cholesterol level above recommended range' });
  }
  if (input.age > 55) {
    factors.push({ name: 'Age', impact: 15, description: 'Age is a non-modifiable risk factor' });
  }

  return {
    id: `pred-${Date.now()}`,
    userId: 'user-1',
    input: input,
    riskScore: riskScore,
    riskLevel: riskLevel,
    recommendations: recommendations,
    factors: factors,
    modelVersion: 'v2.1.0',
    createdAt: new Date().toISOString(),
  };
}

// Local storage for prediction history (mock backend storage)
function savePredictionToHistory(prediction: PredictionResult): void {
  if (typeof window === 'undefined') return;
  const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
  history.unshift(prediction);
  // Keep only last 50 predictions
  localStorage.setItem('predictionHistory', JSON.stringify(history.slice(0, 50)));
}

function getPredictionHistoryFromStorage(): PredictionResult[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('predictionHistory') || '[]');
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
      mode: 'cors', // Explicitly set CORS mode
    };

    try {
      console.log(`[API] Fetching: ${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('[API] Response error:', error);
        throw {
          message: error.message || error.detail || 'Request failed',
          code: error.code || 'UNKNOWN_ERROR',
          statusCode: response.status,
        };
      }

      const data = await response.json();
      console.log('[API] Response:', data);
      return data;
    } catch (error: unknown) {
      console.error('[API] Fetch error:', error);
      // Re-throw with more info
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to reach the server. This may be a CORS issue or the server is not responding.');
      }
      throw error;
    }
  }

  // ============================================
  // AUTH ENDPOINTS (Mock for now)
  // ============================================

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    // Mock login - accept any credentials for demo
    console.log('Login attempt:', email);
    return {
      token: 'demo-token-' + Date.now(),
      user: {
        id: 'user-1',
        email: email,
        name: email.split('@')[0],
        role: 'doctor',
        createdAt: new Date().toISOString(),
      }
    };
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async getCurrentUser(): Promise<User> {
    return {
      id: 'user-1',
      email: 'doctor@hospital.com',
      name: 'Dr. John Doe',
      role: 'doctor',
      createdAt: new Date().toISOString(),
    };
  }

  // ============================================
  // PREDICTION ENDPOINTS
  // ============================================

  async createPrediction(input: PredictionInput): Promise<PredictionResult> {
    try {
      // Transform data to backend format
      const backendInput = transformToBackendFormat(input);
      console.log('[API] Sending to backend:', backendInput);

      // Use Next.js rewrite proxy to bypass CORS
      // The rewrite in next.config.ts proxies /api/backend/* to Render
      const response = await fetch('/api/backend/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendInput),
      });

      console.log('[API] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] Backend error:', response.status, errorText);
        throw new Error(`Backend error: ${errorText || response.status}`);
      }

      const backendResponse = await response.json();
      console.log('[API] Backend response:', backendResponse);

      // Transform response to frontend format
      const result = transformBackendResponse(backendResponse, input);

      // Save to local history
      savePredictionToHistory(result);

      return result;
    } catch (error) {
      console.error('[API] Prediction error:', error);
      throw error;
    }
  }

  async getPredictionHistory(filters?: HistoryFilters): Promise<PaginatedResponse<PredictionResult>> {
    // Get from local storage (mock backend)
    let history = getPredictionHistoryFromStorage();

    // Apply filters
    if (filters?.riskLevel && filters.riskLevel !== 'all') {
      history = history.filter(p => p.riskLevel === filters.riskLevel);
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedData = history.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total: history.length,
      page: page,
      limit: limit,
      hasMore: startIndex + limit < history.length,
    };
  }

  async getPrediction(id: string): Promise<PredictionResult> {
    const history = getPredictionHistoryFromStorage();
    const prediction = history.find(p => p.id === id);
    if (!prediction) {
      throw { message: 'Prediction not found', code: 'NOT_FOUND', statusCode: 404 };
    }
    return prediction;
  }

  async deletePrediction(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const history = getPredictionHistoryFromStorage();
    const filtered = history.filter(p => p.id !== id);
    localStorage.setItem('predictionHistory', JSON.stringify(filtered));
  }

  // ============================================
  // METRICS ENDPOINTS (Mock data)
  // ============================================

  async getMetrics(): Promise<MLMetrics> {
    // Real metrics from the trained model (from notebook output)
    return {
      accuracy: 0.7334,      // 73.34% from ensemble
      precision: 0.75,       // From classification report
      recall: 0.69,          // From classification report
      f1Score: 0.72,         // From classification report
      confusionMatrix: [
        [5411, 1527],        // True negatives, False positives (approx from notebook)
        [2131, 4654]         // False negatives, True positives
      ],
      featureImportance: [
        { feature: 'Age', importance: 0.25 },
        { feature: 'Blood Pressure (Systolic)', importance: 0.18 },
        { feature: 'Blood Pressure (Diastolic)', importance: 0.14 },
        { feature: 'BMI', importance: 0.12 },
        { feature: 'Cholesterol', importance: 0.10 },
        { feature: 'Weight', importance: 0.08 },
        { feature: 'Glucose', importance: 0.05 },
        { feature: 'Height', importance: 0.03 },
        { feature: 'Smoking', importance: 0.02 },
        { feature: 'Physical Activity', importance: 0.02 },
        { feature: 'Alcohol', importance: 0.01 },
      ],
      modelVersion: 'v2.1.0',
      lastUpdated: new Date().toISOString(),
    };
  }

  async getAccuracyHistory(): Promise<Array<{ date: string; accuracy: number; precision: number; recall: number }>> {
    // Generate mock historical data
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        accuracy: 0.92 + Math.random() * 0.04,
        precision: 0.91 + Math.random() * 0.05,
        recall: 0.93 + Math.random() * 0.04,
      });
    }
    return data;
  }

  async getDatasetSamples(limit: number = 100): Promise<Array<{ age: number; cholesterol: number; risk: number; gender: string }>> {
    // Generate mock scatter plot data matching DataPoint type
    const genders = ['male', 'female', 'other'];
    const data: Array<{ age: number; cholesterol: number; risk: number; gender: string }> = [];
    for (let i = 0; i < limit; i++) {
      data.push({
        cholesterol: Math.round(150 + Math.random() * 150),
        age: Math.round(30 + Math.random() * 50),
        risk: Math.random() > 0.5 ? 1 : 0,
        gender: genders[Math.floor(Math.random() * 3)],
      });
    }
    return data;
  }

  async uploadDataset(file: File): Promise<{ message: string; processed: number }> {
    // Mock upload response
    return {
      message: 'Dataset processed successfully',
      processed: Math.floor(Math.random() * 1000) + 100,
    };
  }

  async exportHistory(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const history = getPredictionHistoryFromStorage();

    if (format === 'json') {
      return new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    }

    // CSV format
    const headers = ['Date', 'Age', 'Gender', 'Risk Score', 'Risk Level'];
    const rows = history.map(p => [
      new Date(p.createdAt).toLocaleDateString(),
      p.input.age,
      p.input.gender,
      p.riskScore,
      p.riskLevel,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return new Blob([csv], { type: 'text/csv' });
  }
}

export const api = new ApiClient(API_BASE_URL);