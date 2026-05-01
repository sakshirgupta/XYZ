export const brandColors = {
  teal: '#18837E',
  razzmatazz: '#DB3069',
  yaleBlue: '#004975',
  amethystSmoke: '#9882AC',
  whiteSmoke: '#F2F2F2',
};

export const lightTheme = {
  mode: 'light',
  primary: brandColors.teal,
  secondary: brandColors.razzmatazz,
  accent: brandColors.yaleBlue,
  muted: brandColors.amethystSmoke,
  background: '#F8FAFB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  border: '#E2E8F0',
  shadow: 'rgba(15, 23, 42, 0.06)',
  shadowMd: 'rgba(15, 23, 42, 0.1)',
  shadowLg: 'rgba(15, 23, 42, 0.12)',
  sidebar: {
    bg: '#FFFFFF',
    hover: 'rgba(24, 131, 126, 0.06)',
    active: 'rgba(24, 131, 126, 0.1)',
    border: '#F1F5F9',
  },
  card: {
    bg: '#FFFFFF',
    border: '#E2E8F0',
    hoverBorder: '#CBD5E1',
  },
  chart: {
    grid: '#F1F5F9',
    tooltip: '#FFFFFF',
    colors: ['#18837E', '#DB3069', '#004975', '#9882AC', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#14B8A6', '#8B5CF6'],
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
};

export const darkTheme = {
  mode: 'dark',
  primary: '#2DD4BF',
  secondary: '#F472B6',
  accent: '#60A5FA',
  muted: '#C4B5D0',
  background: '#0B1120',
  surface: '#151D2E',
  surfaceElevated: '#1C2640',
  text: {
    primary: '#F1F5F9',
    secondary: '#CBD5E1',
    muted: '#64748B',
    inverse: '#0F172A',
  },
  border: '#1E293B',
  shadow: 'rgba(0, 0, 0, 0.25)',
  shadowMd: 'rgba(0, 0, 0, 0.35)',
  shadowLg: 'rgba(0, 0, 0, 0.45)',
  sidebar: {
    bg: '#111827',
    hover: 'rgba(45, 212, 191, 0.08)',
    active: 'rgba(45, 212, 191, 0.14)',
    border: '#1E293B',
  },
  card: {
    bg: '#151D2E',
    border: '#1E293B',
    hoverBorder: '#334155',
  },
  chart: {
    grid: '#1E293B',
    tooltip: '#1C2640',
    colors: ['#2DD4BF', '#F472B6', '#60A5FA', '#C4B5D0', '#FBBF24', '#34D399', '#818CF8', '#F9A8D4', '#5EEAD4', '#A78BFA'],
  },
  status: {
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
  },
};
