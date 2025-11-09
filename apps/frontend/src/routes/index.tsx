import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { checkBackendHealth, type HealthCheckResponse } from '@/lib/api';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [backendStatus, setBackendStatus] = useState<HealthCheckResponse | null>(null);

  useEffect(() => {
    // Check backend health on component mount
    checkBackendHealth().then(setBackendStatus);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
            cv-hub
          </h1>
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">Coming Soon</h2>
          <p className="text-lg text-slate-500 dark:text-slate-500 max-w-md mx-auto">
            A modern, professional CV platform built with TanStack Start, React 19, and Tailwind
            CSS.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button
              variant="default"
              onClick={() => console.log('Get Started clicked - Navigation coming in Epic 3')}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log('Learn More clicked - Documentation coming in Epic 3')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Backend Status Indicator - Footer */}
      <footer className="p-4 text-center">
        {backendStatus === null ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
            <span>Checking backend...</span>
          </div>
        ) : backendStatus.status === 'ok' ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-sm text-emerald-700 dark:text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Backend: Connected</span>
            {backendStatus.data && (
              <span className="text-xs opacity-70">(DB: {backendStatus.data.database.status})</span>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-sm text-red-700 dark:text-red-400">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            <span>Backend: Error</span>
            {backendStatus.error && (
              <span className="text-xs opacity-70">({backendStatus.error})</span>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
