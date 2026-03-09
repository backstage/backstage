export const statCardUsageSnippet = `import { StatCard } from '@backstage/ui';

<StatCard 
  label="Active Services" 
  value={142} 
  trend="+12%" 
  status="success" 
/>`;

export const defaultSnippet = `<StatCard 
  label="Active Services" 
  value={142} 
  status="neutral"
/>`;

export const withTrendSnippet = `<StatCard 
  label="Active Services" 
  value={142} 
  trend="+12%" 
  status="success" 
/>`;

export const withIconSnippet = `import { TrendingUpIcon } from 'lucide-react';

<StatCard 
  label="Active Services" 
  value={142} 
  trend="+12%" 
  status="success"
  icon={<TrendingUpIcon />}
/>`;

export const withDescriptionSnippet = `<StatCard 
  label="Active Services" 
  value={142} 
  trend="+12%" 
  status="success"
  description="Currently running in production"
/>`;

export const errorStatusSnippet = `<StatCard 
  label="Failed Deployments" 
  value={3} 
  trend="+2" 
  status="error"
/>`;

export const warningStatusSnippet = `<StatCard 
  label="Pending Reviews" 
  value={15} 
  trend="+5" 
  status="warning"
/>`;

export const infoStatusSnippet = `<StatCard 
  label="Total Users" 
  value="2.4K" 
  status="info"
/>`;

export const interactiveSnippet = `<StatCard 
  label="Active Services" 
  value={142} 
  trend="+12%" 
  status="success"
  onPress={() => console.log('Card clicked')}
/>`;

export const linkSnippet = `<StatCard 
  label="Active Services" 
  value={142} 
  trend="+12%" 
  status="success"
  href="/services"
/>`;

export const gridLayoutSnippet = `import { Grid } from '@backstage/ui';

<Grid.Root columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
  <StatCard label="Active Services" value={142} trend="+12%" status="success" />
  <StatCard label="Failed Deployments" value={3} trend="+2" status="error" />
  <StatCard label="Pending Reviews" value={15} trend="+5" status="warning" />
  <StatCard label="Total Users" value="2.4K" status="info" />
</Grid.Root>`;
