// Zod validation schemas for user, project, task
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/),
});

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
});
