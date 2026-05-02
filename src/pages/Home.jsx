import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks';
import { KpiCard, ChartCard } from '../components';
import { useSalesData, useQualityData } from '../hooks';
import { formatCurrency, formatNumber, computeKPI, computeCrossDatasetCorrelation } from '../utils';
import {
  StorefrontRounded, TrendingUpRounded, VerifiedRounded,
  InsightsRounded, AssessmentRounded, PaidRounded,
} from '@mui/icons-material';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

export default function Home() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { allData: salesData } = useSalesData();
  const { allData: qualityData } = useQualityData();

  const totalRevenue = computeKPI(salesData, 'Monthly_Revenue_INR');
  const totalProfit = computeKPI(salesData, 'Net_Profit_INR');
  const avgSatisfaction = computeKPI(salesData, 'Customer_Satisfaction_Score', 'avg');
  const avgQualityScore = computeKPI(qualityData, 'Audit_Compliance_Score', 'avg');

  const crossData = useMemo(() => computeCrossDatasetCorrelation(salesData, qualityData), [salesData, qualityData]);
  const outletHealthRadar = useMemo(() => {
    if (!salesData.length || !qualityData.length) return [];
    const profitMargin = (computeKPI(salesData, 'Net_Profit_INR') / computeKPI(salesData, 'Monthly_Revenue_INR')) * 100;
    return [
      { metric: 'Satisfaction', value: avgSatisfaction * 20, fullMark: 100 },
      { metric: 'Audit Score', value: avgQualityScore, fullMark: 100 },
      { metric: 'Profit Margin', value: profitMargin, fullMark: 100 },
      { metric: 'Fulfillment', value: computeKPI(qualityData, 'Order_Fulfillment_Accuracy_pct', 'avg'), fullMark: 100 },
      { metric: 'Shelf Avail', value: computeKPI(qualityData, 'On_Shelf_Availability_pct', 'avg'), fullMark: 100 },
    ];
  }, [salesData, qualityData, avgSatisfaction, avgQualityScore]);

  const dashboards = [
    { path: '/sales-dashboard', title: 'Sales Dashboard', desc: 'Power BI revenue analytics with outlet comparisons', badge: 'Power BI', gradient: `linear-gradient(135deg, ${theme.primary}, #0d5f5b)` },
    { path: '/quality-dashboard', title: 'Quality Dashboard', desc: 'Power BI quality metrics and compliance tracking', badge: 'Power BI', gradient: `linear-gradient(135deg, ${theme.accent}, #003057)` },
    { path: '/sales-insights', title: 'Sales Insights', desc: 'Interactive React charts: revenue trends, margins & footfall', badge: 'React', gradient: `linear-gradient(135deg, ${theme.secondary}, #9e1d4a)` },
    { path: '/quality-insights', title: 'Quality Insights', desc: 'React-driven analysis: defect rates, compliance & scores', badge: 'React', gradient: `linear-gradient(135deg, ${theme.muted}, #6b5a80)` },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}08, ${theme.accent}05, ${theme.secondary}04)`,
        borderRadius: '20px', padding: '44px 36px', marginBottom: '28px',
        position: 'relative', overflow: 'hidden', border: `1px solid ${theme.border}`,
      }}>
        <div style={{
          position: 'absolute', top: '-40%', right: '-5%', width: '350px', height: '350px',
          borderRadius: '50%', background: `radial-gradient(circle, ${theme.primary}08, transparent)`,
        }} />
        <div style={{ position: 'relative' }}>
          <img src="/xyz_Logo.png" alt="XYZ" style={{ height: '44px', marginBottom: '14px', objectFit: 'contain' }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: `${theme.primary}12`, padding: '5px 12px', borderRadius: '16px', marginBottom: '14px',
          }}>
            <StorefrontRounded style={{ fontSize: '14px', color: theme.primary }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              10 Outlets • Bangalore
            </span>
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: '32px', fontWeight: 800, color: theme.text.primary, letterSpacing: '-0.8px', lineHeight: 1.2 }}>
            Sales & Quality Analytics Portal
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: theme.text.secondary, maxWidth: '480px', lineHeight: 1.6 }}>
            Unified intelligence platform combining Power BI dashboards with React-powered interactive insights.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <KpiCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle="FY 2024" trend="up" icon={PaidRounded} />
        <KpiCard title="Net Profit" value={formatCurrency(totalProfit)} subtitle="All outlets" trend="up" icon={TrendingUpRounded} />
        <KpiCard title="Satisfaction" value={avgSatisfaction.toFixed(1) + '/5'} subtitle="Customer avg" trend="up" icon={InsightsRounded} />
        <KpiCard title="Audit Score" value={avgQualityScore.toFixed(1) + '%'} subtitle="Compliance avg" trend="up" icon={VerifiedRounded} />
      </div>

      {/* Dashboard Cards */}
      <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 700, color: theme.text.primary }}>Dashboards</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {dashboards.map(({ path, title, desc, badge, gradient }) => (
          <div key={path} onClick={() => navigate(path)} style={{
            backgroundColor: theme.card.bg, border: `1px solid ${theme.card.border}`,
            borderRadius: '14px', padding: '24px', cursor: 'pointer', transition: 'all 0.25s ease',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.card.hoverBorder; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${theme.shadow}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.card.border; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                {badge === 'Power BI' ? <AssessmentRounded style={{ fontSize: '18px' }} /> : <InsightsRounded style={{ fontSize: '18px' }} />}
              </div>
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '3px 7px', borderRadius: '4px',
                backgroundColor: badge === 'React' ? `${theme.primary}12` : `${theme.accent}12`,
                color: badge === 'React' ? theme.primary : theme.accent,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{badge}</span>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: theme.text.primary }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '12px', color: theme.text.muted, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Cross-Dataset Intelligence */}
      <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 700, color: theme.text.primary }}>Cross-Dataset Intelligence</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <ChartCard title="Quality Index vs Revenue" subtitle="Does higher quality drive more revenue? Each dot = outlet">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" dataKey="qualityIndex" name="Quality Index" tick={{ fontSize: 10, fill: theme.text.muted }} domain={['auto', 'auto']} />
              <YAxis type="number" dataKey="revenue" name="Revenue (Cr)" unit="Cr" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <Tooltip contentStyle={{ backgroundColor: theme.chart.tooltip, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '12px' }} formatter={(v, name) => name === 'Revenue (Cr)' ? `₹${v.toFixed(2)}Cr` : v.toFixed(2)} />
              <Scatter data={crossData} fillOpacity={0.7}>
                {crossData.map((_, i) => <Cell key={i} fill={theme.chart.colors[i % theme.chart.colors.length]} r={8} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Overall Health Radar" subtitle="Aggregate KPIs normalized to 100 — a snapshot of chain performance">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={outletHealthRadar} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke={theme.chart.grid} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: theme.text.muted }} domain={[0, 100]} />
              <Radar dataKey="value" stroke={theme.chart.colors[0]} fill={theme.chart.colors[0]} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: theme.text.muted, fontSize: '12px' }}>
        XYZ Retail Chain Analytics Portal • React + Power BI
      </div>
    </div>
  );
}
