import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';
import { ToastProvider } from '../components/Toast';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe('Dashboard Page', () => {
  it('renders the Dashboard heading', () => {
    render(
      <ToastProvider>
        <DashboardPage />
      </ToastProvider>
    );
    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument();
  });
});
