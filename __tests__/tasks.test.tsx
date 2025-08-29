import { render, screen } from '@testing-library/react';
import TasksPage from '../app/tasks/page';
import { ToastProvider } from '../components/Toast';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe('Tasks Page', () => {
  it('renders the Tasks heading', () => {
    render(
      <ToastProvider>
        <ConfirmDialogProvider>
          <TasksPage />
        </ConfirmDialogProvider>
      </ToastProvider>
    );
    // Only match the main heading (h1)
    expect(screen.getByRole('heading', { level: 1, name: /Tasks/i })).toBeInTheDocument();
  });
});
