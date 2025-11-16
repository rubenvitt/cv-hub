import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge component', () => {
  it('renders badge with text', () => {
    render(<Badge>Badge text</Badge>);
    expect(screen.getByText('Badge text')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-primary');
    expect(badge).toHaveClass('text-primary-foreground');
    expect(badge).toHaveClass('border-transparent');
  });

  it('applies secondary variant classes', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-secondary');
    expect(badge).toHaveClass('text-secondary-foreground');
    expect(badge).toHaveClass('border-transparent');
  });

  it('applies destructive variant classes', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-destructive');
    expect(badge).toHaveClass('text-white');
    expect(badge).toHaveClass('border-transparent');
  });

  it('applies outline variant classes', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('text-foreground');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-badge');
  });

  it('applies base badge classes for all variants', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('justify-center');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-medium');
  });

  it('applies data-slot attribute', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveAttribute('data-slot', 'badge');
  });

  it('renders as span element by default', () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('renders with asChild prop', () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>,
    );
    const link = screen.getByText('Link Badge');
    expect(link.nodeName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('maintains badge classes with asChild prop', () => {
    render(
      <Badge asChild variant="secondary">
        <a href="/test">Link Badge</a>
      </Badge>,
    );
    const link = screen.getByText('Link Badge');
    expect(link).toHaveClass('bg-secondary');
    expect(link).toHaveClass('text-secondary-foreground');
    expect(link).toHaveClass('inline-flex');
  });

  it('merges custom className with variant classes', () => {
    const { container } = render(
      <Badge variant="outline" className="custom-class">
        Merged
      </Badge>,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('text-foreground'); // outline variant
    expect(badge).toHaveClass('custom-class'); // custom class
  });

  it('applies focus-visible classes for accessibility', () => {
    const { container } = render(<Badge>Accessible</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('focus-visible:border-ring');
    expect(badge).toHaveClass('focus-visible:ring-ring/50');
  });

  it('applies aria-invalid styles', () => {
    const { container } = render(<Badge aria-invalid="true">Invalid</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('aria-invalid:ring-destructive/20');
    expect(badge).toHaveClass('aria-invalid:border-destructive');
  });

  it('passes through additional HTML attributes', () => {
    const { container } = render(
      <Badge id="test-badge" data-custom="value">
        Badge
      </Badge>,
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveAttribute('id', 'test-badge');
    expect(badge).toHaveAttribute('data-custom', 'value');
  });
});

describe('Badge variants comparison', () => {
  it('applies different background colors for each variant', () => {
    const { rerender, container } = render(<Badge>Test</Badge>);
    let badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-primary');

    rerender(<Badge variant="secondary">Test</Badge>);
    badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-secondary');

    rerender(<Badge variant="destructive">Test</Badge>);
    badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('bg-destructive');

    rerender(<Badge variant="outline">Test</Badge>);
    badge = container.firstChild as HTMLElement;
    expect(badge).not.toHaveClass('bg-primary');
    expect(badge).not.toHaveClass('bg-secondary');
    expect(badge).not.toHaveClass('bg-destructive');
  });

  it('maintains consistent structure across all variants', () => {
    const variants: Array<'default' | 'secondary' | 'destructive' | 'outline'> = [
      'default',
      'secondary',
      'destructive',
      'outline',
    ];

    variants.forEach((variant) => {
      const { container } = render(<Badge variant={variant}>Test</Badge>);
      const badge = container.firstChild as HTMLElement;

      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveAttribute('data-slot', 'badge');
    });
  });
});
