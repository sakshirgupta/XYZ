import {
  HomeRounded,
  TrendingUpRounded,
  VerifiedRounded,
  InsightsRounded,
  AssessmentRounded,
  InfoRounded,
} from '@mui/icons-material';

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: HomeRounded },
  { path: '/sales-dashboard', label: 'Sales Dashboard', icon: TrendingUpRounded, badge: 'Tableau' },
  { path: '/quality-dashboard', label: 'Quality Dashboard', icon: VerifiedRounded, badge: 'Tableau' },
  { path: '/sales-insights', label: 'Sales Insights', icon: InsightsRounded, badge: 'React' },
  { path: '/quality-insights', label: 'Quality Insights', icon: AssessmentRounded, badge: 'React' },
  { path: '/about', label: 'About', icon: InfoRounded },
];

export const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Replace these with actual Tableau Public / Power BI URLs
export const EMBED_URLS = {
  salesTableau: '',
  qualityTableau: '',
  salesPowerBI: 'https://app.powerbi.com/reportEmbed?reportId=674a1f1c-7fd2-463a-89b3-544bb71bc3ab&autoAuth=true&ctid=5b973f99-77df-4beb-b27d-aa0c70b8482c',
  qualityPowerBI: '',
};
