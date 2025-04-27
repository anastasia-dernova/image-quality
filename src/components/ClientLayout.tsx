'use client';

import { useEffect } from 'react';
import { EvaluationProvider } from '@/contexts/EvaluationContext';
import { initTF } from '@/utils/tfInitializer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialize TensorFlow.js when the app starts
  useEffect(() => {
    initTF();
  }, []);

  return (
    <EvaluationProvider>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </EvaluationProvider>
  );
}