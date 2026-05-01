import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks';

export default function TableauEmbed({ url, title }) {
  const containerRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!url || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = '';

    const viz = document.createElement('tableau-viz');
    viz.setAttribute('src', url);
    viz.setAttribute('width', '100%');
    viz.setAttribute('height', '100%');
    viz.setAttribute('toolbar', 'bottom');
    viz.setAttribute('hide-tabs', 'true');
    el.appendChild(viz);

    return () => { el.innerHTML = ''; };
  }, [url]);

  if (!url) return <EmbedPlaceholder title={title} type="Tableau" theme={theme} />;

  return (
    <div ref={containerRef} style={{
      width: '100%', height: '680px', borderRadius: '14px', overflow: 'hidden',
      backgroundColor: theme.surface, border: `1px solid ${theme.card.border}`,
      boxShadow: `0 2px 16px ${theme.shadow}`,
    }} />
  );
}

function EmbedPlaceholder({ title, type, theme }) {
  return (
    <div style={{
      width: '100%', height: '680px', borderRadius: '14px',
      border: `2px dashed ${theme.border}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
      backgroundColor: theme.surface,
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: `linear-gradient(135deg, ${theme.primary}12, ${theme.accent}12)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
      }}>
        📊
      </div>
      <div style={{ textAlign: 'center', maxWidth: '380px' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>
          {title || 'Dashboard'} — Awaiting {type} URL
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: theme.text.muted, lineHeight: 1.6 }}>
          Update <code style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${theme.primary}10`, color: theme.primary }}>
            src/constants/index.js
          </code> with the published {type} URL to activate this embed.
        </p>
      </div>
    </div>
  );
}
