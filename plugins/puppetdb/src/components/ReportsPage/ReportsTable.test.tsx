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
import { ReportsTable } from './ReportsTable';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { puppetDbApiRef, PuppetDbReport, PuppetDbClient } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';
import { puppetDbRouteRef } from '../../routes';

const reports: PuppetDbReport[] = [
  {
    hash: 'hash1',
    puppet_version: 'version1',
    report_format: 1,
    certname: 'node1',
    start_time: '2021-01-01T00:00:00Z',
    end_time: '2021-01-01T00:00:00Z',
    producer_timestamp: '2021-01-01T00:00:00Z',
    receive_time: '2021-01-01T00:00:00Z',
    producer: 'producer1',
    transaction_uuid: 'uuid1',
    catalog_uuid: 'uuid1',
    code_id: 'id1',
    cached_catalog_status: 'status1',
    type: 'type1',
    corrective_change: false,
    configuration_version: 'version1',
    environment: 'production',
    noop: true,
    status: 'changed',
  },
  {
    hash: 'hash2',
    puppet_version: 'version2',
    report_format: 2,
    certname: 'node1',
    start_time: '2021-01-01T00:00:00Z',
    end_time: '2021-01-01T00:00:00Z',
    producer_timestamp: '2021-01-01T00:00:00Z',
    receive_time: '2021-01-01T00:00:00Z',
    producer: 'producer2',
    transaction_uuid: 'uuid2',
    catalog_uuid: 'uuid2',
    code_id: 'id2',
    cached_catalog_status: 'status2',
    type: 'type2',
    corrective_change: false,
    configuration_version: 'version2',
    environment: 'production',
    noop: false,
    status: 'failed',
  },
];

const mockPuppetDbApi: Partial<PuppetDbClient> = {
  getPuppetDbNodeReports: async () => reports,
};

const apis = TestApiRegistry.from([puppetDbApiRef, mockPuppetDbApi]);

const certName = 'node1';

describe('ReportsTable', () => {
  it('should render', async () => {
    const render = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ReportsTable certName={certName} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/puppetdb': puppetDbRouteRef,
        },
      },
    );

    expect(
      render.getByText('Latest PuppetDB reports from node node1'),
    ).toBeInTheDocument();
    expect(render.getByText('Configuration Version')).toBeInTheDocument();
    expect(render.getByText('Start Time')).toBeInTheDocument();
    expect(render.getByText('End Time')).toBeInTheDocument();
    expect(render.getByText('Run Duration')).toBeInTheDocument();
    expect(render.getByText('Mode')).toBeInTheDocument();
    expect(render.getByText('Status')).toBeInTheDocument();
    expect(render.getByText('NO-NOOP')).toBeInTheDocument();
    expect(render.getByText('NOOP')).toBeInTheDocument();
    expect(render.getByText('FAILED')).toBeInTheDocument();
    expect(render.getByText('CHANGED')).toBeInTheDocument();
  });
});
