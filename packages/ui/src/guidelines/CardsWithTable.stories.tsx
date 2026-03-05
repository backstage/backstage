/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-restricted-syntax */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Grid,
  Flex,
  Text,
  Table,
  CellText,
  CellProfile,
  useTable,
  type ColumnConfig,
  PluginHeader,
  HeaderPage,
  Button,
} from '..';

// ---------------------------------------------------------------------------
// Metric card data
// ---------------------------------------------------------------------------

interface MetricCard {
  label: string;
  value: string;
  trend: string;
  trendColor: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const metrics: MetricCard[] = [
  {
    label: 'Total Components',
    value: '142',
    trend: '+12 this week',
    trendColor: 'success',
  },
  {
    label: 'Active Services',
    value: '58',
    trend: '94% healthy',
    trendColor: 'success',
  },
  {
    label: 'Recent Deployments',
    value: '23',
    trend: 'in the last 24 h',
    trendColor: 'secondary',
  },
];

// ---------------------------------------------------------------------------
// Table data
// ---------------------------------------------------------------------------

interface ServiceItem {
  id: string;
  name: string;
  owner: string;
  ownerAvatar: string;
  type: 'service' | 'library' | 'website' | 'documentation';
  lifecycle: 'production' | 'experimental';
  description: string;
}

const services: ServiceItem[] = [
  {
    id: '1',
    name: 'authentication-service',
    owner: 'security-team',
    ownerAvatar: 'https://github.com/identicons/security-team.png',
    type: 'service',
    lifecycle: 'production',
    description: 'Handles user authentication, sessions and token refresh.',
  },
  {
    id: '2',
    name: 'api-gateway',
    owner: 'platform-team',
    ownerAvatar: 'https://github.com/identicons/platform-team.png',
    type: 'service',
    lifecycle: 'production',
    description: 'Routes and validates all inbound API requests.',
  },
  {
    id: '3',
    name: 'frontend-core',
    owner: 'design-system',
    ownerAvatar: 'https://github.com/identicons/design-system.png',
    type: 'library',
    lifecycle: 'production',
    description: 'Shared UI components and design tokens.',
  },
  {
    id: '4',
    name: 'data-pipeline',
    owner: 'data-team',
    ownerAvatar: 'https://github.com/identicons/data-team.png',
    type: 'service',
    lifecycle: 'experimental',
    description: 'Streaming data ingestion pipeline for analytics.',
  },
  {
    id: '5',
    name: 'developer-portal',
    owner: 'devex-team',
    ownerAvatar: 'https://github.com/identicons/devex-team.png',
    type: 'website',
    lifecycle: 'production',
    description: 'Internal developer portal built on Backstage.',
  },
  {
    id: '6',
    name: 'notification-service',
    owner: 'platform-team',
    ownerAvatar: 'https://github.com/identicons/platform-team.png',
    type: 'service',
    lifecycle: 'production',
    description: 'Sends emails, Slack messages and push notifications.',
  },
  {
    id: '7',
    name: 'search-indexer',
    owner: 'search-team',
    ownerAvatar: 'https://github.com/identicons/search-team.png',
    type: 'service',
    lifecycle: 'experimental',
    description: 'Indexes catalog entities for full-text search.',
  },
  {
    id: '8',
    name: 'billing-service',
    owner: 'payments-team',
    ownerAvatar: 'https://github.com/identicons/payments-team.png',
    type: 'service',
    lifecycle: 'production',
    description: 'Manages subscriptions, invoices and payment processing.',
  },
];

// ---------------------------------------------------------------------------
// Stat card component
// ---------------------------------------------------------------------------

const StatCard = ({ label, value, trend, trendColor }: MetricCard) => (
  <Card>
    <CardHeader>{label}</CardHeader>
    <CardBody>
      <Flex direction="column" gap="1">
        <Text variant="title-large" weight="bold">
          {value}
        </Text>
        <Text variant="body-medium" color={trendColor}>
          {trend}
        </Text>
      </Flex>
    </CardBody>
  </Card>
);

// ---------------------------------------------------------------------------
// Page layout component (the actual story render)
// ---------------------------------------------------------------------------

const columns: ColumnConfig<ServiceItem>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    defaultWidth: '3fr',
    cell: item => (
      <CellProfile
        name={item.name}
        src={item.ownerAvatar}
        description={item.description}
      />
    ),
  },
  {
    id: 'owner',
    label: 'Owner',
    defaultWidth: '2fr',
    cell: item => <CellText title={item.owner} />,
  },
  {
    id: 'type',
    label: 'Type',
    defaultWidth: '1fr',
    cell: item => <CellText title={item.type} />,
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle',
    defaultWidth: '1fr',
    cell: item => (
      <CellText
        title={item.lifecycle}
        style={{
          color:
            item.lifecycle === 'production'
              ? 'var(--bui-fg-success)'
              : 'var(--bui-fg-warning)',
        }}
      />
    ),
  },
];

const CardsWithTableLayout = () => {
  const { tableProps } = useTable({
    mode: 'complete',
    getData: () => services,
    paginationOptions: { pageSize: 5 },
  });

  return (
    <>
      <PluginHeader title="Plugin" />
      <HeaderPage
        title="Page title"
        customActions={<Button>Custom action</Button>}
      />
      <Container>
        <Flex direction="column" gap="6">
          <Grid.Root columns="3" gap="4">
            {metrics.map(metric => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </Grid.Root>
          <Table columnConfig={columns} {...tableProps} />
        </Flex>
      </Container>
    </>
  );
};

// ---------------------------------------------------------------------------
// Storybook meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Guidelines/Cards with Table',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: () => JSX.Element) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CardsWithTableLayout />,
};
