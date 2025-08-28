"use client";


import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { useToast } from '../../components/Toast';

export type Project = {
  _id: string;
  title: string;
  description?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProjectsPage() {
  const { showToast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Removed color state

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  // Removed editColor state

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get('/api/projects');
        setProjects(res.data);
      } catch {
        setError('Failed to load projects');
        showToast('Failed to load projects', 'error');
      }
    }
    fetchProjects();
  }, [showToast]);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setError('');
    try {
  const res = await axios.post('/api/projects', { title, description });
  if (res.status !== 201) throw new Error('Failed to create project');
  setTitle('');
  setDescription('');
      // Refresh project list
      const updated = await axios.get('/api/projects');
      setProjects(updated.data);
      showToast('Project created successfully', 'success');
    } catch {
      setError('Failed to create project');
      showToast('Failed to create project', 'error');
    } finally {
      setCreateLoading(false);
    }
  }

  // ...existing code...
  async function handleDeleteProject(id: string) {
  if (!window.confirm('Are you sure you want to delete this project?')) return;
    setDeleteLoadingId(id);
    setError('');
    try {
      const res = await axios.delete(`/api/projects/${id}`);
      if (res.status !== 200) throw new Error('Failed to delete project');
      setProjects(projects.filter(p => p._id !== id));
      showToast('Project deleted', 'success');
    } catch {
      setError('Failed to delete project');
      showToast('Failed to delete project', 'error');
    } finally {
      setDeleteLoadingId(null);
    }
  }

  async function handleEditProject(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setEditLoading(true);
    setError('');
    try {
  const res = await axios.put(`/api/projects/${editId}`, { title: editTitle, description: editDescription });
      if (res.status !== 200) throw new Error('Failed to update project');
      // Refresh project list
      const updated = await axios.get('/api/projects');
      setProjects(updated.data);
      setEditId(null);
      showToast('Project updated', 'success');
    } catch {
      setError('Failed to update project');
      showToast('Failed to update project', 'error');
    } finally {
      setEditLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Projects</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
          <form className="flex flex-col gap-3 w-full p-4 bg-gray-50" onSubmit={handleCreateProject} style={{ minWidth: 0 }}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">Title</label>
              <input type="text" className="border p-2 rounded w-full text-base" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">Description</label>
              <input type="text" className="border p-2 rounded w-full text-base" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <div className="flex-1">
                {/* Color field removed */}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={createLoading}>{createLoading ? 'Creating...' : 'Create Project'}</button>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </form>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left font-semibold">Title</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                  <th className="p-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No projects yet.</td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="border-b last:border-b-0">
                      {editId === project._id ? (
                        <td colSpan={4} className="p-0 !whitespace-normal !align-top" style={{ padding: 0 }}>
                          <form className="flex flex-col gap-3 w-full p-4 bg-gray-50" onSubmit={handleEditProject} style={{ minWidth: 0 }}>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-semibold text-gray-700">Title</label>
                              <input type="text" className="border p-2 rounded w-full text-base" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-semibold text-gray-700">Description</label>
                              <input type="text" className="border p-2 rounded w-full text-base" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                              <div className="flex-1">
                                {/* Color cell removed */}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                              <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition" onClick={() => setEditId(null)}>Cancel</button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="p-2 font-semibold">{project.title}</td>
                          <td className="p-2">
                            <span
                              className="text-gray-500 max-w-xs truncate cursor-pointer"
                              title={project.description || ''}
                            >
                              {project.description && project.description.length > 30
                                ? project.description.slice(0, 30) + '...'
                                : project.description}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button className="bg-yellow-500 text-white px-3 py-1 rounded font-semibold hover:bg-yellow-600 transition" onClick={() => {
                                setEditId(project._id);
                                setEditTitle(project.title);
                                setEditDescription(project.description || '');
                              }}>Edit</button>
                              <button className="bg-red-600 text-white px-3 py-1 rounded font-semibold hover:bg-red-700 transition" onClick={() => handleDeleteProject(project._id)} disabled={deleteLoadingId === project._id}>{deleteLoadingId === project._id ? 'Deleting...' : 'Delete'}</button>
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
        </div>
      </div>
    </div>
  );
}
