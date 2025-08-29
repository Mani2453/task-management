"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import AnimatedCard from '../../components/AnimatedCard';
import { UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const { showToast } = useToast();
	const router = useRouter();

	// Redirect if already authenticated
	React.useEffect(() => {
		if (typeof window !== 'undefined' && localStorage.getItem('session')) {
			router.replace('/dashboard');
		}
	}, [router]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post("/api/auth/register", form);
			// Automatically log in the user
			if (res.data?.token) {
				window.localStorage.setItem("session", res.data.token);
				showToast("Registration successful! You are now logged in.", "success");
				router.push("/");
			} else {
				showToast("Registration successful! Please log in.", "success");
				router.push("/auth/login");
			}
			} catch (err: unknown) {
				const errorMsg = (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) ? (err.response.data.error as string) : 'Registration failed';
				showToast(errorMsg, "error");
		} finally {
			setLoading(false);
		}
	}

		return (
			<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 transition-colors duration-500">
				<AnimatedCard className="w-full max-w-md p-8 backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
					<div className="flex flex-col items-center mb-6">
						<UserPlusIcon className="w-12 h-12 text-indigo-400 mb-2" />
						<h1 className="text-3xl font-extrabold text-indigo-900 mb-2 tracking-tight drop-shadow flex items-center gap-2">Register</h1>
					</div>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
							<input
								type="text"
								className="w-full border p-2 rounded text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200"
								placeholder="Enter your name"
								value={form.name}
								onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
								required
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
							<input
								type="email"
								className="w-full border p-2 rounded text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200"
								placeholder="Enter your email"
								value={form.email}
								onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
								required
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
							<input
								type="password"
								className="w-full border p-2 rounded text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200"
								placeholder="Create a password"
								value={form.password}
								onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
								required
								minLength={8}
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
							disabled={loading}
						>
							<ArrowRightOnRectangleIcon className="w-5 h-5" />
							{loading ? "Registering..." : "Register"}
						</button>
					</form>
					<p className="mt-4 text-sm text-gray-500 text-center">
						Already have an account?{' '}
						<a href="/auth/login" className="text-indigo-600 hover:underline transition">Login</a>
					</p>
				</AnimatedCard>
			</main>
		);
}
