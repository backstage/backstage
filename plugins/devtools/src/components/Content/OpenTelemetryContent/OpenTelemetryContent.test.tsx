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

import { renderInTestApp } from '@backstage/frontend-test-utils';
import { fireEvent, screen, within } from '@testing-library/react';
import { devToolsApiRef, DevToolsApi } from '../../../api';
import { openTelemetryRouteRef } from '../../../alpha/routes';
import { OpenTelemetryContent } from './OpenTelemetryContent';

function rowNames() {
  return screen
    .getAllByRole('rowheader')
    .map(cell => within(cell).getAllByRole('paragraph')[0].textContent);
}

describe('OpenTelemetryContent', () => {
  const mockDevToolsApi: jest.Mocked<DevToolsApi> = {
    getScheduledTasksByPlugin: jest.fn(),
    triggerScheduledTask: jest.fn(),
    cancelScheduledTask: jest.fn(),
    getConfig: jest.fn(),
    getExternalDependencies: jest.fn(),
    getInfo: jest.fn(),
    getOpenTelemetryMetrics: jest.fn(),
    getOpenTelemetrySpans: jest.fn(),
  };

  afterEach(() => jest.resetAllMocks());

  function renderContent(path = '/devtools/opentelemetry/metrics') {
    return renderInTestApp(<OpenTelemetryContent />, {
      apis: [[devToolsApiRef, mockDevToolsApi]],
      mountedRoutes: { '/devtools/opentelemetry': openTelemetryRouteRef },
      initialRouteEntries: [path],
    });
  }

  function currentLocation(result: ReturnType<typeof renderContent>) {
    const { pathname, search } = result.appHistory.getSnapshot().location;
    return `${pathname}${search}`;
  }

  it('lists metrics, filters them by search, and switches to traces', async () => {
    mockDevToolsApi.getOpenTelemetryMetrics.mockResolvedValue({
      metrics: [
        {
          pluginId: 'catalog',
          name: 'catalog.entities.count',
          type: 'observableGauge',
          description: 'Number of entities',
          unit: '{entity}',
        },
        {
          pluginId: 'scaffolder',
          name: 'scaffolder.task.count',
          type: 'counter',
        },
      ],
    });
    mockDevToolsApi.getOpenTelemetrySpans.mockResolvedValue({
      spans: [
        {
          pluginId: 'catalog',
          name: 'catalog.refresh',
          kind: 'internal',
          count: 42,
          lastSeen: '2026-01-01T00:00:00.000Z',
        },
      ],
    });

    const result = renderContent();

    expect(
      await screen.findByText('catalog.entities.count'),
    ).toBeInTheDocument();
    expect(screen.getByText('scaffolder.task.count')).toBeInTheDocument();
    expect(screen.getByText('Number of entities')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('rowheader')
        .map(cell => within(cell).queryByText('scaffolder'))
        .filter(Boolean),
    ).toHaveLength(1);
    expect(
      screen.queryByRole('columnheader', { name: /Plugin/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Observable gauge')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Traces' })).toHaveAttribute(
      'href',
      '/devtools/opentelemetry/traces',
    );
    expect(
      screen.getByRole('link', { name: 'Metrics Service' }),
    ).toHaveAttribute(
      'href',
      'https://backstage.io/docs/backend-system/core-services/metrics',
    );
    expect(
      screen.getByRole('link', { name: 'Telemetry Registry Service' }),
    ).toHaveAttribute(
      'href',
      'https://backstage.io/docs/backend-system/core-services/telemetry-registry',
    );
    expect(
      screen.queryByRole('link', { name: 'Tracing Service' }),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search metrics' }),
      {
        target: { value: 'scaffolder' },
      },
    );
    expect(
      await screen.findByText('scaffolder.task.count'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('catalog.entities.count'),
    ).not.toBeInTheDocument();
    expect(currentLocation(result)).toBe(
      '/devtools/opentelemetry/metrics?q=scaffolder',
    );

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search metrics' }),
      {
        target: { value: 'observable gauge' },
      },
    );
    expect(
      await screen.findByText('catalog.entities.count'),
    ).toBeInTheDocument();
    expect(screen.queryByText('scaffolder.task.count')).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search metrics' }),
      {
        target: { value: '{entity}' },
      },
    );
    expect(
      await screen.findByText('catalog.entities.count'),
    ).toBeInTheDocument();
    expect(screen.queryByText('scaffolder.task.count')).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search metrics' }),
      {
        target: { value: 'no-such-metric' },
      },
    );
    expect(
      await screen.findByText('No metrics match your search or filter.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No metrics have been registered yet.'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Traces' }));
    expect(await screen.findByText('catalog.refresh')).toBeInTheDocument();
    expect(currentLocation(result)).toBe('/devtools/opentelemetry/traces');
    expect(
      screen.getByRole('link', { name: 'Tracing Service' }),
    ).toHaveAttribute(
      'href',
      'https://backstage.io/docs/backend-system/core-services/tracing',
    );
    expect(
      screen.queryByRole('link', { name: 'Metrics Service' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search traces' }), {
      target: { value: 'no-such-span' },
    });
    expect(
      await screen.findByText('No traces match your search or filter.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No spans have been recorded yet.'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('tab', { name: 'Logging' }),
    ).not.toBeInTheDocument();
  });

  it('shows an error when metrics cannot be loaded', async () => {
    mockDevToolsApi.getOpenTelemetryMetrics.mockRejectedValue(
      new Error('Failed to load'),
    );
    mockDevToolsApi.getOpenTelemetrySpans.mockResolvedValue({ spans: [] });

    renderContent();

    expect(await screen.findByText('Failed to load')).toBeInTheDocument();
  });

  it('sorts metrics by name and traces by count, and re-sorts on header click', async () => {
    mockDevToolsApi.getOpenTelemetryMetrics.mockResolvedValue({
      metrics: [
        { pluginId: 'b', name: 'b.metric', type: 'histogram', unit: 's' },
        { pluginId: 'a', name: 'a.metric', type: 'counter' },
        { pluginId: 'c', name: 'c.metric', type: 'gauge', unit: 'ms' },
      ],
    });
    mockDevToolsApi.getOpenTelemetrySpans.mockResolvedValue({
      spans: [
        {
          pluginId: 'p',
          name: 'quiet',
          kind: 'internal',
          count: 1,
          lastSeen: '2026-01-03T00:00:00.000Z',
        },
        {
          pluginId: 'p',
          name: 'busy',
          kind: 'server',
          count: 50,
          lastSeen: '2026-01-01T00:00:00.000Z',
        },
        {
          pluginId: 'p',
          name: 'medium',
          kind: 'client',
          count: 7,
          lastSeen: '2026-01-02T00:00:00.000Z',
        },
      ],
    });

    const result = renderContent();

    await screen.findByText('a.metric');
    expect(rowNames()).toEqual(['a.metric', 'b.metric', 'c.metric']);

    fireEvent.click(screen.getByRole('columnheader', { name: /Type/ }));
    expect(rowNames()).toEqual(['a.metric', 'c.metric', 'b.metric']);
    expect(currentLocation(result)).toBe(
      '/devtools/opentelemetry/metrics?sort=type',
    );

    fireEvent.click(screen.getByRole('columnheader', { name: /Unit/ }));
    expect(rowNames()).toEqual(['c.metric', 'b.metric', 'a.metric']);

    fireEvent.click(screen.getByRole('tab', { name: 'Traces' }));
    await screen.findByText('busy');
    expect(rowNames()).toEqual(['busy', 'medium', 'quiet']);

    fireEvent.click(screen.getByRole('columnheader', { name: /Last seen/ }));
    expect(rowNames()).toEqual(['quiet', 'medium', 'busy']);
    expect(currentLocation(result)).toBe(
      '/devtools/opentelemetry/traces?sort=lastSeen&order=desc',
    );

    fireEvent.click(screen.getByRole('columnheader', { name: /Last seen/ }));
    expect(rowNames()).toEqual(['busy', 'medium', 'quiet']);
  });

  it('pages forward with the default sort and with a sort from the URL', async () => {
    mockDevToolsApi.getOpenTelemetryMetrics.mockResolvedValue({
      metrics: Array.from({ length: 25 }, (_, i) => ({
        pluginId: 'p',
        name: `metric.${String(i).padStart(2, '0')}`,
        type: 'counter' as const,
      })),
    });
    mockDevToolsApi.getOpenTelemetrySpans.mockResolvedValue({ spans: [] });

    const first = renderContent();
    await screen.findByText('metric.00');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText('metric.20')).toBeInTheDocument();
    expect(screen.queryByText('metric.00')).not.toBeInTheDocument();
    first.unmount();

    renderContent('/devtools/opentelemetry/metrics?sort=name&order=desc');
    await screen.findByText('metric.24');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText('metric.04')).toBeInTheDocument();
    expect(screen.queryByText('metric.24')).not.toBeInTheDocument();
  });

  it('redirects the bare path to metrics and restores state from the URL', async () => {
    mockDevToolsApi.getOpenTelemetryMetrics.mockResolvedValue({ metrics: [] });
    mockDevToolsApi.getOpenTelemetrySpans.mockResolvedValue({
      spans: [
        {
          pluginId: 'catalog',
          name: 'catalog.refresh',
          kind: 'internal',
          count: 3,
          lastSeen: '2026-01-01T00:00:00.000Z',
        },
        {
          pluginId: 'auth',
          name: 'auth.refresh',
          kind: 'server',
          count: 9,
          lastSeen: '2026-01-02T00:00:00.000Z',
        },
        {
          pluginId: 'catalog',
          name: 'catalog.stitch',
          kind: 'internal',
          count: 1,
          lastSeen: '2026-01-03T00:00:00.000Z',
        },
      ],
    });

    const bare = renderContent('/devtools/opentelemetry');
    expect(
      await screen.findByText('No metrics have been registered yet.'),
    ).toBeInTheDocument();
    expect(currentLocation(bare)).toBe('/devtools/opentelemetry/metrics');
    bare.unmount();

    renderContent(
      '/devtools/opentelemetry/traces/?q=refresh&plugin=catalog&sort=name&order=desc',
    );
    expect(await screen.findByText('catalog.refresh')).toBeInTheDocument();
    expect(rowNames()).toEqual(['catalog.refresh']);
    expect(
      screen.getByRole('searchbox', { name: 'Search traces' }),
    ).toHaveValue('refresh');
    expect(screen.getByRole('tab', { name: 'Traces' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
