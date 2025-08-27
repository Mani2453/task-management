"use client";
import AuthForm from '../../../components/auth/AuthForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

        // Redirect to dashboard if already logged in
        useEffect(() => {
            if (typeof window !== 'undefined' && localStorage.getItem('token')) {
                router.push('/dashboard');
            }
        }, [router]);

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
            // Save token and redirect
            localStorage.setItem('token', result.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return <AuthForm type="login" onSubmit={handleLogin} loading={loading} error={error} />;
}
