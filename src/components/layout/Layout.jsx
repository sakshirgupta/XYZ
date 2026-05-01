import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../hooks';

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      backgroundColor: theme.background, color: theme.text.primary,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <Sidebar />
      <main className="main-content" style={{ flex: 1, padding: '28px 32px', overflow: 'auto', maxWidth: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}
