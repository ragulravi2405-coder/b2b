import { Suspense } from 'react';
import HomeClient from './HomeClient';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FF] text-[#17152A]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading B2B...</p>
          </div>
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
