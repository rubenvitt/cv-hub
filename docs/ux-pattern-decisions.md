# cv-hub UX Pattern Decisions

**Project:** cv-hub - Privacy-focused CV management system
**Purpose:** Consistency rulebook for UI implementation
**Design Direction:** Professional Modern
**Generated:** 2025-11-04
**Status:** Final Specification

---

## Executive Summary

This document defines **consistency rules** for every interactive pattern across cv-hub. Think of this as the "Constitution" for UI implementation - developers refer to this when they need to know "How should this behave?"

**Core Philosophy:** Consistency trumps novelty. Accessibility is mandatory, not optional. Every pattern must align with the six Core Experience Principles:

1. **Speed** - Instant gratification, <3s first impression
2. **Guidance** - Progressive disclosure, scannable first
3. **Flexibility** - Balanced control, user agency respected
4. **Feedback** - Subtle yet meaningful, clear state changes
5. **Trust** - Transparency, honest UI, no dark patterns
6. **Quality** - Every detail matters, polished and consistent

**Color System:** Minimalist Energy
- Primary: `#f97316` (orange-500) - CTAs, links, active states
- Text: `#18181b` (zinc-900) primary, `#71717a` (zinc-500) secondary
- Backgrounds: `#ffffff` white, `#fafafa` (zinc-50) page, `#f4f4f5` (zinc-100) tertiary
- Borders: `#e4e4e7` (zinc-200) default, `#f97316` (orange-500) focus
- Semantic: Green (success), Red (error), Yellow (warning), Blue (info)

---

## Table of Contents

