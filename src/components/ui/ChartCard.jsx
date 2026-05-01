import { useTheme } from '../../hooks';

export default function ChartCard({ title, subtitle, children, height = 300 }) {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.card.bg,
      border: `1px solid ${theme.card.border}`,
      borderRadius: '14px',
      padding: '20px 24px',
      height: 'auto',
    }}>
      {title && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: theme.text.primary }}>{title}</h3>
          {subtitle && <p style={{ margin: '2px 0 0', fontSize: '12px', color: theme.text.muted }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ width: '100%', height }}>{children}</div>
    </div>
  );
}
