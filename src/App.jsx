import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme';
import { Layout } from './components';
import { Home, SalesDashboard, QualityDashboard, SalesInsights, QualityInsights, About } from './pages';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="sales-dashboard" element={<SalesDashboard />} />
            <Route path="quality-dashboard" element={<QualityDashboard />} />
            <Route path="sales-insights" element={<SalesInsights />} />
            <Route path="quality-insights" element={<QualityInsights />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
