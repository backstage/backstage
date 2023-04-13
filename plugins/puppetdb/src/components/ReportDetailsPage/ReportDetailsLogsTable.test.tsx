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
import { ReportDetailsLogsTable } from './ReportDetailsLogsTable';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { puppetDbApiRef, PuppetDbReportLog } from '../../api';
import { PuppetDbClient } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';
import { puppetDbRouteRef } from '../../routes';

const logs: PuppetDbReportLog[] = [
  {
    level: 'level1',
    file: 'file1',
    line: 1,
    time: '2021-01-01T00:00:00Z',
    message: 'message1',
    source: 'source1',
    tags: ['tag1'],
  },
  {
    level: 'level2',
    file: 'file2',
    line: 2,
    time: '2021-01-01T00:00:00Z',
    message: 'message2',
    source: 'source2',
    tags: ['tag2'],
  },
];

const mockPuppetDbApi: Partial<PuppetDbClient> = {
  getPuppetDbReportLogs: async () => logs,
};

const apis = TestApiRegistry.from([puppetDbApiRef, mockPuppetDbApi]);

const hash = 'hash';

describe('ReportLogsTable', () => {
  it('should render', async () => {
    const render = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ReportDetailsLogsTable hash={hash} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/puppetdb/report/:hash': puppetDbRouteRef,
        },
      },
    );

    expect(render.getByText('Latest logs')).toBeInTheDocument();
    expect(render.getByText('Level')).toBeInTheDocument();
    expect(render.getByText('Timestamp')).toBeInTheDocument();
    expect(render.getByText('Source')).toBeInTheDocument();
    expect(render.getByText('Message')).toBeInTheDocument();
    expect(render.getByText('source1')).toBeInTheDocument();
    expect(render.getByText('source2')).toBeInTheDocument();
  });
});
