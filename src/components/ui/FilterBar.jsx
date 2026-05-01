import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks';

function MultiSelect({ options, selected, onChange, placeholder, theme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (value) => {
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    onChange(next);
  };

  const label = selected.length === 0 ? placeholder : selected.length <= 2 ? selected.join(', ') : `${selected.length} selected`;

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: '180px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '8px 14px', borderRadius: '8px', border: `1px solid ${theme.border}`,
          backgroundColor: theme.surface, color: selected.length ? theme.text.primary : theme.text.muted,
          fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ fontSize: '10px', marginLeft: '8px' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
          backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px',
          boxShadow: `0 4px 16px ${theme.shadow}`, zIndex: 100, maxHeight: '220px', overflowY: 'auto',
        }}>
          {options.map((opt) => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
              cursor: 'pointer', fontSize: '13px', color: theme.text.primary,
              backgroundColor: selected.includes(opt) ? `${theme.primary}10` : 'transparent',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${theme.primary}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selected.includes(opt) ? `${theme.primary}10` : 'transparent'; }}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                style={{ accentColor: theme.primary }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterBar({ outlets, months, selectedOutlets, selectedMonths, onOutletChange, onMonthChange, onReset }) {
  const { theme } = useTheme();

  const hasFilter = selectedOutlets.length > 0 || selectedMonths.length > 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <MultiSelect options={outlets} selected={selectedOutlets} onChange={onOutletChange} placeholder="All Outlets" theme={theme} />
      <MultiSelect options={months} selected={selectedMonths} onChange={onMonthChange} placeholder="All Months" theme={theme} />
      {hasFilter && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: `${theme.secondary}15`,
            color: theme.secondary,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
