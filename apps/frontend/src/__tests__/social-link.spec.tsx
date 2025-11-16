import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLink, SocialLinks } from '@/components/ui/social-link';
import type { Profile } from '@cv-hub/shared-types';

const mockGitHubProfile: Profile = {
  network: 'GitHub',
  username: 'maxmustermann',
  url: 'https://github.com/maxmustermann',
};

const mockLinkedInProfile: Profile = {
  network: 'LinkedIn',
  username: 'maxmustermann',
  url: 'https://linkedin.com/in/maxmustermann',
};

const mockTwitterProfile: Profile = {
  network: 'Twitter',
  username: 'maxmustermann',
  url: 'https://twitter.com/maxmustermann',
};

const mockUnknownProfile: Profile = {
  network: 'MySpace', // Unknown network
  username: 'maxmustermann',
  url: 'https://myspace.com/maxmustermann',
};

describe('SocialLink', () => {
  describe('AC-4: Icon rendering for different networks', () => {
    it('renders with GitHub icon for GitHub network', () => {
      const { container } = render(<SocialLink {...mockGitHubProfile} />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();

      // lucide-react icons render as SVG elements
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with LinkedIn icon for LinkedIn network', () => {
      const { container } = render(<SocialLink {...mockLinkedInProfile} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with Twitter icon for Twitter network', () => {
      const { container } = render(<SocialLink {...mockTwitterProfile} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders fallback icon for unknown network', () => {
      const { container } = render(<SocialLink {...mockUnknownProfile} />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();

      // Still renders an icon (fallback Link icon)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('AC-7: ARIA labels and accessibility', () => {
    it('has correct ARIA label for GitHub', () => {
      render(<SocialLink {...mockGitHubProfile} />);
      const link = screen.getByRole('link', { name: 'Visit GitHub Profile' });
      expect(link).toBeInTheDocument();
    });

    it('has correct ARIA label for LinkedIn', () => {
      render(<SocialLink {...mockLinkedInProfile} />);
      const link = screen.getByRole('link', { name: 'Visit LinkedIn Profile' });
      expect(link).toBeInTheDocument();
    });

    it('has correct ARIA label for Twitter', () => {
      render(<SocialLink {...mockTwitterProfile} />);
      const link = screen.getByRole('link', { name: 'Visit Twitter Profile' });
      expect(link).toBeInTheDocument();
    });

    it('has correct ARIA label for unknown network', () => {
      render(<SocialLink {...mockUnknownProfile} />);
      const link = screen.getByRole('link', { name: 'Visit MySpace Profile' });
      expect(link).toBeInTheDocument();
    });

    it('includes screen reader text for username', () => {
      render(<SocialLink {...mockGitHubProfile} />);
      // Screen reader text has class "sr-only"
      const srText = screen.getByText(mockGitHubProfile.username);
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

    it('icon is hidden from screen readers', () => {
      const { container } = render(<SocialLink {...mockGitHubProfile} />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Security: External links', () => {
    it('opens in new tab with target="_blank"', () => {
      render(<SocialLink {...mockGitHubProfile} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('has security attribute rel="noopener noreferrer"', () => {
      render(<SocialLink {...mockGitHubProfile} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('links to correct URL', () => {
      render(<SocialLink {...mockGitHubProfile} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', mockGitHubProfile.url);
    });
  });

  describe('Styling and interaction states', () => {
    it('has hover and focus styles', () => {
      render(<SocialLink {...mockGitHubProfile} />);
      const link = screen.getByRole('link');

      // Check for Tailwind hover/focus classes
      expect(link).toHaveClass('hover:bg-accent');
      expect(link).toHaveClass('focus-visible:ring-2');
    });

    it('applies custom className when provided', () => {
      render(<SocialLink {...mockGitHubProfile} className="custom-class" />);
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-class');
    });
  });

  describe('Snapshot tests', () => {
    it('matches snapshot for GitHub link', () => {
      const { container } = render(<SocialLink {...mockGitHubProfile} />);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for unknown network', () => {
      const { container } = render(<SocialLink {...mockUnknownProfile} />);
      expect(container).toMatchSnapshot();
    });
  });
});

describe('SocialLinks (Container Component)', () => {
  const mockProfiles: Profile[] = [mockGitHubProfile, mockLinkedInProfile, mockTwitterProfile];

  describe('Rendering multiple links', () => {
    it('renders all social links from profiles array', () => {
      render(<SocialLinks profiles={mockProfiles} />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });

    it('renders correct ARIA labels for all links', () => {
      render(<SocialLinks profiles={mockProfiles} />);
      expect(screen.getByRole('link', { name: 'Visit GitHub Profile' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Visit LinkedIn Profile' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Visit Twitter Profile' })).toBeInTheDocument();
    });
  });

  describe('Empty states', () => {
    it('returns null when profiles is undefined', () => {
      const { container } = render(<SocialLinks profiles={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when profiles is empty array', () => {
      const { container } = render(<SocialLinks profiles={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has role="list" for semantic structure', () => {
      const { container } = render(<SocialLinks profiles={mockProfiles} />);
      const list = container.querySelector('[role="list"]');
      expect(list).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('applies flex-wrap for responsive layout', () => {
      const { container } = render(<SocialLinks profiles={mockProfiles} />);
      const wrapper = container.querySelector('[role="list"]');
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('flex-wrap');
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <SocialLinks profiles={mockProfiles} className="custom-container" />,
      );
      const wrapper = container.querySelector('[role="list"]');
      expect(wrapper).toHaveClass('custom-container');
    });
  });

  describe('Snapshot tests', () => {
    it('matches snapshot with multiple profiles', () => {
      const { container } = render(<SocialLinks profiles={mockProfiles} />);
      expect(container).toMatchSnapshot();
    });
  });
});
