// src/components/layout/MobileNav.tsx - Enhanced Mobile navigation

'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Menu, X, Heart, ChevronRight } from 'lucide-react';
import { 
  LayoutDashboard, 
  History, 
  TrendingUp, 
  Database, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'History', href: '/history', icon: History },
  { name: 'ML Insights', href: '/insights', icon: TrendingUp },
  { name: 'Data Explorer', href: '/data', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary-light rounded-lg blur opacity-50" />
              <div className="relative p-1.5 bg-gradient-to-br from-accent to-primary-light rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary">CardioPredict</h1>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-hover transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={setIsOpen} className="relative z-50 lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col bg-background-card/95 backdrop-blur-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary-light rounded-xl blur opacity-50" />
                      <div className="relative p-2 bg-gradient-to-br from-accent to-primary-light rounded-xl">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-text-primary">CardioPredict</h1>
                      <p className="text-xs text-text-muted">AI Risk Assessment</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-hover transition-all"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-accent/20 to-primary-light/10 text-accent border border-accent/30'
                            : 'text-text-muted hover:bg-background-hover hover:text-text-secondary'
                        )}
                      >
                        <div className={cn(
                          'p-2 rounded-lg',
                          isActive ? 'bg-accent/20' : 'bg-background-hover'
                        )}>
                          <item.icon className={cn(
                            'h-5 w-5',
                            isActive ? 'text-accent' : 'text-text-muted'
                          )} />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <ChevronRight className="h-5 w-5 text-accent" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="px-4 py-3 bg-background rounded-xl border border-slate-700/50">
                    <p className="text-xs text-text-muted mb-1">Model Version</p>
                    <p className="text-sm font-semibold text-text-primary">v2.1.0</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}