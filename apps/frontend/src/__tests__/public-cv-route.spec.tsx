import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Route } from '@/routes/index';
import * as api from '@/lib/api';
import type { CV } from '@cv-hub/shared-types';

// Mock the API module
vi.mock('@/lib/api', () => ({
  fetchPublicCV: vi.fn(),
}));

// Mock CV data for testing
const mockCV: CV = {
  basics: {
    name: 'John Doe',
    label: 'Senior Software Engineer',
    image: 'https://example.com/photo.jpg',
    email: 'john@example.com',
    phone: '+49 123 456789',
    url: 'https://johndoe.com',
    summary:
      'Experienced software engineer with 10+ years building scalable web applications.\nPassionate about TypeScript, React, and clean architecture.',
    location: {
      city: 'Berlin',
      countryCode: 'DE',
      region: 'Berlin',
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'johndoe',
        url: 'https://github.com/johndoe',
      },
      {
        network: 'LinkedIn',
        username: 'johndoe',
        url: 'https://linkedin.com/in/johndoe',
      },
    ],
  },
  skills: [
    {
      name: 'TypeScript',
      level: 'Expert',
      keywords: ['React', 'Node.js', 'Type Safety'],
    },
    {
      name: 'React',
      level: 'Advanced',
      keywords: ['Hooks', 'SSR', 'Performance'],
    },
  ],
  work: [
    {
      name: 'Acme Corporation',
      position: 'Senior Software Engineer',
      url: 'https://acme.com',
      startDate: '2020-01-01',
      endDate: undefined,
      summary: 'Leading frontend development team of 5 engineers.',
      highlights: [
        'Built scalable React architecture serving 1M+ users',
        'Reduced bundle size by 40% through code-splitting',
      ],
      isPrivate: false,
    },
  ],
  education: [
    {
      institution: 'Technical University of Berlin',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: '2013-09-01',
      endDate: '2017-06-30',
      score: '1.5 (German Grade)',
      courses: ['Algorithms', 'Databases'],
    },
  ],
  projects: [
    {
      name: 'Open Source UI Library',
      description: 'A popular React component library with 50k+ weekly downloads.',
      highlights: ['Used by 500+ companies worldwide'],
      keywords: ['React', 'TypeScript'],
      startDate: '2019-01-01',
      url: 'https://github.com/johndoe/ui-library',
      roles: ['Creator', 'Maintainer'],
      entity: 'Personal',
      type: 'library',
      isPrivate: false,
    },
  ],
};

describe('Public CV Route - Loader Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call fetchPublicCV and return CV data (AC #1, #2)', async () => {
    vi.mocked(api.fetchPublicCV).mockResolvedValue(mockCV);
    const result = await Route.options.loader!();
    expect(api.fetchPublicCV).toHaveBeenCalledOnce();
    expect(result).toEqual({ cv: mockCV });
  });

  it('should propagate errors from fetchPublicCV (AC #7)', async () => {
    const error = new Error('API Error: Failed to fetch CV');
    vi.mocked(api.fetchPublicCV).mockRejectedValue(error);
    await expect(Route.options.loader!()).rejects.toThrow('API Error: Failed to fetch CV');
  });
});

describe('Public CV Route - Configuration', () => {
  it('should have SSR enabled (AC #1)', () => {
    expect(Route.options.ssr).toBe(true);
  });

  it('should have loader function defined (AC #1)', () => {
    expect(Route.options.loader).toBeDefined();
    expect(typeof Route.options.loader).toBe('function');
  });

  it('should have component defined (AC #1)', () => {
    expect(Route.options.component).toBeDefined();
    expect(typeof Route.options.component).toBe('function');
  });
});
