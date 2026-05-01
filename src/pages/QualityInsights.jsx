import { useMemo } from 'react';
import { PageHeader, KpiCard, FilterBar, ChartCard } from '../components';
import { useQualityData, useFilters, useTheme } from '../hooks';
import { computeKPI, aggregateMonthly, aggregateByOutlet, computeQualityIndexByOutlet, computeQualityIndex, sortByMonth } from '../utils';
import { AssessmentRounded, BugReportRounded, GppGoodRounded, SupportAgentRounded, CleaningServicesRounded, LocalShippingRounded, InventoryRounded, ScoreboardRounded } from '@mui/icons-material';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Cell,
  ScatterChart, Scatter, PieChart, Pie,
} from 'recharts';

export default function QualityInsights() {
  const { theme } = useTheme();
  const { outlet, month, setOutlet, setMonth, reset, filters } = useFilters();
  const { data, outlets, months } = useQualityData(filters);

  const kpis = useMemo(() => ({
    defectRate: computeKPI(data, 'Defect_Rate_pct', 'avg'),
    returnRate: computeKPI(data, 'Return_Rate_pct', 'avg'),
    complaints: computeKPI(data, 'Customer_Complaints_Count'),
    auditScore: computeKPI(data, 'Audit_Compliance_Score', 'avg'),
    fulfillment: computeKPI(data, 'Order_Fulfillment_Accuracy_pct', 'avg'),
    shelfAvail: computeKPI(data, 'On_Shelf_Availability_pct', 'avg'),
    stockAcc: computeKPI(data, 'Stock_Accuracy_pct', 'avg'),
    resolutionTime: computeKPI(data, 'Avg_Issue_Resolution_Time_hrs', 'avg'),
    supplierComp: computeKPI(data, 'Supplier_Delivery_Compliance_pct', 'avg'),
    cleanliness: computeKPI(data, 'Store_Cleanliness_Score', 'avg'),
    avgQualityIndex: data.length ? data.reduce((s, r) => s + computeQualityIndex(r), 0) / data.length : 0,
  }), [data]);

  const defectTrend = useMemo(() => {
    const defects = aggregateMonthly(data, 'Defect_Rate_pct');
    const returns = aggregateMonthly(data, 'Return_Rate_pct');
    return defects.map((d, i) => ({
      Month: d.Month, Defect: d.avg, Return: returns[i]?.avg || 0,
    }));
  }, [data]);

  const complaintsTrend = useMemo(() => aggregateMonthly(data, 'Customer_Complaints_Count'), [data]);
  const auditByOutlet = useMemo(() => aggregateByOutlet(data, 'Audit_Compliance_Score', 'avg'), [data]);
  const cleanlinessBy = useMemo(() => aggregateByOutlet(data, 'Store_Cleanliness_Score', 'avg'), [data]);
  const qualityIndexByOutlet = useMemo(() => computeQualityIndexByOutlet(data), [data]);

  // Complaints vs Resolution Time scatter
  const complaintsVsResolution = useMemo(() => {
    const outletMap = {};
    data.forEach((r) => {
      if (!outletMap[r.Outlet_Name]) outletMap[r.Outlet_Name] = { name: r.Outlet_Name.split(' ').slice(0, 2).join(' '), complaints: 0, resolution: 0, count: 0 };
      outletMap[r.Outlet_Name].complaints += r.Customer_Complaints_Count;
      outletMap[r.Outlet_Name].resolution += r.Avg_Issue_Resolution_Time_hrs;
      outletMap[r.Outlet_Name].count += 1;
    });
    return Object.values(outletMap).map((o) => ({
      name: o.name, complaints: o.complaints, resolution: o.resolution / o.count,
    }));
  }, [data]);

  // Supply chain health radar
  const supplyChainRadar = useMemo(() => [
    { metric: 'Fulfillment', value: kpis.fulfillment },
    { metric: 'Shelf Avail', value: kpis.shelfAvail },
    { metric: 'Stock Acc', value: kpis.stockAcc },
    { metric: 'Supplier', value: kpis.supplierComp },
    { metric: 'Audit', value: kpis.auditScore },
  ], [kpis]);

  // Resolution time by outlet
  const resolutionByOutlet = useMemo(() => aggregateByOutlet(data, 'Avg_Issue_Resolution_Time_hrs', 'avg').sort((a, b) => a.value - b.value), [data]);

  // Monthly quality index trend
  const qualityIndexTrend = useMemo(() => {
    const monthMap = {};
    data.forEach((r) => {
      if (!monthMap[r.Month]) monthMap[r.Month] = { Month: r.Month, total: 0, count: 0 };
      monthMap[r.Month].total += computeQualityIndex(r);
      monthMap[r.Month].count += 1;
    });
    return sortByMonth(Object.values(monthMap).map((m) => ({ Month: m.Month, value: m.total / m.count })));
  }, [data]);

  // Supplier compliance by outlet
  const supplierByOutlet = useMemo(() => aggregateByOutlet(data, 'Supplier_Delivery_Compliance_pct', 'avg'), [data]);

  // Defect vs Return correlation per outlet
  const defectReturnCorrelation = useMemo(() => {
    const outletMap = {};
    data.forEach((r) => {
      if (!outletMap[r.Outlet_Name]) outletMap[r.Outlet_Name] = { name: r.Outlet_Name.split(' ').slice(0, 2).join(' '), defect: 0, return_: 0, count: 0 };
      outletMap[r.Outlet_Name].defect += r.Defect_Rate_pct;
      outletMap[r.Outlet_Name].return_ += r.Return_Rate_pct;
      outletMap[r.Outlet_Name].count += 1;
    });
    return Object.values(outletMap).map((o) => ({
      name: o.name, defect: o.defect / o.count, return_: o.return_ / o.count,
    }));
  }, [data]);

  // Complaints distribution pie
  const complaintsByOutlet = useMemo(() => aggregateByOutlet(data, 'Customer_Complaints_Count'), [data]);

  const colors = theme.chart.colors;
  const tooltipStyle = { backgroundColor: theme.chart.tooltip, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '12px' };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        icon={AssessmentRounded}
        title="Quality Insights"
        subtitle="Interactive analysis — Defect rates, compliance scores, supply chain health & operational excellence"
        gradient={`linear-gradient(135deg, ${theme.muted}, #6b5a80)`}
      />

      <FilterBar outlets={outlets} months={months} selectedOutlet={outlet} selectedMonth={month} onOutletChange={setOutlet} onMonthChange={setMonth} onReset={reset} />

      {/* KPI Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '12px' }}>
        <KpiCard title="Quality Index" value={kpis.avgQualityIndex.toFixed(1)} subtitle="Composite weighted score" trend="up" icon={ScoreboardRounded} />
        <KpiCard title="Defect Rate" value={`${kpis.defectRate.toFixed(2)}%`} subtitle="Lower is better" trend="down" icon={BugReportRounded} />
        <KpiCard title="Audit Score" value={`${kpis.auditScore.toFixed(1)}%`} subtitle="Compliance avg" trend="up" icon={GppGoodRounded} />
        <KpiCard title="Complaints" value={kpis.complaints.toLocaleString()} subtitle={`${kpis.resolutionTime.toFixed(0)}h avg resolution`} trend="down" icon={SupportAgentRounded} />
      </div>
      {/* KPI Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <KpiCard title="Fulfillment" value={`${kpis.fulfillment.toFixed(1)}%`} subtitle="Order accuracy" trend="up" icon={InventoryRounded} />
        <KpiCard title="Shelf Avail" value={`${kpis.shelfAvail.toFixed(1)}%`} subtitle="On-shelf %" trend="up" icon={InventoryRounded} />
        <KpiCard title="Supplier" value={`${kpis.supplierComp.toFixed(1)}%`} subtitle="Delivery compliance" trend="up" icon={LocalShippingRounded} />
        <KpiCard title="Cleanliness" value={`${kpis.cleanliness.toFixed(1)}/5`} subtitle="Store avg" trend="up" icon={CleaningServicesRounded} />
      </div>

      {/* Row 1: Composite Quality Index + Defect Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Composite Quality Index by Outlet" subtitle="Weighted score (higher = better) — Fulfillment, Audit, Stock, Shelf, Supplier, Defect">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityIndexByOutlet} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" tick={{ fontSize: 10, fill: theme.text.muted }} domain={[92, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: theme.text.secondary }} width={75} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => v.toFixed(2)} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
                {qualityIndexByOutlet.map((entry, i) => <Cell key={i} fill={entry.value > 97 ? colors[0] : entry.value > 95 ? colors[4] : colors[1]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Defect & Return Rate Trend" subtitle="Monthly average % — product quality signal">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={defectTrend} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="Month" tick={{ fontSize: 11, fill: theme.text.muted }} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(2)}%`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="Defect" stroke={colors[1]} fill={`${colors[1]}15`} strokeWidth={2} />
              <Line type="monotone" dataKey="Return" stroke={colors[4]} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Complaints vs Resolution + Compliance Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Complaints vs Avg Resolution Time" subtitle="Are slow resolutions causing more complaints?">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" dataKey="resolution" name="Avg Resolution (hrs)" unit="h" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <YAxis type="number" dataKey="complaints" name="Total Complaints" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={complaintsVsResolution} fill={colors[1]} fillOpacity={0.7}>
                {complaintsVsResolution.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Supply Chain Health Radar" subtitle="Key operational metrics (%) — closer to edge = better">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={supplyChainRadar} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke={theme.chart.grid} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: theme.text.muted }} domain={[90, 100]} />
              <Radar dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Audit by Outlet + Quality Index Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Audit Compliance by Outlet" subtitle="Average score — regulatory readiness">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={auditByOutlet} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.text.muted }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} domain={[88, 100]} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(1)}%`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                {auditByOutlet.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quality Index Trend" subtitle="Monthly composite score — overall trajectory">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={qualityIndexTrend} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="Month" tick={{ fontSize: 11, fill: theme.text.muted }} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} domain={[94, 100]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => v.toFixed(2)} />
              <Area type="monotone" dataKey="value" stroke={colors[0]} fill={`${colors[0]}15`} strokeWidth={2} name="Quality Index" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: Defect vs Return Scatter + Resolution Time */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Defect Rate vs Return Rate" subtitle="Correlation — do defects drive returns?">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" dataKey="defect" name="Defect %" unit="%" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <YAxis type="number" dataKey="return_" name="Return %" unit="%" tick={{ fontSize: 10, fill: theme.text.muted }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Scatter data={defectReturnCorrelation} fill={colors[3]} fillOpacity={0.7}>
                {defectReturnCorrelation.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg Issue Resolution Time" subtitle="Hours by outlet — lower is better">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resolutionByOutlet} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis type="number" tick={{ fontSize: 10, fill: theme.text.muted }} unit="h" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: theme.text.secondary }} width={75} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(1)} hrs`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                {resolutionByOutlet.map((entry, i) => <Cell key={i} fill={entry.value > 20 ? colors[1] : colors[0]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 5: Supplier + Complaints Pie + Cleanliness */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <ChartCard title="Supplier Compliance" subtitle="Delivery compliance by outlet">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplierByOutlet} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: theme.text.muted }} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} domain={[92, 100]} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(1)}%`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={22}>
                {supplierByOutlet.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Complaints Distribution" subtitle="Share of total complaints by outlet">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={complaintsByOutlet} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%" innerRadius="40%" paddingAngle={2} strokeWidth={0}>
                {complaintsByOutlet.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Store Cleanliness" subtitle="Rating out of 5 by outlet">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cleanlinessBy} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: theme.text.muted }} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} domain={[3.5, 5]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v.toFixed(2)}/5`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={22}>
                {cleanlinessBy.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
