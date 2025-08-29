"use client";

import { useRouter } from "next/navigation";
import AnimatedCard from './components/AnimatedCard';
import { ClipboardDocumentListIcon, UserPlusIcon, ArrowRightOnRectangleIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function Home() {
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('session')) {
      router.replace('/dashboard');
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 flex flex-col transition-colors duration-500 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <AnimatedCard className="max-w-2xl w-full mx-auto p-10 mb-10 backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl flex flex-col items-center">
          <ClipboardDocumentListIcon className="w-16 h-16 text-indigo-400 mb-4 animate-bounce" />
          <h1 className="text-5xl font-extrabold mb-4 text-indigo-900 tracking-tight drop-shadow text-center">Task Management App</h1>
          <p className="max-w-xl text-lg text-gray-700 mb-8 text-center">
            Welcome to your modern, full-featured task management application!<br />
            Organize your projects, manage tasks, and stay productive with a clean UI, secure authentication, and real-time feedback.
          </p>
          <ul className="list-disc text-left text-gray-600 space-y-2 mb-8">
            <li className="flex items-center gap-2"><LockClosedIcon className="w-5 h-5 text-indigo-400" /> Secure registration & login (JWT-based)</li>
            <li className="flex items-center gap-2"><ClipboardDocumentListIcon className="w-5 h-5 text-indigo-400" /> Create, edit, and manage projects</li>
            <li className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-green-400" /> Add, update, and track tasks</li>
            <li className="flex items-center gap-2"><UserPlusIcon className="w-5 h-5 text-pink-400" /> All data is private to your account</li>
            <li className="flex items-center gap-2"><ArrowRightOnRectangleIcon className="w-5 h-5 text-indigo-400" /> Fast, responsive, and mobile-friendly UI</li>
            <li className="flex items-center gap-2"><span className="w-5 h-5 text-yellow-400">🔔</span> Toast notifications for all actions</li>
          </ul>
          <div className="flex gap-4 mt-4">
            <a href="/auth/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2">
              <UserPlusIcon className="w-5 h-5" /> Get Started
            </a>
            <a href="/auth/login" className="bg-white border border-indigo-600 text-indigo-700 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2">
              <ArrowRightOnRectangleIcon className="w-5 h-5" /> Login
            </a>
          </div>
        </AnimatedCard>
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm border-t">&copy; {new Date().getFullYear()} Task Management App</footer>
    </div>
  );
}
