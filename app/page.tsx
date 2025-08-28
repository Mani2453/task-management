"use client";
import React from "react";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('session')) {
      router.replace('/dashboard');
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Task Management App</h1>
        <p className="max-w-2xl text-lg text-gray-700 mb-8 text-center">
          Welcome to your modern, full-featured task management application!<br />
          Organize your projects, manage tasks, and stay productive with a clean UI, secure authentication, and real-time feedback.
        </p>
        <ul className="list-disc text-left text-gray-600 space-y-2 mb-8">
          <li>🔒 Secure registration & login (JWT-based)</li>
          <li>🗂️ Create, edit, and manage projects</li>
          <li>✅ Add, update, and track tasks</li>
          <li>👤 All data is private to your account</li>
          <li>⚡ Fast, responsive, and mobile-friendly UI</li>
          <li>🔔 Toast notifications for all actions</li>
        </ul>
        <div className="flex gap-4">
          <a href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition">Get Started</a>
          <a href="/auth/login" className="bg-white border border-blue-600 text-blue-700 font-semibold py-2 px-6 rounded shadow hover:bg-blue-50 transition">Login</a>
        </div>
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm border-t">&copy; {new Date().getFullYear()} Task Management App</footer>
    </div>
  );
}
