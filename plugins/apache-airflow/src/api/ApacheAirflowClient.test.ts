/*
 * Copyright 2021 The Backstage Authors
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
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ApacheAirflowClient } from './index';
import { Dag } from './types';

const server = setupServer();

const dags: Dag[] = [
  {
    dag_id: 'mock_dag_1',
    fileloc: '',
    file_token: '',
    owners: ['admin'],
    schedule_interval: { __type: 'CronExpression', value: '* * 0 0 0' },
    tags: [{ name: 'exmaple' }],
  },
  {
    dag_id: 'mock_dag_2',
    fileloc: '',
    file_token: '',
    owners: ['admin'],
    schedule_interval: { __type: 'CronExpression', value: '* * 0 0 0' },
    tags: [{ name: 'exmaple' }],
  },
  {
    dag_id: 'mock_dag_3',
    fileloc: '',
    file_token: '',
    owners: ['admin'],
    schedule_interval: { __type: 'CronExpression', value: '* * 0 0 0' },
    tags: [{ name: 'exmaple' }],
  },
  {
    dag_id: 'mock_dag_4',
    fileloc: '',
    file_token: '',
    owners: ['admin'],
    schedule_interval: { __type: 'CronExpression', value: '* * 0 0 0' },
    tags: [{ name: 'exmaple' }],
  },
  {
    dag_id: 'mock_dag_5',
    fileloc: '',
    file_token: '',
    owners: ['admin'],
    schedule_interval: { __type: 'CronExpression', value: '* * 0 0 0' },
    tags: [{ name: 'exmaple' }],
  },
];

describe('ApacheAirflowClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const setupHandlers = () => {
    server.use(
      rest.get(`${mockBaseUrl}/airflow/dags`, (req, res, ctx) => {
        expect(req.url.searchParams.get('limit')).toBe('2');

        // emulate paging to check if everything is requested
        if (req.url.searchParams.get('offset') === '0') {
          return res(
            ctx.json({
              dags: dags.slice(0, 2),
              total_entries: dags.length,
            }),
          );
        }

        // page offset 2
        if (req.url.searchParams.get('offset') === '2') {
          return res(
            ctx.json({
              dags: dags.slice(2, 4),
              total_entries: dags.length,
            }),
          );
        }

        // page offset 4
        expect(req.url.searchParams.get('offset')).toBe('4');
        return res(
          ctx.json({
            dags: dags.slice(4),
            total_entries: dags.length,
          }),
        );
      }),

      rest.patch(`${mockBaseUrl}/airflow/dags/:dag_id`, (req, res, ctx) => {
        const { dag_id } = req.params;
        const body = JSON.parse(req.body as string);
        expect(body.is_paused).toBeDefined();
        return res(
          ctx.json({
            dag_id: dag_id,
            root_dag_id: 'string',
            is_paused: body.is_paused,
            is_active: true,
            is_subdag: true,
            fileloc: 'string',
            file_token: 'string',
            owners: ['string'],
            description: 'string',
            schedule_interval: {
              __type: 'string',
              days: 0,
              seconds: 0,
              microseconds: 0,
            },
            tags: [{}],
          }),
        );
      }),
    );
  };

  it('list dags should return all dags with emulated pagination', async () => {
    setupHandlers();
    const client = new ApacheAirflowClient({
      discoveryApi: discoveryApi,
      baseUrl: 'localhost:8080/',
    });

    // call with limit of 2, to force two paginations in requesting all dags
    // as our mocked response has 4 total entries
    const responseDags = await client.listDags({ objectsPerRequest: 2 });
    expect(responseDags.length).toEqual(5);
    expect(responseDags).toEqual(dags);
  });

  it('update dag should return dag information with updated paused attribute', async () => {
    setupHandlers();
    const client = new ApacheAirflowClient({
      discoveryApi: discoveryApi,
      baseUrl: 'localhost:8080/',
    });
    const dagId = 'mock_dag_1';
    const response: Dag = await client.updateDag(dagId, true);
    expect(response.dag_id).toEqual(dagId);
    expect(response.is_paused).toEqual(true);
  });
});
