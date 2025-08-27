"use client";
import AuthForm from '../../components/auth/AuthForm';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(data: { email: string; password: string }) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Login failed');
      // TODO: Save token, redirect, etc.
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <AuthForm type="login" onSubmit={handleLogin} loading={loading} error={error} />;
}
