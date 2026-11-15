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

import { renderTestApp, mockApis } from '@backstage/frontend-test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { screen } from '@testing-library/react';
import devToolsPlugin from '../alpha';
import { devToolsApiRef, DevToolsApi } from '../api';

describe('devtools OpenTelemetry page', () => {
  it('renders the OpenTelemetry tab with its metrics', async () => {
    const devToolsApi: Partial<DevToolsApi> = {
      getOpenTelemetryMetrics: async () => ({
        metrics: [
          {
            pluginId: 'catalog',
            name: 'catalog.entities.count',
            type: 'gauge',
          },
        ],
      }),
      getOpenTelemetrySpans: async () => ({ spans: [] }),
    };

    renderTestApp({
      features: [devToolsPlugin],
      initialRouteEntries: ['/devtools/opentelemetry'],
      apis: [
        [devToolsApiRef, devToolsApi],
        [permissionApiRef, mockApis.permission()],
      ],
    });

    expect(
      await screen.findByText('catalog.entities.count'),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Metrics' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Traces' })).toBeInTheDocument();
  });

  it('opens a tab directly from a nested URL', async () => {
    const devToolsApi: Partial<DevToolsApi> = {
      getOpenTelemetryMetrics: async () => ({ metrics: [] }),
      getOpenTelemetrySpans: async () => ({
        spans: [
          {
            pluginId: 'mcp-actions',
            name: 'tools/call catalog.get-catalog-entity',
            kind: 'server',
            count: 9,
            lastSeen: '2026-01-01T00:00:00.000Z',
          },
        ],
      }),
    };

    renderTestApp({
      features: [devToolsPlugin],
      initialRouteEntries: ['/devtools/opentelemetry/traces?q=catalog'],
      apis: [
        [devToolsApiRef, devToolsApi],
        [permissionApiRef, mockApis.permission()],
      ],
    });

    expect(
      await screen.findByText('tools/call catalog.get-catalog-entity'),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Traces' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
