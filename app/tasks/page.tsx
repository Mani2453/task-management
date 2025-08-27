import React, { useEffect, useState } from 'react';
import type { Task } from '../../types/task';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');
  const [priority, setPriority] = useState<Task['priority']>('LOW');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
      } catch {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status, priority, dueDate }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('LOW');
      setDueDate('');
      // Refresh task list
      const updated = await fetch('/api/tasks');
      setTasks(await updated.json());
    } catch {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tasks</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Create New Task</h2>
          <form className="flex flex-col gap-4" onSubmit={handleCreateTask}>
            <input type="text" placeholder="Task Title" className="border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="text" placeholder="Description (optional)" className="border p-2 rounded" value={description} onChange={e => setDescription(e.target.value)} />
            <select className="border p-2 rounded" value={status} onChange={e => setStatus(e.target.value as Task['status'])} required>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <select className="border p-2 rounded" value={priority} onChange={e => setPriority(e.target.value as Task['priority'])} required>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
            <input type="date" className="border p-2 rounded" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</button>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </form>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
          <ul className="space-y-4">
            {tasks.length === 0 ? (
              <li className="border rounded p-4 flex items-center justify-between">
                <span className="font-semibold">No tasks yet.</span>
              </li>
            ) : (
              tasks.map((task) => (
                <li key={task._id} className="border rounded p-4 flex items-center justify-between">
                  <span className="font-semibold">{task.title}</span>
                  <span className="text-gray-500">{task.description}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${task.priority === 'URGENT' ? 'bg-red-100 text-red-700' : task.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span>
                  <span className="text-gray-400 text-xs">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
