import { useTheme } from '../../hooks';

export default function PowerBIEmbed({ url, title }) {
  const { theme } = useTheme();

  if (!url) {
    return (
      <div style={{
        width: '100%', height: '680px', borderRadius: '14px',
        border: `2px dashed ${theme.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        backgroundColor: theme.surface,
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.accent}12, ${theme.secondary}12)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
        }}>
          📈
        </div>
        <div style={{ textAlign: 'center', maxWidth: '380px' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>
            {title || 'Dashboard'} — Awaiting Power BI URL
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: theme.text.muted, lineHeight: 1.6 }}>
            Update <code style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${theme.accent}10`, color: theme.accent }}>
              src/constants/index.js
            </code> with the Power BI embed URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title={title}
      src={url}
      style={{
        width: '100%',
        height: '680px',
        border: 'none',
        borderRadius: '14px',
        boxShadow: `0 2px 16px ${theme.shadow}`,
      }}
      allowFullScreen
    />
  );
}
