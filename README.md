# XYZ Retail Chain – Sales & Quality Analytics Portal

A unified analytics web application for XYZ Retail Chain (10 outlets, Bangalore) combining embedded Tableau dashboards with React-powered interactive insights.

## Design Choices

- **Sidebar navigation** with dark teal branding for clear visual separation; dark/light theme toggle for user preference
- **Dual analytics approach**: Tableau Public embeds for published dashboards + custom Recharts visualizations for interactive, filterable insights
- **Brand-first UI**: XYZ colour palette (Teal, Razzmatazz, Yale Blue, Amethyst Smoke) applied consistently across charts, cards, and navigation
- **Inter font** used throughout the app and Tableau dashboards for visual harmony
- **Component architecture**: separated into `ui/`, `layout/`, `embed/` modules for maintainability
- **Pre-processed data**: Excel → JSON at build time (no runtime parsing); custom hooks with memoized filtering for performance
- **Multi-select filters**: users can select multiple outlets and months simultaneously for flexible analysis
- **CSS-in-JS with theme tokens**: ensures consistent spacing, colours, and responsive behaviour without class conflicts

## Assumptions

- Data provided (xyz_Sales, xyz_Quality) is clean and ready for analysis
- 120 records per dataset — 10 outlets × 12 months
- KPIs are derived via aggregation (sum/avg) and calculated fields (profit margin, cost ratio, quality index)
- Tableau dashboards are published to Tableau Public; URLs are configured in `src/constants/index.js`
- The app is intended as a demonstration/interview submission, not a production deployment

## How to Run

**Prerequisites**: Node.js 18+ installed

```bash

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

**To build for production:**

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19 + Vite 8
- React Router v7
- Recharts (interactive SVG charts)
- MUI Icons
- Tableau JS API (embed)

