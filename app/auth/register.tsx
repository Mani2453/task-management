"use client";
import AuthForm from '../../components/auth/AuthForm';
import { useState } from 'react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(data: { email: string; password: string; name?: string }) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Registration failed');
      // TODO: Redirect to login or dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <AuthForm type="register" onSubmit={handleRegister} loading={loading} error={error} />;
}
