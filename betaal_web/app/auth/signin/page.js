'use client';

import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-3xl border border-[#e0e0e0] bg-[#FAFAFA] p-10 text-center transition-all duration-500 hover:border-[#1C1C1C] hover:shadow-2xl">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C1C1C] text-white shadow-xl">
          <Mail size={32} />
        </div>

        <h1 className="mb-4 text-3xl font-[900] tracking-tighter text-[#1C1C1C] uppercase">
          Welcome to Betaal AI
        </h1>
        <p className="mb-10 text-[11px] leading-relaxed font-[900] tracking-[0.2em] text-[#1C1C1C]/40 uppercase">
          Sign in to access your digital rehab dashboard and track your progress today.
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1C1C1C] py-5 text-xs font-[900] tracking-[0.15em] text-white uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
        >
          Continue with Google
        </button>

        <div className="mt-8">
          <p className="text-[9px] font-bold tracking-widest text-[#1C1C1C]/25 uppercase">
            Secure, Science-Backed, Focused
          </p>
        </div>
      </div>
    </div>
  );
}
