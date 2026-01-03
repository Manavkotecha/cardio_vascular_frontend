// src/components/layout/Sidebar.tsx - Enhanced Sidebar with gradient accents

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  History, 
  TrendingUp, 
  Database, 
  Settings,
  Heart,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Overview & quick actions' },
  { name: 'History', href: '/history', icon: History, description: 'Past assessments' },
  { name: 'ML Insights', href: '/insights', icon: TrendingUp, description: 'Model performance' },
  { name: 'Data Explorer', href: '/data', icon: Database, description: 'Dataset analysis' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background-card/80 backdrop-blur-xl border-r border-slate-700/50">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary-light rounded-xl blur-lg opacity-50" />
            <div className="relative p-2.5 bg-gradient-to-br from-accent to-primary-light rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">CardioPredict</h1>
            <p className="text-xs text-text-muted">AI Risk Assessment</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-accent/20 to-primary-light/10 text-accent border border-accent/30'
                    : 'text-text-muted hover:bg-background-hover hover:text-text-secondary'
                )}
              >
                <div className={cn(
                  'p-1.5 rounded-lg transition-colors duration-200',
                  isActive 
                    ? 'bg-accent/20' 
                    : 'group-hover:bg-background-card'
                )}>
                  <item.icon className={cn(
                    'h-5 w-5 transition-colors duration-200',
                    isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                  )} />
                </div>
                <div className="flex-1">
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Model Version Info */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="px-4 py-3 bg-gradient-to-r from-background to-background-hover rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-muted">Model Version</p>
              <span className="px-2 py-0.5 bg-risk-low/20 text-risk-low text-xs font-medium rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm font-semibold text-text-primary">v2.1.0</p>
            <p className="text-xs text-text-muted mt-1">73.3% Accuracy</p>
          </div>
        </div>
      </div>
    </aside>
  );
}