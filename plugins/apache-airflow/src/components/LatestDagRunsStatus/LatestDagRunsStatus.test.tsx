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
import { ApacheAirflowApi, apacheAirflowApiRef } from '../../api';
import { DagRun } from '../../api/types/Dags';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { LatestDagRunsStatus } from './LatestDagRunsStatus';

describe('LatestDagRunsStatus', () => {
  const baseDagRun: Partial<DagRun> = {
    dag_run_id: 'mock dag run 1',
    dag_id: 'mock_dag_1',
    logical_date: '2022-05-27T11:25:23.251274+00:00',
    start_date: '2022-05-27T11:25:23.251274+00:00',
    end_date: '2022-05-27T11:25:23.251274+00:00',
    state: 'success',
    external_trigger: true,
    conf: {},
  };
  const mockApi: jest.Mocked<ApacheAirflowApi> = {
    getDagRuns: jest.fn().mockResolvedValue([
      baseDagRun,
      {
        ...baseDagRun,
        dag_run_id: 'mock dag run 2',
        state: 'running',
      },
      {
        ...baseDagRun,
        dag_run_id: 'mock dag run 3',
        state: 'failed',
      },
      {
        ...baseDagRun,
        dag_run_id: 'mock dag run 3',
        state: 'queued',
      },
    ] as DagRun[]),
  } as any;

  it('should render the status of mock dag 1', async () => {
    const dagId = 'mock_dag_1';

    const { getByLabelText } = await renderInTestApp(
      <TestApiProvider apis={[[apacheAirflowApiRef, mockApi]]}>
        <LatestDagRunsStatus dagId={dagId} />
      </TestApiProvider>,
    );
    expect(getByLabelText('Status ok')).toBeInTheDocument();
    expect(getByLabelText('Status running')).toBeInTheDocument();
    expect(getByLabelText('Status error')).toBeInTheDocument();
    expect(getByLabelText('Status pending')).toBeInTheDocument();
  });
});
