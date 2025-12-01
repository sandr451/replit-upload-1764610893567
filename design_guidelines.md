# Multi-Language Builder System - Design Guidelines

## Design Approach
**System-Based Design**: Following modern IDE/developer tool patterns inspired by VS Code, Linear, and CodeSandbox. Emphasis on functional clarity, efficient workflows, and distraction-free coding experience.

## Layout System

**Spacing Scale**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Component padding: p-4, p-6
- Section gaps: gap-4, gap-6
- Margins: m-2, m-4

**Grid Structure**:
- Single-column mobile layout
- Two-panel horizontal split on desktop (60/40 editor-to-output ratio)
- Resizable divider between panels (minimum 300px per panel)

## Typography

**Font Families**:
- UI Text: Inter (400, 500, 600 weights)
- Code/Monospace: JetBrains Mono (400, 500 weights)

**Type Scale**:
- Headers: text-lg font-semibold
- Body/Labels: text-sm font-medium
- Code: text-sm (monospace)
- Console output: text-xs (monospace)
- Buttons: text-sm font-medium

## Component Library

**Header Bar** (h-14, fixed top):
- Logo/title (left)
- Language selector dropdown (center-left)
- Compile & Run button (right, px-6 py-2, rounded-md)
- Template selector button (far right)

**Editor Panel** (flex-1):
- Line numbers gutter (w-12)
- Code editor area with syntax highlighting
- Tab bar for multiple files (h-10, if needed)
- Status bar at bottom (h-8, showing language, line/column)

**Output Console Panel** (flex-1):
- Tab navigation: Output / Errors / Warnings (h-10)
- Scrollable console area with monospace text
- Clear output button (top-right, icon button)
- Auto-scroll toggle

**Language Selector Dropdown**:
- Rounded-lg, px-4 py-2
- Icons for each language (Python, C, C++)
- Active language indicator

**Code Templates Modal** (when opened):
- Centered overlay (max-w-2xl)
- Grid of template cards (grid-cols-2 gap-4)
- Each card: Language icon, title, description
- Close button (top-right)

## Interactions

**Editor Behavior**:
- Tab for indentation
- Ctrl/Cmd+Enter to compile and run
- Syntax highlighting updates in real-time
- Auto-save indication (subtle status text)

**Panel Resizing**:
- Draggable divider (w-1, cursor-col-resize)
- Smooth resize without jank
- Snap to minimum widths

**Compile & Run Button**:
- Primary CTA styling
- Loading spinner during compilation
- Success/error state feedback (brief, 2s)

## Visual Hierarchy

**Emphasis Levels**:
1. Primary: Compile & Run button
2. Secondary: Language selector, code editor
3. Tertiary: Console output, status information
4. Minimal: Line numbers, helper text

**Borders & Dividers**:
- Panel divider: border-r
- Console tabs: border-b-2 (active tab indicator)
- Header: border-b
- Subtle borders throughout for definition

## Accessibility

- All interactive elements min-h-10 (touch targets)
- Keyboard shortcuts documented in UI
- Focus indicators on all inputs/buttons
- ARIA labels for icon-only buttons
- High contrast code syntax highlighting
- Resizable text in console (zoom support)

## Error & Success States

**Compilation Errors**:
- Error message panel (border-l-4 accent, p-4)
- Line number references as clickable links
- Error count badge in console tab

**Successful Compilation**:
- Brief success indicator (2s fade)
- Output streams to console immediately

## Performance Considerations

- Code editor uses virtualization for large files
- Debounced syntax highlighting (150ms)
- Lazy-load language parsers
- Console output truncation after 10,000 lines (with "show more")

---

**Critical Constraint**: This is a productivity tool—prioritize speed, clarity, and keyboard-driven workflows over visual embellishments. Every pixel should serve the developer's efficiency.