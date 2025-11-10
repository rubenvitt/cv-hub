import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Route } from '@/routes/index';

describe('HomePage', () => {
  const HomePage = Route.options.component as React.ComponentType;

  beforeEach(() => {
    render(<HomePage />);
  });

  it('renders cv-hub heading', () => {
    expect(screen.getByText('cv-hub')).toBeInTheDocument();
  });

  it('renders Coming Soon subheading', () => {
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('renders description text', () => {
    expect(screen.getByText(/A modern, professional CV platform/)).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('renders Learn More button', () => {
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
  });
});
