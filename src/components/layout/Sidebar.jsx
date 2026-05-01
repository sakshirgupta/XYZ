import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../hooks';
import { NAV_ITEMS } from '../../constants';
import { DarkModeRounded, LightModeRounded, MenuRounded, ChevronLeftRounded } from '@mui/icons-material';

export default function Sidebar() {
  const { theme, mode, toggleTheme } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const width = collapsed ? '68px' : '256px';

  return (
    <>
      {/* Mobile toggle */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
        position: 'fixed', top: 14, left: 14, zIndex: 1001,
        width: 38, height: 38, borderRadius: '10px', border: 'none',
        background: theme.primary, color: '#fff', cursor: 'pointer',
        display: 'none', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 2px 12px ${theme.shadowMd}`,
      }}>
        <MenuRounded fontSize="small" />
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'none',
      }} />}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`} style={{
        width, minWidth: width, height: '100vh', position: 'sticky', top: 0,
        backgroundColor: theme.sidebar.bg, borderRight: `1px solid ${theme.sidebar.border}`,
        display: 'flex', flexDirection: 'column', zIndex: 1000,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '18px 14px' : '20px 18px',
          borderBottom: `1px solid ${theme.sidebar.border}`,
          display: 'flex', alignItems: 'center', gap: '12px', minHeight: '72px',
        }}>
          <img src="/xyz_Logo.png" alt="XYZ" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: theme.text.primary }}>XYZ Analytics</div>
              <div style={{ fontSize: '11px', color: theme.text.muted }}>Retail Intelligence</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon, badge }) => {
            const active = location.pathname === path;
            return (
              <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '11px',
                padding: collapsed ? '11px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '9px', marginBottom: '2px', textDecoration: 'none',
                color: active ? theme.primary : theme.text.secondary,
                backgroundColor: active ? theme.sidebar.active : 'transparent',
                fontWeight: active ? 600 : 400, fontSize: '13px',
                transition: 'all 0.15s ease', position: 'relative',
              }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = theme.sidebar.hover; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {active && <div style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: '3px', height: '18px', borderRadius: '0 3px 3px 0', backgroundColor: theme.primary,
                }} />}
                <Icon style={{ fontSize: '19px', flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                )}
                {!collapsed && badge && (
                  <span style={{
                    fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                    backgroundColor: badge === 'React' ? `${theme.primary}15` : `${theme.accent}15`,
                    color: badge === 'React' ? theme.primary : theme.accent,
                    textTransform: 'uppercase', letterSpacing: '0.4px',
                  }}>{badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 8px', borderTop: `1px solid ${theme.sidebar.border}` }}>
          <button onClick={toggleTheme} style={{
            display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
            padding: collapsed ? '10px 0' : '10px 14px', justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '9px', border: 'none', background: 'transparent',
            color: theme.text.secondary, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.sidebar.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {mode === 'dark' ? <LightModeRounded style={{ fontSize: '19px' }} /> : <DarkModeRounded style={{ fontSize: '19px' }} />}
            {!collapsed && <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} style={{
            display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
            padding: collapsed ? '10px 0' : '10px 14px', justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '9px', border: 'none', background: 'transparent',
            color: theme.text.muted, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.sidebar.hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ChevronLeftRounded style={{ fontSize: '18px', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
