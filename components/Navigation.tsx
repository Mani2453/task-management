"use client";
import React, { useEffect, useState } from 'react';

export default function Navigation() {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		setLoggedIn(!!(typeof window !== 'undefined' && localStorage.getItem('session')));
	}, []);

	function handleLogout() {
		localStorage.removeItem('session');
		setLoggedIn(false);
		window.location.href = '/';
	}

		return (
			<nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-200/80 via-white/80 to-pink-100/80 backdrop-blur-xl shadow-lg p-4 flex gap-6 justify-center border-b border-white/40">
				<NavLink href="/dashboard">Dashboard</NavLink>
				<NavLink href="/projects">Projects</NavLink>
				<NavLink href="/tasks">Tasks</NavLink>
				{!loggedIn && <NavLink href="/auth/login">Login</NavLink>}
				{!loggedIn && <NavLink href="/auth/register">Register</NavLink>}
				{loggedIn && <button onClick={handleLogout} className="font-semibold text-red-600 relative px-2 py-1 transition-colors duration-200 group">
					<span className="relative z-10">Logout</span>
					<span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300 group-hover:w-full"></span>
				</button>}
			</nav>
		);
// Animated underline NavLink
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<a
			href={href}
			className="font-semibold text-indigo-700 relative px-2 py-1 transition-colors duration-200 group"
		>
			<span className="relative z-10">{children}</span>
			<span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
		</a>
	);
}
}
