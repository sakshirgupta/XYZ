import { useTheme } from '../../hooks';

export default function KpiCard({ title, value, subtitle, trend, icon: Icon }) {
  const { theme } = useTheme();
  const trendColor =
    trend === 'up' ? theme.status.success : trend === 'down' ? theme.status.danger : theme.text.muted;

  return (
    <div
      className="kpi-card"
      style={{
        backgroundColor: theme.card.bg,
        border: `1px solid ${theme.card.border}`,
        borderRadius: '14px',
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: theme.text.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            {title}
          </p>
          <h3 style={{ margin: '8px 0 4px', fontSize: '26px', fontWeight: 700, color: theme.text.primary, letterSpacing: '-0.5px' }}>
            {value}
          </h3>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: trendColor, display: 'flex', alignItems: 'center', gap: '3px' }}>
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'} {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div style={{
            width: '42px', height: '42px', borderRadius: '11px',
            background: `linear-gradient(135deg, ${theme.primary}15, ${theme.primary}08)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon style={{ fontSize: '20px', color: theme.primary }} />
          </div>
        )}
      </div>
    </div>
  );
}
