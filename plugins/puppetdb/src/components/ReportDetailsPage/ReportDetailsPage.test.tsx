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
import { ReportDetailsPage } from './ReportDetailsPage';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { puppetDbRouteRef } from '../../routes';
import { puppetDbApiRef, PuppetDbClient } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';

const mockPuppetDbApi: Partial<PuppetDbClient> = {
  getPuppetDbReportEvents: async () => [],
};

const apis = TestApiRegistry.from([puppetDbApiRef, mockPuppetDbApi]);

describe('ReportDetailsPage', () => {
  it('should render', async () => {
    const render = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ReportDetailsPage />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/puppetdb/report': puppetDbRouteRef,
        },
      },
    );
    expect(render.getByText('PuppetDB Reports')).toBeInTheDocument();
    expect(render.getByText('Events')).toBeInTheDocument();
    expect(render.getByText('Logs')).toBeInTheDocument();
  });
});
