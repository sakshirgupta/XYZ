import { PageHeader, TableauEmbed } from '../components';
import { useTheme } from '../hooks';
import { EMBED_URLS } from '../constants';
import { TrendingUpRounded } from '@mui/icons-material';

export default function SalesDashboard() {
  const { theme } = useTheme();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        icon={TrendingUpRounded}
        title="Sales Dashboard"
        subtitle="Tableau-embedded interactive sales analytics across all 10 outlets"
        gradient={`linear-gradient(135deg, ${theme.primary}, #0d5f5b)`}
      />
      <TableauEmbed url={EMBED_URLS.salesTableau} title="Sales Dashboard" />
      <div style={{
        marginTop: '16px', padding: '12px 18px', backgroundColor: theme.surface,
        borderRadius: '10px', border: `1px solid ${theme.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: EMBED_URLS.salesTableau ? theme.status.success : theme.status.warning }} />
        <span style={{ fontSize: '12px', color: theme.text.muted }}>
          {EMBED_URLS.salesTableau ? 'Connected — Filters and interactions active' : 'Awaiting Tableau Public URL → src/constants/index.js'}
        </span>
      </div>
    </div>
  );
}
