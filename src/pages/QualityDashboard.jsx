import { PageHeader, TableauEmbed } from '../components';
import { useTheme } from '../hooks';
import { EMBED_URLS } from '../constants';
import { VerifiedRounded } from '@mui/icons-material';

export default function QualityDashboard() {
  const { theme } = useTheme();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        icon={VerifiedRounded}
        title="Quality Dashboard"
        subtitle="Tableau-embedded quality metrics, compliance scores & trend analysis"
        gradient={`linear-gradient(135deg, ${theme.accent}, #003057)`}
      />
      <TableauEmbed url={EMBED_URLS.qualityTableau} title="Quality Dashboard" />
      <div style={{
        marginTop: '16px', padding: '12px 18px', backgroundColor: theme.surface,
        borderRadius: '10px', border: `1px solid ${theme.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: EMBED_URLS.qualityTableau ? theme.status.success : theme.status.warning }} />
        <span style={{ fontSize: '12px', color: theme.text.muted }}>
          {EMBED_URLS.qualityTableau ? 'Connected — Filters and interactions active' : 'Awaiting Tableau Public URL → src/constants/index.js'}
        </span>
      </div>
    </div>
  );
}
