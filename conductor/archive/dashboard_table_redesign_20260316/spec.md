# Specification: Redesign Dashboard Table UI

## Objective
Update the "One Day Outlook" dashboard table to perfectly match the provided high-fidelity design screenshot. This involves changing the table structure, column layouts, and introducing new visual elements like status dots, prediction score progress bars, and a pagination footer.

## Context
- **Product:** MRI no-show prediction system.
- **Source Material:** Screenshot (`Screenshot 2026-03-16 at 23.06.39.png`).
- **Scope:** `Dashboard.tsx` and related CSS/components.

## Requirements
1. **Table Redesign (Frontend):**
   - Implement the new columns: `RISK`, `PATIENT NAME`, `SCAN TYPE`, `DATE & TIME`, and `PREDICTION SCORE`.
   - Add the visual "Risk" indicator (colored dot/triangle icon based on risk level).
   - Format `DATE & TIME` to show "Today / Tomorrow" relative text along with the specific time window (e.g., "09:00 AM - 10:00 AM").
   - Display the `PREDICTION SCORE` as both a percentage badge and a horizontal progress bar (using a library component or styled to look like the design).
   - Maintain the `Action` column at the end to keep the "Find a Backup" button, even though it's not in the screenshot.
2. **Pagination UI (Frontend):**
   - Add a footer below the table to visually mock pagination: "Showing 1 to 5 of 142 appointments" along with `<` and `>` arrow icons.
   - For this iteration, the pagination is visual only and does not need to handle real state.
3. **Styling Alignment:**
   - Adjust row padding, borders, typography colors, and font weights to strictly adhere to the professional design system outlined in the screenshot.