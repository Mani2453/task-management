"use client";



import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { useToast } from '../../components/Toast';
import AnimatedCard from '../components/AnimatedCard';
// import FloatingActionButton from '../components/FloatingActionButton';
import { PlusIcon, PencilSquareIcon, TrashIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { useConfirmDialog } from '../../components/ConfirmDialog';

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
  const { confirm } = useConfirmDialog();

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
    const confirmed = await confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 p-8 transition-colors duration-500 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-indigo-900 tracking-tight drop-shadow flex items-center gap-3">
          <FolderOpenIcon className="w-10 h-10 text-indigo-400" />
          Projects
        </h1>
        <AnimatedCard className="mb-10 backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
            <PlusIcon className="w-6 h-6 text-indigo-400" />
            Create New Project
          </h2>
          <form className="flex flex-col gap-3 w-full p-4 bg-white/60 rounded-xl" onSubmit={handleCreateProject} style={{ minWidth: 0 }}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">Title</label>
              <input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700">Description</label>
              <input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition placeholder:italic placeholder:text-indigo-200" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <div className="flex-1" />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300 focus:ring-2 focus:ring-indigo-300" disabled={createLoading}>{createLoading ? 'Creating...' : 'Create Project'}</button>
            </div>
            {error && <div className="text-red-500 text-sm text-center animate-pulse mt-2">{error}</div>}
          </form>
        </AnimatedCard>
        <AnimatedCard className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
            <FolderOpenIcon className="w-6 h-6 text-indigo-400" />
            Your Projects
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-base">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="p-2 text-left font-semibold">Title</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                  <th className="p-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-indigo-300 flex flex-col items-center gap-2">
                      <FolderOpenIcon className="w-12 h-12 mb-2 animate-bounce text-indigo-200" />
                      <span className="text-lg font-semibold">No projects yet. Start by creating one!</span>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="border-b last:border-b-0 transition-all duration-300 hover:bg-indigo-50/60">
                      {editId === project._id ? (
                        <td colSpan={4} className="p-0 !whitespace-normal !align-top" style={{ padding: 0 }}>
                          <form className="flex flex-col gap-3 w-full p-4 bg-white/80 rounded-xl" onSubmit={handleEditProject} style={{ minWidth: 0 }}>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-semibold text-gray-700">Title</label>
                              <input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-semibold text-gray-700">Description</label>
                              <input type="text" className="border p-2 rounded w-full text-base focus:ring-2 focus:ring-indigo-300 transition" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                              <div className="flex-1" />
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-300 focus:ring-2 focus:ring-green-300" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                              <button type="button" className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 active:scale-95 transition-all duration-300" onClick={() => setEditId(null)}>Cancel</button>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="p-2 font-semibold text-indigo-900">{project.title}</td>
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
                              <button className="bg-yellow-400 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-yellow-500 active:scale-95 transition-all duration-300 flex items-center gap-1" onClick={() => {
                                setEditId(project._id);
                                setEditTitle(project.title);
                                setEditDescription(project.description || '');
                              }}>
                                <PencilSquareIcon className="w-5 h-5" />
                                <span>Edit</span>
                              </button>
                              <button className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold shadow hover:bg-red-600 active:scale-95 transition-all duration-300 flex items-center gap-1" onClick={() => handleDeleteProject(project._id)} disabled={deleteLoadingId === project._id}>
                                <TrashIcon className="w-5 h-5" />
                                <span>{deleteLoadingId === project._id ? 'Deleting...' : 'Delete'}</span>
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} label="Add Project" /> */}
      </div>
    </div>
  );
}
