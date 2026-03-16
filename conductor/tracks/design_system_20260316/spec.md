# Specification: Implement the design system for the UI

## Objective
Apply the newly provided design system to the entire MRI Scheduling application, translating static handoff materials (HTML/CSS/PNGs) into a cohesive, professional React UI.

## Context
- **Product:** MRI no-show prediction system.
- **Source Material:** Static handoff (HTML/CSS provided in `docs/design-handoff/`).
- **Scope:** Global typography/colors, Risk Dashboard (Calendar View), and Waitlist Management section.
- **Constraints:** Structural changes to React components are permitted to accurately match the new design layout.

## Requirements
1. **Global Styles & Components (Frontend):**
   - Extract design tokens (colors, fonts, spacing) from the handoff materials.
   - Create reusable base components (e.g., standard buttons, cards, headers) styled according to the new system.
2. **Dashboard & Calendar View (Frontend):**
   - Refactor the `CalendarView` and `Dashboard` components to utilize the new layout structure, typography, and color palette.
   - Ensure the high-risk highlighting and "Auto-Promote" action align with the new design cues.
3. **Waitlist Section (Frontend):**
   - Redesign the `Waitlist` table and layout to match the new visual language and urgency indicators.