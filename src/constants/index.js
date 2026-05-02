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
  { path: '/sales-dashboard', label: 'Sales Dashboard', icon: TrendingUpRounded, badge: 'Power BI' },
  { path: '/quality-dashboard', label: 'Quality Dashboard', icon: VerifiedRounded, badge: 'Power BI' },
  { path: '/sales-insights', label: 'Sales Insights', icon: InsightsRounded, badge: 'React' },
  { path: '/quality-insights', label: 'Quality Insights', icon: AssessmentRounded, badge: 'React' },
  { path: '/about', label: 'About', icon: InfoRounded },
];

export const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export const EMBED_URLS = {
  salesPowerBI: 'https://app.powerbi.com/reportEmbed?reportId=674a1f1c-7fd2-463a-89b3-544bb71bc3ab&autoAuth=true&ctid=5b973f99-77df-4beb-b27d-aa0c70b8482c&filterPaneEnabled=false&navContentPaneEnabled=false',
  qualityPowerBI: 'https://app.powerbi.com/reportEmbed?reportId=068002b1-5939-459c-afe2-ebc4f3db6a72&autoAuth=true&ctid=5b973f99-77df-4beb-b27d-aa0c70b8482c&filterPaneEnabled=false&navContentPaneEnabled=false',
};
