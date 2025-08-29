import { render, screen } from '@testing-library/react';
import Home from '../app/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() })
}));

describe('Home (Landing Page)', () => {
  it('renders the app title and CTA buttons', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /Task Management App/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  });
});
