import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/hero-section';
import type { Basics } from '@cv-hub/shared-types';

// Mock data matching PublicCV['basics'] type
const mockBasics: Basics = {
  name: 'Max Mustermann',
  label: 'Senior Full-Stack Engineer',
  summary: 'Passionate developer with 10 years of experience building scalable web applications.',
  image: 'https://example.com/avatar.jpg',
  profiles: [
    { network: 'GitHub', username: 'maxmustermann', url: 'https://github.com/maxmustermann' },
    {
      network: 'LinkedIn',
      username: 'maxmustermann',
      url: 'https://linkedin.com/in/maxmustermann',
    },
  ],
};

describe('HeroSection', () => {
  describe('AC-1: basics.name as H1 element', () => {
    it('renders basics.name as H1 heading', () => {
      render(<HeroSection basics={mockBasics} />);
      const heading = screen.getByRole('heading', { level: 1, name: mockBasics.name });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });
  });

  describe('AC-2: basics.label as tagline/subtitle', () => {
    it('displays basics.label as tagline prominently', () => {
      render(<HeroSection basics={mockBasics} />);
      expect(screen.getByText(mockBasics.label!)).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      const basicsWithoutLabel = { ...mockBasics, label: undefined };
      render(<HeroSection basics={basicsWithoutLabel} />);
      expect(screen.queryByText(/Senior Full-Stack/)).not.toBeInTheDocument();
    });
  });

  describe('AC-3: basics.summary displayed', () => {
    it('displays basics.summary correctly', () => {
      render(<HeroSection basics={mockBasics} />);
      expect(screen.getByText(/Passionate developer/i)).toBeInTheDocument();
    });

    it('does not render summary when not provided', () => {
      const basicsWithoutSummary = { ...mockBasics, summary: undefined };
      render(<HeroSection basics={basicsWithoutSummary} />);
      expect(screen.queryByText(/Passionate developer/)).not.toBeInTheDocument();
    });
  });

  describe('AC-4: Social links render as icon links', () => {
    it('renders social links for all profiles', () => {
      render(<HeroSection basics={mockBasics} />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2); // GitHub + LinkedIn
    });

    it('does not render social links when profiles is empty', () => {
      const basicsWithoutProfiles = { ...mockBasics, profiles: [] };
      render(<HeroSection basics={basicsWithoutProfiles} />);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    it('does not render social links when profiles is undefined', () => {
      const basicsWithoutProfiles = { ...mockBasics, profiles: undefined };
      render(<HeroSection basics={basicsWithoutProfiles} />);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
  });

  describe('AC-5: Avatar image with fallback', () => {
    it('renders avatar image when basics.image is provided', () => {
      render(<HeroSection basics={mockBasics} />);
      const img = screen.getByRole('img', { name: mockBasics.name });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockBasics.image);
      expect(img).toHaveAttribute('alt', mockBasics.name);
      expect(img).toHaveAttribute('loading', 'lazy'); // Performance optimization
    });

    it('renders fallback with initials when basics.image is missing', () => {
      const basicsWithoutImage = { ...mockBasics, image: undefined };
      const { container } = render(<HeroSection basics={basicsWithoutImage} />);

      // Avatar image should not be present
      expect(screen.queryByRole('img')).not.toBeInTheDocument();

      // Fallback should contain first letter of name
      const fallback = container.querySelector('.bg-gradient-to-br');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('M'); // First letter of "Max Mustermann"
    });
  });

  describe('AC-6: Responsive design', () => {
    it('applies responsive layout classes (mobile: flex-col, desktop: flex-row)', () => {
      const { container } = render(<HeroSection basics={mockBasics} />);
      const header = container.querySelector('header');

      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex-col'); // Mobile default
      expect(header).toHaveClass('md:flex-row'); // Desktop breakpoint
    });

    it('applies responsive text alignment (mobile: center, desktop: left)', () => {
      const { container } = render(<HeroSection basics={mockBasics} />);
      const header = container.querySelector('header');

      expect(header).toHaveClass('text-center'); // Mobile
      expect(header).toHaveClass('md:text-left'); // Desktop
    });
  });

  describe('AC-7: Accessibility - Semantic HTML', () => {
    it('uses semantic <header> element', () => {
      const { container } = render(<HeroSection basics={mockBasics} />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('uses semantic <h1> for name', () => {
      render(<HeroSection basics={mockBasics} />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1.tagName).toBe('H1');
    });
  });

  describe('Snapshot tests', () => {
    it('matches snapshot with full data', () => {
      const { container } = render(<HeroSection basics={mockBasics} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot without optional fields', () => {
      const minimalBasics: Basics = {
        name: 'John Doe',
      };
      const { container } = render(<HeroSection basics={minimalBasics} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Edge cases', () => {
    it('handles empty profiles array', () => {
      const basicsWithEmptyProfiles = { ...mockBasics, profiles: [] };
      render(<HeroSection basics={basicsWithEmptyProfiles} />);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    it('handles very long name', () => {
      const basicsWithLongName = {
        ...mockBasics,
        name: 'Dr. Maximilian Alexander Friedrich von Mustermann-Beispielhausen III',
      };
      render(<HeroSection basics={basicsWithLongName} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/Maximilian/);
    });

    it('handles special characters in name for avatar fallback', () => {
      const basicsWithSpecialName = { ...mockBasics, name: 'Ümläut Tëst', image: undefined };
      const { container } = render(<HeroSection basics={basicsWithSpecialName} />);
      const fallback = container.querySelector('.bg-gradient-to-br');
      expect(fallback).toHaveTextContent('Ü'); // First character
    });
  });
});