1. [Button Hierarchy & Usage](#1-button-hierarchy--usage)
2. [Feedback Patterns](#2-feedback-patterns)
3. [Form Patterns](#3-form-patterns)
4. [Modal & Dialog Patterns](#4-modal--dialog-patterns)
5. [Navigation Patterns](#5-navigation-patterns)
6. [Empty State Patterns](#6-empty-state-patterns)
7. [Confirmation Patterns](#7-confirmation-patterns)
8. [Notification Patterns](#8-notification-patterns)
9. [Loading & Progress Patterns](#9-loading--progress-patterns)
10. [Error Recovery Patterns](#10-error-recovery-patterns)
11. [Data Display Patterns](#11-data-display-patterns)
12. [Responsive Behavior Patterns](#12-responsive-behavior-patterns)

---

## 1. Button Hierarchy & Usage

### Overview
Button hierarchy establishes visual importance and prevents decision paralysis. cv-hub uses a strict 4-level hierarchy to guide users toward primary actions while making supporting actions accessible without competition.

### Design Principles Alignment
- **Speed:** Clear visual hierarchy enables instant decision-making
- **Guidance:** Primary actions are obvious, secondary actions available but not distracting
- **Trust:** Destructive actions are clearly differentiated and require confirmation

---

### Rule 1.1: Primary Button Usage

**When to use:**
- Main CTA per screen section (maximum 1 per viewport)
- Actions that complete a user's primary goal in their current context
- Examples: "Create Link", "Publish Changes", "Get in Touch", "Send Email"

**How it works:**
- Visually dominant: Orange background, white text, prominent placement
- Always positioned where user's attention naturally flows (right side of forms, center of CTAs)
- Never more than one primary button visible in a single viewport section

**Visual specification:**
- Background: `#f97316` (orange-500)
- Text: `#ffffff` (white)
- Font weight: `500` (medium)
- Padding: `12px 24px` (default), `14px 28px` (lg), `10px 20px` (sm)
- Border radius: `8px` (--radius-md)
- Shadow: `shadow-sm` default, `shadow-md` on hover
- Hover: Background darkens to `#ea580c` (orange-600), subtle lift `translateY(-1px)`
- Active: Pressed state, `translateY(0)`, `shadow-sm`
- Focus: Orange ring `ring-2 ring-orange-500 ring-offset-2`
- Disabled: Opacity `0.5`, `cursor-not-allowed`, no hover effects
- Transition: `200ms ease` for all states

**Component mapping:**
- shadcn/ui Button component: `variant="default" size="default|lg|sm"`
- Props: `variant="default"`, `className` for custom sizing

**Code example:**
```tsx
// Primary CTA - Hero section
<Button
  variant="default"
  size="lg"
  className="shadow-sm hover:shadow-md transition-all duration-200"
>
  Get in Touch
</Button>

// Primary form submit
<Button
  variant="default"
  type="submit"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Creating...
    </>
  ) : (
    "Create Link"
  )}
</Button>
```

**Accessibility:**
- Keyboard: `Enter` or `Space` to activate
- ARIA: `role="button"` (implicit with `<button>`)
- Focus visible: Orange ring always visible on keyboard focus
- Loading state: `aria-busy="true"`, `aria-live="polite"` for status updates
- Disabled: `aria-disabled="true"`, `disabled` attribute, cannot receive focus

**Mobile adaptations:**
- Minimum touch target: `44x44px` (iOS guideline)
- Full-width on mobile forms (stretches to container)
- Larger size (`lg`) preferred for main CTAs
- Spacing: `16px` margin below (no cramped stacking)

**Rationale:**
Orange primary color creates visual hierarchy while avoiding "corporate blue" fatigue. Single primary button per viewport prevents decision paralysis and guides users to intended actions. Hover lift and shadow change provide tactile feedback that reinforces interactivity.

**Anti-patterns (What NOT to do):**
- ❌ Multiple primary buttons competing in same viewport section
- ❌ Primary button for low-priority actions (e.g., "Cancel", "Back")
- ❌ Primary button without clear action verb ("Click Here", "Submit")
- ❌ Disabled primary button without explanation of why it's disabled

---

### Rule 1.2: Secondary Button Usage

**When to use:**
- Supporting actions that complement primary action
- Alternative paths that are valid but not the main goal
- Examples: "View on LinkedIn", "Cancel", "Save Draft", "Preview"

**How it works:**
- Visually quieter than primary: White background, orange border and text
- Positioned adjacent to primary button or in form footers
- Can have multiple secondary buttons in same viewport (max 2-3 recommended)

**Visual specification:**
- Background: `#ffffff` (white)
- Border: `1px solid #f97316` (orange-500)
- Text: `#f97316` (orange-500)
- Font weight: `500` (medium)
- Padding: Same as primary button
- Border radius: `8px` (--radius-md)
- Shadow: `none` default, `shadow-sm` on hover
- Hover: Background `#fff7ed` (orange-50), border remains orange
- Active: Slightly darker tint
- Focus: Orange ring (same as primary)
- Disabled: Opacity `0.5`, gray border and text
- Transition: `200ms ease`

**Component mapping:**
- shadcn/ui Button: `variant="secondary"`

**Code example:**
```tsx
// Secondary action next to primary
<div className="flex gap-3 justify-end">
  <Button variant="secondary" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="default" onClick={onSubmit}>
    Create Link
  </Button>
</div>

// Secondary CTA (social links)
<Button
  variant="secondary"
  size="default"
  asChild
>
  <a href="https://linkedin.com/in/ruben" target="_blank" rel="noopener">
    View on LinkedIn
  </a>
</Button>
```

**Accessibility:**
- Same keyboard and ARIA requirements as primary button
- If wrapping link: Use `asChild` pattern to maintain semantic HTML
- External links: Include `aria-label` describing destination

**Mobile adaptations:**
- Stacks below primary button (vertical layout)
- Full-width or auto-width depending on context
- Minimum touch target: `44x44px`

**Rationale:**
Orange border maintains brand consistency while reducing visual weight compared to filled primary button. White background ensures readability and provides clear differentiation from primary actions.

**Anti-patterns:**
- ❌ Secondary button more prominent than primary (size, position)
- ❌ Too many secondary buttons (>3) creates decision fatigue
- ❌ Secondary button for destructive actions (use destructive variant)

---

### Rule 1.3: Ghost Button Usage

**When to use:**
- Tertiary actions (lowest priority)
- Inline actions within content (e.g., "Show More", "Expand Details")
- Icon-only buttons in toolbars/tables
- Dismissible actions

**How it works:**
- Minimal visual presence: Transparent background, orange text only
- Appears inline with content without disrupting flow
- Hover reveals background tint to indicate interactivity

**Visual specification:**
- Background: `transparent` default
- Text: `#f97316` (orange-500)
- Font weight: `500` (medium)
- Padding: Same as other buttons
- Border: `none`
- Hover: Background `#fff7ed` (orange-50), text remains orange
- Active: Slightly darker orange tint `#ea580c`
- Focus: Orange ring (same as primary)
- Disabled: Text color `#a1a1aa` (zinc-400), no hover
- Transition: `200ms ease`

**Component mapping:**
- shadcn/ui Button: `variant="ghost"`

**Code example:**
```tsx
// Inline expansion button
<Button
  variant="ghost"
  size="sm"
  onClick={toggleExpanded}
  aria-expanded={isExpanded}
>
  {isExpanded ? "Show Less" : "Show More"}
  <ChevronDown className={cn(
    "ml-2 h-4 w-4 transition-transform",
    isExpanded && "rotate-180"
  )} />
</Button>

// Table action
<Button
  variant="ghost"
  size="sm"
  onClick={onCopy}
>
  <Copy className="h-4 w-4 mr-2" />
  Copy
</Button>
```

**Accessibility:**
- Expandable content: `aria-expanded` attribute reflects state
- Icon-only buttons: `aria-label` required (e.g., "Copy URL")
- Tooltip recommended for icon-only buttons (not required, but helpful)

**Mobile adaptations:**
- Ensure touch target is `44x44px` even if visual button is smaller
- Consider adding subtle border on mobile for better visibility

**Rationale:**
Ghost buttons don't compete visually with primary/secondary actions but remain discoverable through orange text color. Transparent background allows them to integrate seamlessly into content layouts without adding visual weight.

**Anti-patterns:**
- ❌ Ghost button for critical primary actions
- ❌ Icon-only ghost button without accessible label
- ❌ Ghost button on low-contrast backgrounds (white text on light bg)

---

### Rule 1.4: Destructive Button Usage

**When to use:**
- Delete, remove, deactivate actions
- Irreversible or high-impact operations
- Examples: "Delete Link", "Remove Item", "Deactivate Account"
- ALWAYS requires confirmation (see Confirmation Patterns)

**How it works:**
- Red color signals danger and caution
- Never the primary CTA (positioned as secondary or ghost destructive)
- Confirmation modal/dialog required before executing action

**Visual specification:**
- Background: `#ef4444` (red-500)
- Text: `#ffffff` (white)
- Font weight: `500` (medium)
- Padding: Same as primary button
- Border radius: `8px`
- Shadow: `shadow-sm`
- Hover: Background darkens to `#dc2626` (red-600), shadow increases
- Active: Pressed state
- Focus: Red ring `ring-2 ring-red-500 ring-offset-2`
- Disabled: Opacity `0.5`
- Transition: `200ms ease`

**Component mapping:**
- shadcn/ui Button: `variant="destructive"`

**Code example:**
```tsx
// Destructive action with confirmation
const [showConfirm, setShowConfirm] = useState(false)

<>
  <Button
    variant="destructive"
    size="sm"
    onClick={() => setShowConfirm(true)}
  >
    <Trash2 className="h-4 w-4 mr-2" />
    Delete
  </Button>

  <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Link?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The link will be permanently deleted.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</>
```

**Accessibility:**
- Confirmation dialog: `role="alertdialog"`, `aria-modal="true"`
- Focus management: Auto-focus safe action (Cancel) by default
- Escape key: Closes confirmation dialog (cancels action)
- Clear consequence messaging in confirmation dialog

**Mobile adaptations:**
- Full-width buttons in confirmation dialogs on mobile
- Larger touch targets for cancel vs. delete (prevent accidental deletion)

**Rationale:**
Red color universally signals danger and prompts user caution. Mandatory confirmation prevents accidental data loss and gives users a chance to reconsider. Positioning as secondary/ghost destructive reduces prominence while maintaining discoverability.

**Anti-patterns:**
- ❌ Destructive action without confirmation dialog
- ❌ Destructive button as primary CTA (creates anxiety)
- ❌ Ambiguous destructive labels ("Remove" vs "Delete" - be specific)
- ❌ Undo without clear time window (see Confirmation Patterns)

---

### Rule 1.5: Icon-Only Buttons

**When to use:**
- Space-constrained interfaces (tables, toolbars, mobile headers)
- Actions with universally recognized icons (copy, edit, delete, close)
- Navigation elements (back, menu, close)
- When text label would be redundant with surrounding context

**How it works:**
- Icon size: `16px` (h-4 w-4) for compact spaces, `20px` (h-5 w-5) for standard, `24px` (h-6 w-6) for mobile
- Hover shows tooltip (recommended but not required)
- Accessible label REQUIRED via `aria-label`

**Visual specification:**
- Same button variants apply (default, secondary, ghost, destructive)
- Padding: `8px` square for compact, `10px` for standard, `12px` for mobile
- Minimum touch target: `44x44px` on mobile (padding or hit area)
- Icon color matches button text color
- Icon should be from lucide-react library for consistency

**Component mapping:**
- shadcn/ui Button + lucide-react icons
- Tooltip component for hover hints

**Code example:**
```tsx
// Icon-only with tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Copy URL"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Copy URL</TooltipContent>
  </Tooltip>
</TooltipProvider>

// Mobile menu toggle
<Button
  variant="ghost"
  size="sm"
  aria-label="Open navigation menu"
  aria-expanded={isMenuOpen}
  onClick={toggleMenu}
  className="md:hidden"
>
  {isMenuOpen ? (
    <X className="h-6 w-6" />
  ) : (
    <Menu className="h-6 w-6" />
  )}
</Button>
```

**Accessibility:**
- `aria-label` REQUIRED: Describes action clearly ("Copy URL", not "Copy")
- Tooltip provides visual hint for mouse users (not accessibility requirement)
- Icon must have `aria-hidden="true"` if button has label
- State toggles: `aria-expanded` for expandable elements

**Mobile adaptations:**
- Larger hit area: Use padding or `min-h-[44px] min-w-[44px]`
- Visual size can remain compact if hit area meets touch target size
- Avoid icon-only buttons on mobile unless absolutely necessary

**Rationale:**
Icon-only buttons save space without sacrificing functionality when icons are universally recognized. Mandatory accessible labels ensure screen reader users understand action. Tooltips provide redundancy for sighted users unsure of icon meaning.

**Anti-patterns:**
- ❌ Icon-only button without `aria-label`
- ❌ Ambiguous icons (e.g., abstract symbols without clear meaning)
- ❌ Touch target <44px on mobile
- ❌ Icon-only primary actions (use text + icon for important CTAs)

---

### Rule 1.6: Button Groups

**When to use:**
- Related actions that should be visually grouped
- Toggle groups (exclusive or multiple selection)
- Segmented controls for view switching
- Examples: "Edit | Delete", "List View | Grid View", social share buttons

**How it works:**
- Buttons aligned horizontally with minimal spacing (`gap-2` or `gap-3`)
- Maximum 3-4 buttons per group (avoid overwhelming)
- Consistent variant within group (all ghost, all secondary, or mixed purposefully)
- Right-aligned for form actions, center-aligned for toggles

**Visual specification:**
- Spacing: `8px` (gap-2) between buttons for compact, `12px` (gap-3) for comfortable
- Alignment: Right-aligned for forms, center-aligned for content controls
- Mobile: Stack vertically or horizontal scroll depending on context
- Segmented control: Buttons connected with no gap, shared border

**Component mapping:**
- Flex container: `flex gap-2 justify-end|center`
- shadcn/ui ToggleGroup for exclusive selection

**Code example:**
```tsx
// Form actions (right-aligned)
<div className="flex gap-3 justify-end">
  <Button variant="ghost" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="secondary" onClick={onSaveDraft}>
    Save Draft
  </Button>
  <Button variant="default" onClick={onSubmit}>
    Publish
  </Button>
</div>

// Toggle group (view switcher)
<ToggleGroup type="single" value={view} onValueChange={setView}>
  <ToggleGroupItem value="list" aria-label="List view">
    <List className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="grid" aria-label="Grid view">
    <Grid className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>

// Social share buttons (equal weight)
<div className="flex gap-2 justify-center">
  <Button variant="secondary" size="sm">
    <Linkedin className="h-4 w-4 mr-2" />
    LinkedIn
  </Button>
  <Button variant="secondary" size="sm">
    <Github className="h-4 w-4 mr-2" />
    GitHub
  </Button>
</div>
```

**Accessibility:**
- Toggle groups: `role="group"`, `aria-label` for group
- Current selection: `aria-pressed="true"` for selected button
- Keyboard: Arrow keys navigate between buttons in toggle group
- Focus: Visible focus indicator moves between buttons

**Mobile adaptations:**
- Stack vertically if >2 buttons (full-width)
- Horizontal scroll for toggle groups (preserve horizontal layout)
- Ensure touch targets don't overlap (adequate spacing)

**Rationale:**
Grouping related actions creates visual clarity and reduces cognitive load. Consistent spacing and alignment help users understand button relationships. Right-alignment for forms follows natural reading flow (left to right, top to bottom).

**Anti-patterns:**
- ❌ >4 buttons in a single group (overwhelming)
- ❌ Mixed visual weights without purpose (confusing hierarchy)
- ❌ Button group without clear relationship between actions
- ❌ Mobile button groups without adequate touch spacing

---

### Rule 1.7: Disabled State Handling

**When to use:**
- Form validation incomplete (missing required fields)
- Loading/processing state (action already triggered)
- Permission-based restrictions (user lacks access)
- Dependent conditions not met (e.g., checkbox must be checked first)

**How it works:**
- Visual: Reduced opacity (`0.5`), no hover effects
- Cursor: `not-allowed` to indicate non-interactive state
- Explanation: Tooltip or inline message explaining WHY disabled (recommended)
- Never hide buttons that users expect to see (disable instead of hiding)

**Visual specification:**
- Opacity: `0.5` (50%)
- Cursor: `cursor-not-allowed`
- Background/Border: Remains same color, just faded
- Text: Readable but clearly not interactive
- No hover effects: Button doesn't respond to hover
- No shadow changes

**Component mapping:**
- shadcn/ui Button: `disabled` prop
- Tooltip: Optional but recommended for context

**Code example:**
```tsx
// Form submit disabled until valid
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <span> {/* Wrapper needed for tooltip on disabled button */}
        <Button
          variant="default"
          type="submit"
          disabled={!isFormValid}
          className="w-full"
        >
          Create Link
        </Button>
      </span>
    </TooltipTrigger>
    {!isFormValid && (
      <TooltipContent>
        Please fill in all required fields
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>

// Loading state
<Button variant="default" disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Creating...
    </>
  ) : (
    "Create Link"
  )}
</Button>
```

**Accessibility:**
- `disabled` attribute: Removes from tab order
- `aria-disabled="true"`: Alternative if button must remain focusable
- Explanation: `aria-describedby` links to message explaining why disabled
- Loading: `aria-busy="true"`, `aria-live="polite"` for status updates

**Mobile adaptations:**
- Same visual treatment as desktop
- Explanation text below button (tooltip alternative)
- Clear indication of what's needed to enable button

**Rationale:**
Disabled state prevents errors and guides users toward completing prerequisites. Reduced opacity is universal disabled indicator. Keeping button visible (not hiding) maintains layout stability and shows users the action exists.

**Anti-patterns:**
- ❌ Disabled button without explanation (frustrating for users)
- ❌ Hiding buttons instead of disabling (confusing UX)
- ❌ Disabled button as only CTA (user has no path forward)
- ❌ Permanent disabled state (if action is never available, don't show button)

---

### Rule 1.8: Loading State Handling

**When to use:**
- Async operations (API calls, form submissions)
- File uploads, processing tasks
- Navigation that requires data fetch

**How it works:**
- Button becomes disabled during loading
- Spinner icon appears with loading text
- Original button text changes to describe current action
- User receives clear feedback that action is in progress

**Visual specification:**
- Spinner: lucide-react `Loader2` icon with `animate-spin`
- Spinner size: `h-4 w-4` matches text size
- Position: Left of text with `mr-2` spacing
- Text changes: "Create Link" → "Creating..."
- Button remains disabled: Same disabled opacity applies
- Transition: Spinner fades in smoothly

**Component mapping:**
- shadcn/ui Button + lucide-react Loader2 icon
- Conditional rendering based on loading state

**Code example:**
```tsx
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await createLink(formData)
    toast.success("Link created successfully")
  } catch (error) {
    toast.error("Failed to create link")
  } finally {
    setIsLoading(false)
  }
}

<Button
  variant="default"
  onClick={handleSubmit}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Creating...
    </>
  ) : (
    "Create Link"
  )}
</Button>
```

**Accessibility:**
- `aria-busy="true"`: Indicates loading state
- `aria-live="polite"`: Announces loading status to screen readers
- `disabled`: Prevents multiple submissions
- Status text: "Creating..." provides clear feedback

**Mobile adaptations:**
- Same treatment as desktop
- Ensure spinner is visible on smaller buttons
- Consider full-screen loading overlay for long operations (>3s)

**Rationale:**
Loading state prevents double-submission and provides immediate feedback that action was received. Spinner communicates "processing" universally. Changed text clarifies current action stage.

**Anti-patterns:**
- ❌ No loading indicator (users don't know if click registered)
- ❌ Spinner without text (ambiguous what's happening)
- ❌ Button doesn't disable during loading (allows double submission)
- ❌ Loading state without timeout/error handling (infinite spinner)

---

## 2. Feedback Patterns

### Overview
Feedback patterns communicate system status and action results. cv-hub uses a 4-tier feedback system (Success, Error, Warning, Info) with appropriate urgency levels (toast, inline, banner, modal). Feedback must be subtle yet meaningful - never interrupting flow unnecessarily while ensuring users always understand current state.

### Design Principles Alignment
- **Speed:** Instant feedback on all actions (<100ms)
- **Feedback:** Subtle yet celebratory, clear state changes
- **Trust:** Honest error messages with recovery paths
- **Quality:** Consistent feedback patterns across all journeys

---

### Rule 2.1: Success Feedback - Toast Notifications

**When to use:**
- After successful actions that complete user goals
- Actions with persistent effects (created, updated, deleted)
- Examples: "Link created", "CV updated", "Link deactivated", "URL copied"
- DEFAULT feedback mechanism for success (use unless inline makes more sense)

**How it works:**
- Toast appears top-right (desktop) or top-center (mobile) with slide-in animation
- Auto-dismisses after 3-5 seconds
- Can be manually dismissed via X button
- Doesn't block interaction (non-modal)
- Stacks if multiple toasts (max 3 visible, newest on top)

**Visual specification:**
- Position: `top-right` desktop, `top-center` mobile
- Background: `#ffffff` (white)
- Border: `1px solid #e4e4e7` (zinc-200)
- Border-left: `4px solid #22c55e` (green-500) - success indicator
- Shadow: `shadow-lg` for elevation
- Padding: `16px`
- Border radius: `8px`
- Icon: Green checkmark circle (`CheckCircle2` from lucide-react)
- Icon color: `#22c55e` (green-500)
- Icon size: `20px` (h-5 w-5)
- Title: `font-semibold text-zinc-900`
- Description: `text-sm text-zinc-500` (optional)
- Close button: `X` icon, ghost button style
- Animation: Slide in from right (desktop) or top (mobile), `300ms ease-out`
- Auto-dismiss: 3 seconds (simple messages), 5 seconds (with description)
- Exit animation: Fade out, `200ms ease-in`

**Component mapping:**
- shadcn/ui Toast + Toaster components
- CheckCircle2 icon from lucide-react
- Optional action button (e.g., "Undo")

**Code example:**
```tsx
import { toast } from "sonner" // or shadcn/ui toast
import { CheckCircle2 } from "lucide-react"

// Simple success
toast.success("Link created successfully")

// Success with description
toast.success("Link created successfully", {
  description: "URL copied to clipboard",
  duration: 5000,
})

// Success with action
toast.success("Link created successfully", {
  description: "Share it with your recipient",
  action: {
    label: "Copy URL",
    onClick: () => copyToClipboard(url)
  }
})

// Custom success toast (full control)
toast.custom((t) => (
  <div className="flex items-start gap-3 rounded-lg border border-zinc-200 border-l-4 border-l-green-500 bg-white p-4 shadow-lg">
    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1 space-y-1">
      <p className="font-semibold text-zinc-900">Link created successfully</p>
      <p className="text-sm text-zinc-500">URL copied to clipboard</p>
    </div>
    <button
      onClick={() => toast.dismiss(t)}
      className="text-zinc-400 hover:text-zinc-600"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
))
```

**Accessibility:**
- `role="status"`: Toast is a status message (not alert)
- `aria-live="polite"`: Announced when convenient (not interrupting)
- `aria-atomic="true"`: Entire message read, not just changes
- Keyboard: Focus moves to toast if action button present, Escape dismisses
- Screen reader: "Success: Link created successfully"

**Mobile adaptations:**
- Position: `top-center` instead of top-right
- Width: Full viewport width minus `16px` margins
- Slide animation: From top instead of right
- Touch swipe: Swipe right to dismiss

**Rationale:**
Toasts provide non-blocking feedback that confirms action success without interrupting user's flow. Auto-dismiss prevents cluttering UI, while manual dismiss gives control to users who want to read carefully. Green left border provides instant visual association with success, while avoiding aggressive green backgrounds that can feel jarring.

**Anti-patterns:**
- ❌ Success toast for every minor action (form auto-save, hover events)
- ❌ Toasts that cover primary content or CTAs
- ❌ No way to dismiss toast manually (only auto-dismiss)
- ❌ Multiple toasts for same action (stack/merge instead)
- ❌ Success toast without clear indication of WHAT succeeded

---

### Rule 2.2: Success Feedback - Inline Success

**When to use:**
- Form field validation passes (real-time or on blur)
- Inline edits saved successfully
- Individual field updates (not entire form)
- When feedback needs to persist (longer than toast duration)

**How it works:**
- Appears directly below the related field/element
- Includes green checkmark icon + success message
- Fades in smoothly (0.2s)
- Optionally fades out after 3-5s OR persists until next interaction
- Does not block other form fields

**Visual specification:**
- Position: Below input field, `mt-2` spacing
- Icon: `CheckCircle2` (lucide-react), `h-4 w-4`
- Icon color: `#22c55e` (green-500)
- Text: `text-sm text-green-700`
- Background: `bg-green-50` (optional, for emphasis)
- Border: `border-l-2 border-green-500` (optional)
- Padding: `p-2` if background used
- Animation: Fade in `200ms ease`, optional fade out after 3s

**Component mapping:**
- Custom inline message component
- Can wrap in shadcn/ui Alert component with success variant

**Code example:**
```tsx
// Inline success message
{isSuccess && (
  <div className="mt-2 flex items-center gap-2 text-sm text-green-700 animate-in fade-in duration-200">
    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
    <span>Email address is valid</span>
  </div>
)}

// With background (emphasized)
{isSuccess && (
  <div className="mt-2 flex items-center gap-2 rounded-md bg-green-50 border-l-2 border-green-500 p-2 text-sm text-green-700 animate-in fade-in duration-200">
    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
    <span>Changes saved successfully</span>
  </div>
)}

// Auto-fade after 3s
{isSuccess && (
  <div className={cn(
    "mt-2 flex items-center gap-2 text-sm text-green-700 transition-opacity duration-200",
    shouldFade && "opacity-0"
  )}>
    <CheckCircle2 className="h-4 w-4" />
    <span>Saved</span>
  </div>
)}
```

**Accessibility:**
- `role="status"`: Indicates success message
- `aria-live="polite"`: Announced when convenient
- Associate with field: `aria-describedby` on input points to success message ID
- Color not only indicator: Icon + text provide redundancy

**Mobile adaptations:**
- Same treatment as desktop
- Ensure text wraps properly on narrow screens
- Icon size remains consistent (h-4 w-4)

**Rationale:**
Inline success messages provide context-specific feedback that persists near the relevant element. This is better than toasts for form validation because users can see which field succeeded without looking away from their current focus. Optional auto-fade prevents clutter while giving users time to register the success.

**Anti-patterns:**
- ❌ Inline success for unrelated actions (use toast instead)
- ❌ Success message covering next form field (causes layout shift)
- ❌ Green background so bright it distracts (subtle tint preferred)
- ❌ No icon, only text color (insufficient for colorblind users)

---

### Rule 2.3: Error Feedback - Toast Notifications

**When to use:**
- System errors (API failures, network errors, server errors)
- Global errors affecting entire page/application
- Errors not tied to specific form field
- Examples: "Connection lost", "Failed to load data", "Server error"

**How it works:**
- Toast appears top-right (desktop) or top-center (mobile)
- Does NOT auto-dismiss (requires manual dismiss OR "Retry" action)
- Duration: 7-10 seconds if auto-dismiss enabled (longer than success)
- Red left border indicates error severity
- Optional retry button for recoverable errors

**Visual specification:**
- Position: `top-right` desktop, `top-center` mobile
- Background: `#ffffff` (white)
- Border: `1px solid #e4e4e7` (zinc-200)
- Border-left: `4px solid #ef4444` (red-500) - error indicator
- Shadow: `shadow-lg`
- Padding: `16px`
- Border radius: `8px`
- Icon: Red X circle (`XCircle` from lucide-react)
- Icon color: `#ef4444` (red-500)
- Icon size: `20px` (h-5 w-5)
- Title: `font-semibold text-zinc-900`
- Description: `text-sm text-zinc-500` (error explanation)
- Actions: "Retry" button (secondary), "Dismiss" button (ghost)
- Animation: Slide in from right/top, shake animation on error (subtle)

**Component mapping:**
- shadcn/ui Toast + Toaster
- XCircle icon from lucide-react
- Action buttons

**Code example:**
```tsx
// Simple error
toast.error("Failed to create link")

// Error with description
toast.error("Failed to create link", {
  description: "Please check your internet connection and try again",
  duration: 10000, // 10 seconds
})

// Error with retry action
toast.error("Failed to create link", {
  description: "Network error occurred",
  action: {
    label: "Retry",
    onClick: () => retryAction()
  },
  duration: Infinity, // Doesn't auto-dismiss
})

// Custom error toast with dismiss
toast.custom((t) => (
  <div className="flex items-start gap-3 rounded-lg border border-zinc-200 border-l-4 border-l-red-500 bg-white p-4 shadow-lg animate-in slide-in-from-right duration-300">
    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1 space-y-2">
      <p className="font-semibold text-zinc-900">Connection failed</p>
      <p className="text-sm text-zinc-500">
        Unable to reach server. Check your connection.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => retryAction()}
          className="text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          Retry
        </button>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
))
```

**Accessibility:**
- `role="alert"`: Error is important, announced immediately
- `aria-live="assertive"`: Interrupts screen reader to announce error
- `aria-atomic="true"`: Entire message read
- Focus management: If error blocks action, focus moves to error or retry button
- Keyboard: Escape dismisses, Enter activates retry

**Mobile adaptations:**
- Position: `top-center` (full width minus margins)
- Touch swipe: Swipe right to dismiss (if dismissible)
- Buttons: Full-width or adequate touch targets

**Rationale:**
Error toasts use red to signal urgency and problem. Manual dismiss (or very long auto-dismiss) ensures users don't miss critical error information. "Retry" action provides immediate recovery path without leaving current context. System errors use toasts because they're not tied to specific form fields.

**Anti-patterns:**
- ❌ Error toast that auto-dismisses too quickly (users need time to read)
- ❌ Generic error without explanation ("Error occurred")
- ❌ No recovery action (retry, contact support)
- ❌ Technical jargon in error messages ("ERR_CONNECTION_REFUSED")

---

### Rule 2.4: Error Feedback - Inline Field Errors

**When to use:**
- Form field validation fails (required field empty, format invalid)
- Individual field errors during or after submission
- Real-time validation feedback (on blur or on submit)

**How it works:**
- Appears directly below the invalid field
- Red border on input + red error message + error icon
- Shake animation on field (0.3s) to draw attention
- Error persists until user corrects and re-validates
- First error field auto-focused on form submit

**Visual specification:**
- Input border: `border-red-500` (2px)
- Input background: `bg-red-50` (subtle tint)
- Error message position: Below input, `mt-1` spacing
- Icon: `AlertCircle` (lucide-react), `h-4 w-4`
- Icon color: `#ef4444` (red-500)
- Text: `text-sm text-red-700`
- Animation: Input shake (6px left-right, 3 cycles, 300ms)
- Fade in: Error message fades in `200ms ease`

**Component mapping:**
- shadcn/ui Input with error props
- Form error message component
- AlertCircle icon from lucide-react

**Code example:**
```tsx
// Form field with error state
<div className="space-y-1">
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    onBlur={validateEmail}
    className={cn(
      "transition-colors",
      errors.email && "border-red-500 bg-red-50 animate-shake"
    )}
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  {errors.email && (
    <div
      id="email-error"
      className="flex items-center gap-2 text-sm text-red-700 animate-in fade-in duration-200"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{errors.email}</span>
    </div>
  )}
</div>

// Shake animation (add to tailwind.config)
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   25% { transform: translateX(-6px); }
//   75% { transform: translateX(6px); }
// }
// animation: shake 300ms ease-in-out;
```

**Accessibility:**
- `aria-invalid="true"`: Marks field as having error
- `aria-describedby`: Links input to error message
- Error message ID: Must match `aria-describedby` value
- Focus management: First error field receives focus on submit
- Color not only indicator: Icon + border + text provide redundancy
- Screen reader: "Email address, invalid. Email must contain @ symbol"

**Mobile adaptations:**
- Error message wraps properly on narrow screens
- Shake animation same as desktop (important feedback)
- Icon size consistent (h-4 w-4)

**Rationale:**
Inline field errors provide context-specific feedback that helps users understand exactly what needs correction. Red border draws visual attention to problematic field, while error message explains what's wrong. Shake animation provides additional attention-grabbing feedback without being jarring. Form submit focuses first error to help users quickly find and fix issues.

**Anti-patterns:**
- ❌ Error message above field (users may miss it)
- ❌ Generic error for all fields ("Please fix errors")
- ❌ Error without explanation of HOW to fix ("Invalid")
- ❌ Error covers next field (layout shift issues)
- ❌ Red background so bright it hurts eyes (subtle tint preferred)

---

### Rule 2.5: Warning Feedback

**When to use:**
- Non-blocking issues that user should be aware of
- Potential problems that may cause issues later
- Validation warnings (not errors - user can still proceed)
- Examples: "Link expires in 2 days", "Some fields couldn't be extracted", "Large file may take longer"

**How it works:**
- Yellow/amber color signals caution (not as severe as error)
- Can be toast, inline, or banner depending on context
- Does not block user actions (warnings vs errors)
- Provides explanation and optional action

**Visual specification:**
- Color: `#eab308` (yellow-500) for icon and border
- Background: `#fef3c7` (yellow-50) for banners
- Icon: `AlertTriangle` (lucide-react)
- Icon size: `h-5 w-5` (toast/banner), `h-4 w-4` (inline)
- Text: `text-yellow-700` for dark bg, `text-yellow-900` for light bg
- Border: `border-l-4 border-yellow-500` (left accent)
- Duration: 7 seconds auto-dismiss (toast), persistent (banner/inline)

**Component mapping:**
- shadcn/ui Toast with warning styling
- shadcn/ui Alert component for banners
- Custom inline warning component

**Code example:**
```tsx
// Warning toast
toast.warning("Link expires in 2 days", {
  description: "Consider extending the expiration date",
  duration: 7000,
  action: {
    label: "Extend",
    onClick: () => extendExpiration()
  }
})

// Warning banner (persistent)
<Alert variant="warning" className="mb-4">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Some fields couldn't be extracted</AlertTitle>
  <AlertDescription>
    Please review and manually add missing information before publishing.
  </AlertDescription>
</Alert>

// Inline warning
{hasWarning && (
  <div className="mt-2 flex items-start gap-2 rounded-md bg-yellow-50 border-l-2 border-yellow-500 p-2 text-sm text-yellow-900">
    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium">Large file detected</p>
      <p className="text-yellow-700">Upload may take 2-3 minutes</p>
    </div>
  </div>
)}
```

**Accessibility:**
- `role="status"`: Warning is informational, not critical alert
- `aria-live="polite"`: Announced when convenient
- Color not only indicator: Icon + text provide redundancy
- Action button: Clearly labeled and keyboard accessible

**Mobile adaptations:**
- Banner: Full width, adequate padding
- Toast: Same as desktop warning toast
- Inline: Wraps properly, icon aligns with text

**Rationale:**
Warnings inform users of potential issues without blocking their workflow. Yellow color universally signals caution while being less alarming than red. Providing optional actions (extend, fix, dismiss) gives users control over how to respond to warnings.

**Anti-patterns:**
- ❌ Warning for critical errors (use error instead)
- ❌ Too many warnings (warning fatigue)
- ❌ Warning without explanation of what might go wrong
- ❌ Warning that user can't act on (no resolution path)

---

### Rule 2.6: Info Feedback

**When to use:**
- Neutral information, helpful tips, feature announcements
- Explanatory messages that add context
- Non-urgent notifications
- Examples: "Pro tip: Use markdown formatting", "Beta feature", "Updated yesterday"

**How it works:**
- Blue color signals neutral information (not warning or error)
- Can be toast, inline, or banner
- Optional dismiss action
- Doesn't interrupt flow

**Visual specification:**
- Color: `#3b82f6` (blue-500) for icon and border
- Background: `#dbeafe` (blue-50) for banners
- Icon: `Info` or `Lightbulb` (lucide-react)
- Icon size: `h-5 w-5` (toast/banner), `h-4 w-4` (inline)
- Text: `text-blue-700` for dark bg, `text-blue-900` for light bg
- Border: `border-l-4 border-blue-500` (left accent)
- Duration: 5 seconds auto-dismiss (toast), dismissible (banner)

**Component mapping:**
- shadcn/ui Toast with info styling
- shadcn/ui Alert component for banners
- Custom inline info component

**Code example:**
```tsx
// Info toast
toast.info("Markdown formatting is supported", {
  description: "Use **bold** and *italic* in your message",
  duration: 5000,
})

// Info banner (dismissible)
<Alert variant="info" className="mb-4">
  <Lightbulb className="h-4 w-4" />
  <AlertTitle>Pro tip</AlertTitle>
  <AlertDescription>
    Create links quickly by using keyboard shortcuts: Cmd+K (Mac) or Ctrl+K (Windows)
  </AlertDescription>
  <button onClick={dismissTip} className="absolute top-4 right-4">
    <X className="h-4 w-4 text-zinc-400 hover:text-zinc-600" />
  </button>
</Alert>

// Inline info
{showInfo && (
  <div className="mt-2 flex items-start gap-2 rounded-md bg-blue-50 border-l-2 border-blue-500 p-2 text-sm text-blue-900">
    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
    <span>This link was created on October 15, 2025</span>
  </div>
)}
```

**Accessibility:**
- `role="status"`: Info is supplementary, not critical
- `aria-live="polite"`: Announced when convenient
- Dismiss button: `aria-label="Dismiss tip"`
- Color not only indicator: Icon + text provide redundancy

**Mobile adaptations:**
- Banner: Full width, adequate padding
- Toast: Same as desktop info toast
- Inline: Wraps properly

**Rationale:**
Info messages provide helpful context without implying problems. Blue color is neutral and doesn't trigger anxiety like red/yellow. Dismissible banners allow users to hide tips they've already learned.

**Anti-patterns:**
- ❌ Info message for critical information (use warning or error)
- ❌ Too many info messages (noise)
- ❌ Info message that blocks important content
- ❌ Non-dismissible info banner that persists forever

---

### Rule 2.7: Loading Feedback - Spinner

**When to use:**
- Quick actions (<2s expected duration)
- Button actions, form submissions
- Examples: Creating link, copying URL, fetching data

**How it works:**
- Spinner appears in button or inline
- Button disables during loading
- Text changes to present tense ("Creating...")
- Spinner rotates continuously until action completes

**Visual specification:**
- Icon: `Loader2` (lucide-react) with `animate-spin`
- Size: `h-4 w-4` (matches button text)
- Color: Matches button text color (white for primary, orange for secondary)
- Position: Left of text with `mr-2` spacing
- Animation: Continuous rotation, `animate-spin` (Tailwind)

**Component mapping:**
- lucide-react Loader2 icon
- Button component with loading state

**Code example:**
```tsx
// Button loading state
<Button
  variant="default"
  disabled={isLoading}
  onClick={handleAction}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Creating...
    </>
  ) : (
    "Create Link"
  )}
</Button>

// Inline loading (small actions)
{isLoading && (
  <div className="flex items-center gap-2 text-sm text-zinc-500">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>Loading...</span>
  </div>
)}
```

**Accessibility:**
- `aria-busy="true"`: Indicates loading state
- `aria-live="polite"`: Announces loading status
- Button disabled: Prevents multiple clicks
- Status text: "Creating..." provides clear feedback

**Mobile adaptations:**
- Same visual treatment
- Ensure spinner is visible on smaller buttons

**Rationale:**
Spinner provides universal "processing" indicator. Rotating animation clearly shows system is working. Disabling button prevents double-submission. Changed text clarifies what's happening.

**Anti-patterns:**
- ❌ No loading indicator (users don't know if click registered)
- ❌ Spinner without text (ambiguous)
- ❌ Button doesn't disable (allows multiple submissions)
- ❌ Spinner for very quick actions (<500ms - use optimistic UI instead)

---

### Rule 2.8: Loading Feedback - Progress Bar

**When to use:**
- Long-running operations (>2s expected)
- Multi-step processes (e.g., AI extraction: Upload → Extract → Process → Ready)
- File uploads
- When progress can be quantified

**How it works:**
- Progress bar shows completion percentage or steps
- Text updates with current step or percentage
- Estimated time shown (optional)
- Non-blocking if possible (user can navigate away)

**Visual specification:**
- Bar background: `bg-zinc-200`
- Progress fill: `bg-orange-500`
- Height: `h-2` (8px) default, `h-3` (12px) emphasized
- Border radius: `rounded-full`
- Animation: Smooth transition `transition-all duration-300`
- Width: Percentage-based, `0%` to `100%`
- Text: Above or below bar, shows step name or percentage

**Component mapping:**
- shadcn/ui Progress component
- Custom step indicator for multi-step processes

**Code example:**
```tsx
// Simple progress bar
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-zinc-700">Uploading...</span>
    <span className="text-zinc-500">{progress}%</span>
  </div>
  <Progress value={progress} className="h-2" />
</div>

// Multi-step progress
const steps = [
  { id: 1, name: "Upload", status: "complete" },
  { id: 2, name: "Extract", status: "current" },
  { id: 3, name: "Process", status: "pending" },
  { id: 4, name: "Ready", status: "pending" },
]

<div className="space-y-4">
  <div className="flex justify-between items-center">
    {steps.map((step, index) => (
      <React.Fragment key={step.id}>
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step.status === "complete" && "bg-green-500 text-white",
            step.status === "current" && "bg-orange-500 text-white",
            step.status === "pending" && "bg-zinc-200 text-zinc-400"
          )}>
            {step.status === "complete" ? (
              <Check className="h-4 w-4" />
            ) : (
              step.id
            )}
          </div>
          <span className={cn(
            "text-xs",
            step.status === "current" ? "text-zinc-900 font-medium" : "text-zinc-500"
          )}>
            {step.name}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div className={cn(
            "flex-1 h-0.5 mx-2",
            step.status === "complete" ? "bg-green-500" : "bg-zinc-200"
          )} />
        )}
      </React.Fragment>
    ))}
  </div>
  <p className="text-sm text-zinc-500 text-center">
    Step 2 of 4 - Extracting data... (usually 30-60 seconds)
  </p>
</div>
```

**Accessibility:**
- `role="progressbar"`: Indicates progress element
- `aria-valuenow`: Current value (e.g., 45)
- `aria-valuemin`: Minimum value (0)
- `aria-valuemax`: Maximum value (100)
- `aria-label` or `aria-labelledby`: Describes what's loading
- Status text: "Uploading, 45% complete"

**Mobile adaptations:**
- Full-width progress bar
- Step labels stack or scroll horizontally
- Adequate spacing between steps

**Rationale:**
Progress bars reduce anxiety during long operations by showing system is working and how much longer. Multi-step processes help users understand current stage. Estimated time sets expectations.

**Anti-patterns:**
- ❌ Progress bar that jumps around (non-linear progress)
- ❌ "99% complete" that stays forever (stuck progress)
- ❌ No estimated time for long operations
- ❌ Progress bar for indeterminate processes (use spinner instead)

---

### Rule 2.9: Loading Feedback - Skeleton UI

**When to use:**
- Content loading (SSR hydration, initial page load)
- List/table data fetching
- Image loading placeholders
- When layout structure is known before content arrives

**How it works:**
- Placeholder elements match final content layout
- Shimmer animation provides "loading" feel
- Replaces with real content smoothly (fade transition)
- Prevents layout shift when content loads

**Visual specification:**
- Background: `bg-zinc-200` (light gray)
- Shimmer: `animate-pulse` (Tailwind) or custom gradient animation
- Border radius: Matches final content (8px for cards)
- Dimensions: Match expected content (height/width)
- Spacing: Same as final layout
- Animation: Subtle pulse, 1.5s duration, infinite loop

**Component mapping:**
- shadcn/ui Skeleton component
- Custom skeleton layouts for specific content types

**Code example:**
```tsx
// Simple skeleton (text lines)
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-5/6" />
</div>

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-1/2" /> {/* Title */}
    <Skeleton className="h-4 w-3/4 mt-2" /> {/* Description */}
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </CardContent>
  <CardFooter>
    <Skeleton className="h-10 w-24" /> {/* Button */}
  </CardFooter>
</Card>

// Table skeleton
<Table>
  <TableHeader>
    <TableRow>
      {[1, 2, 3, 4, 5].map((col) => (
        <TableHead key={col}>
          <Skeleton className="h-4 w-full" />
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {[1, 2, 3].map((row) => (
      <TableRow key={row}>
        {[1, 2, 3, 4, 5].map((col) => (
          <TableCell key={col}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Accessibility:**
- `aria-busy="true"`: On parent container
- `aria-live="polite"`: Announces when content loads
- `aria-label="Loading content"`: On skeleton container
- Focus management: Don't trap focus on skeleton
- Screen reader: "Loading content, please wait"

**Mobile adaptations:**
- Same layout as desktop skeleton
- Matches responsive final layout

**Rationale:**
Skeleton UI provides instant visual feedback that content is loading while preventing jarring layout shifts. Matching final content structure helps users anticipate what's coming. Subtle pulse animation indicates "working" without being distracting.

**Anti-patterns:**
- ❌ Skeleton that doesn't match final layout (causes layout shift)
- ❌ Too-aggressive shimmer animation (distracting)
- ❌ No skeleton for long-loading content (blank screen)
- ❌ Skeleton visible after content loads (failed fade transition)

---

## 3. Form Patterns

### Overview
Form patterns ensure consistent data entry experiences across cv-hub. All forms prioritize clarity, accessibility, and error recovery. Forms guide users through required fields while respecting their time with clear validation and helpful feedback.

### Design Principles Alignment
- **Speed:** Validation on blur (not every keystroke), clear required fields
- **Guidance:** Labels above fields, help text when needed, clear error messages
- **Flexibility:** Optional fields clearly marked, users can skip and return
- **Feedback:** Inline validation, clear error recovery
- **Trust:** No hidden required fields, clear data usage
- **Quality:** Accessible by default (labels, ARIA, keyboard)

---

### Rule 3.1: Label Placement & Required Fields

**When to use:**
- ALL form fields (no exceptions)
- Labels describe what data is expected
- Required/optional indicators set clear expectations

**How it works:**
- Labels ALWAYS above input (not inline, not floating)
- Required fields marked with orange asterisk (*) after label
- Optional fields marked with "(optional)" text in zinc-500
- Default assumption: Fields are required unless marked optional

**Visual specification:**
- Label position: Above input, `mb-2` spacing
- Label text: `text-sm font-medium text-zinc-900`
- Required indicator: Orange asterisk `*` in `text-orange-500`, `ml-1` spacing
- Optional indicator: `(optional)` in `text-zinc-500`, `ml-2` spacing
- Input: `mt-0` (label spacing handles gap)

**Component mapping:**
- shadcn/ui Label component
- Custom FormField wrapper component

**Code example:**
```tsx
// Required field (with asterisk)
<div className="space-y-2">
  <Label htmlFor="recipient">
    Recipient Name
    <span className="text-orange-500 ml-1">*</span>
  </Label>
  <Input
    id="recipient"
    type="text"
    required
    aria-required="true"
  />
</div>

// Optional field
<div className="space-y-2">
  <Label htmlFor="message">
    Personalized Message
    <span className="text-zinc-500 ml-2">(optional)</span>
  </Label>
  <Textarea
    id="message"
    aria-required="false"
  />
</div>

// Reusable FormField component
<FormField
  label="Email Address"
  name="email"
  required
  helpText="We'll send confirmation to this email"
>
  <Input
    id="email"
    type="email"
    required
  />
</FormField>
```

**Accessibility:**
- `<label>` element: Always use semantic label (not divs)
- `htmlFor` attribute: Matches input `id` (enables click-to-focus)
- `required` attribute: Marks input as required
- `aria-required="true"`: Screen reader equivalent
- `aria-label`: NOT used if visible label exists
- Label text: Clear, concise, describes expected data

**Mobile adaptations:**
- Same layout (label above input)
- Adequate spacing for touch interaction
- Font size remains readable (no smaller than 14px)

**Rationale:**
Labels above inputs provide clear hierarchy and work better on mobile (no wrapping issues). Orange asterisk uses brand color while being universally understood as "required". Marking optional fields (not required) sets expectation that most fields are required without cluttering every label with asterisks.

**Anti-patterns:**
- ❌ Placeholder as label (disappears when typing, inaccessible)
- ❌ Floating labels (complex implementation, accessibility issues)
- ❌ Labels to the left of input (wrapping issues, mobile problems)
- ❌ No indication of required vs optional (users guess)
- ❌ All fields marked required (even optional ones)

---

### Rule 3.2: Field Validation Timing

**When to use:**
- Determine WHEN to show validation errors
- Balance between helpful and annoying
- Different timing for different validation types

**How it works:**
- **On blur (default):** Validate after user leaves field (most common)
- **On submit:** Show ALL errors when form submitted
- **Real-time (explicit cases only):** Password strength, username availability
- **Never on every keystroke** (too aggressive, annoying)

**Validation timing matrix:**

| Field Type | Blur | Submit | Real-time | Rationale |
|------------|------|--------|-----------|-----------|
| Text input | ✅ | ✅ | ❌ | Blur validates after user finishes typing |
| Email | ✅ | ✅ | ❌ | Format validation on blur |
| Password | ❌ | ✅ | ✅ (strength) | Show strength indicator as typing |
| Confirm password | ✅ | ✅ | ❌ | Match validation on blur |
| Required field | ✅ | ✅ | ❌ | Empty check on blur |
| Username | ❌ | ✅ | ✅ (availability) | Check availability with debounce (500ms) |
| URL | ✅ | ✅ | ❌ | Format validation on blur |
| Phone | ✅ | ✅ | ❌ | Format validation on blur |
| Textarea | ❌ | ✅ | ❌ | Only validate on submit (less intrusive) |

**Visual specification:**
- Validation errors appear immediately on trigger event (no delay)
- Success indicators appear after validation passes
- Loading spinner during async validation (username check)
- Error persists until user corrects and re-validates (blur or submit)

**Component mapping:**
- React Hook Form or TanStack Form for validation logic
- Custom validation rules per field type
- Async validation with debounce utilities

**Code example:**
```tsx
import { useForm } from "react-hook-form"

const form = useForm({
  mode: "onBlur", // Default validation mode
})

// Standard field (validates on blur)
<input
  {...form.register("email", {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    }
  })}
  onBlur={() => form.trigger("email")} // Explicit blur validation
/>

// Real-time validation (password strength)
const password = form.watch("password")
const strength = calculatePasswordStrength(password)

<div>
  <Input
    {...form.register("password", {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      }
    })}
  />
  {password && (
    <div className="mt-2">
      <PasswordStrengthMeter strength={strength} />
    </div>
  )}
</div>

// Async validation (username availability)
<Input
  {...form.register("username", {
    required: "Username is required",
    validate: async (value) => {
      const isAvailable = await checkUsernameAvailability(value)
      return isAvailable || "Username already taken"
    }
  })}
/>

// Submit validation (shows all errors)
const onSubmit = async (data) => {
  const isValid = await form.trigger() // Validate all fields
  if (!isValid) {
    // Focus first error field
    const firstError = Object.keys(form.formState.errors)[0]
    form.setFocus(firstError)
    return
  }
  // Proceed with submission
}
```

**Accessibility:**
- Validation triggered: `aria-live="polite"` announces errors
- Error messages: Associated via `aria-describedby`
- Focus management: First error field receives focus on submit
- Real-time validation: Avoid announcing every keystroke (use polite, not assertive)

**Mobile adaptations:**
- Same validation timing rules
- Native keyboard types trigger appropriate validation (email keyboard, number keyboard)
- Ensure error messages don't overlap with mobile keyboard

**Rationale:**
Validation on blur provides immediate feedback without being intrusive during typing. Submit validation catches any missed errors and provides comprehensive feedback. Real-time validation is reserved for cases where users benefit from immediate feedback (password strength) or need to make iterative changes (username availability). Avoiding keystroke-by-keystroke validation prevents annoying interruptions.

**Anti-patterns:**
- ❌ Validate on every keystroke (too aggressive)
- ❌ Only validate on submit (users don't get early feedback)
- ❌ Real-time validation for all fields (performance + UX issues)
- ❌ Validation that blocks typing (e.g., disallowing characters)
- ❌ No re-validation after user corrects error (error persists incorrectly)

---

### Rule 3.3: Error Message Guidelines

**When to use:**
- Validation fails for any reason
- Clear, actionable error messages help users fix issues

**How it works:**
- Error messages explain WHAT'S wrong and HOW to fix it
- Use friendly, human language (no technical jargon)
- Provide specific guidance, not generic messages
- Keep messages concise (1-2 sentences max)

**Message structure:**
- **What's wrong:** "Email is required" / "Email format is invalid"
- **How to fix (if not obvious):** "Please enter a valid email address (e.g., name@example.com)"
- **Avoid blame:** "Invalid email" → "Email must contain @"
- **Be specific:** "Too short" → "Password must be at least 8 characters"

**Error message examples:**

| Bad ❌ | Good ✅ | Why Better |
|--------|---------|------------|
| "Invalid input" | "Email must contain @" | Specific, actionable |
| "Error" | "Recipient name is required" | Explains what's missing |
| "Wrong format" | "Phone number must be 10 digits (e.g., 5551234567)" | Provides format example |
| "Try again" | "Password must include uppercase, lowercase, and number" | Clear requirements |
| "Field required" | "Message is optional, but expiration date is required" | Contextual |
| "Cannot be empty" | "Please enter a recipient name" | Friendly tone |
| "Max length exceeded" | "Message must be 500 characters or less (currently 550)" | Shows current vs limit |

**Visual specification:**
- Text: `text-sm text-red-700`
- Icon: `AlertCircle` (lucide-react), `h-4 w-4`, `text-red-500`
- Position: Below input, `mt-1` spacing
- Animation: Fade in `200ms ease`
- Persistence: Until user corrects and re-validates

**Component mapping:**
- Form library error message component
- Custom FormError component

**Code example:**
```tsx
// Error message display
{errors.email && (
  <div className="mt-1 flex items-center gap-2 text-sm text-red-700">
    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
    <span>{errors.email.message}</span>
  </div>
)}

// Custom error messages (validation rules)
<Input
  {...form.register("email", {
    required: "Email address is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address (e.g., name@example.com)"
    }
  })}
/>

// Complex validation with custom error
<Input
  {...form.register("password", {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters"
    },
    validate: (value) => {
      if (!/[A-Z]/.test(value)) return "Password must include uppercase letter"
      if (!/[a-z]/.test(value)) return "Password must include lowercase letter"
      if (!/[0-9]/.test(value)) return "Password must include number"
      return true
    }
  })}
/>

// Error summary (multiple errors on submit)
{Object.keys(errors).length > 0 && (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Please fix the following errors:</AlertTitle>
    <AlertDescription>
      <ul className="list-disc list-inside space-y-1">
        {Object.values(errors).map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
)}
```

**Accessibility:**
- Error message linked: `aria-describedby` on input points to error message ID
- Error message ID: Must be unique and match `aria-describedby`
- Screen reader: "Email address, invalid. Please enter a valid email address"
- Focus on error: First error field receives focus on submit

**Mobile adaptations:**
- Error messages wrap properly on narrow screens
- Font size remains readable (14px minimum)
- Icon aligns with first line of multi-line error

**Rationale:**
Clear, actionable error messages reduce frustration and help users fix issues quickly. Friendly tone (not blame-y) maintains trust. Specific guidance (format examples, character counts) prevents repeat errors. Error summaries on submit provide comprehensive overview for forms with multiple errors.

**Anti-patterns:**
- ❌ Generic errors ("Invalid input", "Error")
- ❌ Technical jargon ("Regex pattern failed")
- ❌ Blame-y tone ("You entered invalid data")
- ❌ No guidance on how to fix ("Wrong")
- ❌ Error messages that contradict each other
- ❌ Errors without context (which field?)

---

### Rule 3.4: Help Text & Field Descriptions

**When to use:**
- Complex fields that need explanation (format requirements, examples)
- Fields where users might be uncertain what to enter
- Privacy/security context (why we need this data)
- Optional but recommended fields
- Examples: "URL will expire in 30 days", "This will be visible to recipients", "We'll never share your email"

**How it works:**
- Help text appears below label, above input
- Uses zinc-500 (secondary color) to differentiate from label
- Keeps help text concise (1 sentence ideal, 2 max)
- Icon optional for emphasis (Info, Lock for security notes)

**Visual specification:**
- Position: Below label, above input, `mt-1 mb-2` spacing
- Text: `text-sm text-zinc-500`
- Icon: `Info` or `Lock` (lucide-react), `h-4 w-4`, inline with text
- Icon color: `text-zinc-400`
- Max width: Same as input field
- Line height: `leading-relaxed` for multi-line

**Component mapping:**
- Custom FormHelpText component
- Inline with FormField wrapper

**Code example:**
```tsx
// Simple help text
<div className="space-y-2">
  <Label htmlFor="expiration">
    Expiration Date
    <span className="text-orange-500 ml-1">*</span>
  </Label>
  <p className="text-sm text-zinc-500">
    Link will automatically deactivate after this date
  </p>
  <Input
    id="expiration"
    type="date"
    required
  />
</div>

// Help text with icon (privacy context)
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <div className="flex items-center gap-2 text-sm text-zinc-500">
    <Lock className="h-4 w-4 text-zinc-400 flex-shrink-0" />
    <span>We'll never share your email with third parties</span>
  </div>
  <Input
    id="email"
    type="email"
  />
</div>

// Help text with example
<div className="space-y-2">
  <Label htmlFor="phone">Phone Number</Label>
  <p className="text-sm text-zinc-500">
    Enter 10 digits without spaces or dashes (e.g., 5551234567)
  </p>
  <Input
    id="phone"
    type="tel"
    placeholder="5551234567"
  />
</div>

// Reusable FormField with help text
<FormField
  label="LinkedIn Profile URL"
  name="linkedinUrl"
  helpText="Make sure your profile is set to public visibility"
  helpIcon={<Info className="h-4 w-4" />}
>
  <Input
    id="linkedinUrl"
    type="url"
    placeholder="https://linkedin.com/in/yourname"
  />
</FormField>
```

**Accessibility:**
- Help text linked: `aria-describedby` on input points to help text ID
- Help text ID: Must be unique (e.g., `email-help`)
- Screen reader: "Email address. We'll never share your email with third parties. Edit text"
- Don't duplicate in placeholder: Placeholder should not repeat help text
- Persistent: Help text always visible (doesn't disappear like placeholder)

**Mobile adaptations:**
- Help text wraps properly on narrow screens
- Icon aligns with first line if multi-line
- Font size remains readable (14px minimum)
- Adequate spacing from input (tap target consideration)

**Rationale:**
Help text reduces uncertainty and errors by providing context before users start typing. Positioning above input ensures it's seen before interaction. Secondary color (zinc-500) distinguishes help text from labels and errors. Privacy/security context builds trust by explaining data usage.

**Anti-patterns:**
- ❌ Help text below input (users miss it before typing)
- ❌ Help text in placeholder (disappears when typing, inaccessible)
- ❌ Verbose help text (paragraphs of explanation)
- ❌ Help text for every field (cluttered, overwhelming)
- ❌ Technical jargon in help text
- ❌ Help text that contradicts error messages

---

### Rule 3.5: Input Field States

**When to use:**
- All text inputs, textareas, selects must support these states
- States communicate interaction status and validation results
- Consistent visual feedback across all form fields

**States to support:**
1. **Default/Empty:** Field ready for input, no interaction yet
2. **Focus:** User actively typing or field has keyboard focus
3. **Filled/Valid:** User entered valid data, field validated successfully
4. **Error:** Validation failed, requires correction
5. **Disabled:** Field not editable (temporarily or due to permissions)
6. **Loading:** Async validation in progress (username check, API validation)

**Visual specification per state:**

**Default state:**
- Border: `1px solid #e4e4e7` (zinc-200)
- Background: `#ffffff` (white)
- Text: `#18181b` (zinc-900)
- Placeholder: `#a1a1aa` (zinc-400)
- Cursor: `text` cursor

**Focus state:**
- Border: `2px solid #f97316` (orange-500)
- Background: `#ffffff` (white)
- Ring: `ring-2 ring-orange-500 ring-offset-0` (Tailwind focus-visible)
- Transition: `border 200ms ease`
- Label: Remains zinc-900 (no color change)

**Filled/Valid state:**
- Border: `1px solid #e4e4e7` (zinc-200) - normal border
- Background: `#ffffff` (white)
- Text: `#18181b` (zinc-900)
- Success indicator: Green checkmark below field (see Rule 2.2)
- Optional: Subtle green left border `border-l-2 border-green-500`

**Error state:**
- Border: `2px solid #ef4444` (red-500)
- Background: `#fef2f2` (red-50) - subtle tint
- Text: `#18181b` (zinc-900)
- Error message: Below field with red icon (see Rule 2.4)
- Animation: Shake on error (300ms, 3 cycles)

**Disabled state:**
- Border: `1px solid #e4e4e7` (zinc-200)
- Background: `#fafafa` (zinc-50)
- Text: `#a1a1aa` (zinc-400)
- Cursor: `not-allowed`
- Opacity: `0.6` on entire field
- No focus ring: Cannot receive focus

**Loading state:**
- Border: `1px solid #e4e4e7` (zinc-200)
- Background: `#ffffff` (white)
- Loading spinner: Right side of input, `mr-2`
- Cursor: `wait` or `progress`
- Field disabled during loading

**Component mapping:**
- shadcn/ui Input with state variants
- Custom Input wrapper with state management
- Focus-visible utility class from Tailwind

**Code example:**
```tsx
// Input with all states
<Input
  id="email"
  type="email"
  value={email}
  onChange={handleChange}
  onBlur={validateEmail}
  disabled={isDisabled}
  className={cn(
    "transition-all duration-200",
    // Error state
    errors.email && "border-red-500 bg-red-50 animate-shake",
    // Valid state
    isValid && !errors.email && "border-l-2 border-l-green-500",
    // Loading state
    isValidating && "cursor-wait"
  )}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : "email-help"}
/>

// Loading indicator (async validation)
{isValidating && (
  <div className="absolute right-3 top-1/2 -translate-y-1/2">
    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
  </div>
)}

// State management example
const [fieldState, setFieldState] = useState<'default' | 'valid' | 'error' | 'loading'>('default')

const validateField = async (value: string) => {
  setFieldState('loading')
  try {
    const isValid = await checkAvailability(value)
    setFieldState(isValid ? 'valid' : 'error')
  } catch (error) {
    setFieldState('error')
  }
}

// Disabled field with explanation
<div className="space-y-2">
  <Label htmlFor="preset-name" className="text-zinc-500">
    Preset Name
  </Label>
  <Input
    id="preset-name"
    value="Professional CV"
    disabled
  />
  <p className="text-sm text-zinc-500">
    This field cannot be edited for default presets
  </p>
</div>
```

**Accessibility:**
- Focus state: Always visible (not just hover)
- `aria-invalid`: True when error state
- `aria-disabled`: True when disabled
- `aria-busy`: True when loading
- `aria-describedby`: Links to help text or error message
- Screen reader announces state: "Email, edit text, invalid"
- Color not only indicator: Border + background + icon provide redundancy

**Mobile adaptations:**
- Focus state: Orange border (no ring on mobile)
- Touch feedback: Brief background tint on tap
- Loading spinner: Adequate size (h-5 w-5 on mobile)
- Error shake: Same animation (important feedback)
- Disabled: Same visual treatment

**Rationale:**
Consistent states across all inputs create predictable interaction patterns. Orange focus ring uses brand color while being highly visible. Error state combines multiple indicators (border, background, icon) for accessibility. Disabled state clearly shows non-interactive fields. Loading state prevents confusion during async operations.

**Anti-patterns:**
- ❌ Focus state only on hover (keyboard users miss it)
- ❌ No visual difference between filled and empty (ambiguous)
- ❌ Error state without explanation (see Rule 3.3)
- ❌ Disabled field without context (users don't know why)
- ❌ Loading state without spinner (looks broken)
- ❌ Color as only state indicator (accessibility issue)

---

### Rule 3.6: Form Layout & Grouping

**When to use:**
- Multi-field forms (2+ fields)
- Related fields that should be grouped logically
- Long forms that need visual organization
- Progressive disclosure (conditional fields)

**How it works:**
- Single column layout for all forms (no multi-column)
- Group related fields with visual separation
- Progressive disclosure: Show conditional fields only when relevant
- Clear section headings for distinct form areas
- Adequate spacing between fields and groups

**Layout structure:**
- **Single column:** All fields stack vertically (max-width: 100%)
- **Field spacing:** `space-y-4` (16px) between fields
- **Group spacing:** `space-y-6` (24px) between groups
- **Section spacing:** `space-y-8` (32px) between major sections
- **Max width:** `max-w-2xl` (672px) for readability on large screens

**Visual specification:**
- Field container: `space-y-4` (16px between fields)
- Group container: `space-y-6`, optional border or background for emphasis
- Section heading: `text-lg font-semibold text-zinc-900`, `mb-4`
- Section description: `text-sm text-zinc-500`, `mb-6`
- Divider: `border-t border-zinc-200`, `my-8`
- Card/Panel: `bg-zinc-50 rounded-lg p-6` for grouped fields
- Conditional fields: Fade in/slide down animation (200ms)

**Component mapping:**
- Form wrapper component with max-width
- FieldGroup component for related fields
- Collapsible component for progressive disclosure
- Separator/Divider component

**Code example:**
```tsx
// Single column form with groups
<form className="max-w-2xl mx-auto space-y-8">
  {/* Section 1: Basic Info */}
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-zinc-900">Basic Information</h2>
      <p className="text-sm text-zinc-500 mt-1">
        Who is this CV link for?
      </p>
    </div>

    <div className="space-y-4">
      <FormField label="Recipient Name" name="recipientName" required>
        <Input id="recipientName" />
      </FormField>

      <FormField label="Recipient Email" name="recipientEmail" required>
        <Input id="recipientEmail" type="email" />
      </FormField>
    </div>
  </div>

  {/* Divider */}
  <Separator />

  {/* Section 2: Link Settings */}
  <div className="space-y-4">
    <div>
      <h2 className="text-lg font-semibold text-zinc-900">Link Settings</h2>
      <p className="text-sm text-zinc-500 mt-1">
        Configure how long this link will be active
      </p>
    </div>

    {/* Grouped fields (card style) */}
    <div className="bg-zinc-50 rounded-lg p-6 space-y-4">
      <FormField label="Expiration Date" name="expirationDate" required>
        <Input id="expirationDate" type="date" />
      </FormField>

      <FormField label="Maximum Views" name="maxViews">
        <Input id="maxViews" type="number" placeholder="Unlimited" />
      </FormField>
    </div>
  </div>

  {/* Section 3: Customization (Progressive Disclosure) */}
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-900">Customization</h2>
      <Badge variant="secondary">Optional</Badge>
    </div>

    <Collapsible open={showCustomization} onOpenChange={setShowCustomization}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between">
          <span>Add personalized message</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            showCustomization && "rotate-180"
          )} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
        <FormField label="Message" name="message">
          <Textarea id="message" rows={4} />
        </FormField>

        <FormField label="Message Color" name="messageColor">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </CollapsibleContent>
    </Collapsible>
  </div>

  {/* Form actions */}
  <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200">
    <Button variant="ghost" type="button" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="secondary" type="button" onClick={onSaveDraft}>
      Save Draft
    </Button>
    <Button variant="default" type="submit">
      Create Link
    </Button>
  </div>
</form>

// Conditional field (appears based on checkbox)
const [enableExpiration, setEnableExpiration] = useState(false)

<div className="space-y-4">
  <div className="flex items-center gap-2">
    <Checkbox
      id="enableExpiration"
      checked={enableExpiration}
      onCheckedChange={setEnableExpiration}
    />
    <Label htmlFor="enableExpiration">Set expiration date</Label>
  </div>

  {enableExpiration && (
    <div className="animate-in slide-in-from-top-2 duration-200">
      <FormField label="Expiration Date" name="expirationDate" required>
        <Input id="expirationDate" type="date" />
      </FormField>
    </div>
  )}
</div>
```

**Accessibility:**
- Logical field order: Tab order follows visual order
- Section headings: Use semantic `<h2>`, `<h3>` (not just styled divs)
- Grouped fields: `<fieldset>` and `<legend>` for semantic grouping
- Progressive disclosure: `aria-expanded` on trigger
- Conditional fields: Announced when appear (`aria-live="polite"`)
- Skip links: Optional for very long forms ("Skip to submission")

**Mobile adaptations:**
- Single column already mobile-optimized
- Section headings remain prominent
- Grouped cards: Reduced padding on mobile (`p-4` instead of `p-6`)
- Collapsible sections: Touch-friendly trigger size
- Form actions: Stack vertically or full-width on mobile

**Rationale:**
Single column layout prevents confusion and works perfectly on all screen sizes. Grouping related fields reduces cognitive load. Progressive disclosure keeps forms short and focused. Adequate spacing improves scannability. Section headings provide clear mental model of form structure.

**Anti-patterns:**
- ❌ Multi-column forms (confusing tab order, mobile issues)
- ❌ No grouping of related fields (overwhelming)
- ❌ All fields visible regardless of relevance (long, intimidating)
- ❌ Insufficient spacing (cramped, hard to scan)
- ❌ No section headings (unclear form structure)
- ❌ Form wider than readable width (>800px)

---

### Rule 3.7: Placeholder Text Usage

**When to use:**
- Provide examples of expected format
- Clarify ambiguous inputs
- Show sample data (not instructions)
- NEVER as replacement for labels

**How it works:**
- Placeholder text is light gray, disappears when typing starts
- Should be example data, not instructions
- Short and concise (5-7 words max)
- Not required for obvious fields (e.g., "Email" field doesn't need "Enter email")

**Visual specification:**
- Color: `#a1a1aa` (zinc-400) - light enough to distinguish from actual input
- Font style: `normal` (not italic - reduces readability)
- Text: Example data that matches expected format
- Disappears: On focus or first character typed

**Component mapping:**
- Native input `placeholder` attribute
- shadcn/ui Input component

**Code example:**
```tsx
// Good placeholder usage (examples)
<Input
  type="email"
  placeholder="name@example.com"
  aria-label="Email address"
/>

<Input
  type="tel"
  placeholder="5551234567"
  aria-label="Phone number"
/>

<Input
  type="url"
  placeholder="https://linkedin.com/in/yourname"
  aria-label="LinkedIn profile URL"
/>

<Textarea
  placeholder="Hi [Name], I'd love to discuss this opportunity with you..."
  aria-label="Personalized message"
  rows={4}
/>

<Input
  type="text"
  placeholder="Software Engineer"
  aria-label="Job title"
/>

// Bad placeholder usage ❌
<Input
  placeholder="Enter your email address" // Instruction, not example
/>

<Input
  placeholder="This field is required" // Instructions belong in help text
/>

<Input
  placeholder="Email" // Label, not placeholder
/>

// No placeholder needed (obvious fields)
<div className="space-y-2">
  <Label htmlFor="name">First Name</Label>
  <Input
    id="name"
    type="text"
    // No placeholder - "First Name" is self-explanatory
  />
</div>

// Placeholder vs Help Text (both together)
<div className="space-y-2">
  <Label htmlFor="website">Website URL</Label>
  <p className="text-sm text-zinc-500">
    Include the full URL starting with https://
  </p>
  <Input
    id="website"
    type="url"
    placeholder="https://www.example.com"
  />
</div>
```

**Accessibility:**
- `aria-label` or visible label: Placeholder never replaces label
- `placeholder` attribute: Not announced as label by screen readers
- Color contrast: Placeholder meets WCAG AA (4.5:1 ratio with background)
- Disappears on focus: Don't rely on placeholder for critical info
- Always pair with label: `<Label>` or `aria-label`

**Mobile adaptations:**
- Same color and styling
- Readable on smaller screens (14px min font size)
- Native keyboard types: Placeholder reinforces expected format

**Rationale:**
Placeholders provide helpful examples without cluttering UI with additional text. Disappearing on focus is standard behavior users expect. Light gray color clearly distinguishes placeholder from actual input. Examples (not instructions) help users understand format expectations.

**Anti-patterns:**
- ❌ Placeholder as label (disappears, inaccessible)
- ❌ Instructions in placeholder ("Enter your email", "Required field")
- ❌ Long placeholder text (truncated, unreadable)
- ❌ Placeholder that doesn't match expected format
- ❌ Placeholder for every field (unnecessary, cluttered)
- ❌ Dark placeholder color (looks like pre-filled value)

---

### Rule 3.8: Form Submission & Actions

**When to use:**
- Every form must have clear submission action
- Supporting actions (cancel, save draft) positioned consistently
- Loading states during submission
- Success/error feedback after submission

**How it works:**
- Primary submit button positioned bottom-right
- Secondary actions (cancel, save draft) positioned left of submit
- Button hierarchy: Cancel (ghost), Save Draft (secondary), Submit (primary)
- Loading state disables form during submission
- Success redirects or shows confirmation
- Errors focus first error field

**Visual specification:**
- Action container: `flex gap-3 justify-end` (right-aligned)
- Spacing: `pt-6 border-t border-zinc-200` (visual separator)
- Button order: Cancel → Save Draft → Submit (left to right)
- Mobile: Stack vertically (Submit on top for thumb reach)
- Form during submit: All fields disabled, submit button shows loading spinner

**Component mapping:**
- Button components with variants
- Form submission handler with loading state
- Toast or redirect for success feedback

**Code example:**
```tsx
// Standard form submission
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (data: FormData) => {
  setIsSubmitting(true)
  try {
    await createLink(data)
    toast.success("Link created successfully")
    router.push("/dashboard/links")
  } catch (error) {
    toast.error("Failed to create link", {
      description: error.message,
      action: {
        label: "Retry",
        onClick: () => handleSubmit(data)
      }
    })
  } finally {
    setIsSubmitting(false)
  }
}

<form onSubmit={handleSubmit(onSubmit)}>
  {/* Form fields */}
  <div className="space-y-4">
    {/* ... fields ... */}
  </div>

  {/* Form actions */}
  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-6 border-t border-zinc-200">
    <Button
      type="button"
      variant="ghost"
      onClick={onCancel}
      disabled={isSubmitting}
    >
      Cancel
    </Button>

    <Button
      type="button"
      variant="secondary"
      onClick={handleSaveDraft}
      disabled={isSubmitting}
    >
      {isDraftSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Draft"
      )}
    </Button>

    <Button
      type="submit"
      variant="default"
      disabled={isSubmitting || !isFormValid}
      className="sm:min-w-[120px]"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        "Create Link"
      )}
    </Button>
  </div>
</form>

// Form with validation on submit
const onSubmit = async (data: FormData) => {
  // Trigger validation for all fields
  const isValid = await form.trigger()

  if (!isValid) {
    // Get first error field
    const firstErrorField = Object.keys(form.formState.errors)[0]

    // Focus first error
    const element = document.getElementById(firstErrorField)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Show error summary toast
    toast.error("Please fix the errors in the form", {
      description: `${Object.keys(form.formState.errors).length} field(s) need attention`
    })

    return
  }

  // Proceed with submission
  setIsSubmitting(true)
  // ... submission logic
}

// Autosave draft (progressive enhancement)
const { watch } = useForm()
const formValues = watch()

useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (isDirty) {
      saveDraft(formValues)
    }
  }, 2000) // 2 second debounce

  return () => clearTimeout(timeoutId)
}, [formValues, isDirty])

{isDraftSaved && (
  <p className="text-sm text-zinc-500 flex items-center gap-2">
    <CheckCircle2 className="h-4 w-4 text-green-500" />
    Draft saved automatically
  </p>
)}

// Unsaved changes warning
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty && !isSubmitting) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}, [isDirty, isSubmitting])
```

**Accessibility:**
- Submit button: `type="submit"` for form submission
- Secondary actions: `type="button"` to prevent accidental submit
- Disabled state: All form fields during submission
- `aria-busy="true"`: On form during submission
- Focus management: Return focus to appropriate element after success/error
- Error announcement: `aria-live="assertive"` for submission errors
- Keyboard: Enter key submits form from any field

**Mobile adaptations:**
- Buttons stack vertically: `flex-col-reverse` (submit on top)
- Full-width buttons: Better for thumb reach
- Submit button larger: `size="lg"` on mobile
- Adequate spacing: `gap-4` between stacked buttons
- Sticky submit: Optional sticky bottom bar for long forms

**Rationale:**
Right-aligned buttons follow natural reading flow (LTR languages). Button hierarchy guides users to primary action. Loading state prevents double-submission and provides feedback. Success confirmation builds trust. Error handling with focus management helps users recover quickly. Autosave draft reduces data loss anxiety.

**Anti-patterns:**
- ❌ Submit button on left (contradicts reading flow)
- ❌ No loading state during submission (users click multiple times)
- ❌ Submit button doesn't disable during submission
- ❌ No success confirmation (users unsure if action completed)
- ❌ Error without focusing error field (users must hunt for problem)
- ❌ Losing form data on navigation (no draft save)
- ❌ Cancel button same visual weight as submit (confusing hierarchy)

---

## 4. Modal & Dialog Patterns

### Overview
Modals and dialogs interrupt user flow to focus attention on critical actions or information. cv-hub uses modals sparingly - only for decisions that cannot be inline, confirmations of destructive actions, or complex interactions requiring focused context.

### Design Principles Alignment
- **Speed:** Quick to open, quick to dismiss (Escape key always works)
- **Guidance:** Clear primary action, obvious way to close
- **Flexibility:** User can always cancel or dismiss (except critical alerts)
- **Feedback:** Modal purpose clear from title and content
- **Trust:** Never trap users, always provide exit path

---

### Rule 4.1: When to Use Modals vs Inline

**When to use modals:**
- Destructive action confirmations (delete, deactivate)
- Critical decisions requiring full attention (data loss prevention)
- Multi-step flows contained in one context (wizard)
- Form that's secondary to page purpose (quick add item)
- Error states requiring acknowledgment (authentication failure)

**When to use inline patterns:**
- Primary form on page (create new link - should be page, not modal)
- Reading content (help text, documentation - use drawer or separate page)
- Non-critical notifications (use toast or banner)
- Progressive disclosure (collapsible sections, accordions)
- Editing existing content (inline edit mode)

**Decision matrix:**

| Use Case | Pattern | Rationale |
|----------|---------|-----------|
| Delete link | Modal (AlertDialog) | Destructive, needs confirmation |
| Create new link | Page (not modal) | Primary task, needs focus |
| Quick view link details | Modal (Dialog) | Secondary, doesn't change data |
| Edit link name | Inline edit | Simple change, no context switch |
| Upload CV | Page or Modal | Depends: Primary flow = page, quick add = modal |
| View help text | Tooltip or Popover | Supplementary info, non-blocking |
| Multi-step wizard | Modal with steps | Contained flow, doesn't need full page |
| Authentication error | Modal (AlertDialog) | Critical, needs acknowledgment |
| Settings panel | Page (not modal) | Complex, needs dedicated space |

**Visual specification:**
- Modal backdrop: `bg-zinc-900/50` (semi-transparent black overlay)
- Modal animation: Fade in backdrop (150ms) + scale up content (200ms)
- Dismissal: Click backdrop, press Escape, click Close button
- Z-index: `z-50` (above all other content)

**Component mapping:**
- shadcn/ui Dialog: Standard modals
- shadcn/ui AlertDialog: Destructive confirmations
- shadcn/ui Sheet: Side drawers (mobile navigation, settings)
- Custom Modal wrapper for consistent behavior

**Code example:**
```tsx
// Standard modal (view details)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="ghost">View Details</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Link Details</DialogTitle>
      <DialogDescription>
        View information about this CV link
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="default" onClick={() => setIsOpen(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Alert dialog (destructive confirmation)
<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Link?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. The link will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={onDelete}
        className="bg-red-500 hover:bg-red-600"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Accessibility:**
- `role="dialog"` or `role="alertdialog"`: Semantic modal
- `aria-modal="true"`: Indicates modal overlay
- `aria-labelledby`: Links to dialog title
- `aria-describedby`: Links to dialog description
- Focus trap: Focus stays within modal (Tab cycles through modal elements)
- Focus management: First focusable element receives focus on open
- Escape key: Always closes modal (except critical alerts needing explicit action)
- Return focus: Focus returns to trigger element on close

**Mobile adaptations:**
- Full-screen or near-full-screen modals
- Sheet (slide from bottom) preferred for mobile
- Safe area padding: Account for notch/home indicator
- Touch dismiss: Swipe down to dismiss (Sheet component)

**Rationale:**
Modals interrupt flow, so use only when interruption is beneficial (prevents errors, focuses attention). Primary tasks deserve dedicated pages, not modals. Inline patterns reduce context switching and maintain flow. Clear decision matrix prevents modal overuse.

**Anti-patterns:**
- ❌ Modal for primary page action (creates friction)
- ❌ Modal within modal (nested modals are confusing)
- ❌ Modal that can't be dismissed (traps users)
- ❌ Modal for long-form content (reading/scrolling issues)
- ❌ Using modal when inline pattern would work (unnecessary interruption)

---

### Rule 4.2: Modal Structure & Anatomy

**When to use:**
- Every modal must follow this consistent structure
- Predictable layout helps users understand modal purpose
- Clear hierarchy guides users to primary action

**Modal anatomy (top to bottom):**
1. **Close button** (top-right corner, always visible)
2. **Header** (title + optional description)
3. **Content** (scrollable if needed)
4. **Footer** (actions, right-aligned)

**Visual specification:**

**Overall modal:**
- Background: `bg-white` (zinc-50 for less critical modals)
- Border radius: `rounded-lg` (12px)
- Shadow: `shadow-xl` (deep shadow for elevation)
- Max width: `max-w-md` (448px) for standard, `max-w-2xl` (672px) for complex
- Padding: `p-6` (header), `p-6` (content), `p-6` (footer)
- Backdrop: `bg-zinc-900/50` (50% opacity black)

**Close button:**
- Position: `absolute top-4 right-4`
- Icon: `X` (lucide-react), `h-4 w-4`
- Button: Ghost variant, `h-8 w-8` (square)
- Color: `text-zinc-400 hover:text-zinc-600`
- ARIA: `aria-label="Close dialog"`

**Header:**
- Title: `text-lg font-semibold text-zinc-900`
- Description: `text-sm text-zinc-500 mt-2`
- Spacing: `pb-4 border-b border-zinc-200` (optional divider)

**Content:**
- Spacing: `py-4` (between header and footer)
- Scrollable: `max-h-[60vh] overflow-y-auto` if content exceeds viewport
- Padding: Content scrolls, padding remains fixed

**Footer:**
- Alignment: `flex gap-3 justify-end` (right-aligned)
- Border: `pt-4 border-t border-zinc-200` (optional divider)
- Button order: Cancel → Secondary → Primary (left to right)

**Component mapping:**
- shadcn/ui Dialog components (DialogContent, DialogHeader, DialogTitle, etc.)
- Custom modal wrapper for consistent structure

**Code example:**
```tsx
// Complete modal structure
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-md">
    {/* Close button (automatic in shadcn/ui DialogContent) */}

    {/* Header */}
    <DialogHeader>
      <DialogTitle>Create New Link</DialogTitle>
      <DialogDescription>
        Generate a personalized CV link for this recipient
      </DialogDescription>
    </DialogHeader>

    {/* Content (scrollable if needed) */}
    <div className="py-4 space-y-4">
      <FormField label="Recipient Name" name="name" required>
        <Input id="name" />
      </FormField>
      <FormField label="Recipient Email" name="email" required>
        <Input id="email" type="email" />
      </FormField>
      {/* More fields... */}
    </div>

    {/* Footer */}
    <DialogFooter>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </Button>
      <Button
        variant="default"
        onClick={handleSubmit}
      >
        Create Link
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Scrollable content example
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogDescription>
        How we handle your data
      </DialogDescription>
    </DialogHeader>

    {/* Scrollable content */}
    <div className="py-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-4 pr-4">
        <p className="text-sm text-zinc-700">
          {/* Long content... */}
        </p>
      </div>
    </div>

    <DialogFooter>
      <Button variant="default" onClick={() => setIsOpen(false)}>
        I Understand
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Alert dialog structure (destructive)
<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Link?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. The link will be permanently deleted
        and all associated data will be lost.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={onDelete}
        className="bg-red-500 hover:bg-red-600"
      >
        Delete Permanently
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Accessibility:**
- Header IDs: `DialogTitle` and `DialogDescription` have IDs for ARIA linking
- `aria-labelledby`: Modal content references title ID
- `aria-describedby`: Modal content references description ID
- Focus order: Close button → Content → Footer actions
- Escape key: Closes modal (focus returns to trigger)
- Screen reader: "Dialog. Create New Link. Generate a personalized CV link..."

**Mobile adaptations:**
- Full width: `max-w-full mx-4` on mobile
- Reduced padding: `p-4` instead of `p-6`
- Full-screen for complex modals: `h-full` on mobile
- Sheet variant: Slide from bottom preferred (easier thumb reach)

**Rationale:**
Consistent structure creates predictability. Close button in top-right is universal convention. Header provides context before content. Footer actions right-aligned follow reading flow. Scrollable content prevents modal from growing beyond viewport.

**Anti-patterns:**
- ❌ No close button (users feel trapped)
- ❌ Close button moves or hidden (frustrating)
- ❌ No header/title (unclear modal purpose)
- ❌ Actions in header (breaks convention)
- ❌ Left-aligned footer actions (contradicts reading flow)
- ❌ Non-scrollable content that overflows (unusable)

---

### Rule 4.3: Modal Sizes

**When to use:**
- Choose modal size based on content complexity and form length
- Consistent sizes create predictable experiences
- Larger isn't always better (use smallest effective size)

**Size options:**

**Small (`max-w-sm` / 384px):**
- Simple confirmations (1-2 sentences)
- Single-field forms (quick input)
- Alert messages
- Examples: "Are you sure?", "Enter password to continue"

**Medium (`max-w-md` / 448px) - DEFAULT:**
- Standard forms (3-5 fields)
- Most confirmations and dialogs
- Short content with actions
- Examples: "Delete confirmation", "Create link form"

**Large (`max-w-lg` / 512px):**
- Forms with 5-8 fields
- Content with supporting information
- Multi-section dialogs
- Examples: "Edit profile", "Filter options"

**Extra Large (`max-w-2xl` / 672px):**
- Complex forms (8+ fields)
- Content requiring width (tables, code)
- Multi-step wizards
- Examples: "Import CV wizard", "Advanced settings"

**Full-screen:**
- Very complex interfaces (rare)
- Mobile-only (Sheet component)
- Examples: "Customize CV theme" (mobile), "Full editor"

**Visual specification:**
- Small: `sm:max-w-sm` (384px)
- Medium: `sm:max-w-md` (448px)
- Large: `sm:max-w-lg` (512px)
- XL: `sm:max-w-2xl` (672px)
- Responsive prefix: `sm:` breakpoint ensures full-width on mobile

**Component mapping:**
- shadcn/ui Dialog with className override
- Custom size prop wrapper

**Code example:**
```tsx
// Small modal (simple confirmation)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-sm">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to deactivate this link?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="default" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Medium modal (standard form) - DEFAULT
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Create Link</DialogTitle>
      <DialogDescription>
        Enter recipient details
      </DialogDescription>
    </DialogHeader>
    <div className="py-4 space-y-4">
      <FormField label="Name" name="name" required>
        <Input id="name" />
      </FormField>
      <FormField label="Email" name="email" required>
        <Input id="email" type="email" />
      </FormField>
      <FormField label="Message" name="message">
        <Textarea id="message" rows={3} />
      </FormField>
    </div>
    <DialogFooter>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="default" onClick={onSubmit}>
        Create
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Large modal (complex form)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Advanced Filters</DialogTitle>
      <DialogDescription>
        Customize your search criteria
      </DialogDescription>
    </DialogHeader>
    <div className="py-4 space-y-6">
      {/* Multiple sections with 5-8 fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Date Range</h3>
        {/* Date fields */}
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Status</h3>
        {/* Status filters */}
      </div>
    </div>
    <DialogFooter>
      <Button variant="ghost" onClick={onReset}>
        Reset
      </Button>
      <Button variant="default" onClick={onApply}>
        Apply Filters
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Extra large modal (wizard)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>Import CV</DialogTitle>
      <DialogDescription>
        Step {currentStep} of 3 - Upload and extract your CV data
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Multi-step content with preview */}
      {currentStep === 1 && <UploadStep />}
      {currentStep === 2 && <ExtractStep />}
      {currentStep === 3 && <ReviewStep />}
    </div>
    <DialogFooter>
      {currentStep > 1 && (
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      )}
      <Button variant="default" onClick={onNext}>
        {currentStep === 3 ? "Finish" : "Next"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Accessibility:**
- Modal size doesn't affect accessibility requirements
- Ensure content fits within viewport (scrollable if needed)
- Touch targets remain adequate regardless of modal size
- Screen reader navigation same across all sizes

**Mobile adaptations:**
- All sizes become full-width on mobile (`max-w-full`)
- Height adapts to content (max-h-[90vh])
- Sheet component preferred for mobile (slides from bottom)
- Full-screen only for complex interactions

**Rationale:**
Consistent sizes create predictable experiences. Smaller modals feel lighter and less interrupting. Larger modals prevent cramped layouts for complex content. Default medium size works for 80% of cases.

**Anti-patterns:**
- ❌ Tiny modal with cramped content (hard to read/interact)
- ❌ Huge modal for simple confirmation (overwhelming)
- ❌ Custom widths for every modal (inconsistent)
- ❌ Modal wider than viewport (requires horizontal scroll)
- ❌ Choosing large size "just in case" (wasteful whitespace)

---

### Rule 4.4: Modal Actions & Button Placement

**When to use:**
- Every modal needs clear actions
- Button hierarchy guides users to primary action
- Consistent placement reduces cognitive load

**Action types:**
1. **Primary action:** Main goal of modal (Create, Save, Confirm, Delete)
2. **Secondary action:** Alternative path (Save Draft, Export)
3. **Cancel/Dismiss:** Exit without action (Cancel, Close, Go Back)

**Button placement rules:**
- **Position:** Right-aligned in footer
- **Order:** Cancel/Dismiss → Secondary → Primary (left to right)
- **Spacing:** `gap-3` (12px) between buttons
- **Mobile:** Stack vertically, Primary on top (thumb reach)

**Visual specification:**
- Footer container: `flex gap-3 justify-end`
- Mobile: `flex-col-reverse gap-3` (reverses order so Primary on top)
- Button variants: Cancel (ghost), Secondary (secondary), Primary (default/destructive)
- Minimum width: `min-w-[80px]` for primary action (prevents tiny buttons)
- Full-width mobile: `w-full sm:w-auto` (optional, context-dependent)

**Component mapping:**
- DialogFooter component with flex layout
- Button components with appropriate variants
- Responsive classes for mobile stacking

**Code example:**
```tsx
// Standard modal actions (primary + cancel)
<DialogFooter>
  <Button variant="ghost" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="default" onClick={onSubmit}>
    Create Link
  </Button>
</DialogFooter>

// Three actions (cancel + secondary + primary)
<DialogFooter>
  <Button variant="ghost" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="secondary" onClick={onSaveDraft}>
    Save Draft
  </Button>
  <Button variant="default" onClick={onPublish}>
    Publish
  </Button>
</DialogFooter>

// Destructive action (AlertDialog)
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction
    onClick={onDelete}
    className="bg-red-500 hover:bg-red-600"
  >
    Delete Permanently
  </AlertDialogAction>
</AlertDialogFooter>

// Single action modal (informational)
<DialogFooter>
  <Button variant="default" onClick={() => setIsOpen(false)}>
    Got It
  </Button>
</DialogFooter>

// Mobile-optimized full-width actions
<DialogFooter className="flex-col-reverse sm:flex-row gap-3">
  <Button
    variant="ghost"
    onClick={onCancel}
    className="w-full sm:w-auto"
  >
    Cancel
  </Button>
  <Button
    variant="default"
    onClick={onSubmit}
    className="w-full sm:w-auto"
  >
    Create Link
  </Button>
</DialogFooter>

// Loading state in modal action
<DialogFooter>
  <Button
    variant="ghost"
    onClick={onCancel}
    disabled={isLoading}
  >
    Cancel
  </Button>
  <Button
    variant="default"
    onClick={onSubmit}
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Creating...
      </>
    ) : (
      "Create Link"
    )}
  </Button>
</DialogFooter>
```

**Accessibility:**
- Focus order: Cancel → Secondary → Primary (left to right)
- Default focus: Primary action receives focus on modal open (or Cancel for destructive)
- Enter key: Activates focused button
- Escape key: Equivalent to Cancel/Dismiss
- `type="button"`: All modal buttons (prevents form submission if modal inside form)
- Screen reader: Buttons announced with role and label

**Mobile adaptations:**
- Stack vertically: `flex-col-reverse` (Primary on top)
- Full-width buttons: `w-full` for better thumb reach
- Spacing: `gap-3` or `gap-4` between stacked buttons
- Larger touch targets: Consider `size="lg"` for primary action

**Rationale:**
Right-aligned actions follow natural reading flow (LTR languages). Button order from low to high importance guides eye movement toward primary action. Cancel on left provides safe "escape hatch" without accidental clicks on primary. Mobile stacking with primary on top optimizes for thumb reach.

**Anti-patterns:**
- ❌ Primary action on left (contradicts reading flow)
- ❌ Cancel button same visual weight as primary (confusing)
- ❌ Too many actions (>3 creates decision paralysis)
- ❌ Destructive primary action without clear warning (dangerous)
- ❌ No cancel option (users feel trapped)
- ❌ Actions in header or content area (breaks convention)

---

(Continuing with remaining Modal rules, then sections 5-12...)