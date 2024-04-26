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
import { ReportDetailsEventsTable } from './ReportDetailsEventsTable';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { puppetDbApiRef, PuppetDbReportEvent } from '../../api';
import { PuppetDbClient } from '../../api';
import { ApiProvider } from '@backstage/core-app-api';
import { puppetDbRouteRef } from '../../routes';

const events: PuppetDbReportEvent[] = [
  {
    name: 'event3',
    message: 'message1',
    file: 'file1',
    line: 1,
    certname: 'node1',
    report: 'hash1',
    timestamp: '2021-01-01T00:00:00Z',
    report_receive_time: '2021-01-01T00:00:00Z',
    run_start_time: '2021-01-01T00:00:00Z',
    containing_class: 'class1',
    environment: 'production',
    configuration_version: 'version1',
    containment_path: ['path1'],
    corrective_change: false,
    run_end_time: '2021-01-01T00:00:00Z',
    resource_type: 'type1',
    resource_title: 'title1',
    property: 'property1',
    old_value: 'old1',
    new_value: 'new1',
    status: 'changed',
  },
  {
    name: 'event2',
    message: 'message2',
    file: 'file2',
    line: 2,
    certname: 'node1',
    report: 'hash1',
    timestamp: '2021-01-01T00:00:00Z',
    report_receive_time: '2021-01-01T00:00:00Z',
    run_start_time: '2021-01-01T00:00:00Z',
    containing_class: 'class2',
    environment: 'production',
    configuration_version: 'version2',
    containment_path: ['path2'],
    corrective_change: false,
    run_end_time: '2021-01-01T00:00:00Z',
    resource_type: 'type2',
    resource_title: 'title2',
    property: 'property2',
    old_value: 'old2',
    new_value: 'new2',
    status: 'failed',
  },
];

const mockPuppetDbApi: Partial<PuppetDbClient> = {
  getPuppetDbReportEvents: async () => events,
};

const apis = TestApiRegistry.from([puppetDbApiRef, mockPuppetDbApi]);

const hash = 'hash';

describe('ReportEventsTable', () => {
  it('should render', async () => {
    const render = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ReportDetailsEventsTable hash={hash} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/puppetdb/report/:hash': puppetDbRouteRef,
        },
      },
    );

    expect(render.getByText('Latest events')).toBeInTheDocument();
    expect(render.getByText('Containing Class')).toBeInTheDocument();
    expect(render.getByText('Resource')).toBeInTheDocument();
    expect(render.getByText('Property')).toBeInTheDocument();
    expect(render.getByText('Old Value')).toBeInTheDocument();
    expect(render.getByText('New Value')).toBeInTheDocument();
    expect(render.getByText('Status')).toBeInTheDocument();
    expect(render.getByText('property2')).toBeInTheDocument();
    expect(render.getByText('old1')).toBeInTheDocument();
    expect(render.getByText('old2')).toBeInTheDocument();
  });
});
