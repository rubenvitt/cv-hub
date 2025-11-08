import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Route } from '@/routes/index';

describe('HomePage', () => {
  it('renders cv-hub heading', () => {
    const HomePage = Route.options.component as React.ComponentType;
    render(<HomePage />);

    expect(screen.getByText('cv-hub')).toBeInTheDocument();
  });

  it('renders Coming Soon subheading', () => {
    const HomePage = Route.options.component as React.ComponentType;
    render(<HomePage />);

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('renders description text', () => {
    const HomePage = Route.options.component as React.ComponentType;
    render(<HomePage />);

    expect(
      screen.getByText(/A modern, professional CV platform/)
    ).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    const HomePage = Route.options.component as React.ComponentType;
    render(<HomePage />);

    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('renders Learn More button', () => {
    const HomePage = Route.options.component as React.ComponentType;
    render(<HomePage />);

    expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
  });
});
