/**
 * SkillBadge Component
 *
 * Displays individual skill with optional level indicator.
 * Optimized with React.memo for performance in large skill lists.
 *
 * AC#1: Renders skills as Tailwind-styled badges with level-based coloring
 * AC#6: Hover animations with scale transition
 * AC#8: ARIA-compliant with semantic HTML
 * AC#9: Fixed dimensions to prevent layout shifts
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkillBadgeProps {
  /** Skill name (required) */
  name: string;
  /** Proficiency level (optional) */
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Returns level-specific color classes for badge styling
 * Color mapping based on expertise progression:
 * - Beginner: Blue (learning)
 * - Intermediate: Green (proficient)
 * - Advanced: Purple (skilled)
 * - Expert: Orange (mastery)
 */
function getLevelStyles(level?: SkillBadgeProps['level']): string {
  if (!level) {
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }

  const levelStyles: Record<NonNullable<SkillBadgeProps['level']>, string> = {
    Beginner:
      'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    Intermediate:
      'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900',
    Advanced:
      'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
    Expert:
      'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900',
  };

  return levelStyles[level];
}

/**
 * SkillBadge Component (Memoized)
 *
 * Performance optimization: React.memo prevents re-renders when parent updates
 * but props remain unchanged. Critical for filtering operations with large skill lists.
 */
export const SkillBadge = React.memo(function SkillBadge({
  name,
  level,
  className,
}: SkillBadgeProps) {
  const levelStyles = getLevelStyles(level);

  return (
    <div
      className={cn(
        // Base styles
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg border',
        // Animation styles (AC#6: Hover transitions)
        'transition-all duration-200 ease-in-out',
        'hover:scale-105 hover:shadow-sm',
        // Accessibility (AC#8: Touch targets ≥44x44px)
        'min-h-[44px]',
        // Layout shift prevention (AC#9)
        'will-change-transform',
        // Level-based colors
        levelStyles,
        className,
      )}
      // Accessibility (AC#8)
      role="listitem"
      aria-label={level ? `${name} - ${level} level` : name}
    >
      {/* Skill Name */}
      <span className="font-medium text-sm leading-tight">{name}</span>

      {/* Level Indicator (Optional) */}
      {level && (
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full font-semibold',
            'bg-white/60 dark:bg-black/20',
            'border border-current/20',
          )}
          aria-label={`Level: ${level}`}
        >
          {level.charAt(0)}
        </span>
      )}
    </div>
  );
});

SkillBadge.displayName = 'SkillBadge';
