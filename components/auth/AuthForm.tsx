import React, { useState } from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  loading?: boolean;
  error?: string;
}

export default function AuthForm({ type, onSubmit, loading, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'register') {
      onSubmit({ email, password, name });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center mb-2">{type === 'login' ? 'Login' : 'Register'}</h2>
      {type === 'register' && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Please wait...' : type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
