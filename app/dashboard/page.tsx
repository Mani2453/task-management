"use client";


import React, { useEffect, useState } from 'react';
import type { Task } from '../../types/task';
import type { Project } from '../../types/project';
import axios from '../../lib/axios';
import AnimatedCard from '../components/AnimatedCard';
import { ClipboardDocumentListIcon, CheckCircleIcon, ExclamationTriangleIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

		useEffect(() => {
			async function fetchData() {
				try {
					const [tasksRes, projectsRes] = await Promise.all([
						axios.get('/api/tasks'),
						axios.get('/api/projects'),
					]);
					setTasks(tasksRes.data);
					setProjects(projectsRes.data);
				} catch {
					setError('Failed to load dashboard data');
				} finally {
					setLoading(false);
				}
			}
			fetchData();
		}, []);

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
	const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length;

	// Recent activity: last 5 tasks and last 3 projects
	const recentTasks = [...tasks]
		.sort((a, b) => (b.updatedAt && a.updatedAt ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() : 0))
		.slice(0, 5);
	const recentProjects = [...projects]
		.sort((a, b) => (b.updatedAt && a.updatedAt ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() : 0))
		.slice(0, 3);

		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 p-8 transition-colors duration-500 font-sans">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-extrabold mb-10 text-indigo-900 tracking-tight drop-shadow flex items-center gap-3">
						<ClipboardDocumentListIcon className="w-10 h-10 text-indigo-400" />
						Dashboard
					</h1>
					{loading ? (
						<div className="text-center text-indigo-400 animate-pulse">Loading...</div>
					) : error ? (
						<div className="text-center text-red-500 animate-pulse">{error}</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
								<AnimatedCard className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl flex flex-col items-center">
									<span className="mb-2"><ClipboardDocumentListIcon className="w-8 h-8 text-indigo-400" /></span>
									<h2 className="text-lg font-semibold mb-1 text-indigo-700">Total Tasks</h2>
									<div className="text-3xl font-extrabold text-blue-600 drop-shadow">{totalTasks}</div>
								</AnimatedCard>
								<AnimatedCard className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl flex flex-col items-center">
									<span className="mb-2"><CheckCircleIcon className="w-8 h-8 text-green-400" /></span>
									<h2 className="text-lg font-semibold mb-1 text-green-700">Completed</h2>
									<div className="text-3xl font-extrabold text-green-600 drop-shadow">{completedTasks}</div>
								</AnimatedCard>
								<AnimatedCard className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl flex flex-col items-center">
									<span className="mb-2"><ExclamationTriangleIcon className="w-8 h-8 text-red-400" /></span>
									<h2 className="text-lg font-semibold mb-1 text-red-700">Overdue</h2>
									<div className="text-3xl font-extrabold text-red-600 drop-shadow">{overdueTasks}</div>
								</AnimatedCard>
							</div>
							<AnimatedCard className="mb-10 backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
								<h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
									<ClipboardDocumentListIcon className="w-6 h-6 text-indigo-400" />
									Recent Tasks
								</h2>
								<ul className="space-y-2">
									{recentTasks.length === 0 ? (
										<li className="text-indigo-300 flex flex-col items-center gap-2">
											<ClipboardDocumentListIcon className="w-10 h-10 mb-2 animate-bounce text-indigo-200" />
											<span className="text-lg font-semibold">No recent tasks.</span>
										</li>
									) : (
										recentTasks.map(task => (
											<li key={task._id} className="flex justify-between items-center border-b last:border-b-0 py-2">
												<span className="font-medium text-indigo-900">{task.title}</span>
												<span className={`text-xs font-bold px-2 py-1 rounded ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
											</li>
										))
									)}
								</ul>
							</AnimatedCard>
							<AnimatedCard className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
								<h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
									<FolderOpenIcon className="w-6 h-6 text-indigo-400" />
									Recent Projects
								</h2>
								<ul className="space-y-2">
									{recentProjects.length === 0 ? (
										<li className="text-indigo-300 flex flex-col items-center gap-2">
											<FolderOpenIcon className="w-10 h-10 mb-2 animate-bounce text-indigo-200" />
											<span className="text-lg font-semibold">No recent projects.</span>
										</li>
									) : (
										recentProjects.map(project => (
											<li key={project._id} className="flex justify-between items-center border-b last:border-b-0 py-2">
												<span className="font-medium text-indigo-900">{project.title}</span>
											</li>
										))
									)}
								</ul>
							</AnimatedCard>
						</>
					)}
				</div>
			</div>
	);
}
