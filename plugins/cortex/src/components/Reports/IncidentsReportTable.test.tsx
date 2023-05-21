/*
 * Copyright 2020 The Backstage Authors
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
import React from 'react';
import {AlertsReportsTable} from './ReportsTables';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { CortexApiRef, Incident } from '../../api';
import { CortexApiClient } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';
import { cortexRouteRef } from '../../routes';

const event: Incident[] = [
    {
        creation_time: 1672838146532,
        description: 'test',
        severity: 'low',
        hosts: ['test'],

    }
];

const mockCortexApi: Partial<CortexApiClient> = {
  getCortexSecurityIncidents: async () => event,
};

const apis = TestApiRegistry.from([CortexApiRef, mockCortexApi]);

const hash = 'hash';

describe('IncidentsReportTable', () => {
  it('should render', async () => {
    const render = await renderInTestApp(
      <ApiProvider apis={apis}>
        <AlertsReportsTable ip={hash} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/cortex': cortexRouteRef,
        },
      },
    );

    expect(render.getByText('Severity')).toBeInTheDocument();
    expect(render.getByText('Description')).toBeInTheDocument();
    expect(render.getByText('Date')).toBeInTheDocument();
    expect(render.getByText('LOW')).toBeInTheDocument();
    expect(render.getByText('test')).toBeInTheDocument();
  });
});
