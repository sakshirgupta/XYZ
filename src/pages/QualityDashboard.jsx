import { PageHeader, PowerBIEmbed } from '../components';
import { useTheme } from '../hooks';
import { EMBED_URLS } from '../constants';
import { VerifiedRounded, PictureAsPdfRounded } from '@mui/icons-material';

export default function QualityDashboard() {
  const { theme } = useTheme();

  return (
    <div>
      <PageHeader
        icon={VerifiedRounded}
        title="Quality Dashboard"
        subtitle="Quality metrics, compliance scores & trend analysis across all 10 outlets"
        gradient={`linear-gradient(135deg, ${theme.accent}, #003057)`}
      />
      <PowerBIEmbed url={EMBED_URLS.qualityPowerBI} title="Quality Dashboard — Power BI" />

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
          src="/Quality%20Dashboard.pdf"
          title="Quality Dashboard PDF"
          style={{
            width: '100%', height: '600px', border: 'none', borderRadius: '10px',
            backgroundColor: theme.surface,
          }}
        />
        <a
          href="/Quality%20Dashboard.pdf"
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
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: theme.status.success }} />
        <span style={{ fontSize: '12px', color: theme.text.muted }}>
          Connected — Filters and interactions active (requires org sign-in; PDF fallback available)
        </span>
      </div>
    </div>
  );
}
