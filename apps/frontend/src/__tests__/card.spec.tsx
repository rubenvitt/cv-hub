import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card component', () => {
  it('renders card with content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default card classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('border');
  });

  it('applies custom className to card', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-card');
  });

  it('applies data-slot attribute to card', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('data-slot', 'card');
  });

  it('renders as a div element', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});

describe('CardHeader component', () => {
  it('renders card header with content', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies default card header classes', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('grid');
    expect(header).toHaveClass('px-6');
  });

  it('applies custom className to card header', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom-header');
  });

  it('applies data-slot attribute to card header', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveAttribute('data-slot', 'card-header');
  });
});

describe('CardTitle component', () => {
  it('renders card title with content', () => {
    render(<CardTitle>Title text</CardTitle>);
    expect(screen.getByText('Title text')).toBeInTheDocument();
  });

  it('applies default card title classes', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('leading-none');
  });

  it('applies custom className to card title', () => {
    const { container } = render(<CardTitle className="custom-title">Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveClass('custom-title');
  });

  it('applies data-slot attribute to card title', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild as HTMLElement;
    expect(title).toHaveAttribute('data-slot', 'card-title');
  });
});

describe('CardDescription component', () => {
  it('renders card description with content', () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('applies default card description classes', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.firstChild as HTMLElement;
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveClass('text-sm');
  });

  it('applies custom className to card description', () => {
    const { container } = render(
      <CardDescription className="custom-description">Description</CardDescription>,
    );
    const description = container.firstChild as HTMLElement;
    expect(description).toHaveClass('custom-description');
  });

  it('applies data-slot attribute to card description', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    const description = container.firstChild as HTMLElement;
    expect(description).toHaveAttribute('data-slot', 'card-description');
  });
});

describe('CardAction component', () => {
  it('renders card action with content', () => {
    render(<CardAction>Action content</CardAction>);
    expect(screen.getByText('Action content')).toBeInTheDocument();
  });

  it('applies default card action classes', () => {
    const { container } = render(<CardAction>Action</CardAction>);
    const action = container.firstChild as HTMLElement;
    expect(action).toHaveClass('col-start-2');
    expect(action).toHaveClass('row-span-2');
    expect(action).toHaveClass('justify-self-end');
  });

  it('applies custom className to card action', () => {
    const { container } = render(<CardAction className="custom-action">Action</CardAction>);
    const action = container.firstChild as HTMLElement;
    expect(action).toHaveClass('custom-action');
  });

  it('applies data-slot attribute to card action', () => {
    const { container } = render(<CardAction>Action</CardAction>);
    const action = container.firstChild as HTMLElement;
    expect(action).toHaveAttribute('data-slot', 'card-action');
  });
});

describe('CardContent component', () => {
  it('renders card content with content', () => {
    render(<CardContent>Main content</CardContent>);
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('applies default card content classes', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('px-6');
  });

  it('applies custom className to card content', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('custom-content');
  });

  it('applies data-slot attribute to card content', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveAttribute('data-slot', 'card-content');
  });
});

describe('CardFooter component', () => {
  it('renders card footer with content', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies default card footer classes', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('px-6');
  });

  it('applies custom className to card footer', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('custom-footer');
  });

  it('applies data-slot attribute to card footer', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveAttribute('data-slot', 'card-footer');
  });
});

describe('Card component composition', () => {
  it('renders full card with all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });

  it('maintains proper HTML structure', () => {
    const { container } = render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    const card = container.querySelector('[data-testid="card"]');
    const header = container.querySelector('[data-testid="header"]');
    const title = container.querySelector('[data-testid="title"]');

    expect(card).toContainElement(header);
    expect(header).toContainElement(title);
  });
});
