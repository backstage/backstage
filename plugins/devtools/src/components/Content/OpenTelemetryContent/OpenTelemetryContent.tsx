/*
 * Copyright 2026 The Backstage Authors
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

import { useEffect, useMemo } from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  useApi,
  useAppLocation,
  useAppNavigate,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import {
  CellText,
  Flex,
  Link,
  Tab,
  TabList,
  Tabs,
  Text,
  type ColumnConfig,
} from '@backstage/ui';
import {
  OpenTelemetryMetric,
  OpenTelemetrySpan,
} from '@backstage/plugin-devtools-common/alpha';
import { devToolsApiRef } from '../../../api';
import {
  openTelemetryMetricsRouteRef,
  openTelemetryTracesRouteRef,
} from '../../../alpha/routes';
import { NameCell } from './NameCell';
import { TelemetryRow, TelemetryTable } from './TelemetryTable';

const METRIC_TYPE_LABELS: Record<OpenTelemetryMetric['type'], string> = {
  counter: 'Counter',
  upDownCounter: 'Up/down counter',
  histogram: 'Histogram',
  gauge: 'Gauge',
  observableCounter: 'Observable counter',
  observableUpDownCounter: 'Observable up/down counter',
  observableGauge: 'Observable gauge',
};

type MetricRow = TelemetryRow & OpenTelemetryMetric;
type SpanRow = TelemetryRow & OpenTelemetrySpan;

const metricColumns: ColumnConfig<MetricRow>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    defaultWidth: '3fr',
    cell: item => (
      <NameCell
        name={item.name}
        pluginId={item.pluginId}
        description={item.description}
      />
    ),
  },
  {
    id: 'type',
    isSortable: true,
    label: 'Type',
    defaultWidth: '1fr',
    minWidth: 160,
    cell: item => (
      <CellText title={METRIC_TYPE_LABELS[item.type] ?? item.type} />
    ),
  },
  {
    id: 'unit',
    isSortable: true,
    label: 'Unit',
    defaultWidth: '1fr',
    minWidth: 100,
    cell: item => <CellText title={item.unit ?? ''} />,
  },
];

const spanColumns: ColumnConfig<SpanRow>[] = [
  {
    id: 'name',
    label: 'Name',
    isRowHeader: true,
    isSortable: true,
    defaultWidth: '3fr',
    cell: item => <NameCell name={item.name} pluginId={item.pluginId} />,
  },
  {
    id: 'kind',
    isSortable: true,
    label: 'Kind',
    defaultWidth: '1fr',
    minWidth: 100,
    cell: item => <CellText title={item.kind} />,
  },
  {
    id: 'count',
    isSortable: true,
    label: 'Count',
    defaultWidth: '1fr',
    minWidth: 80,
    cell: item => <CellText title={String(item.count)} />,
  },
  {
    id: 'lastSeen',
    isSortable: true,
    label: 'Last seen',
    defaultWidth: '1.5fr',
    minWidth: 200,
    cell: item => <CellText title={new Date(item.lastSeen).toLocaleString()} />,
  },
];

const DOCS_BASE_URL = 'https://backstage.io/docs/backend-system/core-services';

const DocsLink = (props: { path: string; children: string }) => (
  <Link
    href={`${DOCS_BASE_URL}/${props.path}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {props.children}
  </Link>
);

const REGISTRY_NOTES = {
  metrics: {
    subject: 'metrics created',
    service: 'Metrics Service',
    path: 'metrics',
  },
  traces: {
    subject: 'spans started',
    service: 'Tracing Service',
    path: 'tracing',
  },
} as const;

const RegistryNote = (props: { signal: keyof typeof REGISTRY_NOTES }) => {
  const { subject, service, path } = REGISTRY_NOTES[props.signal];
  return (
    <Text as="p" color="secondary">
      Only {subject} through the Backstage{' '}
      <DocsLink path={path}>{service}</DocsLink> are listed, and only for this
      backend instance. See the{' '}
      <DocsLink path="telemetry-registry">Telemetry Registry Service</DocsLink>{' '}
      docs for details.
    </Text>
  );
};

function MetricsPanel() {
  const api = useApi(devToolsApiRef);
  const { value, error } = useAsync(() => api.getOpenTelemetryMetrics(), [api]);
  const rows = useMemo(
    () => value?.metrics.map(m => ({ ...m, id: `${m.pluginId}/${m.name}` })),
    [value],
  );
  return (
    <TelemetryTable
      noun="metrics"
      rows={rows}
      error={error}
      columnConfig={metricColumns}
      defaultSort={{ column: 'name', direction: 'ascending' }}
      sortValue={(row, column) => {
        switch (column) {
          case 'type':
            return METRIC_TYPE_LABELS[row.type] ?? row.type;
          case 'unit':
            return row.unit;
          default:
            return row.name;
        }
      }}
      searchText={row => [
        row.description,
        METRIC_TYPE_LABELS[row.type],
        row.type,
        row.unit,
      ]}
      emptyState={<Text>No metrics have been registered yet.</Text>}
    />
  );
}

function TracesPanel() {
  const api = useApi(devToolsApiRef);
  const { value, error } = useAsync(() => api.getOpenTelemetrySpans(), [api]);
  const rows = useMemo(
    () => value?.spans.map(s => ({ ...s, id: `${s.pluginId}/${s.name}` })),
    [value],
  );
  return (
    <TelemetryTable
      noun="traces"
      searchText={row => [row.kind]}
      defaultSort={{ column: 'count', direction: 'descending' }}
      descendingFirst={['count', 'lastSeen']}
      sortValue={(row, column) => {
        switch (column) {
          case 'kind':
            return row.kind;
          case 'count':
            return row.count;
          case 'lastSeen':
            return Date.parse(row.lastSeen);
          default:
            return row.name;
        }
      }}
      rows={rows}
      error={error}
      columnConfig={spanColumns}
      emptyState={<Text>No spans have been recorded yet.</Text>}
    />
  );
}

type Signal = 'metrics' | 'traces';

const SIGNALS: Signal[] = ['metrics', 'traces'];

const SIGNAL_TITLES: Record<Signal, string> = {
  metrics: 'Metrics',
  traces: 'Traces',
};

function isAtOrBelow(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export const OpenTelemetryContent = () => {
  const { pathname } = useAppLocation();
  const navigate = useAppNavigate();

  const metricsLink = useRouteRef(openTelemetryMetricsRouteRef);
  const tracesLink = useRouteRef(openTelemetryTracesRouteRef);
  const paths: Record<Signal, string | undefined> = {
    metrics: metricsLink?.(),
    traces: tracesLink?.(),
  };

  const active = SIGNALS.find(signal => {
    const path = paths[signal];
    return path !== undefined && isAtOrBelow(pathname, path);
  });

  // The bare sub-page path has no tab of its own, so send it to Metrics.
  useEffect(() => {
    if (!active && paths.metrics) {
      navigate(paths.metrics, { replace: true });
    }
  }, [active, paths.metrics, navigate]);

  return (
    <Flex direction="column" gap="4">
      <Tabs>
        <TabList aria-label="OpenTelemetry signals">
          {SIGNALS.map(signal => (
            <Tab key={signal} id={signal} href={paths[signal]}>
              {SIGNAL_TITLES[signal]}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      {active === 'metrics' && (
        <>
          <RegistryNote signal="metrics" />
          <MetricsPanel />
        </>
      )}
      {active === 'traces' && (
        <>
          <RegistryNote signal="traces" />
          <TracesPanel />
        </>
      )}
    </Flex>
  );
};
