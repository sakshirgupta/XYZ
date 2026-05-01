import { useMemo } from 'react';
import { PageHeader, KpiCard, FilterBar, ChartCard } from '../components';
import { useSalesData, useFilters, useTheme } from '../hooks';
import {
  formatCurrency, formatNumber, computeKPI, computeGrowth,
  aggregateMonthly, aggregateByOutlet,
  computeProfitMarginByOutlet, computeOperatingCostRatio,
  computeRevenuePerFootfall, computeMonthlyProfitMargin,
} from '../utils';
import { InsightsRounded, PaidRounded, PeopleRounded, ShoppingCartRounded, TrendingUpRounded, AccountBalanceWalletRounded } from '@mui/icons-material';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, ScatterChart, Scatter,
} from 'recharts';

export default function SalesInsights() {
  const { theme } = useTheme();
  const { outlets: selectedOutlets, months: selectedMonths, setOutlets, setMonths, reset, filters } = useFilters();
  const { data, outlets, months } = useSalesData(filters);

  const kpis = useMemo(() => ({
    revenue: computeKPI(data, 'Monthly_Revenue_INR'),
    profit: computeKPI(data, 'Net_Profit_INR'),
    transactions: computeKPI(data, 'Transactions'),
    footfall: computeKPI(data, 'Footfall'),
    avgBill: computeKPI(data, 'Avg_Bill_Value_INR', 'avg'),
    margin: computeKPI(data, 'Gross_Margin_pct', 'avg'),
    conversion: computeKPI(data, 'Conversion_Rate_pct', 'avg'),
    growth: computeGrowth(data, 'Monthly_Revenue_INR'),
    costRatio: data.length ? (computeKPI(data, 'Operating_Cost_INR') / computeKPI(data, 'Monthly_Revenue_INR') * 100) : 0,
    profitMargin: data.length ? (computeKPI(data, 'Net_Profit_INR') / computeKPI(data, 'Monthly_Revenue_INR') * 100) : 0,
    invTurnover: computeKPI(data, 'Inventory_Turnover', 'avg'),
    satisfaction: computeKPI(data, 'Customer_Satisfaction_Score', 'avg'),
  }), [data]);

  const revenueByMonth = useMemo(() => aggregateMonthly(data, 'Monthly_Revenue_INR'), [data]);
  const profitByMonth = useMemo(() => aggregateMonthly(data, 'Net_Profit_INR'), [data]);
  const revenueByOutlet = useMemo(() => aggregateByOutlet(data, 'Monthly_Revenue_INR'), [data]);
  const profitMarginByOutlet = useMemo(() => computeProfitMarginByOutlet(data), [data]);
  const costRatioByOutlet = useMemo(() => computeOperatingCostRatio(data), [data]);
  const revenuePerFootfall = useMemo(() => computeRevenuePerFootfall(data), [data]);
  const monthlyEfficiency = useMemo(() => computeMonthlyProfitMargin(data), [data]);

  const revenueProfitCombo = useMemo(() => revenueByMonth.map((r, i) => ({
    Month: r.Month, Revenue: r.value, Profit: profitByMonth[i]?.value || 0,
  })), [revenueByMonth, profitByMonth]);

  const conversionData = useMemo(() => aggregateByOutlet(data, 'Conversion_Rate_pct', 'avg').map((o) => ({
    outlet: o.name.split(' ')[0], value: o.value,
  })), [data]);

  // Scatter: Footfall vs Revenue per outlet-month
  const scatterData = useMemo(() => data.map((r) => ({
    footfall: r.Footfall, revenue: r.Monthly_Revenue_INR / 100000,
    name: r.Outlet_Name.split(' ')[0], month: r.Month,
  })), [data]);

  // Satisfaction trend
  const satisfactionTrend = useMemo(() => aggregateMonthly(data, 'Customer_Satisfaction_Score').map((m) => ({
    Month: m.Month, value: m.avg,
  })), [data]);

  const colors = theme.chart.colors;
  const tooltipStyle = { backgroundColor: theme.chart.tooltip, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '12px' };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        icon={InsightsRounded}
        title="Sales Insights"
        subtitle="Interactive analysis built with React & Recharts — Revenue, Profitability & Operational Efficiency"
        gradient={`linear-gradient(135deg, ${theme.secondary}, #9e1d4a)`}
      />

      <FilterBar outlets={outlets} months={months} selectedOutlets={selectedOutlets} selectedMonths={selectedMonths} onOutletChange={setOutlets} onMonthChange={setMonths} onReset={reset} />

      {/* KPI Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '12px' }}>
        <KpiCard title="Revenue" value={formatCurrency(kpis.revenue)} subtitle={`${kpis.growth >= 0 ? '+' : ''}${kpis.growth.toFixed(1)}% MoM`} trend={kpis.growth >= 0 ? 'up' : 'down'} icon={PaidRounded} />
        <KpiCard title="Net Profit" value={formatCurrency(kpis.profit)} subtitle={`${kpis.profitMargin.toFixed(1)}% margin`} trend="up" icon={TrendingUpRounded} />
        <KpiCard title="Transactions" value={formatNumber(kpis.transactions)} subtitle={`Avg bill ${formatCurrency(kpis.avgBill)}`} trend="up" icon={ShoppingCartRounded} />
        <KpiCard title="Footfall" value={formatNumber(kpis.footfall)} subtitle={`${kpis.conversion.toFixed(1)}% conversion`} trend="up" icon={PeopleRounded} />
      </div>
      {/* KPI Row 2 - Profitability */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <KpiCard title="Cost Ratio" value={`${kpis.costRatio.toFixed(1)}%`} subtitle="OpEx / Revenue" trend={kpis.costRatio < 60 ? 'up' : 'down'} icon={AccountBalanceWalletRounded} />
        <KpiCard title="Gross Margin" value={`${kpis.margin.toFixed(1)}%`} subtitle="Avg across outlets" trend="up" icon={TrendingUpRounded} />
        <KpiCard title="Inv. Turnover" value={kpis.invTurnover.toFixed(2)} subtitle="Avg monthly" trend="up" icon={InsightsRounded} />
        <KpiCard title="Satisfaction" value={`${kpis.satisfaction.toFixed(1)}/5`} subtitle="Customer avg" trend="up" icon={PeopleRounded} />
      </div>

      {/* Row 1: Revenue & Profit Trend + Revenue by Outlet */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Revenue & Profit Trend" subtitle="Monthly combined view">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={revenueProfitCombo} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="Month" tick={{ fontSize: 11, fill: theme.text.muted }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: theme.text.muted }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="Revenue" fill={`${colors[0]}20`} stroke={colors[0]} strokeWidth={2} />
              <Bar dataKey="Profit" fill={colors[1]} radius={[4, 4, 0, 0]} barSize={20} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Profit Margin & Cost Ratio Trend" subtitle="Monthly efficiency (%)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyEfficiency} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="Month" tick={{ fontSize: 11, fill: theme.text.muted }} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(1)}%`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="profitMargin" name="Profit Margin" stroke={colors[0]} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="costRatio" name="Cost Ratio" stroke={colors[1]} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Outlet Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Revenue by Outlet" subtitle="Total revenue ranking">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByOutlet.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 10, fill: theme.text.muted }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: theme.text.secondary }} width={75} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                {revenueByOutlet.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Net Profit Margin by Outlet" subtitle="Profit as % of revenue — efficiency ranking">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitMarginByOutlet} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" tick={{ fontSize: 10, fill: theme.text.muted }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: theme.text.secondary }} width={75} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(1)}%`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                {profitMarginByOutlet.map((entry, i) => <Cell key={i} fill={entry.value > 10 ? colors[0] : colors[1]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Cost Efficiency + Revenue per Footfall */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Operating Cost Ratio by Outlet" subtitle="Lower is better — cost efficiency ranking">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costRatioByOutlet} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.text.muted }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} unit="%" domain={[50, 70]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(1)}%`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                {costRatioByOutlet.map((entry, i) => <Cell key={i} fill={entry.value < 58 ? colors[0] : entry.value < 62 ? colors[4] : colors[1]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue per Footfall" subtitle="Customer value — how much each visitor spends">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenuePerFootfall} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.text.muted }} angle={-30} textAnchor="end" height={60} />
              <YAxis tickFormatter={(v) => `${Math.round(v)}`} tick={{ fontSize: 11, fill: theme.text.muted }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `Rs.${v.toFixed(0)}`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                {revenuePerFootfall.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: Scatter + Radar + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Footfall vs Revenue" subtitle="Each dot = one outlet-month">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" dataKey="footfall" name="Footfall" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <YAxis type="number" dataKey="revenue" name="Revenue" unit="L" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => name === 'Revenue' ? `${v.toFixed(0)}L` : v.toLocaleString()} />
              <Scatter data={scatterData} fill={colors[0]} fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Conversion Rate Radar" subtitle="Footfall-to-transaction ratio by outlet">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={conversionData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke={theme.chart.grid} />
              <PolarAngleAxis dataKey="outlet" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: theme.text.muted }} />
              <Radar dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 5: Pie + Satisfaction */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        <ChartCard title="Revenue Distribution" subtitle="Share by outlet">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={revenueByOutlet} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%" innerRadius="45%" paddingAngle={2} strokeWidth={0}>
                {revenueByOutlet.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Satisfaction Trend" subtitle="Average score across outlets over time">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={satisfactionTrend} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="Month" tick={{ fontSize: 11, fill: theme.text.muted }} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} domain={[3.8, 4.8]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(2)}/5`} />
              <Area type="monotone" dataKey="value" stroke={colors[5]} fill={`${colors[5]}20`} strokeWidth={2} name="Satisfaction" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
