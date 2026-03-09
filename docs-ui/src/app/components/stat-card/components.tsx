'use client';

import { Grid, StatCard } from '@backstage/ui';

export const Default = () => {
  return <StatCard label="Active Services" value={142} status="neutral" />;
};

export const WithTrend = () => {
  return (
    <StatCard
      label="Active Services"
      value={142}
      trend="+12%"
      status="success"
    />
  );
};

export const WithIcon = () => {
  return (
    <StatCard
      label="Active Services"
      value={142}
      trend="+12%"
      status="success"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      }
    />
  );
};

export const WithDescription = () => {
  return (
    <StatCard
      label="Active Services"
      value={142}
      trend="+12%"
      status="success"
      description="Currently running in production"
    />
  );
};

export const ErrorStatus = () => {
  return (
    <StatCard label="Failed Deployments" value={3} trend="+2" status="error" />
  );
};

export const WarningStatus = () => {
  return (
    <StatCard label="Pending Reviews" value={15} trend="+5" status="warning" />
  );
};

export const InfoStatus = () => {
  return <StatCard label="Total Users" value="2.4K" status="info" />;
};

export const Interactive = () => {
  return (
    <StatCard
      label="Active Services"
      value={142}
      trend="+12%"
      status="success"
      onPress={() => alert('Card clicked!')}
    />
  );
};

export const Link = () => {
  return (
    <StatCard
      label="Active Services"
      value={142}
      trend="+12%"
      status="success"
      href="https://backstage.io"
    />
  );
};

export const GridLayout = () => {
  return (
    <Grid.Root columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
      <StatCard
        label="Active Services"
        value={142}
        trend="+12%"
        status="success"
      />
      <StatCard
        label="Failed Deployments"
        value={3}
        trend="+2"
        status="error"
      />
      <StatCard
        label="Pending Reviews"
        value={15}
        trend="+5"
        status="warning"
      />
      <StatCard label="Total Users" value="2.4K" status="info" />
    </Grid.Root>
  );
};
