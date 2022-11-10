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
import { DagRun } from './types/Dags';

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

const dagRuns: DagRun[] = [
  {
    dag_run_id: 'mock dag run 1',
    dag_id: 'mock_dag_1',
    logical_date: '2022-05-27T11:25:23.251274+00:00',
    start_date: '2022-05-27T11:25:23.251274+00:00',
    end_date: '2022-05-27T11:25:23.251274+00:00',
    state: 'success',
    external_trigger: true,
    conf: {},
  },
  {
    dag_run_id: 'mock dag run 2',
    dag_id: 'mock_dag_2',
    logical_date: '2022-05-27T11:25:23.251274+00:00',
    start_date: '2022-05-27T11:25:23.251274+00:00',
    end_date: '2022-05-27T11:25:23.251274+00:00',
    state: 'running',
    external_trigger: true,
    conf: {},
  },
  {
    dag_run_id: 'mock dag run 3',
    dag_id: 'mock_dag_1',
    logical_date: '2022-05-27T11:25:23.251274+00:00',
    start_date: '2022-05-27T11:25:23.251274+00:00',
    end_date: '2022-05-27T11:25:23.251274+00:00',
    state: 'failed',
    external_trigger: true,
    conf: {},
  },
];

describe('ApacheAirflowClient', () => {
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let client: ApacheAirflowClient;
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

      rest.get(`${mockBaseUrl}/airflow/dags/:dag_id`, (req, res, ctx) => {
        const { dag_id } = req.params;
        const dag = dags.find(d => d.dag_id === dag_id);
        if (dag) {
          return res(ctx.json(dag));
        }
        return res(ctx.status(404));
      }),

      rest.get(
        `${mockBaseUrl}/airflow/dags/:dag_id/dagRuns`,
        (req, res, ctx) => {
          const { dag_id } = req.params;
          const runs = dagRuns.filter(run => run.dag_id === dag_id);
          // event if the dag_id is invalid, airflow returns a valid response (with 0 dag runs)
          return res(
            ctx.json({
              dag_runs: runs,
              total_entries: runs.length,
            }),
          );
        },
      ),

      rest.patch(
        `${mockBaseUrl}/airflow/dags/:dag_id`,
        async (req, res, ctx) => {
          const { dag_id } = req.params;
          const body = JSON.parse(await req.text());
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
        },
      ),
    );
  };

  beforeEach(() => {
    setupHandlers();
    client = new ApacheAirflowClient({
      discoveryApi: discoveryApi,
      baseUrl: 'localhost:8080/',
    });
  });

  it('list dags should return all dags with emulated pagination', async () => {
    // call with limit of 2, to force two paginations in requesting all dags
    // as our mocked response has 4 total entries
    const responseDags = await client.listDags({ objectsPerRequest: 2 });
    expect(responseDags.length).toEqual(5);
    expect(responseDags).toEqual(dags);
  });

  it('update dag should return dag information with updated paused attribute', async () => {
    const dagId = 'mock_dag_1';
    const response: Dag = await client.updateDag(dagId, true);
    expect(response.dag_id).toEqual(dagId);
    expect(response.is_paused).toEqual(true);
  });

  it('get only some dags', async () => {
    const dagIds = ['mock_dag_1', 'mock_dag_3'];
    const response = await client.getDags(dagIds);
    expect(response.dags.length).toEqual(dagIds.length);
    response.dags.forEach((dag, index) =>
      expect(dag.dag_id).toEqual(dagIds[index]),
    );
    expect(response.dagsNotFound.length).toEqual(0);
  });

  it('get dags but ignore NOT FOUND errors', async () => {
    const dagIds = ['mock_dag_1', 'a-random-DAG-id'];
    const response = await client.getDags(dagIds);
    expect(response.dags.length).toEqual(1);
    expect(response.dags[0].dag_id).toEqual('mock_dag_1');
    expect(response.dagsNotFound.length).toEqual(1);
    expect(response.dagsNotFound[0]).toEqual('a-random-DAG-id');
  });

  it('should get dag runs', async () => {
    const dagId = 'mock_dag_1';
    const response = await client.getDagRuns(dagId);
    expect(response.length).toEqual(2);
    response.forEach(run => expect(run.dag_id).toEqual(dagId));
  });
});
