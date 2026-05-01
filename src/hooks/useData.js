import { useMemo, useState } from 'react';
import salesData from '../data/sales.json';
import qualityData from '../data/quality.json';

export function useSalesData(filters = {}) {
  const filtered = useMemo(() => {
    let data = salesData;
    if (filters.outlets?.length) data = data.filter((r) => filters.outlets.includes(r.Outlet_Name));
    if (filters.months?.length) data = data.filter((r) => filters.months.includes(r.Month));
    return data;
  }, [filters.outlets, filters.months]);

  const outlets = useMemo(() => [...new Set(salesData.map((r) => r.Outlet_Name))], []);
  const months = useMemo(() => [...new Set(salesData.map((r) => r.Month))], []);

  return { data: filtered, allData: salesData, outlets, months };
}

export function useQualityData(filters = {}) {
  const filtered = useMemo(() => {
    let data = qualityData;
    if (filters.outlets?.length) data = data.filter((r) => filters.outlets.includes(r.Outlet_Name));
    if (filters.months?.length) data = data.filter((r) => filters.months.includes(r.Month));
    return data;
  }, [filters.outlets, filters.months]);

  const outlets = useMemo(() => [...new Set(qualityData.map((r) => r.Outlet_Name))], []);
  const months = useMemo(() => [...new Set(qualityData.map((r) => r.Month))], []);

  return { data: filtered, allData: qualityData, outlets, months };
}

export function useFilters() {
  const [outlets, setOutlets] = useState([]);
  const [months, setMonths] = useState([]);

  const reset = () => {
    setOutlets([]);
    setMonths([]);
  };

  return { outlets, months, setOutlets, setMonths, reset, filters: { outlets, months } };
}
