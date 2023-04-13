/*
 * Copyright 2022 The Backstage Authors
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
import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { PuppetDbClient } from './PuppetDbClient';
import {
  PuppetDbReport,
  PuppetDbReportEvent,
  PuppetDbReportLog,
} from './types';

const server = setupServer();

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
    noop: false,
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

const events: PuppetDbReportEvent[] = [
  {
    name: 'event1',
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

describe('PuppetDbClient', () => {
  setupRequestMockHandlers(server);

  const puppetDbCertName = 'node1';
  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let client: PuppetDbClient;

  const setupHandlers = () => {
    server.use(
      rest.get(
        `${mockBaseUrl}/puppetdb/pdb/query/v4/reports`,
        (req, res, ctx) => {
          if (
            req.url.searchParams.get('query') !==
            `["=","certname","${puppetDbCertName}"]`
          ) {
            return res(ctx.status(400));
          }

          return res(ctx.status(200), ctx.json(reports));
        },
      ),

      rest.get(
        `${mockBaseUrl}/puppetdb/pdb/query/v4/reports/hash1/events`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(events));
        },
      ),

      rest.get(
        `${mockBaseUrl}/puppetdb/pdb/query/v4/reports/hash1/logs`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(logs));
        },
      ),
    );
  };

  beforeEach(() => {
    setupHandlers();
    client = new PuppetDbClient({
      discoveryApi: discoveryApi,
      fetchApi: new MockFetchApi(),
    });
  });

  it('getPuppetDbNodeReports should return reports', async () => {
    const got = await client.getPuppetDbNodeReports(puppetDbCertName);
    expect(got).toEqual(reports);
  });

  it('getPuppetDbReportEvents should return events', async () => {
    const got = await client.getPuppetDbReportEvents('hash1');
    expect(got).toEqual(events);
  });

  it('getPuppetDbReportLogs should return logs', async () => {
    const got = await client.getPuppetDbReportLogs('hash1');
    expect(got).toEqual(logs);
  });
});
