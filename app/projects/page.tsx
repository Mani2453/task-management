"use client";
import React, { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, color }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      setTitle('');
      setDescription('');
      setColor('#3b82f6');
      // Refresh project list
      const updated = await fetch('/api/projects');
      setProjects(await updated.json());
    } catch {
      setError('Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Projects</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
          <form className="flex flex-col gap-4" onSubmit={handleCreateProject}>
            <input type="text" placeholder="Project Title" className="border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="text" placeholder="Description (optional)" className="border p-2 rounded" value={description} onChange={e => setDescription(e.target.value)} />
            <input type="color" className="w-12 h-8 p-0 border rounded" value={color} onChange={e => setColor(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</button>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </form>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
          <ul className="space-y-4">
            {projects.length === 0 ? (
              <li className="border rounded p-4 flex items-center justify-between">
                <span className="font-semibold">No projects yet.</span>
              </li>
            ) : (
              projects.map((project) => (
                <li key={project._id} className="border rounded p-4 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-2">
                    <span style={{ background: project.color, width: 16, height: 16, borderRadius: '50%' }}></span>
                    {project.title}
                  </span>
                  <span className="text-gray-500">{project.description}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
