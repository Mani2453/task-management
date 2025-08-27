export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}
