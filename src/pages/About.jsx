import { useTheme } from '../hooks';
import { PageHeader } from '../components';
import { brandColors } from '../theme';
import {
  InfoRounded, StorefrontRounded, DatasetRounded,
  BuildRounded, PaletteRounded, ArchitectureRounded,
} from '@mui/icons-material';

export default function About() {
  const { theme } = useTheme();

  const sections = [
    {
      icon: <StorefrontRounded />,
      title: 'About This Project',
      content: 'This analytics portal was built for XYZ Retail Chain — a Bangalore-based retailer with 10 outlets. It provides a unified platform combining Tableau/Power BI embedded dashboards with React-powered interactive analytics, demonstrating full-stack data visualization capabilities.',
    },
    {
      icon: <DatasetRounded />,
      title: 'Data Sources',
      items: [
        'xyz_Sales (120 records) — Monthly revenue, transactions, footfall, margins, profit & satisfaction by outlet',
        'xyz_Quality (120 records) — Defect rates, complaints, audit scores, compliance & cleanliness by outlet',
        'xyz_Colours — Brand palette: Teal, Razzmatazz, Yale Blue, Amethyst Smoke, White Smoke',
        'xyz_Logo — Official brand logo in PNG format',
      ],
    },
    {
      icon: <ArchitectureRounded />,
      title: 'Architecture & Design Decisions',
      items: [
        'Pre-processed Excel → JSON at build time for zero-runtime parsing overhead',
        'Custom hooks (useSalesData, useQualityData) with memoized filtering',
        'Theme context with localStorage persistence for dark/light mode',
        'Recharts for responsive, interactive SVG charts with theme-aware colors',
        'Tableau embed via Web Component API; Power BI via iframe embed',
        'Component-driven architecture: ui/, layout/, embed/, charts/ separation',
        'CSS-in-JS with theme tokens — no CSS class conflicts, full type safety',
      ],
    },
    {
      icon: <BuildRounded />,
      title: 'Technology Stack',
      items: [
        'React 19 + Vite 8 — Lightning-fast HMR and build tooling',
        'React Router v7 — Client-side routing with nested layouts',
        'Recharts — Declarative SVG charts (Area, Bar, Radar, Pie, Composed)',
        'Material UI Icons — Consistent iconography across the app',
        'Tableau Public — Dashboard hosting & JS API embed',
        'Power BI Embedded — iframe-based dashboard integration',
        'Inter (Google Fonts) — Typography consistent with Tableau dashboards',
      ],
    },
  ];

  const colorSwatches = [
    { name: 'Teal', hex: brandColors.teal },
    { name: 'Razzmatazz', hex: brandColors.razzmatazz },
    { name: 'Yale Blue', hex: brandColors.yaleBlue },
    { name: 'Amethyst Smoke', hex: brandColors.amethystSmoke },
    { name: 'White Smoke', hex: brandColors.whiteSmoke },
  ];

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <PageHeader
        icon={InfoRounded}
        title="About"
        subtitle="Project overview, architecture, and design decisions"
        gradient={`linear-gradient(135deg, ${theme.accent}, ${theme.muted})`}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sections.map(({ icon, title, content, items }) => (
          <div key={title} style={{
            backgroundColor: theme.card.bg, border: `1px solid ${theme.card.border}`,
            borderRadius: '14px', padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ color: theme.primary, display: 'flex' }}>{icon}</span>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>{title}</h2>
            </div>
            {content && <p style={{ margin: 0, fontSize: '13px', color: theme.text.secondary, lineHeight: 1.7 }}>{content}</p>}
            {items && (
              <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map((item, i) => (
                  <li key={i} style={{ fontSize: '13px', color: theme.text.secondary, lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Color Palette */}
        <div style={{ backgroundColor: theme.card.bg, border: `1px solid ${theme.card.border}`, borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ color: theme.primary, display: 'flex' }}><PaletteRounded /></span>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>Brand Color Palette</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {colorSwatches.map(({ name, hex }) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', height: '48px', borderRadius: '8px', backgroundColor: hex, border: `1px solid ${theme.border}` }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: theme.text.primary }}>{name}</span>
                <span style={{ fontSize: '10px', color: theme.text.muted, fontFamily: 'monospace' }}>{hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '28px', color: theme.text.muted, fontSize: '12px' }}>
        XYZ Retail Chain — Empowering Smarter Retail • 2026
      </div>
    </div>
  );
}
