"use client";



import React, { useEffect, useState } from 'react';
import type { Task } from '../../types/task';
import type { Project } from '../../types/project';
import axios from '../../lib/axios';
import { useToast } from '../../components/Toast';
import { useConfirmDialog } from '../../components/ConfirmDialog';
import AnimatedCard from '../components/AnimatedCard';
// import FloatingActionButton from '../components/FloatingActionButton';
import { PlusIcon, PencilSquareIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function TasksPage() {
	const { showToast } = useToast();
	const { confirm } = useConfirmDialog();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [editId, setEditId] = useState<string | null>(null);
	const [editTitle, setEditTitle] = useState('');
	const [editDescription, setEditDescription] = useState('');
	const [editStatus, setEditStatus] = useState<Task['status']>('TODO');
	const [editPriority, setEditPriority] = useState<Task['priority']>('LOW');
	const [editDueDate, setEditDueDate] = useState('');
	const [editProjectId, setEditProjectId] = useState('');
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);
	const [createLoading, setCreateLoading] = useState(false);
	const [error, setError] = useState('');

	// Form state
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState<Task['status']>('TODO');
	const [priority, setPriority] = useState<Task['priority']>('LOW');
	const [dueDate, setDueDate] = useState('');
	const [projectId, setProjectId] = useState('');

	useEffect(() => {
		async function fetchTasksAndProjects() {
			try {
				const [tasksRes, projectsRes] = await Promise.all([
					axios.get('/api/tasks'),
					axios.get('/api/projects'),
				]);
				setTasks(tasksRes.data);
				setProjects(projectsRes.data);
			} catch {
				setError('Failed to load tasks or projects');
				showToast('Failed to load tasks or projects', 'error');
			}
		}
		fetchTasksAndProjects();
	}, [showToast]);

	async function handleCreateTask(e: React.FormEvent) {
		e.preventDefault();
		setCreateLoading(true);
		setError('');
		try {
			if (!projectId) {
				setError('Please select a project.');
				setCreateLoading(false);
				showToast('Please select a project.', 'error');
				return;
			}
			const res = await axios.post('/api/tasks', { title, description, status, priority, dueDate, projectId });
			if (res.status !== 201) throw new Error('Failed to create task');
			setTitle('');
			setDescription('');
			setStatus('TODO');
			setPriority('LOW');
			setDueDate('');
			setProjectId('');
			// Refresh task list
			const updated = await axios.get('/api/tasks');
			setTasks(updated.data);
			showToast('Task created successfully', 'success');
		} catch {
			setError('Failed to create task');
			showToast('Failed to create task', 'error');
		} finally {
			setCreateLoading(false);
		}
	}


					function startEditTask(task: Task) {
						setEditId(task._id);
						setEditTitle(task.title);
						setEditDescription(task.description || '');
						setEditStatus(task.status);
						setEditPriority(task.priority);
						setEditDueDate(task.dueDate || '');
						setEditProjectId(task.projectId);
					}

					async function handleEditTask(e: React.FormEvent) {
						e.preventDefault();
						if (!editId) return;
						setEditLoading(true);
						try {
							const res = await axios.put(`/api/tasks/${editId}`, {
								title: editTitle,
								description: editDescription,
								status: editStatus,
								priority: editPriority,
								dueDate: editDueDate,
								projectId: editProjectId,
							});
							if (res.status !== 200) throw new Error('Failed to update task');
							// Refresh task list
							const updated = await axios.get('/api/tasks');
							setTasks(updated.data);
							setEditId(null);
							showToast('Task updated', 'success');
						} catch {
							showToast('Failed to update task', 'error');
						} finally {
							setEditLoading(false);
						}
					}

					function cancelEdit() {
						setEditId(null);
					}

					async function handleDeleteTask(id: string) {
						const ok = await confirm('Are you sure you want to delete this task?');
						if (!ok) return;
						setDeleteLoadingId(id);
						try {
							const res = await axios.delete(`/api/tasks/${id}`);
							if (res.status !== 200) throw new Error('Failed to delete task');
							setTasks(tasks.filter(t => t._id !== id));
							showToast('Task deleted', 'success');
						} catch {
							showToast('Failed to delete task', 'error');
						} finally {
							setDeleteLoadingId(null);
						}
					}

							return (
								<div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 p-8 transition-colors duration-500 font-sans">
									<div className="max-w-3xl mx-auto">
										<h1 className="text-4xl font-extrabold mb-10 text-indigo-900 tracking-tight drop-shadow flex items-center gap-3">
											<ClipboardDocumentListIcon className="w-10 h-10 text-indigo-400" />
											Tasks
										</h1>
										<AnimatedCard className="mb-10 backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
											<h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
												<PlusIcon className="w-6 h-6 text-indigo-400" />
												Create New Task
											</h2>
											<form className="flex flex-col gap-3 w-full p-4 bg-white/60 rounded-xl" onSubmit={handleCreateTask} style={{ minWidth: 0 }}>
												<div className="flex flex-col gap-2">
													<label className="text-xs font-semibold text-gray-700">Title</label>
													<input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
												</div>
												<div className="flex flex-col gap-2">
													<label className="text-xs font-semibold text-gray-700">Description</label>
													<input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
												</div>
												<div className="flex flex-col gap-2 md:flex-row md:gap-4">
													<div className="flex-1">
														<label className="text-xs font-semibold text-gray-700">Status</label>
														<select className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={status} onChange={e => setStatus(e.target.value as Task['status'])} required>
															<option value="TODO">TODO</option>
															<option value="IN_PROGRESS">IN PROGRESS</option>
															<option value="COMPLETED">COMPLETED</option>
														</select>
													</div>
													<div className="flex-1">
														<label className="text-xs font-semibold text-gray-700">Priority</label>
														<select className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={priority} onChange={e => setPriority(e.target.value as Task['priority'])} required>
															<option value="LOW">LOW</option>
															<option value="MEDIUM">MEDIUM</option>
															<option value="HIGH">HIGH</option>
															<option value="URGENT">URGENT</option>
														</select>
													</div>
												</div>
												<div className="flex flex-col gap-2 md:flex-row md:gap-4">
													<div className="flex-1">
														<label className="text-xs font-semibold text-gray-700">Due Date</label>
														<input type="date" className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={dueDate} onChange={e => setDueDate(e.target.value)} />
													</div>
													<div className="flex-1">
														<label className="text-xs font-semibold text-gray-700">Project</label>
														<select className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={projectId} onChange={e => setProjectId(e.target.value)} required>
															<option value="">Select Project</option>
															{projects.map((project) => (
																<option key={project._id} value={project._id}>{project.title}</option>
															))}
														</select>
													</div>
												</div>
												<div className="flex gap-2 mt-2">
													<button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300 focus:ring-2 focus:ring-indigo-300" disabled={createLoading}>{createLoading ? 'Creating...' : 'Create Task'}</button>
												</div>
												{error && <div className="text-red-500 text-sm text-center animate-pulse mt-2">{error}</div>}
											</form>
										</AnimatedCard>
										<AnimatedCard className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
											<h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
												<ClipboardDocumentListIcon className="w-6 h-6 text-indigo-400" />
												Your Tasks
											</h2>
											<div className="overflow-x-auto">
												<table className="min-w-full text-base">
													<thead>
														<tr className="bg-indigo-50">
															<th className="p-2 text-left font-semibold">Title</th>
															<th className="p-2 text-left font-semibold">Description</th>
															<th className="p-2 text-left font-semibold">Status</th>
															<th className="p-2 text-left font-semibold">Priority</th>
															<th className="p-2 text-left font-semibold">Due Date</th>
															<th className="p-2 text-left font-semibold">Actions</th>
														</tr>
													</thead>
													<tbody>
														{tasks.length === 0 ? (
															<tr>
																<td colSpan={6} className="p-8 text-center text-indigo-300 flex flex-col items-center gap-2">
																	<ClipboardDocumentListIcon className="w-12 h-12 mb-2 animate-bounce text-indigo-200" />
																	<span className="text-lg font-semibold">No tasks yet. Start by creating one!</span>
																</td>
															</tr>
														) : (
															tasks.map((task) => (
																<tr key={task._id} className="border-b last:border-b-0 transition-all duration-300 hover:bg-indigo-50/60">
																	{editId === task._id ? (
																		<td colSpan={6} className="p-0 !whitespace-normal !align-top" style={{ padding: 0 }}>
																			<form className="flex flex-col gap-3 w-full p-4 bg-white/80 rounded-xl" onSubmit={handleEditTask} style={{ minWidth: 0 }}>
																				<div className="flex flex-col gap-2">
																					<label className="text-xs font-semibold text-gray-700">Title</label>
																					<input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
																				</div>
																				<div className="flex flex-col gap-2">
																					<label className="text-xs font-semibold text-gray-700">Description</label>
																					<input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
																				</div>
																				<div className="flex flex-col gap-2 md:flex-row md:gap-4">
																					<div className="flex-1">
																						<label className="text-xs font-semibold text-gray-700">Status</label>
																						<select className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={editStatus} onChange={e => setEditStatus(e.target.value as Task['status'])} required>
																							<option value="TODO">TODO</option>
																							<option value="IN_PROGRESS">IN PROGRESS</option>
																							<option value="COMPLETED">COMPLETED</option>
																						</select>
																					</div>
																					<div className="flex-1">
																						<label className="text-xs font-semibold text-gray-700">Priority</label>
																						<select className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={editPriority} onChange={e => setEditPriority(e.target.value as Task['priority'])} required>
																							<option value="LOW">LOW</option>
																							<option value="MEDIUM">MEDIUM</option>
																							<option value="HIGH">HIGH</option>
																							<option value="URGENT">URGENT</option>
																						</select>
																					</div>
																				</div>
																				<div className="flex flex-col gap-2 md:flex-row md:gap-4">
																					<div className="flex-1">
																						<label className="text-xs font-semibold text-gray-700">Due Date</label>
																						<input type="date" className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
																					</div>
																					<div className="flex-1">
																						<label className="text-xs font-semibold text-gray-700">Project</label>
																						<select className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 transition" value={editProjectId} onChange={e => setEditProjectId(e.target.value)} required>
																							<option value="">Select Project</option>
																							{projects.map((project) => (
																								<option key={project._id} value={project._id}>{project.title}</option>
																							))}
																						</select>
																					</div>
																				</div>
																				<div className="flex gap-2 mt-2">
																					<button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-300 focus:ring-2 focus:ring-green-300" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
																					<button type="button" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 active:scale-95 transition-all duration-300" onClick={cancelEdit}>Cancel</button>
																				</div>
																			</form>
																		</td>
																	) : (
																		<>
																			<td className="p-2 font-semibold text-indigo-900">{task.title}</td>
																			<td className="p-2">
																				<span
																					className="text-gray-500 max-w-xs truncate cursor-pointer"
																					title={task.description || ''}
																				>
																					{task.description && task.description.length > 30
																						? task.description.slice(0, 30) + '...'
																						: task.description}
																				</span>
																			</td>
																			<td className="p-2">
																				<span className={`px-2 py-1 rounded text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
																			</td>
																			<td className="p-2">
																				<span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'URGENT' ? 'bg-red-100 text-red-700' : task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span>
																			</td>
																			<td className="p-2 text-xs text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
																			<td className="p-2">
																				<div className="flex gap-2">
																					<button className="bg-yellow-400 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-yellow-500 active:scale-95 transition-all duration-300 flex items-center gap-1" onClick={() => startEditTask(task)}>
																						<PencilSquareIcon className="w-5 h-5" />
																						<span>Edit</span>
																					</button>
																					<button className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-red-600 active:scale-95 transition-all duration-300 flex items-center gap-1" onClick={() => handleDeleteTask(task._id)} disabled={deleteLoadingId === task._id}>
																						<TrashIcon className="w-5 h-5" />
																						<span>{deleteLoadingId === task._id ? 'Deleting...' : 'Delete'}</span>
																					</button>
																				</div>
																			</td>
																		</>
																	)}
																</tr>
															))
														)}
													</tbody>
												</table>
											</div>
										</AnimatedCard>
												{/* <FloatingActionButton onClick={() => {
													setEditId(null);
													setTitle('');
													setDescription('');
													setStatus('TODO');
													setPriority('LOW');
													setDueDate('');
													setProjectId('');
													window.scrollTo({ top: 0, behavior: 'smooth' });
												}} label="Add Task" /> */}
									</div>
								</div>
				);
			}

