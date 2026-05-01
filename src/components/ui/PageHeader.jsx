import { useTheme } from '../../hooks';

export default function PageHeader({ icon: Icon, title, subtitle, gradient }) {
  const { theme } = useTheme();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
      {Icon && (
        <div style={{
          width: '46px', height: '46px', borderRadius: '13px',
          background: gradient || `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: `0 4px 14px ${theme.shadow}`,
        }}>
          <Icon style={{ fontSize: '22px' }} />
        </div>
      )}
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.text.primary, letterSpacing: '-0.5px' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '3px 0 0', fontSize: '13px', color: theme.text.muted }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
