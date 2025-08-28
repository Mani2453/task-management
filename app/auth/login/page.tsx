"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const { showToast } = useToast();
	const router = useRouter();

	// Redirect if already authenticated
	useEffect(() => {
		if (typeof window !== 'undefined' && localStorage.getItem('session')) {
			router.replace('/dashboard');
		}
	}, [router]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post("/api/auth/login", form);
			window.localStorage.setItem("session", res.data.token);
			showToast("Login successful!", "success");
			router.push("/dashboard");
			} catch (err: unknown) {
				const errorMsg = (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) ? (err.response.data.error as string) : 'Login failed';
				showToast(errorMsg, "error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
				<h1 className="text-2xl font-bold mb-4">Login</h1>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm font-medium mb-1">Email</label>
						<input
							type="email"
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
							value={form.email}
							onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Password</label>
						<input
							type="password"
							className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
							value={form.password}
							onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
							required
							minLength={8}
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
						<p className="mt-4 text-sm text-gray-500">
							Don&apos;t have an account? <a href="/auth/register" className="text-blue-600 hover:underline">Register</a>
						</p>
			</div>
		</main>
	);
}
