'use client';

import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-[#e0e0e0] bg-[#FAFAFA] p-10 text-center transition-all duration-500 hover:border-[#1C1C1C] hover:shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] text-white flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Mail size={32} />
        </div>
        
        <h1 className="text-3xl font-[900] tracking-tighter uppercase text-[#1C1C1C] mb-4">
          Welcome to Betaal AI
        </h1>
        <p className="text-[11px] font-[900] uppercase tracking-[0.2em] text-[#1C1C1C]/40 mb-10 leading-relaxed">
          Sign in to access your digital rehab dashboard and track your progress today.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-[#1C1C1C] text-white py-5 rounded-2xl text-xs font-[900] uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          Continue with Google
        </button>
        
        <div className="mt-8">
          <p className="text-[9px] font-bold text-[#1C1C1C]/25 uppercase tracking-widest">
            Secure, Science-Backed, Focused
          </p>
        </div>
      </div>
    </div>
  );
}
