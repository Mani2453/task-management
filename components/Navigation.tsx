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
		<nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md p-4 flex gap-6 justify-center border-b border-gray-200">
			<a href="/dashboard" className="font-semibold text-blue-600 hover:underline">Dashboard</a>
			<a href="/projects" className="font-semibold text-blue-600 hover:underline">Projects</a>
			<a href="/tasks" className="font-semibold text-blue-600 hover:underline">Tasks</a>
			{!loggedIn && <a href="/auth/login" className="font-semibold text-blue-600 hover:underline">Login</a>}
			{!loggedIn && <a href="/auth/register" className="font-semibold text-blue-600 hover:underline">Register</a>}
			{loggedIn && <button onClick={handleLogout} className="font-semibold text-red-600 hover:underline">Logout</button>}
		</nav>
	);
}
