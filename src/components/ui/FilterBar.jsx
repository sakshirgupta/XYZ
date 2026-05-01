import { useTheme } from '../../hooks';

export default function FilterBar({ outlets, months, selectedOutlet, selectedMonth, onOutletChange, onMonthChange, onReset }) {
  const { theme } = useTheme();

  const selectStyle = {
    padding: '8px 14px',
    borderRadius: '8px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.surface,
    color: theme.text.primary,
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '160px',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <select value={selectedOutlet} onChange={(e) => onOutletChange(e.target.value)} style={selectStyle}>
        <option value="">All Outlets</option>
        {outlets.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <select value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)} style={selectStyle}>
        <option value="">All Months</option>
        {months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      {(selectedOutlet || selectedMonth) && (
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
