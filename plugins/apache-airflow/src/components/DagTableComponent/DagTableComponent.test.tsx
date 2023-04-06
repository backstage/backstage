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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { DagTableComponent } from './DagTableComponent';

describe('DagTableComponent', () => {
  const mockApi: jest.Mocked<ApacheAirflowApi> = {
    listDags: jest.fn().mockResolvedValue([
      {
        dag_id: 'mock_dag_1',
      },
      {
        dag_id: 'mock_dag_2',
      },
      {
        dag_id: 'mock_dag_3',
      },
    ]),
    getDags: jest.fn().mockResolvedValue({
      dags: [{ dag_id: 'mock_dag_1' }],
      dagsNotFound: ['a-random-id'],
    }),
  } as any;

  it('should render all DAGs', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[apacheAirflowApiRef, mockApi]]}>
        <DagTableComponent />
      </TestApiProvider>,
    );

    ['mock_dag_1', 'mock_dag_2', 'mock_dag_3'].forEach(dagId => {
      expect(getByText(dagId)).toBeInTheDocument();
    });
  });

  it('should render only selected DAGs', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[apacheAirflowApiRef, mockApi]]}>
        <DagTableComponent dagIds={['mock_dag_1', 'a-random-id']} />
      </TestApiProvider>,
    );
    expect(getByText('mock_dag_1')).toBeInTheDocument();
    expect(getByText('Warning: 1 DAGs were not found')).toBeInTheDocument();
    expect(getByText('a-random-id')).toBeInTheDocument();
  });
});
