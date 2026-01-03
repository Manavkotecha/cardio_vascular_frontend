'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../lib/validations';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Heart, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await api.login(data.email, data.password);
      localStorage.setItem('token', result.token);
      toast.success('Login successful!', {
        icon: '🎉',
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
      router.push('/');
    } catch (error) {
      toast.error('Invalid credentials', {
        style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-light/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <Card className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary-light rounded-2xl blur-xl opacity-50 animate-pulse-glow" />
            <div className="relative p-4 bg-gradient-to-br from-accent to-primary-light rounded-2xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mt-6">CardioPredict</h1>
          <p className="text-text-muted mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Demo Account Notice */}
        <div className="mb-6 p-4 bg-accent/10 rounded-xl border border-accent/30">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Demo Mode</span>
          </div>
          <p className="text-xs text-text-muted">
            Enter any email and password (6+ chars) to access the demo. No real authentication required.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="doctor@hospital.com"
            {...register('email')}
            error={errors.email?.message}
            icon={<Mail className="h-5 w-5" />}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            icon={<Lock className="h-5 w-5" />}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            loading={isSubmitting} 
            fullWidth
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-sm text-text-muted">
            Powered by AI • v2.1.0
          </p>
        </div>
      </Card>
    </div>
  );
}