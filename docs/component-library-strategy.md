# Component Library Strategy - cv-hub

**Project:** cv-hub - Privacy-focused CV management system
**Design System:** shadcn/ui (Radix UI primitives + Tailwind CSS)
**Design Direction:** Professional Modern
**Generated:** 2025-11-04
**Status:** Final Specification

---

## Table of Contents

1. [Overview](#overview)
2. [Part 1: shadcn/ui Components](#part-1-shadcnui-components-out-of-the-box)
3. [Part 2: Custom Components](#part-2-custom-components-to-develop)
4. [Part 3: Component States Matrix](#part-3-component-states-matrix)
5. [Part 4: Journey-to-Component Mapping](#part-4-journey-to-component-mapping)
6. [Part 5: Component Hierarchy & Composition](#part-5-component-hierarchy--composition)
7. [Part 6: Accessibility Requirements](#part-6-accessibility-requirements)
8. [Part 7: Implementation Guidance](#part-7-implementation-guidance)
9. [Part 8: Summary & Priorities](#part-8-summary--priorities)

---

## Overview

This document provides a comprehensive component library strategy for cv-hub, specifying which components to use from shadcn/ui and which custom components need development. All components reflect the **Professional Modern** design direction with:

- Single-column, card-based layouts
- Top navigation (sticky)
- Medium density with generous whitespace
- Progressive disclosure (inline expansion)
- Subtle elevation (shadow-sm → shadow-md on hover)
- Orange accents for CTAs, links, active states
- Monochrome base (zinc grays)

**Tech Stack:** React 19, Vite, TanStack Router, Tailwind CSS, shadcn/ui

**Color Theme:** Minimalist Energy
- Primary: `#f97316` (orange-500)
- Text: `#18181b` (zinc-900), `#71717a` (zinc-500)
- Backgrounds: `#ffffff`, `#fafafa`, `#f4f4f5`
- Borders: `#e4e4e7` (zinc-200)

---

## Part 1: shadcn/ui Components (Out-of-the-Box)

These components can be used directly from shadcn/ui with minimal customization.

---

### Button

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Variants Used:**
- `default` - Primary actions (orange background `#f97316`, white text)
- `secondary` - Supporting actions (white background, orange border/text)
- `ghost` - Tertiary actions (transparent, orange text on hover)
- `destructive` - Delete/remove actions (red background `#ef4444`, white text)

**Sizes:**
- `sm` - Compact spaces (table actions, mobile CTAs)
- `default` - Standard size (most buttons)
- `lg` - Primary CTAs (hero sections, major actions)

**Usage in Journeys:**
- **Journey 1 (Public):** "Show More" (ghost), LinkedIn/GitHub links (secondary)
- **Journey 2 (Invited):** "Get in Touch" (default), Contact buttons (secondary)
- **Journey 3 (Admin):** "Create Link" (default), "Copy URL" (secondary), "Delete" (destructive), "Deactivate" (ghost)
- **Journey 4 (Admin CV):** "Upload CV" (default), "Publish" (default), "Cancel" (ghost), "Save Draft" (secondary)

**States:**
- Default
- Hover (darker orange `#ea580c`, subtle lift)
- Active (pressed state, darker)
- Focus (orange ring `ring-orange-500`)
- Disabled (opacity 50%, not interactive)
- Loading (spinner icon, disabled state)

**Customization Notes:**
- Orange primary color already matches theme
- Loading state: Add spinner icon with `lucide-react`
- Focus: Orange ring (`ring-2 ring-orange-500 ring-offset-2`)
- Smooth transitions: `transition-colors duration-200`

**TypeScript Example:**
```tsx
<Button variant="default" size="lg">Get in Touch</Button>
<Button variant="secondary" size="default">View on LinkedIn</Button>
<Button variant="ghost" size="sm">Show More</Button>
<Button variant="destructive" size="default">Delete Link</Button>
```

---

### Card

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Variants Used:**
- `default` - Standard card with border and shadow
- Custom variants created via className prop

**Components:**
- `Card` - Main container
- `CardHeader` - Header section (optional)
- `CardTitle` - Title text
- `CardDescription` - Subtitle/description
- `CardContent` - Main content area
- `CardFooter` - Footer section (optional, for actions)

**Usage in Journeys:**
- **Journey 1 (Public):** Project cards, experience cards, skills section container
- **Journey 2 (Invited):** Personalized message card, contact info card
- **Journey 3 (Admin):** Stats cards, link detail cards (mobile)
- **Journey 4 (Admin CV):** Upload zone container, review sections

**States:**
- Default (border zinc-200, shadow-sm, bg-white)
- Hover (shadow-md, subtle lift on interactive cards)
- Active/Selected (orange border `border-orange-500`)

**Customization Notes:**
- Base: `rounded-lg border border-zinc-200 bg-white shadow-sm`
- Hover transition: `transition-shadow duration-200 hover:shadow-md`
- Interactive cards: Add `cursor-pointer` for clickable cards
- Personalized message card: Custom orange accent (left border `border-l-4 border-orange-500`)

**TypeScript Example:**
```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Project details */}
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Show More</Button>
  </CardFooter>
</Card>
```

---

### Badge

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Variants Used:**
- `default` - Zinc background (neutral badges)
- `secondary` - Lighter zinc background
- `destructive` - Red background (error states)
- `outline` - Transparent with border
- Custom variants for status indicators

**Usage in Journeys:**
- **Journey 1 (Public):** Tech stack tags (on project cards)
- **Journey 2 (Invited):** "Invited Access" indicator (top-right), "Full Access" mini-badges on sections
- **Journey 3 (Admin):** Link status badges (Active/Expired/Deactivated), visit count indicators
- **Journey 4 (Admin CV):** Validation status badges (Error/Warning/Success)

**States:**
- Default (no hover state for static badges)
- Clickable badges: Hover effect (darker background)

**Customization Notes:**
- Base styling sufficient for most cases
- Status colors:
  - Active: Green background `bg-green-100 text-green-700`
  - Expired: Yellow background `bg-yellow-100 text-yellow-700`
  - Deactivated: Gray background `bg-zinc-200 text-zinc-600`
  - Invited Access: Orange tint `bg-orange-50 text-orange-700 border border-orange-200`

**TypeScript Example:**
```tsx
<Badge variant="default">React</Badge>
<Badge variant="outline">TypeScript</Badge>
<Badge className="bg-orange-50 text-orange-700 border-orange-200">
  Invited Access
</Badge>
```

---

### Input

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Variants Used:**
- Standard text input (default)
- Custom states via className

**Usage in Journeys:**
- **Journey 3 (Admin):** Recipient name/label input, search/filter inputs
- **Journey 4 (Admin CV):** File name display (read-only)

**States:**
- Default (border zinc-200)
- Focus (orange border `border-orange-500`, orange ring)
- Error (red border `border-red-500`, red background tint `bg-red-50`)
- Success (green border `border-green-500`, optional)
- Disabled (zinc-100 background, zinc-400 text, not editable)

**Customization Notes:**
- Focus state: `focus:border-orange-500 focus:ring-orange-500`
- Error state: Add `aria-invalid="true"` and `aria-describedby` for error messages
- Label association: Always use `<label>` with `htmlFor` attribute
- Validation icons: Add icon inside input (right side) for visual feedback

**TypeScript Example:**
```tsx
<div className="space-y-2">
  <Label htmlFor="recipient">Recipient Name</Label>
  <Input
    id="recipient"
    placeholder="e.g., Jane Doe - TechCorp Recruiter"
    className="focus:border-orange-500 focus:ring-orange-500"
  />
</div>
```

---

### Textarea

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Variants Used:**
- Standard multiline text input
- Custom styling for message input

**Usage in Journeys:**
- **Journey 3 (Admin):** Personalized message input (with character counter)
- **Journey 4 (Admin CV):** Notes/comments field (optional)

**States:**
- Same as Input component (default, focus, error, disabled)
- Resizable: Allow vertical resize only (`resize-y`)

**Customization Notes:**
- Min height: 120px for message input
- Max height: 300px (scrollable after)
- Character counter: Display below textarea (e.g., "245 / 500 characters")
- Markdown support hint: Small text below indicating markdown formatting available

**TypeScript Example:**
```tsx
<div className="space-y-2">
  <Label htmlFor="message">Personalized Message (Optional)</Label>
  <Textarea
    id="message"
    placeholder="Hey [Name], I'm excited to share..."
    className="min-h-[120px] resize-y"
    maxLength={500}
  />
  <p className="text-sm text-zinc-500">245 / 500 characters</p>
</div>
```

---

### Select

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `Select` - Root component
- `SelectTrigger` - Button to open dropdown
- `SelectContent` - Dropdown menu container
- `SelectItem` - Individual options
- `SelectValue` - Displays selected value

**Usage in Journeys:**
- **Journey 3 (Admin):** Template selection dropdown, expiration presets dropdown
- **Journey 4 (Admin CV):** Section selector (if editing specific sections)

**States:**
- Default (closed)
- Open (dropdown visible)
- Selected (highlighted item)
- Hover (item hover state)
- Disabled (entire select or individual items)

**Customization Notes:**
- Orange focus state on trigger
- Selected item: Orange background `bg-orange-50 text-orange-700`
- Max height for dropdown: 300px with scroll

**TypeScript Example:**
```tsx
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select expiration" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="7">7 days</SelectItem>
    <SelectItem value="30">30 days</SelectItem>
    <SelectItem value="90">90 days</SelectItem>
    <SelectItem value="never">Never expires</SelectItem>
  </SelectContent>
</Select>
```

---

### Dialog

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `Dialog` - Root component
- `DialogTrigger` - Button to open dialog
- `DialogContent` - Modal container
- `DialogHeader` - Header section
- `DialogTitle` - Modal title
- `DialogDescription` - Subtitle/context
- `DialogFooter` - Action buttons area

**Usage in Journeys:**
- **Journey 3 (Admin):** Create link modal, edit link modal, delete confirmation dialog
- **Journey 4 (Admin CV):** Publish confirmation dialog, error recovery dialogs

**States:**
- Closed (not visible)
- Open (modal visible, background overlay)
- Closing (fade-out animation)

**Customization Notes:**
- Overlay: Dark with opacity (`bg-black/50`)
- Modal max-width: 500px for forms, 800px for complex content
- Close button: Always visible (top-right X icon)
- Focus trap: Keep focus within modal when open
- Escape key: Close modal on ESC press

**TypeScript Example:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Create New Link</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Create Personalized Link</DialogTitle>
      <DialogDescription>
        Generate a new invite link with optional message and expiration.
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="default">Create Link</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Sheet

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `Sheet` - Root component
- `SheetTrigger` - Button to open sheet
- `SheetContent` - Slide-in panel container
- `SheetHeader` - Header section
- `SheetTitle` - Panel title
- `SheetDescription` - Subtitle/context
- `SheetFooter` - Action buttons area

**Usage in Journeys:**
- **Journey 1 (Public):** Mobile navigation menu (hamburger)
- **Journey 2 (Invited):** Mobile navigation menu, mobile contact CTA sheet
- **Journey 3 (Admin):** Mobile link actions sheet, mobile filters

**Variants:**
- `side="left"` - Slide from left (navigation)
- `side="right"` - Slide from right (settings, filters)
- `side="bottom"` - Slide from bottom (contact CTA, action sheets)

**States:**
- Closed
- Open (slides in with animation)
- Closing (slides out)

**Customization Notes:**
- Mobile navigation: Full height, side="left"
- Contact CTA sheet: Bottom sheet, rounded top corners
- Max-width on tablet: 400px for side sheets
- Dark overlay when open

**TypeScript Example:**
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="sm">
      <MenuIcon className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-[300px]">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    {/* Navigation links */}
  </SheetContent>
</Sheet>
```

---

### Table

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `Table` - Root table element
- `TableHeader` - Header row container
- `TableBody` - Body rows container
- `TableRow` - Individual row
- `TableHead` - Header cell
- `TableCell` - Body cell
- `TableCaption` - Optional caption

**Usage in Journeys:**
- **Journey 3 (Admin):** Link management table (recipient, created, expires, status, visits, actions)

**States:**
- Default (static table)
- Hover (row hover effect `hover:bg-zinc-50`)
- Sortable headers (with sort icons)
- Selected row (orange tint `bg-orange-50`)

**Customization Notes:**
- Responsive: Transform to card view on mobile (custom component wraps table)
- Sortable headers: Add clickable header with sort icons
- Pagination: Use shadcn/ui Pagination component below table
- Sticky header (optional): Header stays visible on scroll
- Action column: Right-aligned, compact buttons/icons

**TypeScript Example:**
```tsx
<Table>
  <TableCaption>List of active invite links</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Recipient</TableHead>
      <TableHead>Created</TableHead>
      <TableHead>Expires</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Visits</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-zinc-50">
      <TableCell>Jane Doe - TechCorp</TableCell>
      <TableCell>2025-10-15</TableCell>
      <TableCell>2025-11-15</TableCell>
      <TableCell>
        <Badge className="bg-green-100 text-green-700">Active</Badge>
      </TableCell>
      <TableCell className="text-right">12</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">Copy</Button>
        <Button variant="ghost" size="sm">Delete</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Dropdown Menu

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `DropdownMenu` - Root component
- `DropdownMenuTrigger` - Button to open menu
- `DropdownMenuContent` - Menu container
- `DropdownMenuItem` - Individual menu item
- `DropdownMenuSeparator` - Divider between items
- `DropdownMenuLabel` - Section label

**Usage in Journeys:**
- **Journey 3 (Admin):** Link actions dropdown (Copy, Edit, Deactivate, Delete)
- **Journey 4 (Admin CV):** Section selector dropdown, action menus

**States:**
- Closed
- Open (menu visible)
- Hover (item hover state `bg-zinc-100`)
- Disabled (specific items)

**Customization Notes:**
- Destructive actions: Red text color for delete items
- Icons: Add icons to menu items (left side)
- Keyboard navigation: Arrow keys, Enter to select
- Max-width: 220px for compact menus

**TypeScript Example:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreVerticalIcon className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-[180px]">
    <DropdownMenuItem>
      <CopyIcon className="mr-2 h-4 w-4" />
      Copy URL
    </DropdownMenuItem>
    <DropdownMenuItem>
      <EditIcon className="mr-2 h-4 w-4" />
      Edit Link
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-600">
      <TrashIcon className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Toast

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `Toast` - Individual toast notification
- `Toaster` - Container that manages toasts
- `useToast` - Hook to trigger toasts

**Variants:**
- `default` - Neutral notification
- `destructive` - Error/warning toast (red)
- Custom variants for success (green)

**Usage in Journeys:**
- **Journey 3 (Admin):** Success ("Link created!"), error ("Failed to create link"), undo actions ("Link deactivated" with Undo button)
- **Journey 4 (Admin CV):** Success ("CV published!"), validation errors, upload progress

**States:**
- Entering (fade + slide in)
- Visible (static)
- Exiting (fade + slide out)
- Dismissible (X button)

**Customization Notes:**
- Position: Bottom-right corner (desktop), bottom-center (mobile)
- Duration: 5 seconds default, persistent for undo actions
- Max visible: 3 toasts at once (stack)
- Action button: For undo operations ("Undo" button in toast)

**TypeScript Example:**
```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

// Success toast
toast({
  title: "Link created successfully!",
  description: "URL copied to clipboard.",
})

// Error toast
toast({
  variant: "destructive",
  title: "Failed to create link",
  description: "Please try again or contact support.",
})

// Undo toast
toast({
  title: "Link deactivated",
  action: <Button variant="outline" size="sm">Undo</Button>,
})
```

---

### Progress

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Usage in Journeys:**
- **Journey 4 (Admin CV):** AI extraction progress bar ("Uploading... Extracting... Processing...")

**States:**
- Determinate (0-100% progress)
- Indeterminate (loading animation, unknown duration)

**Customization Notes:**
- Orange fill color for progress bar (`bg-orange-500`)
- Background: Light zinc (`bg-zinc-200`)
- Smooth animation: `transition-all duration-300`
- Height: 8px (default) or 12px (larger for prominent progress)

**TypeScript Example:**
```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Extracting CV data...</span>
    <span>45%</span>
  </div>
  <Progress value={45} className="h-2" />
</div>
```

---

### Tooltip

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Components:**
- `Tooltip` - Root component
- `TooltipTrigger` - Element that triggers tooltip
- `TooltipContent` - Tooltip content

**Usage in Journeys:**
- **Journey 1 (Public):** Skill tags hover tooltips (years of experience, details)
- **Journey 3 (Admin):** Action button tooltips ("Copy URL", "Deactivate link")
- **Journey 4 (Admin CV):** Validation error explanations, icon tooltips

**States:**
- Hidden (default)
- Visible (on hover or focus)

**Customization Notes:**
- Delay: 300ms before showing
- Max-width: 250px for text wrapping
- Dark background: `bg-zinc-900 text-white`
- Small arrow pointing to trigger element
- Touch devices: Show on tap (not hover)

**TypeScript Example:**
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm">
      <InfoIcon className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Click to copy the invite URL to your clipboard</p>
  </TooltipContent>
</Tooltip>
```

---

### Avatar

**shadcn/ui Component:** Yes (use directly, optional)
**Version:** Latest

**Components:**
- `Avatar` - Container
- `AvatarImage` - Image element
- `AvatarFallback` - Fallback text/icon

**Usage in Journeys:**
- **Journey 1 (Public):** Hero section profile photo (optional)
- **Journey 2 (Invited):** Same as public view

**States:**
- Image loaded (shows photo)
- Image loading (shows fallback)
- No image (shows initials or icon)

**Customization Notes:**
- Size: 80px × 80px (hero section)
- Border: Optional subtle border `border border-zinc-200`
- Rounded: Full circle `rounded-full`
- Fallback: Initials with orange background

**TypeScript Example:**
```tsx
<Avatar className="h-20 w-20 border border-zinc-200">
  <AvatarImage src="/profile-photo.jpg" alt="Ruben" />
  <AvatarFallback className="bg-orange-100 text-orange-700">
    RD
  </AvatarFallback>
</Avatar>
```

---

### Separator

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Usage in Journeys:**
- **Journey 1 (Public):** Between CV sections (Skills / Projects / Experience)
- **Journey 2 (Invited):** Same as public view
- **Journey 3 (Admin):** Between dashboard sections

**Variants:**
- Horizontal (default)
- Vertical (for inline separation)

**Customization Notes:**
- Color: Zinc-200 (`bg-zinc-200`)
- Thickness: 1px (default)
- Section separators: Add orange accent line option (custom variant)
  - Gradient: `bg-gradient-to-r from-orange-500 via-zinc-200 to-zinc-200`

**TypeScript Example:**
```tsx
{/* Standard separator */}
<Separator className="my-8" />

{/* Custom orange accent separator */}
<Separator className="my-8 h-px bg-gradient-to-r from-orange-500 via-zinc-200 to-zinc-200" />
```

---

### Tabs

**shadcn/ui Component:** Yes (use if needed, optional)
**Version:** Latest

**Components:**
- `Tabs` - Root container
- `TabsList` - Tabs navigation
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab panel content

**Usage in Journeys:**
- **Journey 4 (Admin CV):** JSON view / Preview view tabs (mobile)
- **Potential use:** Skills filtering by category (Frontend / Backend / DevOps)

**States:**
- Inactive tab
- Active tab (orange indicator `border-b-2 border-orange-500`)
- Hover (subtle background)

**Customization Notes:**
- Active tab: Orange bottom border, orange text
- Smooth transition between tabs (fade content)
- Keyboard navigation: Arrow keys to switch tabs

**TypeScript Example:**
```tsx
<Tabs defaultValue="json">
  <TabsList>
    <TabsTrigger value="json">JSON</TabsTrigger>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="diff">Diff</TabsTrigger>
  </TabsList>
  <TabsContent value="json">
    {/* JSON editor */}
  </TabsContent>
  <TabsContent value="preview">
    {/* Visual preview */}
  </TabsContent>
  <TabsContent value="diff">
    {/* Diff view */}
  </TabsContent>
</Tabs>
```

---

### Label

**shadcn/ui Component:** Yes (use directly)
**Version:** Latest

**Usage in Journeys:**
- **Journey 3 (Admin):** Form field labels (recipient, message, expiration)
- **Journey 4 (Admin CV):** File upload label, section labels

**States:**
- Default
- Disabled (lighter color `text-zinc-400`)
- Error (red color `text-red-600`)

**Customization Notes:**
- Always associate with form input via `htmlFor` attribute
- Required indicator: Add red asterisk `<span className="text-red-500">*</span>`
- Font weight: Medium (`font-medium`)

**TypeScript Example:**
```tsx
<Label htmlFor="recipient" className="font-medium">
  Recipient Name <span className="text-red-500">*</span>
</Label>
<Input id="recipient" required />
```

---

## Part 2: Custom Components (To Develop)

These components need to be developed specifically for cv-hub.

---

### SkillTag

**Type:** Custom Component (extends Badge)

**Purpose:** Display a skill/technology with visual prominence and optional interactivity

**Anatomy:**
- Text label (skill name)
- Optional: Icon (technology logo from `lucide-react` or custom SVG)
- Background color (subtle zinc-100)
- Border (1px zinc-200)
- Hover state (orange border, subtle lift)

**Variants:**
- `primary` - Key skills (larger, more prominent: `text-base`, `px-4 py-2`)
- `secondary` - Supporting skills (standard size: `text-sm`, `px-3 py-1.5`)
- `category` - Category labels (different styling: bold text, darker background)

**States:**
- **Default:** `bg-zinc-100 text-zinc-900 border-zinc-200`
- **Hover:** Orange border (2px), subtle lift (`shadow-sm`, `transform scale-105`)
- **Active/Selected:** Orange background `bg-orange-500 text-white` (if filtering enabled)
- **Focus:** Orange ring for keyboard navigation

**Props:**
```typescript
interface SkillTagProps {
  name: string
  variant?: 'primary' | 'secondary' | 'category'
  icon?: React.ReactNode
  onClick?: () => void
  selected?: boolean
  experienceYears?: number // For tooltip
}
```

**Usage:**
- **Journey 1:** Skills section (20+ tags), scannable overview
- **Journey 2:** Skills section with experience levels shown in tooltips
- **Journey 4:** Extracted skills display in review interface

**Implementation Notes:**
- Use `cn()` utility for class composition
- Smooth transitions: `transition-all duration-200 ease-out`
- Touch-optimized: Minimum 44x44px tap target on mobile
- Keyboard accessible: Focusable if clickable, Enter/Space to activate
- Tooltip on hover: Show experience years if provided

**Example:**
```tsx
<SkillTag
  name="React"
  variant="primary"
  icon={<ReactIcon className="w-4 h-4" />}
  experienceYears={5}
/>
```

---

### ProjectCard

**Type:** Custom Component (wraps shadcn/ui Card)

**Purpose:** Display project information with expandable details (progressive disclosure)

**Anatomy:**
- Card container (shadcn/ui Card)
- Project title (H3, bold)
- Brief description (2-3 lines, zinc-600)
- Tech stack badges (horizontal list, SkillTag components)
- "Show More" / "Show Less" button (ghost variant)
- Expandable section (hidden by default):
  - Full description
  - Key achievements (bullet points)
  - Timeline
  - Company name (invited view only)
  - Business metrics (invited view only)

**Variants:**
- `collapsed` - Default state (brief info)
- `expanded` - Full details visible

**States:**
- **Default (Collapsed):** Brief info, "Show More" button visible
- **Hover:** Shadow lift (`shadow-sm` → `shadow-md`), subtle border color change
- **Expanded:** Full details visible, "Show Less" button, smooth height transition
- **Focus:** Orange border when keyboard focused

**Props:**
```typescript
interface ProjectCardProps {
  title: string
  briefDescription: string
  fullDescription: string
  techStack: string[]
  achievements: string[]
  timeline: string
  companyName?: string // Only shown in invited view
  businessMetrics?: string // Only shown in invited view
  thumbnail?: string // Optional project image
  isInvitedView?: boolean
}
```

**Usage:**
- **Journey 1:** 2-3 projects displayed, expandable inline
- **Journey 2:** 3-4 projects with full details (company names, metrics)
- **Journey 4:** Preview of extracted projects in CV review

**Implementation Notes:**
- Animation: Smooth height transition using Radix Collapsible or Framer Motion
- Duration: 300ms ease-in-out
- Content: Use `overflow-hidden` during transition
- Mobile: Full-width cards, vertical stack
- Desktop: Consider 2-column layout if space allows (max 1 column preferred for readability)
- Accessibility: `aria-expanded` attribute on button, announce state changes

**Example:**
```tsx
<ProjectCard
  title="E-commerce Platform Redesign"
  briefDescription="Redesigned checkout flow resulting in increased conversion rates."
  fullDescription="Led complete UX overhaul of checkout process..."
  techStack={['React', 'TypeScript', 'TailwindCSS', 'Stripe']}
  achievements={[
    '25% increase in conversion rate',
    'Reduced cart abandonment by 40%',
    'A/B tested 5 design variations'
  ]}
  timeline="Jan 2024 - Apr 2024"
  companyName="TechCorp GmbH"
  businessMetrics="Processed 100K+ transactions in first month"
  isInvitedView={true}
/>
```

---

### ExperienceCard

**Type:** Custom Component (wraps shadcn/ui Card)

**Purpose:** Display work experience with timeline and achievements

**Anatomy:**
- Card container
- Job title (H3, bold)
- Company name (secondary text, may be redacted in public view)
- Date range (tertiary text)
- Location (optional, city/country)
- Key highlights (bullet points, 3-5 items in public, 5-7 in invited)
- Optional: Expandable "More Details" section
- Timeline indicator (left border accent or connecting line)

**Variants:**
- `public` - Generic company name ("Leading Tech Company"), fewer details
- `invited` - Full company name, location, extended achievements

**States:**
- **Default:** Brief highlights visible
- **Hover:** Subtle shadow lift (optional, if interactive)
- **Expanded:** Full achievements visible (if collapsible)

**Props:**
```typescript
interface ExperienceCardProps {
  jobTitle: string
  companyName: string
  dateRange: string
  location?: string
  highlights: string[]
  extendedAchievements?: string[]
  isInvitedView?: boolean
}
```

**Usage:**
- **Journey 1:** 2-3 experiences, generic company names
- **Journey 2:** Complete work history with full company details

**Implementation Notes:**
- Timeline visual: Left border (4px orange for most recent, zinc-300 for older)
- Bullet points: Custom orange bullet icons or styled list
- Date formatting: "Jan 2024 - Present" format
- Mobile: Stack all elements vertically, timeline simplified
- Accessibility: Semantic HTML (`<article>` or `<section>`)

**Example:**
```tsx
<ExperienceCard
  jobTitle="Senior Full-Stack Engineer"
  companyName={isInvitedView ? "TechCorp GmbH" : "Leading Tech Company"}
  dateRange="Jan 2023 - Present"
  location="Berlin, Germany"
  highlights={[
    'Led development of microservices architecture',
    'Mentored 3 junior developers',
    'Reduced deployment time by 60%'
  ]}
  extendedAchievements={[
    'Implemented CI/CD pipeline with GitHub Actions',
    'Conducted technical interviews for 15+ candidates',
    'Presented at internal tech talks on React 19'
  ]}
  isInvitedView={true}
/>
```

---

### PersonalMessageCard

**Type:** Custom Component (special styling)

**Purpose:** Display personalized message from Ruben to invited recipient (hero integration)

**Anatomy:**
- Card container with special styling
- Greeting line ("Hey [Name],")
- Message body (markdown rendered)
- Signature ("— Ruben")
- Optional: Profile photo (small avatar)
- Subtle orange accent (left border or background tint)

**Variants:**
- `default` - Standard message display
- `collapsible` - Mobile variant with collapse/expand toggle

**States:**
- **Default:** Message fully visible
- **Collapsed (Mobile):** Message hidden, "Show Message" button visible
- **Expanded (Mobile):** Full message visible, "Hide Message" button

**Props:**
```typescript
interface PersonalMessageCardProps {
  recipientName: string
  messageBody: string // Markdown string
  senderName?: string // Default: "Ruben"
  senderAvatar?: string
  collapsible?: boolean // Enable mobile collapse
}
```

**Usage:**
- **Journey 2:** Hero section, above main CV content (if message provided)

**Implementation Notes:**
- Styling:
  - Background: Subtle orange tint `bg-orange-50` or gradient
  - Left border: 4px orange accent `border-l-4 border-orange-500`
  - Padding: Generous `p-6`
  - Border radius: `rounded-lg`
- Markdown rendering: Use library like `react-markdown` for formatting
- XSS protection: Sanitize HTML output from markdown
- Mobile collapsible: Use Radix Collapsible, save state in session storage
- Typography: Use professional-warm tone, avoid generic templates
- Signature styling: Italic, secondary color

**Example:**
```tsx
<PersonalMessageCard
  recipientName="Jane"
  messageBody="I'm excited to share my full profile with you! Looking forward to discussing how my experience in React and TypeScript could align with TechCorp's frontend needs."
  senderName="Ruben"
  collapsible={isMobile}
/>
```

---

### InvitedAccessBadge

**Type:** Custom Component (special badge)

**Purpose:** Subtle indicator that user is viewing personalized/invited CV

**Anatomy:**
- Small badge (top-right corner of hero section or fixed position)
- Text: "Invited Access" or "Personalized View"
- Icon: Optional checkmark or key icon
- Subtle styling (not intrusive)

**Variants:**
- `subtle` - Minimal, translucent background
- `prominent` - More visible, solid background

**States:**
- **Default:** Static, no interaction
- **Hover (optional):** Tooltip explaining invited access

**Props:**
```typescript
interface InvitedAccessBadgeProps {
  label?: string // Default: "Invited Access"
  variant?: 'subtle' | 'prominent'
  position?: 'top-right' | 'top-left' | 'inline'
  showTooltip?: boolean
}
```

**Usage:**
- **Journey 2:** Visible throughout invited view (sticky or in hero)

**Implementation Notes:**
- Positioning: Fixed top-right (with nav offset) or inline in hero
- Styling:
  - Subtle variant: `bg-orange-50/80 text-orange-700 border border-orange-200 backdrop-blur-sm`
  - Prominent variant: `bg-orange-100 text-orange-800 border-orange-300`
- Size: Small `text-xs px-2 py-1`
- Z-index: Ensure visible above other elements (z-50)
- Mobile: Smaller size, potentially different position
- Tooltip (optional): "You have full access to Ruben's complete profile"

**Example:**
```tsx
<InvitedAccessBadge
  label="Invited Access"
  variant="subtle"
  position="top-right"
  showTooltip={true}
/>
```

---

### StickyNav

**Type:** Custom Component (navigation bar)

**Purpose:** Persistent top navigation with section links and responsive menu

**Anatomy:**
- Container (sticky, top of viewport)
- Logo/Name (left side, links to top)
- Section links (center or right):
  - Skills
  - Projects
  - Experience
  - Education
  - Contact (invited view only)
- Mobile hamburger button (right side, opens Sheet)
- Optional: "Admin" link (only visible when logged in)

**Variants:**
- `public` - Public view links
- `invited` - Invited view links (includes Contact)
- `admin` - Admin-specific nav

**States:**
- **Default:** Transparent or subtle background
- **Scrolled:** Solid background with shadow (triggered after 50px scroll)
- **Active Link:** Orange underline or orange text color
- **Mobile:** Hamburger icon visible, links hidden

**Props:**
```typescript
interface StickyNavProps {
  variant?: 'public' | 'invited' | 'admin'
  currentSection?: string // For highlighting active link
  showAdminLink?: boolean
  logoText?: string // Default: "Ruben"
}
```

**Usage:**
- **Journey 1:** Always visible, allows quick navigation
- **Journey 2:** Same as public, plus Contact link
- **Journey 3 & 4:** Admin-specific nav with different links

**Implementation Notes:**
- Sticky positioning: `sticky top-0 z-50`
- Background transition: On scroll, fade in `bg-white/90 backdrop-blur-md shadow-sm`
- Smooth scroll: When clicking section links, smooth scroll to target
- Active section detection: Use Intersection Observer to highlight active link
- Mobile Sheet: Opens from left with section links
- Keyboard navigation: Tab through links, Enter to activate
- Accessibility: `<nav>` element with `aria-label="Main navigation"`

**Example:**
```tsx
<StickyNav
  variant="invited"
  currentSection="projects"
  showAdminLink={false}
  logoText="Ruben"
/>
```

---

### HeroSection

**Type:** Custom Component (hero/header)

**Purpose:** Above-the-fold section with name, title, tagline, and key skills

**Anatomy:**
- Container (centered, max-width)
- Optional: Profile photo (Avatar component)
- Name heading (H1, large, bold)
- Professional title (H2 or p, secondary text)
- Tagline/elevator pitch (1-2 sentences, zinc-600)
- Key skills (6-8 SkillTag components, prominent)
- Optional: PersonalMessageCard (invited view only)
- Scroll indicator (subtle down arrow animation)

**Variants:**
- `public` - Standard hero
- `invited` - Includes PersonalMessageCard above or integrated

**States:**
- **Default:** Static display
- **Loading:** Skeleton screens for content (during SSR hydration)

**Props:**
```typescript
interface HeroSectionProps {
  name: string
  title: string
  tagline: string
  keySkills: string[]
  avatarUrl?: string
  personalMessage?: PersonalMessageCardProps
  isInvitedView?: boolean
}
```

**Usage:**
- **Journey 1:** First thing users see, sets professional tone
- **Journey 2:** Includes personalized message card

**Implementation Notes:**
- Layout: Centered content, generous padding `py-16 md:py-24`
- Typography: Large name `text-5xl`, clear hierarchy
- Spacing: Generous whitespace between elements
- Skills: Horizontal layout (wrap on mobile), primary variant SkillTags
- Scroll indicator: Subtle animation (bounce or fade), disappears on scroll
- Mobile: Stack all elements vertically, smaller font sizes
- Background: Optional subtle gradient or texture

**Example:**
```tsx
<HeroSection
  name="Ruben"
  title="Senior Full-Stack Engineer"
  tagline="Building modern web applications with React, TypeScript, and a focus on exceptional user experiences."
  keySkills={['React', 'TypeScript', 'Node.js', 'TailwindCSS', 'PostgreSQL', 'Docker']}
  avatarUrl="/profile.jpg"
  personalMessage={personalMessageData}
  isInvitedView={true}
/>
```

---

### StatsCard

**Type:** Custom Component (metric display)

**Purpose:** Display key metrics/stats on admin dashboard

**Anatomy:**
- Card container (shadcn/ui Card)
- Metric label (text-sm, secondary color)
- Metric value (text-3xl, bold, primary color)
- Optional: Icon (left side)
- Optional: Trend indicator (up/down arrow with percentage)
- Optional: Subtitle (additional context)

**Variants:**
- `default` - Standard metric card
- `highlight` - Important metric (orange accent)
- `warning` - Attention needed (yellow accent)

**States:**
- **Default:** Static display
- **Hover:** Subtle lift (if clickable)
- **Loading:** Skeleton value

**Props:**
```typescript
interface StatsCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  trend?: { direction: 'up' | 'down'; percentage: number }
  subtitle?: string
  variant?: 'default' | 'highlight' | 'warning'
  onClick?: () => void // Make card clickable for drill-down
}
```

**Usage:**
- **Journey 3:** Dashboard overview (Total Links, Total Visits, Expiring Soon)

**Implementation Notes:**
- Layout: Compact, 4 cards in row on desktop, stack on mobile
- Spacing: Padding `p-6`
- Colors:
  - Default: Zinc text colors
  - Highlight: Orange accent (border-top or icon)
  - Warning: Yellow accent
- Icons: Use `lucide-react` icons, size 24px
- Trend: Green for positive, red for negative (if applicable)
- Loading state: Show skeleton with shimmer effect

**Example:**
```tsx
<StatsCard
  label="Total Active Links"
  value={12}
  icon={<LinkIcon className="h-6 w-6 text-orange-500" />}
  trend={{ direction: 'up', percentage: 15 }}
  subtitle="vs. last month"
  variant="default"
  onClick={() => {/* Navigate to detailed view */}}
/>
```

---

### LinkTableRow

**Type:** Custom Component (table row for admin)

**Purpose:** Display individual link information in admin dashboard table

**Anatomy:**
- Table row (shadcn/ui TableRow)
- Cells:
  - Recipient/Label (text, truncate if long)
  - Created Date (formatted date)
  - Expiration Date (formatted date, highlight if soon)
  - Status Badge (Active/Expired/Deactivated)
  - Visit Count (number, right-aligned)
  - Last Visit (relative time, e.g., "2 hours ago")
  - Actions (DropdownMenu with Copy/Edit/Deactivate/Delete)

**Variants:**
- `default` - Standard row
- `expiring-soon` - Yellow background tint for links expiring within 7 days
- `expired` - Muted colors for expired links

**States:**
- **Default:** Normal display
- **Hover:** Background highlight `hover:bg-zinc-50`
- **Selected:** Orange tint `bg-orange-50` (if selection enabled)
- **Expanded (mobile):** Transform to card view with all info stacked

**Props:**
```typescript
interface LinkTableRowProps {
  linkId: string
  recipient: string
  createdDate: string
  expirationDate?: string
  status: 'active' | 'expired' | 'deactivated'
  visitCount: number
  lastVisit?: string
  onCopy: () => void
  onEdit: () => void
  onDeactivate: () => void
  onDelete: () => void
  onRowClick?: () => void // For viewing details
}
```

**Usage:**
- **Journey 3:** Each link in the dashboard table

**Implementation Notes:**
- Responsive: Transform to card on mobile (use custom styling)
- Status badge colors:
  - Active: Green
  - Expired: Yellow
  - Deactivated: Gray
- Expiring soon: Check if expiration within 7 days, apply yellow tint
- Date formatting: Use `date-fns` for consistent formatting
- Actions: DropdownMenu on desktop, swipe actions on mobile (optional)
- Click row: Show detailed stats (expandable or navigate)

**Example:**
```tsx
<LinkTableRow
  linkId="clx123abc"
  recipient="Jane Doe - TechCorp Recruiter"
  createdDate="2025-10-15"
  expirationDate="2025-11-15"
  status="active"
  visitCount={12}
  lastVisit="2 hours ago"
  onCopy={handleCopy}
  onEdit={handleEdit}
  onDeactivate={handleDeactivate}
  onDelete={handleDelete}
  onRowClick={handleShowDetails}
/>
```

---

### DiffViewer

**Type:** Custom Component (comparison display)

**Purpose:** Show git-style differences between old and new CV data

**Anatomy:**
- Container (full-width or two-column)
- Layout options:
  - **Side-by-side:** Old CV (left) | New CV (right)
  - **Inline:** Unified view with color-coded changes
- Syntax highlighting for JSON (if showing raw data)
- Color coding:
  - Green background/text: Additions
  - Red background/text with strikethrough: Deletions
  - Yellow background: Modifications
- Line numbers (optional)
- Section toggles (Skills, Projects, Experience)

**Variants:**
- `side-by-side` - Desktop layout (two columns)
- `inline` - Mobile layout or unified view
- `visual` - Human-readable (not code), formatted changes

**States:**
- **Default:** Show all changes
- **Filtered:** Show only specific section changes
- **Collapsed sections:** Expandable sections for each CV area

**Props:**
```typescript
interface DiffViewerProps {
  oldData: CVData // Previous CV version
  newData: CVData // New CV version
  layout?: 'side-by-side' | 'inline' | 'visual'
  showLineNumbers?: boolean
  highlightSyntax?: boolean
  collapsibleSections?: boolean
}
```

**Usage:**
- **Journey 4:** CV review after AI extraction, compare extracted data with current CV

**Implementation Notes:**
- Diff library: Use `react-diff-viewer` or `diff` library for computation
- Syntax highlighting: Use `prism-react-renderer` for JSON
- Colors:
  - Additions: `bg-green-100 text-green-800 border-l-4 border-green-500`
  - Deletions: `bg-red-100 text-red-800 line-through border-l-4 border-red-500`
  - Modifications: `bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500`
- Scrolling: Synchronized scroll for side-by-side view
- Mobile: Inline view only, simplified colors
- Accessibility: Clear visual and text indicators (not color alone)

**Example:**
```tsx
<DiffViewer
  oldData={currentCV}
  newData={extractedCV}
  layout={isMobile ? 'inline' : 'side-by-side'}
  showLineNumbers={false}
  highlightSyntax={true}
  collapsibleSections={true}
/>
```

---

### UploadZone

**Type:** Custom Component (file upload)

**Purpose:** Drag-and-drop file upload interface for CV documents

**Anatomy:**
- Container (dashed border, large drop zone)
- Upload icon (large, center)
- Primary text: "Drag and drop your CV here"
- Secondary text: "or click to browse"
- Supported formats indicator: "PDF, Markdown, or Plain Text"
- File size limit: "Max 10MB"
- File picker button (hidden, triggered by click)
- Selected file preview (when file selected)

**Variants:**
- `idle` - Waiting for file
- `dragover` - File being dragged over (highlight)
- `selected` - File selected, showing preview
- `uploading` - Upload in progress (progress bar)
- `error` - Invalid file (red border, error message)

**States:**
- **Idle:** Default state, dashed border
- **Drag Over:** Solid orange border `border-orange-500`, background tint `bg-orange-50`
- **File Selected:** Show filename, file size, remove button
- **Uploading:** Progress bar visible, "Uploading..." text
- **Error:** Red border `border-red-500`, error message below
- **Success:** Green checkmark, filename displayed

**Props:**
```typescript
interface UploadZoneProps {
  onFileSelect: (file: File) => void
  acceptedFormats?: string[] // Default: ['.pdf', '.md', '.txt']
  maxSizeBytes?: number // Default: 10MB
  onError?: (error: string) => void
}
```

**Usage:**
- **Journey 4:** CV upload step in extraction workflow

**Implementation Notes:**
- Drag-and-drop: Use React `onDrop`, `onDragOver`, `onDragLeave` events
- File validation:
  - Check file type against accepted formats
  - Check file size against max limit
  - Show specific error messages
- File picker: Hidden input triggered by click on zone
- Preview: Show filename, file icon, file size, remove button
- Accessibility: Keyboard accessible (Enter/Space to trigger file picker)
- Mobile: Simplified UI, tap to open native file picker

**Example:**
```tsx
<UploadZone
  onFileSelect={handleFileSelect}
  acceptedFormats={['.pdf', '.md', '.txt', '.docx']}
  maxSizeBytes={10 * 1024 * 1024} // 10MB
  onError={handleError}
/>
```

---

### ProgressSteps

**Type:** Custom Component (stepper)

**Purpose:** Visual multi-step progress indicator for CV extraction workflow

**Anatomy:**
- Horizontal step indicator
- Steps:
  1. Upload
  2. Extract
  3. Review
  4. Publish
- Each step:
  - Step number or icon
  - Step label
  - Connecting line to next step
  - Status indicator (pending/active/complete)

**Variants:**
- `horizontal` - Desktop layout (side-by-side steps)
- `vertical` - Mobile layout (stacked steps)

**States per Step:**
- **Pending:** Gray, not yet started (`text-zinc-400`)
- **Active:** Orange, currently processing (`text-orange-500`, pulse animation)
- **Complete:** Green, finished (`text-green-500`, checkmark icon)
- **Error:** Red, failed (`text-red-500`, X icon)

**Props:**
```typescript
interface ProgressStepsProps {
  steps: Array<{
    id: string
    label: string
    status: 'pending' | 'active' | 'complete' | 'error'
  }>
  orientation?: 'horizontal' | 'vertical'
}
```

**Usage:**
- **Journey 4:** Shows extraction workflow progress (Upload → Extract → Review → Publish)

**Implementation Notes:**
- Layout: Flex row (horizontal) or column (vertical)
- Connecting lines: CSS pseudo-elements or separate divs
- Icons: Numbers for inactive, icons for active/complete (lucide-react)
- Animation: Pulse or spinner for active step
- Mobile: Vertical layout, smaller text
- Accessibility: `aria-current="step"` for active step

**Example:**
```tsx
<ProgressSteps
  steps={[
    { id: '1', label: 'Upload', status: 'complete' },
    { id: '2', label: 'Extract', status: 'complete' },
    { id: '3', label: 'Review', status: 'active' },
    { id: '4', label: 'Publish', status: 'pending' },
  ]}
  orientation={isMobile ? 'vertical' : 'horizontal'}
/>
```

---

## Part 3: Component States Matrix

This table shows which states each component supports:

| Component | Default | Hover | Active | Focus | Disabled | Loading | Error | Success | Expanded |
|-----------|---------|-------|--------|-------|----------|---------|-------|---------|----------|
| **shadcn/ui Components** |
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | - | - |
| Card | ✅ | ✅ (interactive) | ✅ (selected) | ✅ | - | - | - | - | - |
| Badge | ✅ | ✅ (clickable) | ✅ (selected) | - | - | - | - | - | - |
| Input | ✅ | ✅ | - | ✅ | ✅ | - | ✅ | ✅ | - |
| Textarea | ✅ | ✅ | - | ✅ | ✅ | - | ✅ | - | - |
| Select | ✅ | ✅ | ✅ (selected) | ✅ | ✅ | - | - | - | ✅ (open) |
| Dialog | ✅ | - | - | - | - | - | - | - | ✅ (open) |
| Sheet | ✅ | - | - | - | - | - | - | - | ✅ (open) |
| Table | ✅ | ✅ (row) | ✅ (selected) | - | - | - | - | - | - |
| Dropdown Menu | ✅ | ✅ (item) | ✅ (selected) | ✅ | ✅ (item) | - | - | - | ✅ (open) |
| Toast | ✅ | - | - | - | - | - | ✅ (destructive) | ✅ (custom) | - |
| Progress | ✅ | - | - | - | - | ✅ (indeterminate) | - | - | - |
| Tooltip | ✅ (hidden) | ✅ (visible) | - | ✅ | - | - | - | - | - |
| Avatar | ✅ | - | - | - | - | ✅ (loading img) | - | - | - |
| Separator | ✅ | - | - | - | - | - | - | - | - |
| Tabs | ✅ | ✅ | ✅ (active tab) | ✅ | - | - | - | - | - |
| Label | ✅ | - | - | - | ✅ | - | ✅ | - | - |
| **Custom Components** |
| SkillTag | ✅ | ✅ | ✅ (selected) | ✅ | - | - | - | - | - |
| ProjectCard | ✅ | ✅ | - | ✅ | - | ✅ (loading details) | - | - | ✅ (expanded) |
| ExperienceCard | ✅ | ✅ | - | ✅ | - | - | - | - | ✅ (expanded, optional) |
| PersonalMessageCard | ✅ | - | - | - | - | - | - | - | ✅ (collapsible, mobile) |
| InvitedAccessBadge | ✅ | ✅ (tooltip) | - | - | - | - | - | - | - |
| StickyNav | ✅ | ✅ (links) | ✅ (active link) | ✅ | - | - | - | - | ✅ (mobile menu) |
| HeroSection | ✅ | - | - | - | - | ✅ (skeleton) | - | - | - |
| StatsCard | ✅ | ✅ (clickable) | - | ✅ | - | ✅ (skeleton) | - | - | - |
| LinkTableRow | ✅ | ✅ | ✅ (selected) | ✅ | - | - | - | - | ✅ (mobile card) |
| DiffViewer | ✅ | - | - | - | - | - | - | - | ✅ (collapsed sections) |
| UploadZone | ✅ (idle) | ✅ (drag over) | - | ✅ | - | ✅ (uploading) | ✅ | ✅ | - |
| ProgressSteps | ✅ | - | ✅ (active step) | - | - | ✅ (active step) | ✅ (error step) | ✅ (complete) | - |

---

## Part 4: Journey-to-Component Mapping

### Journey 1: Public CV Exploration

**Components Used:**

**Hero Section:**
- HeroSection (custom)
- StickyNav (custom)
- Avatar (shadcn/ui, optional)
- SkillTag (custom) - key skills display

**Skills Section:**
- SkillTag (custom) × 20+
- Separator (shadcn/ui) - between sections
- Optional: Category filter buttons (Button - ghost variant)

**Projects Section:**
- ProjectCard (custom) × 2-3
- Badge (shadcn/ui) - tech stack tags
- Button (shadcn/ui) - "Show More" (ghost variant)
- Card (shadcn/ui) - wrapping container for projects

**Experience Section:**
- ExperienceCard (custom) × 2-3
- Card (shadcn/ui) - wrapping container
- Separator (shadcn/ui) - between experiences

**Education Section:**
- Card (shadcn/ui) - education cards
- Badge (shadcn/ui) - degree type, honors

**CTA Section:**
- Button (shadcn/ui) - LinkedIn, GitHub links (secondary variant)
- Separator (shadcn/ui) - section divider

**Navigation:**
- StickyNav (custom) - always visible
- Sheet (shadcn/ui) - mobile menu

---

### Journey 2: Personalized Link Access (Invited View)

**All components from Journey 1, PLUS:**

**Hero Section Additions:**
- PersonalMessageCard (custom) - personalized greeting
- InvitedAccessBadge (custom) - subtle indicator

**Contact Section (New):**
- Card (shadcn/ui) - contact info container
- Button (shadcn/ui) - "Get in Touch" (default variant), email/phone buttons (secondary)
- Separator (shadcn/ui)

**Full Access Indicators:**
- Badge (shadcn/ui) - "Full Access" mini-badges on sections (optional)

**Mobile-Specific:**
- Sheet (shadcn/ui) - bottom sheet for contact CTA (sticky)

---

### Journey 3: Admin Dashboard - Link Management

**Components Used:**

**Dashboard Overview:**
- StickyNav (custom) - admin nav
- StatsCard (custom) × 3-4 - metrics overview
- Button (shadcn/ui) - "+ Create New Link" (default, large)
- Separator (shadcn/ui)

**Link Management Table:**
- Table (shadcn/ui) - link list container
  - TableHeader, TableBody, TableRow, TableHead, TableCell
- LinkTableRow (custom) - each link row
- Badge (shadcn/ui) - status indicators
- Dropdown Menu (shadcn/ui) - actions menu (Copy, Edit, Delete)
- Button (shadcn/ui) - action buttons in dropdown

**Create/Edit Link Flow:**
- Dialog (shadcn/ui) - create/edit modal
- Label (shadcn/ui) - form labels
- Input (shadcn/ui) - recipient name input
- Textarea (shadcn/ui) - message input
- Select (shadcn/ui) - template dropdown, expiration dropdown
- Button (shadcn/ui) - form actions (Create, Cancel)
- Toast (shadcn/ui) - success/error notifications

**Analytics View:**
- Card (shadcn/ui) - stats container
- Separator (shadcn/ui)
- Progress (shadcn/ui) - visit trends (optional, growth)

**Mobile Adaptations:**
- Sheet (shadcn/ui) - mobile create link form (bottom sheet)
- Card (shadcn/ui) - link cards (instead of table rows)

---

### Journey 4: Admin CV Update via AI Extraction

**Components Used:**

**Upload Interface:**
- StickyNav (custom) - admin nav
- UploadZone (custom) - drag-drop upload
- Button (shadcn/ui) - "Choose File" (secondary)
- Card (shadcn/ui) - upload container
- Toast (shadcn/ui) - upload errors

**Extraction Progress:**
- ProgressSteps (custom) - workflow steps
- Progress (shadcn/ui) - extraction progress bar
- Card (shadcn/ui) - progress container

**Review Interface:**
- DiffViewer (custom) - compare old/new CV
- Tabs (shadcn/ui) - JSON / Preview / Diff tabs (mobile)
- Card (shadcn/ui) - review sections
- Badge (shadcn/ui) - validation status indicators
- Button (shadcn/ui) - Publish, Save Draft, Cancel
- Textarea (shadcn/ui) - manual JSON editor (fallback)
- Label (shadcn/ui) - section labels

**Publish Confirmation:**
- Dialog (shadcn/ui) - confirmation modal
- Button (shadcn/ui) - Confirm, Cancel
- Toast (shadcn/ui) - success notification

**Version History (Optional):**
- Table (shadcn/ui) - version list
- Button (shadcn/ui) - Restore button
- Separator (shadcn/ui)

---

## Part 5: Component Hierarchy & Composition

### Public/Invited CV Pages

```
Page (Route Component)
├── StickyNav (custom)
│   ├── Logo/Name (text + link)
│   ├── Navigation Links (Button - ghost)
│   └── Mobile Menu Button (Sheet trigger)
│       └── Sheet (mobile navigation)
│           └── Navigation Links (stacked)
│
├── HeroSection (custom)
│   ├── Avatar (shadcn/ui, optional)
│   ├── Heading (H1 - Name)
│   ├── Subheading (H2 - Title)
│   ├── Tagline (p - Elevator pitch)
│   ├── SkillTag[] (custom - primary variant)
│   └── [PersonalMessageCard] (custom - invited only)
│       ├── InvitedAccessBadge (custom)
│       ├── Greeting (text)
│       ├── Message Body (markdown rendered)
│       └── Signature (text)
│
├── Separator (shadcn/ui - with orange accent)
│
├── Section (Skills)
│   ├── Heading (H2)
│   ├── Separator (shadcn/ui)
│   └── SkillTag[] (custom - categorized)
│       ├── Category: Frontend
│       ├── Category: Backend
│       └── Category: DevOps
│
├── Separator (shadcn/ui)
│
├── Section (Projects)
│   ├── Heading (H2)
│   ├── Separator (shadcn/ui)
│   └── ProjectCard[] (custom)
│       ├── Card (shadcn/ui - wrapper)
│       ├── CardHeader
│       │   ├── CardTitle (H3 - project name)
│       │   └── CardDescription (brief)
│       ├── CardContent
│       │   ├── Badge[] (shadcn/ui - tech stack)
│       │   └── [Expanded Details] (collapsible)
│       │       ├── Full description
│       │       ├── Achievements (bullet list)
│       │       └── Timeline
│       └── CardFooter
│           └── Button (ghost - "Show More/Less")
│
├── Separator (shadcn/ui)
│
├── Section (Experience)
│   ├── Heading (H2)
│   ├── Separator (shadcn/ui)
│   └── ExperienceCard[] (custom)
│       ├── Card (shadcn/ui - wrapper)
│       ├── Timeline indicator (left border)
│       ├── Job title (H3)
│       ├── Company name (p)
│       ├── Date range (p)
│       ├── Highlights (bullet list)
│       └── [Extended achievements] (invited only)
│
├── Separator (shadcn/ui)
│
├── Section (Education)
│   ├── Heading (H2)
│   ├── Separator (shadcn/ui)
│   └── Card[] (shadcn/ui)
│       ├── CardHeader (degree, institution)
│       ├── CardContent (details)
│       └── Badge[] (honors, GPA)
│
├── Separator (shadcn/ui)
│
└── Section (CTA / Contact)
    ├── Heading (H2)
    ├── Separator (shadcn/ui)
    └── Button[] (shadcn/ui - contact links)
        ├── LinkedIn (secondary)
        ├── GitHub (secondary)
        └── [Email/Phone] (invited only - default variant)
```

---

### Admin Dashboard

```
Dashboard (Route Component)
├── StickyNav (custom - admin variant)
│   ├── Logo/Name
│   ├── Admin Navigation Links
│   │   ├── Dashboard
│   │   ├── Link Management
│   │   ├── CV Management
│   │   └── Settings
│   └── Logout Button
│
├── Page Header
│   ├── Heading (H1 - "Link Management")
│   └── Button (default - "+ Create New Link")
│
├── Separator (shadcn/ui)
│
├── StatsCard[] (custom - overview metrics)
│   ├── Card (shadcn/ui - wrapper)
│   ├── Icon (lucide-react)
│   ├── Label (text)
│   ├── Value (large number)
│   └── [Trend indicator] (optional)
│
├── Separator (shadcn/ui)
│
├── Filters & Search (optional)
│   ├── Input (shadcn/ui - search)
│   ├── Select (shadcn/ui - status filter)
│   └── Button (ghost - "Clear filters")
│
├── Table (shadcn/ui - desktop)
│   ├── TableHeader
│   │   └── TableRow
│   │       └── TableHead[] (sortable headers)
│   └── TableBody
│       └── LinkTableRow[] (custom)
│           ├── TableCell[] (data)
│           ├── Badge (status)
│           └── DropdownMenu (shadcn/ui - actions)
│               ├── DropdownMenuTrigger (Button - ghost)
│               └── DropdownMenuContent
│                   ├── DropdownMenuItem (Copy URL)
│                   ├── DropdownMenuItem (Edit)
│                   ├── DropdownMenuSeparator
│                   └── DropdownMenuItem (Delete - red text)
│
└── [Card List] (mobile - replaces table)
    └── Card[] (shadcn/ui)
        ├── Link data (stacked)
        ├── Badge (status)
        └── Button[] (action buttons)
```

---

### Admin Dashboard - Create Link Modal

```
Dialog (shadcn/ui - create link)
├── DialogTrigger (Button - "+ Create New Link")
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle ("Create Personalized Link")
    │   └── DialogDescription (context)
    │
    ├── Form (react-hook-form)
    │   ├── Field Group (Recipient)
    │   │   ├── Label (shadcn/ui)
    │   │   └── Input (shadcn/ui)
    │   │
    │   ├── Field Group (Message)
    │   │   ├── Label (shadcn/ui)
    │   │   ├── Select (template dropdown)
    │   │   ├── Textarea (shadcn/ui)
    │   │   └── Character counter (text)
    │   │
    │   ├── Field Group (Expiration)
    │   │   ├── Label (shadcn/ui)
    │   │   ├── Preset Buttons (Button - outline)
    │   │   │   ├── "7 days"
    │   │   │   ├── "30 days"
    │   │   │   ├── "90 days"
    │   │   │   └── "Never"
    │   │   └── [Custom Date Picker] (if "Custom" selected)
    │   │
    │   └── Preview Panel
    │       ├── Generated URL (copyable text)
    │       └── Message preview (styled)
    │
    └── DialogFooter
        ├── Button (secondary - "Cancel")
        └── Button (default - "Create Link")
```

---

### Admin CV Upload & Extraction

```
CV Management Page (Route Component)
├── StickyNav (custom - admin)
│
├── Page Header
│   ├── Heading (H1 - "CV Management")
│   └── Button[] (actions)
│       ├── "Upload & Extract" (default)
│       └── "View Version History" (secondary)
│
├── Separator (shadcn/ui)
│
├── UploadZone (custom)
│   ├── Card (shadcn/ui - wrapper)
│   ├── Upload Icon (large)
│   ├── Instructions (text)
│   ├── File formats (text)
│   └── Hidden file input
│
├── [Extraction Progress] (when uploading)
│   ├── ProgressSteps (custom)
│   │   ├── Step: Upload (complete)
│   │   ├── Step: Extract (active)
│   │   ├── Step: Review (pending)
│   │   └── Step: Publish (pending)
│   └── Progress (shadcn/ui - bar)
│
└── [Review Interface] (after extraction)
    ├── Tabs (shadcn/ui - mobile only)
    │   ├── TabsTrigger ("JSON")
    │   ├── TabsTrigger ("Preview")
    │   └── TabsTrigger ("Diff")
    │
    ├── Content Area (split or tabbed)
    │   ├── JSON Editor (Textarea or code editor)
    │   │   ├── Syntax highlighting
    │   │   ├── Line numbers
    │   │   └── Validation errors (Badge)
    │   │
    │   ├── Visual Preview (CV as it appears)
    │   │   ├── HeroSection (custom)
    │   │   ├── Section (Skills)
    │   │   ├── Section (Projects)
    │   │   └── Section (Experience)
    │   │
    │   └── DiffViewer (custom - comparison)
    │       ├── Side-by-side or inline
    │       ├── Color-coded changes
    │       └── Collapsible sections
    │
    └── Action Bar
        ├── Button (secondary - "Save Draft")
        ├── Button (ghost - "Discard")
        └── Button (default - "Publish Changes")
            └── [Confirmation Dialog] (on click)
                ├── DialogHeader (confirmation message)
                ├── Change summary (list)
                └── DialogFooter
                    ├── Button (secondary - "Cancel")
                    └── Button (default - "Confirm & Publish")
```

---

## Part 6: Accessibility Requirements

All components must meet **WCAG 2.1 AA compliance** standards.

---

### Interactive Components (Button, SkillTag, ProjectCard)

**Keyboard Navigation:**
- Focusable with `Tab` key
- Activated with `Enter` or `Space`
- Logical tab order through page

**Focus Indicators:**
- Visible focus ring: `ring-2 ring-orange-500 ring-offset-2`
- High contrast focus state (at least 3:1 contrast ratio)
- Focus ring visible in all themes/contexts

**ARIA Labels:**
- Descriptive labels for all interactive elements
- `aria-label` or `aria-labelledby` for icon-only buttons
- Example: `<Button aria-label="Show more project details">Show More</Button>`

**Screen Reader Announcements:**
- Announce state changes (e.g., "Section expanded", "Link copied")
- Use `aria-live` regions for dynamic content updates
- Use `aria-expanded` for expandable components

**Touch Targets:**
- Minimum 44×44px touch target size on mobile
- Adequate spacing between interactive elements (8px minimum)

---

### Form Components (Input, Textarea, Select)

**Labels:**
- Always use `<label>` element with `for` attribute matching input `id`
- Example: `<label htmlFor="recipient">Recipient Name</label>`
- Label text clear and descriptive

**Error States:**
- `aria-invalid="true"` on input when validation fails
- `aria-describedby` pointing to error message element
- Error messages visible and programmatically associated
- Error icon + text (not color alone)

**Required Fields:**
- Visual indicator (red asterisk or "Required" text)
- `aria-required="true"` attribute
- Example: `<Input id="name" required aria-required="true" />`

**Help Text:**
- `aria-describedby` for tooltips or helper text
- Example: `<Input aria-describedby="password-hint" />`
- Help text visible or accessible via tooltip

**Field Groups:**
- Use `<fieldset>` and `<legend>` for grouped form fields
- Example: Expiration date presets grouped together

---

### Navigation (StickyNav)

**Landmark:**
- Use `<nav>` element with `aria-label="Main navigation"`
- Example: `<nav aria-label="Main navigation">`

**Active State:**
- Use `aria-current="page"` for current section/page
- Visual indicator (orange underline or text color)
- Example: `<a href="#projects" aria-current="page">Projects</a>`

**Skip Links:**
- Include "Skip to content" link for keyboard users
- Hidden visually but available to screen readers
- Becomes visible on focus
- Example: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`

**Mobile Menu:**
- `aria-expanded` on hamburger button to indicate menu state
- `aria-controls` pointing to menu element ID
- Focus trap when mobile menu is open
- Close menu on `Escape` key press

---

### Custom Components

**SkillTag:**
- If clickable: `role="button"` and proper focus management
- `tabindex="0"` to make focusable
- Keyboard activation: Enter and Space keys
- Hover tooltip: `aria-describedby` for experience years

**ProjectCard:**
- Expandable button: `aria-expanded="false|true"` to indicate state
- `aria-controls` pointing to expanded content ID
- Announce state change: "Project details expanded" (screen reader)
- Semantic heading structure: H3 for project titles

**PersonalMessageCard:**
- Proper heading hierarchy (H2 or H3 for greeting)
- Readable text contrast: Minimum 4.5:1 for body text, 3:1 for large text
- Collapsible (mobile): `aria-expanded` on toggle button

**DiffViewer:**
- Color + icon/text indicators (not color alone)
- Use text labels: "Added", "Removed", "Modified"
- Example: Green background + "+ Added" prefix
- Semantic HTML: Use `<ins>` for additions, `<del>` for deletions (optional)

**UploadZone:**
- Keyboard accessible: File picker triggered by Enter/Space
- `aria-label` on drop zone: "Drop CV file here or click to browse"
- Announce file selection: "File selected: resume.pdf"
- Error messages clearly announced

**Table (LinkTableRow):**
- Use semantic table elements: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- Column headers with `<th scope="col">`
- Row headers (if applicable) with `<th scope="row">`
- `aria-sort` on sortable headers
- Screen reader summary: `<caption>` element or `aria-label` on table

---

### Color Contrast Requirements

**Text Contrast:**
- Normal text (< 18pt): Minimum 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): Minimum 3:1 contrast ratio
- Verify all color combinations:
  - `#18181b` (zinc-900) on `#ffffff` (white): ✅ 16.1:1
  - `#71717a` (zinc-500) on `#ffffff`: ✅ 4.6:1
  - `#f97316` (orange-500) on `#ffffff`: ⚠️ 2.5:1 (fails for text)
  - `#f97316` on `#18181b`: ✅ 6.4:1 (passes)

**Non-Text Contrast:**
- UI components (borders, icons): Minimum 3:1 contrast ratio
- Focus indicators: Minimum 3:1 contrast against background
- Disabled states: Exception (no minimum contrast required)

**Use Cases:**
- Orange text on white: Only for large text (≥18pt) or interactive elements with additional cues
- Orange buttons: Use white text on orange background (sufficient contrast)
- Borders: Use zinc-200 on white (3.4:1 contrast) for visible separation

---

### Screen Reader Support

**Semantic HTML:**
- Use proper heading hierarchy (H1 → H2 → H3, no skipping)
- Use `<main>` for main content area
- Use `<nav>` for navigation
- Use `<article>` or `<section>` for content sections
- Use `<aside>` for complementary content

**ARIA Attributes:**
- `aria-label`: Provide accessible name when visible label is absent
- `aria-labelledby`: Reference visible label element
- `aria-describedby`: Associate descriptive text with element
- `aria-live`: Announce dynamic content updates (polite, assertive, off)
- `aria-hidden="true"`: Hide decorative elements from screen readers

**Dynamic Content:**
- Announce loading states: "Loading CV data..."
- Announce success/error: "Link created successfully"
- Announce navigation changes: "Projects section"
- Use `aria-live="polite"` for non-urgent updates, `aria-live="assertive"` for urgent

**Images & Icons:**
- Decorative images: `alt=""` or `aria-hidden="true"`
- Meaningful images: Descriptive `alt` text
- Icon-only buttons: `aria-label` with action description

---

### Keyboard Navigation Requirements

**Tab Order:**
- Logical tab order following visual order
- All interactive elements focusable
- Skip links first in tab order

**Focus Trap:**
- Modal dialogs: Trap focus within modal when open
- Mobile menus: Trap focus within menu when open
- Release focus when closed, return to trigger element

**Keyboard Shortcuts:**
- `Escape`: Close modals, dropdowns, sheets
- `Enter`/`Space`: Activate buttons and links
- Arrow keys: Navigate through dropdown items, tabs
- `Tab`/`Shift+Tab`: Move focus forward/backward

**Expandable Content:**
- `Enter`/`Space` to toggle expansion
- `aria-expanded` reflects current state
- Focus management: Keep focus on toggle button after expansion

---

## Part 7: Implementation Guidance

---

### Component File Structure

```
src/
├── components/
│   ├── ui/                          # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── table.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── use-toast.ts
│   │   ├── progress.tsx
│   │   ├── tooltip.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   └── label.tsx
│   │
│   ├── custom/                      # Custom components
│   │   ├── skill-tag.tsx
│   │   ├── project-card.tsx
│   │   ├── experience-card.tsx
│   │   ├── personal-message-card.tsx
│   │   ├── invited-access-badge.tsx
│   │   ├── sticky-nav.tsx
│   │   ├── hero-section.tsx
│   │   ├── stats-card.tsx
│   │   ├── link-table-row.tsx
│   │   ├── diff-viewer.tsx
│   │   ├── upload-zone.tsx
│   │   └── progress-steps.tsx
│   │
│   └── layouts/                     # Layout components
│       ├── cv-layout.tsx           # Public/Invited CV layout
│       ├── admin-layout.tsx        # Admin dashboard layout
│       └── root-layout.tsx         # Root app layout
│
├── lib/
│   ├── utils.ts                    # cn() utility and helpers
│   └── constants.ts                # Design tokens, colors
│
└── styles/
    └── globals.css                 # Global styles, Tailwind imports
```

---

### Component Development Checklist

For each custom component, ensure:

**✅ Code Quality:**
- [ ] TypeScript interface for props defined
- [ ] Default props specified where applicable
- [ ] Component documented with JSDoc comments
- [ ] Props validated (using TypeScript types)

**✅ Variants & States:**
- [ ] All specified variants implemented
- [ ] All specified states implemented (default, hover, active, disabled, loading, error, success)
- [ ] State transitions smooth (use Tailwind transitions)

**✅ Responsive Design:**
- [ ] Component tested on mobile (320px - 640px)
- [ ] Component tested on tablet (640px - 1024px)
- [ ] Component tested on desktop (1024px+)
- [ ] Breakpoints use Tailwind classes (`sm:`, `md:`, `lg:`)
- [ ] Content doesn't overflow on small screens

**✅ Keyboard Navigation:**
- [ ] All interactive elements focusable with Tab
- [ ] Focus indicators visible and high-contrast
- [ ] Keyboard shortcuts work (Enter, Space, Escape, Arrows)
- [ ] Tab order is logical

**✅ ARIA Attributes:**
- [ ] `aria-label` or `aria-labelledby` on interactive elements
- [ ] `aria-expanded` on expandable components
- [ ] `aria-describedby` for help text and errors
- [ ] `aria-invalid` on form inputs with errors
- [ ] `aria-live` for dynamic content announcements

**✅ Screen Reader Testing:**
- [ ] Component tested with screen reader (VoiceOver, NVDA, JAWS)
- [ ] All content announced correctly
- [ ] State changes announced
- [ ] Navigation landmarks correct

**✅ Color Contrast:**
- [ ] Text contrast meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Non-text contrast meets 3:1 ratio (borders, icons)
- [ ] Focus indicators have 3:1 contrast
- [ ] Disabled states clearly visible (can be lower contrast)

**✅ Touch Targets:**
- [ ] All interactive elements ≥44×44px on mobile
- [ ] Adequate spacing between touch targets (≥8px)
- [ ] Tap targets don't overlap

**✅ Animations & Transitions:**
- [ ] Smooth transitions (200-300ms ease)
- [ ] No jarring animations
- [ ] Respects `prefers-reduced-motion` media query
- [ ] Animations enhance UX (not distracting)

**✅ Design Tokens:**
- [ ] Uses Tailwind utility classes (not inline styles)
- [ ] Uses design token colors (`zinc-*`, `orange-*`)
- [ ] Uses spacing scale (`spacing-*`)
- [ ] Uses border radius tokens (`rounded-md`, etc.)

**✅ Performance:**
- [ ] Component renders efficiently (no unnecessary re-renders)
- [ ] Large lists use virtualization (if applicable)
- [ ] Images optimized and lazy-loaded
- [ ] Code-split if component is large (dynamic import)

**✅ Documentation:**
- [ ] Component usage documented (props, examples)
- [ ] Storybook story created (optional but recommended)
- [ ] Edge cases documented

---

### Styling Approach

**Use Tailwind CSS utility classes:**

```tsx
// Good: Utility classes
<div className="rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:border-orange-500 hover:shadow-sm">
  React
</div>

// Avoid: Inline styles
<div style={{ borderRadius: '8px', border: '1px solid #e4e4e7', ... }}>
  React
</div>
```

**Use `cn()` utility for conditional classes:**

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
  variant === "primary" && "bg-orange-500 text-white border-orange-500",
  variant === "secondary" && "bg-zinc-100 text-zinc-900 border-zinc-200",
  isActive && "bg-orange-500 text-white shadow-md",
  disabled && "opacity-50 cursor-not-allowed"
)}>
  {children}
</div>
```

**Use CSS custom properties for theme values (optional):**

```css
/* globals.css */
:root {
  --color-primary: #f97316;
  --color-primary-hover: #ea580c;
  --color-text-primary: #18181b;
  --color-text-secondary: #71717a;
  --color-border: #e4e4e7;
  --spacing-4: 1rem;
  --radius-md: 8px;
}
```

```tsx
// Use in components
<div style={{ color: 'var(--color-text-primary)' }}>
  {/* Or use Tailwind classes */}
</div>
```

---

### Testing Strategy

**Unit Tests (Vitest + React Testing Library):**

```tsx
// Example: SkillTag.test.tsx
import { render, screen } from '@testing-library/react'
import { SkillTag } from './skill-tag'

describe('SkillTag', () => {
  it('renders with correct text', () => {
    render(<SkillTag name="React" variant="primary" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('applies primary variant styles', () => {
    render(<SkillTag name="React" variant="primary" />)
    const tag = screen.getByText('React')
    expect(tag).toHaveClass('text-base') // Primary is larger
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<SkillTag name="React" onClick={handleClick} />)
    await userEvent.click(screen.getByText('React'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows selected state', () => {
    render(<SkillTag name="React" selected={true} />)
    const tag = screen.getByText('React')
    expect(tag).toHaveClass('bg-orange-500 text-white')
  })
})
```

**Visual Regression (Playwright or Chromatic):**
- Snapshot each component state (default, hover, active, disabled, etc.)
- Test responsive breakpoints (mobile, tablet, desktop)
- Dark mode compatibility (if applicable)
- Example: Use Playwright to capture screenshots of all variants

**Accessibility Tests:**
- Use `@axe-core/react` or Playwright axe integration
- Test keyboard navigation manually
- Screen reader testing (manual, using VoiceOver/NVDA)

```tsx
// Example: Axe accessibility test
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('should not have accessibility violations', async () => {
  const { container } = render(<SkillTag name="React" />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

### Code Examples

**Example 1: SkillTag Component**

```tsx
// components/custom/skill-tag.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SkillTagProps {
  name: string
  variant?: 'primary' | 'secondary' | 'category'
  icon?: React.ReactNode
  onClick?: () => void
  selected?: boolean
  experienceYears?: number
}

export function SkillTag({
  name,
  variant = 'secondary',
  icon,
  onClick,
  selected = false,
  experienceYears,
}: SkillTagProps) {
  const TagComponent = onClick ? 'button' : 'span'

  const tag = (
    <TagComponent
      onClick={onClick}
      className={cn(
        // Base styles
        "inline-flex items-center gap-1.5 rounded-md border transition-all duration-200",
        // Variant styles
        variant === 'primary' && "px-4 py-2 text-base font-semibold",
        variant === 'secondary' && "px-3 py-1.5 text-sm font-medium",
        variant === 'category' && "px-3 py-1.5 text-sm font-bold uppercase tracking-wide",
        // State styles
        selected
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-zinc-100 text-zinc-900 border-zinc-200",
        // Interactive styles
        onClick && !selected && "hover:border-orange-500 hover:shadow-sm hover:scale-105 cursor-pointer",
        onClick && "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      )}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick && selected ? 'true' : undefined}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{name}</span>
    </TagComponent>
  )

  // Wrap with tooltip if experience years provided
  if (experienceYears) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{tag}</TooltipTrigger>
        <TooltipContent>
          <p>{experienceYears} years of experience</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return tag
}
```

**Example 2: ProjectCard Component**

```tsx
// components/custom/project-card.tsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  title: string
  briefDescription: string
  fullDescription: string
  techStack: string[]
  achievements: string[]
  timeline: string
  companyName?: string
  businessMetrics?: string
  thumbnail?: string
  isInvitedView?: boolean
}

export function ProjectCard({
  title,
  briefDescription,
  fullDescription,
  techStack,
  achievements,
  timeline,
  companyName,
  businessMetrics,
  thumbnail,
  isInvitedView = false,
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-zinc-900">{title}</CardTitle>
        <CardDescription className="text-zinc-600">{briefDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-zinc-700">{fullDescription}</p>

            <div>
              <h4 className="font-semibold text-zinc-900 mb-2">Key Achievements:</h4>
              <ul className="list-disc list-inside space-y-1 text-zinc-700">
                {achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
              <span><strong>Timeline:</strong> {timeline}</span>
              {isInvitedView && companyName && (
                <span><strong>Company:</strong> {companyName}</span>
              )}
            </div>

            {isInvitedView && businessMetrics && (
              <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                <p className="text-sm text-zinc-800">{businessMetrics}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={`project-${title.replace(/\s+/g, '-').toLowerCase()}-details`}
          className="text-orange-600 hover:text-orange-700"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUpIcon className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDownIcon className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Example 3: Using Radix UI Collapsible for Smooth Animations**

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'

<Collapsible.Root open={isExpanded} onOpenChange={setIsExpanded}>
  <Collapsible.Trigger asChild>
    <Button variant="ghost">
      {isExpanded ? 'Show Less' : 'Show More'}
    </Button>
  </Collapsible.Trigger>
  <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
    {/* Expanded content */}
  </Collapsible.Content>
</Collapsible.Root>
```

---

### Animation & Transition Guidelines

**Timing:**
- Quick interactions (hover, focus): 150-200ms
- Standard transitions (expansion, modal open): 250-300ms
- Slow animations (page transitions, complex animations): 400-500ms

**Easing:**
- Use `ease-out` for entering elements (start fast, end slow)
- Use `ease-in` for exiting elements (start slow, end fast)
- Use `ease-in-out` for state changes (smooth both ways)

**Tailwind Classes:**
```tsx
// Hover transitions
className="transition-colors duration-200 hover:bg-orange-500"

// Shadow lift
className="transition-shadow duration-200 hover:shadow-md"

// Scale on hover
className="transition-transform duration-200 hover:scale-105"

// Multiple properties
className="transition-all duration-300 ease-out"
```

**Respect User Preferences:**
```tsx
// Disable animations for users who prefer reduced motion
className={cn(
  "transition-all duration-300",
  "motion-reduce:transition-none"
)}
```

---

### Performance Optimization

**Code Splitting:**
```tsx
// Lazy load heavy components
const DiffViewer = React.lazy(() => import('@/components/custom/diff-viewer'))

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <DiffViewer oldData={oldCV} newData={newCV} />
</Suspense>
```

**Memoization:**
```tsx
// Memoize expensive components
const ProjectCard = React.memo(({ title, ...props }) => {
  // Component logic
})

// Memoize computed values
const filteredSkills = useMemo(() => {
  return skills.filter(skill => skill.category === activeCategory)
}, [skills, activeCategory])
```

**Virtualization (for long lists):**
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function SkillsList({ skills }) {
  const parentRef = useRef()
  const rowVirtualizer = useVirtualizer({
    count: skills.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  })

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div key={virtualItem.key} style={{ transform: `translateY(${virtualItem.start}px)` }}>
            <SkillTag name={skills[virtualItem.index].name} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Image Optimization:**
- Use modern formats (WebP, AVIF)
- Lazy load images below the fold
- Use responsive images (`srcset`, `sizes`)
- Compress images (80-85% quality)

---

## Part 8: Summary & Priorities

### Total Components

**shadcn/ui Components (Out-of-the-Box):** 16
- Button, Card, Badge, Input, Textarea, Select, Dialog, Sheet, Table, Dropdown Menu, Toast, Progress, Tooltip, Avatar, Separator, Tabs, Label

**Custom Components (To Develop):** 12
- SkillTag, ProjectCard, ExperienceCard, PersonalMessageCard, InvitedAccessBadge, StickyNav, HeroSection, StatsCard, LinkTableRow, DiffViewer, UploadZone, ProgressSteps

**Total Components:** 28

---

### Development Phases

#### Phase 1 (MVP - Journey 1 & 2)

**Priority:** HIGH
**Goal:** Launch public and invited CV views

**Components to Build:**
1. **HeroSection** (custom)
2. **StickyNav** (custom)
3. **SkillTag** (custom)
4. **ProjectCard** (custom)
5. **ExperienceCard** (custom)
6. **PersonalMessageCard** (custom)
7. **InvitedAccessBadge** (custom)

**shadcn/ui Components Needed:**
- Button, Card, Badge, Sheet (mobile menu), Separator, Avatar (optional), Tooltip

**Estimated Effort:** 3-4 weeks (with testing)

**Success Criteria:**
- Public CV loads in <1.5s, Lighthouse score >90
- All components accessible (WCAG AA)
- Responsive on mobile, tablet, desktop
- Smooth animations and interactions
- Token validation works for invited links

---

#### Phase 2 (Admin Link Management - Journey 3)

**Priority:** MEDIUM
**Goal:** Enable link creation and management

**Components to Build:**
1. **StatsCard** (custom)
2. **LinkTableRow** (custom)

**shadcn/ui Components Needed:**
- Table, Dropdown Menu, Dialog, Toast, Input, Select, Textarea, Label

**Estimated Effort:** 2-3 weeks

**Success Criteria:**
- Create link in <30 seconds
- Table sortable and filterable
- Mobile-responsive (card view)
- Copy URL to clipboard works
- Stats display correctly

---

#### Phase 3 (CV Update - Journey 4)

**Priority:** LOWER (Post-MVP)
**Goal:** AI-powered CV extraction and publishing

**Components to Build:**
1. **UploadZone** (custom)
2. **ProgressSteps** (custom)
3. **DiffViewer** (custom)

**shadcn/ui Components Needed:**
- Progress, Tabs, Textarea (JSON editor)

**Estimated Effort:** 3-4 weeks (including AI integration)

**Success Criteria:**
- Upload and extraction in <60 seconds
- 90%+ extraction accuracy
- Diff view clear and helpful
- Publish and rollback work correctly
- Version history functional

---

### Component Reusability

**High Reusability** (used across all journeys):
- Button (all journeys)
- Card (all journeys)
- Badge (all journeys)
- Separator (all journeys)

**Medium Reusability** (used in multiple journeys):
- SkillTag (Journey 1, 2, 4)
- StickyNav (Journey 1, 2, 3, 4)
- Toast (Journey 3, 4)
- Dialog (Journey 3, 4)

**Low Reusability** (single-use or specialized):
- PersonalMessageCard (Journey 2 only)
- InvitedAccessBadge (Journey 2 only)
- DiffViewer (Journey 4 only)
- UploadZone (Journey 4 only)
- ProgressSteps (Journey 4 only)
- LinkTableRow (Journey 3 only)

---

### Design System Alignment

**All components reflect "Professional Modern" design direction:**

✅ **Single-column, card-based layouts**
- All CV sections use Card components
- Content centered with max-width 1024px
- Clean, uncluttered presentation

✅ **Top navigation (sticky)**
- StickyNav component always visible
- Smooth scroll to sections
- Mobile hamburger menu

✅ **Medium density with generous whitespace**
- Spacing scale consistently applied
- Comfortable padding in cards (p-6)
- Section spacing (py-12 to py-16)

✅ **Progressive disclosure patterns**
- ProjectCard expandable inline
- ExperienceCard collapsible details
- PersonalMessageCard collapsible on mobile

✅ **Subtle elevation and depth**
- Default cards: shadow-sm
- Hover state: shadow-md
- Smooth transitions between states

✅ **Orange accent usage consistent**
- Primary buttons: Orange background
- Active nav links: Orange underline
- Focus states: Orange ring
- Hover states: Orange border

✅ **Smooth transitions and micro-interactions**
- All transitions 200-300ms
- Hover effects subtle (lift, color change)
- Loading states with skeleton screens
- Success states with checkmarks

---

### Key Takeaways

**For Developers:**

1. **Start with shadcn/ui:** Install and configure all needed components first
2. **Build Custom Components Incrementally:** Follow Phase 1 → 2 → 3 order
3. **Test as You Build:** Unit tests + accessibility tests for each component
4. **Use Design Tokens:** Stick to Tailwind classes and design token values
5. **Prioritize Accessibility:** WCAG AA compliance from the start, not an afterthought
6. **Mobile-First:** Design and develop for mobile, enhance for desktop
7. **Performance Matters:** Lazy load, memoize, virtualize when needed
8. **Consistent Patterns:** Reuse component patterns across similar components

**For Designers:**

1. **Consistency is Key:** All components follow same design language
2. **Orange Sparingly:** 10% orange accents, 90% monochrome base
3. **Whitespace Generously:** Medium density with breathing room
4. **Progressive Disclosure:** Don't overwhelm users, show details on demand
5. **Accessibility First:** Contrast, focus indicators, keyboard navigation
6. **Smooth Interactions:** Every transition should feel intentional and polished

**For Project Managers:**

1. **MVP First:** Phase 1 delivers core value (public + invited views)
2. **Iterative Development:** Each phase builds on the previous
3. **Realistic Timeline:** 3-4 weeks per phase (including testing)
4. **Quality Over Speed:** Accessibility and performance are non-negotiable
5. **User Feedback:** Test with real users after each phase

---

## Appendix

### Related Documents

- **UX Design Specification:** `/Users/rubeen/dev/personal/lebenslauf/docs/ux-design-specification.md`
- **User Journey Flows:** `/Users/rubeen/dev/personal/lebenslauf/docs/user-journey-flows.md`
- **Product Requirements:** `/Users/rubeen/dev/personal/lebenslauf/docs/PRD.md`
- **Color Theme Visualizer:** `/Users/rubeen/dev/personal/lebenslauf/docs/ux-color-themes.html`
- **Design Direction Mockups:** `/Users/rubeen/dev/personal/lebenslauf/docs/ux-design-directions-refined.html`

### Useful Resources

**shadcn/ui:**
- Documentation: https://ui.shadcn.com/
- GitHub: https://github.com/shadcn/ui

**Radix UI:**
- Documentation: https://www.radix-ui.com/
- Primitives: https://www.radix-ui.com/primitives

**Tailwind CSS:**
- Documentation: https://tailwindcss.com/docs
- Customization: https://tailwindcss.com/docs/theme

**Accessibility:**
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Axe DevTools: https://www.deque.com/axe/devtools/
- React ARIA: https://react-spectrum.adobe.com/react-aria/

**Testing:**
- React Testing Library: https://testing-library.com/react
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/

---

**Document Version:** 1.0
**Last Updated:** 2025-11-04
**Status:** Final - Ready for Implementation
