import { render, screen } from '@testing-library/react';
import LoginPage from '../app/auth/login/page';
import RegisterPage from '../app/auth/register/page';
import { ToastProvider } from '../components/Toast';

// Mock next/navigation useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

describe('Auth Pages', () => {
  it('renders the Login heading', () => {
    render(
      <ToastProvider>
        <LoginPage />
      </ToastProvider>
    );
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });
  it('renders the Register heading', () => {
    render(
      <ToastProvider>
        <RegisterPage />
      </ToastProvider>
    );
    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
  });
});
