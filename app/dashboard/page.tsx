"use client";

import React, { useEffect, useState } from 'react';
import type { Task } from '../../types/task';
import type { Project } from '../../types/project';
import axios from '../../lib/axios';

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
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
				{loading ? (
					<div className="text-center text-gray-500">Loading...</div>
				) : error ? (
					<div className="text-center text-red-500">{error}</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<div className="bg-white rounded shadow p-6">
								<h2 className="text-lg font-semibold mb-2">Total Tasks</h2>
								<div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
							</div>
							<div className="bg-white rounded shadow p-6">
								<h2 className="text-lg font-semibold mb-2">Completed Tasks</h2>
								<div className="text-2xl font-bold text-green-600">{completedTasks}</div>
							</div>
							<div className="bg-white rounded shadow p-6">
								<h2 className="text-lg font-semibold mb-2">Overdue Tasks</h2>
								<div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
							</div>
						</div>
						<div className="bg-white rounded shadow p-6 mb-8">
							<h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
							<ul className="space-y-2">
								{recentTasks.length === 0 ? (
									<li className="text-gray-500">No recent tasks.</li>
								) : (
									recentTasks.map(task => (
										<li key={task._id} className="flex justify-between items-center">
											<span className="font-medium">{task.title}</span>
											<span className="text-xs text-gray-400">{task.status}</span>
										</li>
									))
								)}
							</ul>
						</div>
						<div className="bg-white rounded shadow p-6">
							<h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
							<ul className="space-y-2">
								{recentProjects.length === 0 ? (
									<li className="text-gray-500">No recent projects.</li>
								) : (
									recentProjects.map(project => (
										<li key={project._id} className="flex justify-between items-center">
											<span className="font-medium">{project.title}</span>
											<span className="text-xs text-gray-400">{project.color}</span>
										</li>
									))
								)}
							</ul>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
