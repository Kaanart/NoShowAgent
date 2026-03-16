# Specification: Implement dashboard with left menu and calendar updates

## Objective
Implement a new main layout for the MRI Scheduling application that includes a persistent left-hand sidebar navigation menu. Update the existing views based on user selection, and modify the Calendar View to display weekdays only.

## Context
- **Product:** MRI no-show prediction system.
- **Source Material:** Screenshot provided by the user.
- **Scope:** Main `App.tsx` layout, new `Sidebar` component, and updates to `CalendarView.tsx`.
- **Navigation:** Simple state-based view toggling (no React Router yet).

## Requirements
1. **Sidebar Navigation (Frontend):**
   - Create a `Sidebar` component with links for "Daily Dashboard" and "Schedule".
   - Include the "MedSchedule" branding at the top and a simple user profile placeholder at the bottom.
   - Implement a responsive design where the sidebar collapses into a hamburger menu on smaller screens (mobile/tablet).
2. **Main Layout Integration (Frontend):**
   - Update `App.tsx` to use a CSS grid or flexbox layout with the `Sidebar` on the left and the main content area on the right.
   - Use React state to track the active view ("Daily Dashboard" vs "Schedule") and render the corresponding components.
3. **Calendar View Updates (Frontend):**
   - Update the `CalendarView` to only show Monday through Friday (removing Saturday and Sunday columns).
   - Ensure the layout and styling adjust appropriately for a 5-day week instead of 7.