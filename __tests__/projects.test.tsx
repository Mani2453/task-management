import { render, screen } from '@testing-library/react';
import ProjectsPage from '../app/projects/page';
import { ToastProvider } from '../components/Toast';
import { ConfirmDialogProvider } from '../components/ConfirmDialog';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe('Projects Page', () => {
  it('renders the Projects heading', () => {
    render(
      <ToastProvider>
        <ConfirmDialogProvider>
          <ProjectsPage />
        </ConfirmDialogProvider>
      </ToastProvider>
    );
    expect(screen.getByRole('heading', { level: 1, name: /Projects/i })).toBeInTheDocument();
  });
});
