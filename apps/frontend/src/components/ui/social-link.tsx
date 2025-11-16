import * as React from 'react';
import { Github, Linkedin, Twitter, Link as LinkIcon, type LucideIcon } from 'lucide-react';
import type { Profile } from '@cv-hub/shared-types';

import { cn } from '@/lib/utils';

/**
 * Icon mapping for social network profiles
 * Maps network names (case-insensitive) to corresponding Lucide icons
 */
const ICON_MAP: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

/**
 * Social Link Component
 *
 * Renders a single social media profile link with appropriate icon.
 * Follows accessibility best practices with ARIA labels and external link security.
 *
 * @param props - Social profile data (network, username, url)
 * @returns Icon link element with hover/focus states
 */
export interface SocialLinkProps extends Profile {
  className?: string;
}

export const SocialLink = React.forwardRef<HTMLAnchorElement, SocialLinkProps>(
  ({ network, username, url, className }, ref) => {
    const IconComponent = ICON_MAP[network.toLowerCase()] || LinkIcon;
    const ariaLabel = `Visit ${network} Profile`;

    return (
      <a
        ref={ref}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2 transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        <IconComponent className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">{username}</span>
      </a>
    );
  },
);

SocialLink.displayName = 'SocialLink';

/**
 * Social Links Container Component
 *
 * Renders a list of social media profile links.
 * Returns null if no profiles are provided.
 *
 * @param props - Object containing array of social profiles
 * @returns Container div with social link buttons or null
 */
export interface SocialLinksProps {
  profiles?: Profile[];
  className?: string;
}

export function SocialLinks({ profiles, className }: SocialLinksProps) {
  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="list">
      {profiles.map((profile) => (
        <SocialLink key={profile.url} {...profile} />
      ))}
    </div>
  );
}
