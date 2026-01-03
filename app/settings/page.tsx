'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogOut, User, Key, Server, Bell, Shield, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully', {
      style: { background: '#111827', color: '#f8fafc', border: '1px solid #334155' },
    });
    router.push('/login');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-background-card to-primary/10 border border-slate-700/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-accent to-primary-light rounded-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            <p className="text-text-muted mt-1">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Profile</CardTitle>
              <p className="text-sm text-text-muted mt-0.5">Update your personal information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" defaultValue="Dr. John Doe" />
            <Input label="Email" type="email" defaultValue="doctor@hospital.com" disabled helpText="Email cannot be changed" />
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary">Update Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-light/20 rounded-lg">
              <Server className="h-5 w-5 text-primary-light" />
            </div>
            <div>
              <CardTitle>API Configuration</CardTitle>
              <p className="text-sm text-text-muted mt-0.5">Configure backend connection settings</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="API Base URL" 
              defaultValue={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} 
              helpText="FastAPI backend URL"
            />
            <Input 
              label="API Key" 
              type="password" 
              placeholder="••••••••••••••••" 
              rightIcon={<Key className="h-4 w-4" />}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary">Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-risk-medium/20 rounded-lg">
              <Bell className="h-5 w-5 text-risk-medium" />
            </div>
            <div>
              <CardTitle>Preferences</CardTitle>
              <p className="text-sm text-text-muted mt-0.5">Customize your experience</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Dark Mode</p>
                  <p className="text-xs text-text-muted">Always enabled for optimal viewing</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-risk-low/20 text-risk-low text-xs font-medium rounded-full">
                Active
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Notifications</p>
                  <p className="text-xs text-text-muted">Receive alerts for high-risk predictions</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-background-hover rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-risk-high/30">
        <CardHeader>
          <CardTitle className="text-risk-high">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-risk-high/10 rounded-xl border border-risk-high/30">
            <div>
              <p className="text-sm font-medium text-text-primary">Logout from your account</p>
              <p className="text-xs text-text-muted mt-1">You will be redirected to the login page</p>
            </div>
            <Button 
              variant="danger" 
              icon={<LogOut className="h-4 w-4" />} 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}