import { MONTH_ORDER } from '../constants';

export const formatCurrency = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

export const formatNumber = (value) => {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value?.toLocaleString('en-IN') ?? '0';
};

export const sortByMonth = (data) =>
  [...data].sort((a, b) => MONTH_ORDER.indexOf(a.Month) - MONTH_ORDER.indexOf(b.Month));

export const groupByOutlet = (data) =>
  data.reduce((acc, row) => {
    const key = row.Outlet_Name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

export const aggregateMonthly = (data, field) => {
  const monthMap = {};
  data.forEach((row) => {
    if (!monthMap[row.Month]) monthMap[row.Month] = { Month: row.Month, total: 0, count: 0 };
    monthMap[row.Month].total += row[field];
    monthMap[row.Month].count += 1;
  });
  return sortByMonth(
    Object.values(monthMap).map((m) => ({
      Month: m.Month,
      value: m.total,
      avg: m.total / m.count,
    }))
  );
};

export const aggregateByOutlet = (data, field, mode = 'sum') => {
  const outletMap = {};
  data.forEach((row) => {
    if (!outletMap[row.Outlet_Name]) outletMap[row.Outlet_Name] = { name: row.Outlet_Name, total: 0, count: 0 };
    outletMap[row.Outlet_Name].total += row[field];
    outletMap[row.Outlet_Name].count += 1;
  });
  return Object.values(outletMap)
    .map((o) => ({ name: o.name, value: mode === 'avg' ? o.total / o.count : o.total }))
    .sort((a, b) => b.value - a.value);
};

export const computeKPI = (data, field, mode = 'sum') => {
  if (!data.length) return 0;
  const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
  return mode === 'avg' ? total / data.length : total;
};

export const computeGrowth = (data, field) => {
  const sorted = sortByMonth(data);
  const months = [...new Set(sorted.map((r) => r.Month))];
  if (months.length < 2) return 0;
  const lastMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];
  const lastVal = sorted.filter((r) => r.Month === lastMonth).reduce((s, r) => s + r[field], 0);
  const prevVal = sorted.filter((r) => r.Month === prevMonth).reduce((s, r) => s + r[field], 0);
  return prevVal === 0 ? 0 : ((lastVal - prevVal) / prevVal) * 100;
};

// --- Advanced Derived Metrics ---

export const computeProfitMarginByOutlet = (data) => {
  const outletMap = {};
  data.forEach((r) => {
    if (!outletMap[r.Outlet_Name]) outletMap[r.Outlet_Name] = { name: r.Outlet_Name, revenue: 0, profit: 0 };
    outletMap[r.Outlet_Name].revenue += r.Monthly_Revenue_INR;
    outletMap[r.Outlet_Name].profit += r.Net_Profit_INR;
  });
  return Object.values(outletMap)
    .map((o) => ({ name: o.name, value: (o.profit / o.revenue) * 100 }))
    .sort((a, b) => b.value - a.value);
};

export const computeOperatingCostRatio = (data) => {
  const outletMap = {};
  data.forEach((r) => {
    if (!outletMap[r.Outlet_Name]) outletMap[r.Outlet_Name] = { name: r.Outlet_Name, revenue: 0, cost: 0 };
    outletMap[r.Outlet_Name].revenue += r.Monthly_Revenue_INR;
    outletMap[r.Outlet_Name].cost += r.Operating_Cost_INR;
  });
  return Object.values(outletMap)
    .map((o) => ({ name: o.name, value: (o.cost / o.revenue) * 100 }))
    .sort((a, b) => a.value - b.value);
};

export const computeRevenuePerFootfall = (data) => {
  const outletMap = {};
  data.forEach((r) => {
    if (!outletMap[r.Outlet_Name]) outletMap[r.Outlet_Name] = { name: r.Outlet_Name, revenue: 0, footfall: 0 };
    outletMap[r.Outlet_Name].revenue += r.Monthly_Revenue_INR;
    outletMap[r.Outlet_Name].footfall += r.Footfall;
  });
  return Object.values(outletMap)
    .map((o) => ({ name: o.name, value: o.footfall ? o.revenue / o.footfall : 0 }))
    .sort((a, b) => b.value - a.value);
};

export const computeMonthlyProfitMargin = (data) => {
  const monthMap = {};
  data.forEach((r) => {
    if (!monthMap[r.Month]) monthMap[r.Month] = { Month: r.Month, revenue: 0, profit: 0, cost: 0 };
    monthMap[r.Month].revenue += r.Monthly_Revenue_INR;
    monthMap[r.Month].profit += r.Net_Profit_INR;
    monthMap[r.Month].cost += r.Operating_Cost_INR;
  });
  return sortByMonth(
    Object.values(monthMap).map((m) => ({
      Month: m.Month,
      profitMargin: (m.profit / m.revenue) * 100,
      costRatio: (m.cost / m.revenue) * 100,
    }))
  );
};

export const computeQualityIndex = (row) => {
  return (
    (row.Order_Fulfillment_Accuracy_pct * 0.2) +
    (row.On_Shelf_Availability_pct * 0.15) +
    (row.Stock_Accuracy_pct * 0.15) +
    (row.Audit_Compliance_Score * 0.2) +
    (row.Supplier_Delivery_Compliance_pct * 0.1) +
    ((100 - row.Defect_Rate_pct) * 0.1) +
    ((100 - row.Return_Rate_pct) * 0.05) +
    (row.Store_Cleanliness_Score * 20 * 0.05)
  );
};

export const computeQualityIndexByOutlet = (data) => {
  const outletMap = {};
  data.forEach((r) => {
    if (!outletMap[r.Outlet_Name]) outletMap[r.Outlet_Name] = { name: r.Outlet_Name, total: 0, count: 0 };
    outletMap[r.Outlet_Name].total += computeQualityIndex(r);
    outletMap[r.Outlet_Name].count += 1;
  });
  return Object.values(outletMap)
    .map((o) => ({ name: o.name, value: o.total / o.count }))
    .sort((a, b) => b.value - a.value);
};

export const computeCrossDatasetCorrelation = (salesData, qualityData) => {
  const salesByOutlet = {};
  salesData.forEach((r) => {
    if (!salesByOutlet[r.Outlet_Name]) salesByOutlet[r.Outlet_Name] = { revenue: 0, satisfaction: 0, count: 0 };
    salesByOutlet[r.Outlet_Name].revenue += r.Monthly_Revenue_INR;
    salesByOutlet[r.Outlet_Name].satisfaction += r.Customer_Satisfaction_Score;
    salesByOutlet[r.Outlet_Name].count += 1;
  });
  const qualityByOutlet = {};
  qualityData.forEach((r) => {
    if (!qualityByOutlet[r.Outlet_Name]) qualityByOutlet[r.Outlet_Name] = { complaints: 0, qualityIndex: 0, count: 0 };
    qualityByOutlet[r.Outlet_Name].complaints += r.Customer_Complaints_Count;
    qualityByOutlet[r.Outlet_Name].qualityIndex += computeQualityIndex(r);
    qualityByOutlet[r.Outlet_Name].count += 1;
  });

  return Object.keys(salesByOutlet).map((name) => {
    const s = salesByOutlet[name];
    const q = qualityByOutlet[name] || { complaints: 0, qualityIndex: 0, count: 1 };
    return {
      name: name.split(' ').slice(0, 2).join(' '),
      revenue: s.revenue / 10000000,
      satisfaction: s.satisfaction / s.count,
      qualityIndex: q.qualityIndex / q.count,
      complaints: q.complaints,
    };
  });
};
