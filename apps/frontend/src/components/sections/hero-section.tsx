import type { Basics } from '@cv-hub/shared-types';

import { SocialLinks } from '@/components/ui/social-link';
import { cn } from '@/lib/utils';

/**
 * Hero Section Component
 *
 * Displays the main header section of the public CV page with:
 * - Name (H1 heading)
 * - Professional label/tagline
 * - Bio summary (2-3 sentences)
 * - Social media links
 *
 * Features:
 * - Responsive design (mobile: vertical stack, desktop: horizontal layout)
 * - Semantic HTML for accessibility
 * - SSR-compatible (no client-side dependencies)
 *
 * @param props - CV basics data (name, label, summary, profiles)
 * @returns Semantic header element with hero content
 */
export interface HeroSectionProps {
  basics: Basics;
  className?: string;
}

export function HeroSection({ basics, className }: HeroSectionProps) {
  return (
    <header
      className={cn(
        'flex flex-col items-center gap-6 text-center',
        'md:flex-row md:items-start md:gap-8 md:text-left',
        className,
      )}
    >
      {/* Avatar - Conditional rendering based on basics.image */}
      {basics.image ? (
        <img
          src={basics.image}
          alt={basics.name}
          className="h-24 w-24 rounded-full object-cover shadow-md md:h-32 md:w-32"
          loading="lazy"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-md md:h-32 md:w-32">
          {basics.name[0]}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Name - Required field, H1 for semantic HTML */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {basics.name}
        </h1>

        {/* Label/Tagline - Optional professional title */}
        {basics.label && (
          <p className="text-xl font-medium text-muted-foreground sm:text-2xl">{basics.label}</p>
        )}

        {/* Summary/Bio - Optional professional summary */}
        {basics.summary && (
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
            {basics.summary}
          </p>
        )}

        {/* Social Links - Optional array of social profiles */}
        {basics.profiles && basics.profiles.length > 0 && (
          <div className="mt-2">
            <SocialLinks profiles={basics.profiles} />
          </div>
        )}
      </div>
    </header>
  );
}
