import { useMemo, useState } from 'react';
import salesData from '../data/sales.json';
import qualityData from '../data/quality.json';

export function useSalesData(filters = {}) {
  const filtered = useMemo(() => {
    let data = salesData;
    if (filters.outlet) data = data.filter((r) => r.Outlet_Name === filters.outlet);
    if (filters.month) data = data.filter((r) => r.Month === filters.month);
    return data;
  }, [filters.outlet, filters.month]);

  const outlets = useMemo(() => [...new Set(salesData.map((r) => r.Outlet_Name))], []);
  const months = useMemo(() => [...new Set(salesData.map((r) => r.Month))], []);

  return { data: filtered, allData: salesData, outlets, months };
}

export function useQualityData(filters = {}) {
  const filtered = useMemo(() => {
    let data = qualityData;
    if (filters.outlet) data = data.filter((r) => r.Outlet_Name === filters.outlet);
    if (filters.month) data = data.filter((r) => r.Month === filters.month);
    return data;
  }, [filters.outlet, filters.month]);

  const outlets = useMemo(() => [...new Set(qualityData.map((r) => r.Outlet_Name))], []);
  const months = useMemo(() => [...new Set(qualityData.map((r) => r.Month))], []);

  return { data: filtered, allData: qualityData, outlets, months };
}

export function useFilters() {
  const [outlet, setOutlet] = useState('');
  const [month, setMonth] = useState('');

  const reset = () => {
    setOutlet('');
    setMonth('');
  };

  return { outlet, month, setOutlet, setMonth, reset, filters: { outlet, month } };
}
