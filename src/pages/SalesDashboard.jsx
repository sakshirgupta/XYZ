import { PageHeader, TableauEmbed, PowerBIEmbed } from '../components';
import { useTheme } from '../hooks';
import { EMBED_URLS } from '../constants';
import { TrendingUpRounded, PictureAsPdfRounded } from '@mui/icons-material';

export default function SalesDashboard() {
  const { theme } = useTheme();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        icon={TrendingUpRounded}
        title="Sales Dashboard"
        subtitle="Interactive sales analytics across all 10 outlets"
        gradient={`linear-gradient(135deg, ${theme.primary}, #0d5f5b)`}
      />
      <TableauEmbed url={EMBED_URLS.salesTableau} title="Sales Dashboard — Tableau" />
      {EMBED_URLS.salesPowerBI && (
        <div style={{ marginTop: '24px' }}>
          <PowerBIEmbed url={EMBED_URLS.salesPowerBI} title="Sales Dashboard — Power BI" />
        </div>
      )}

      {/* PDF Fallback */}
      <div style={{
        marginTop: '24px', padding: '20px', backgroundColor: theme.surface,
        borderRadius: '14px', border: `1px solid ${theme.card.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <PictureAsPdfRounded style={{ color: theme.secondary, fontSize: '20px' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: theme.text.primary }}>
            Dashboard Preview (PDF)
          </span>
          <span style={{ fontSize: '11px', color: theme.text.muted }}>
            — If the interactive embed requires sign-in, view the static version below
          </span>
        </div>
        <iframe
          src="/Sales%20Dashboard.pdf"
          title="Sales Dashboard PDF"
          style={{
            width: '100%', height: '600px', border: 'none', borderRadius: '10px',
            backgroundColor: theme.surface,
          }}
        />
        <a
          href="/Sales%20Dashboard.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block', marginTop: '10px', fontSize: '12px',
            color: theme.primary, textDecoration: 'none', fontWeight: 500,
          }}
        >
          Open PDF in new tab ↗
        </a>
      </div>

      <div style={{
        marginTop: '16px', padding: '12px 18px', backgroundColor: theme.surface,
        borderRadius: '10px', border: `1px solid ${theme.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: (EMBED_URLS.salesTableau || EMBED_URLS.salesPowerBI) ? theme.status.success : theme.status.warning }} />
        <span style={{ fontSize: '12px', color: theme.text.muted }}>
          {(EMBED_URLS.salesTableau || EMBED_URLS.salesPowerBI) ? 'Connected — Filters and interactions active' : 'Awaiting embed URL → src/constants/index.js'}
        </span>
      </div>
    </div>
  );
}
