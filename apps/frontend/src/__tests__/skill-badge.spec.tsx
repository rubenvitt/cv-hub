/**
 * SkillBadge Component Tests
 *
 * Test Coverage:
 * - Basic rendering
 * - Level-based styling
 * - Accessibility (ARIA, semantic HTML)
 * - Hover animations
 * - Memoization behavior
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillBadge } from '@/components/ui/skill-badge';

describe('SkillBadge Component', () => {
  describe('Basic Rendering', () => {
    it('should render skill name', () => {
      render(<SkillBadge name="TypeScript" />);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should render without level indicator when level is not provided', () => {
      const { container } = render(<SkillBadge name="JavaScript" />);
      // Only skill name should be present (no level badge)
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.queryByLabelText(/Level:/)).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<SkillBadge name="React" className="custom-class" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('custom-class');
    });
  });

  describe('Level-Based Styling', () => {
    it('should render Beginner level with blue styling', () => {
      const { container } = render(<SkillBadge name="Go" level="Beginner" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-blue-50');
      expect(badge.className).toContain('text-blue-700');
    });

    it('should render Intermediate level with green styling', () => {
      const { container } = render(<SkillBadge name="Python" level="Intermediate" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-green-50');
      expect(badge.className).toContain('text-green-700');
    });

    it('should render Advanced level with purple styling', () => {
      const { container } = render(<SkillBadge name="React" level="Advanced" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-purple-50');
      expect(badge.className).toContain('text-purple-700');
    });

    it('should render Expert level with orange styling', () => {
      const { container } = render(<SkillBadge name="TypeScript" level="Expert" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-orange-50');
      expect(badge.className).toContain('text-orange-700');
    });

    it('should display level indicator with first letter', () => {
      render(<SkillBadge name="Node.js" level="Expert" />);
      expect(screen.getByLabelText('Level: Expert')).toHaveTextContent('E');
    });
  });

  describe('Accessibility (AC#8)', () => {
    it('should have proper ARIA role', () => {
      const { container } = render(<SkillBadge name="Docker" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute('role', 'listitem');
    });

    it('should have aria-label with skill name only (no level)', () => {
      const { container } = render(<SkillBadge name="Kubernetes" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute('aria-label', 'Kubernetes');
    });

    it('should have aria-label with skill name and level', () => {
      const { container } = render(<SkillBadge name="PostgreSQL" level="Advanced" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute('aria-label', 'PostgreSQL - Advanced level');
    });

    it('should have minimum touch target size (44px)', () => {
      const { container } = render(<SkillBadge name="Git" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('min-h-[44px]');
    });
  });

  describe('Animations (AC#6)', () => {
    it('should have hover transition classes', () => {
      const { container } = render(<SkillBadge name="Redis" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('transition-all');
      expect(badge.className).toContain('hover:scale-105');
      expect(badge.className).toContain('hover:shadow-sm');
    });

    it('should have will-change-transform for performance', () => {
      const { container } = render(<SkillBadge name="MongoDB" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('will-change-transform');
    });
  });

  describe('Layout Shift Prevention (AC#9)', () => {
    it('should have fixed minimum height', () => {
      const { container } = render(<SkillBadge name="GraphQL" />);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('min-h-[44px]');
    });
  });

  describe('Edge Cases', () => {
    it('should handle long skill names gracefully', () => {
      const longName = 'Very Long Skill Name That Might Wrap';
      render(<SkillBadge name={longName} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle special characters in skill names', () => {
      render(<SkillBadge name="C++" level="Advanced" />);
      expect(screen.getByText('C++')).toBeInTheDocument();
    });

    it('should handle empty string name (edge case)', () => {
      const { container } = render(<SkillBadge name="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
