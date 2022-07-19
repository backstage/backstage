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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { ApacheAirflowApi, apacheAirflowApiRef } from '../../api';
import { HomePage } from './HomePage';

describe('<HomePage />', () => {
  const mockApi: jest.Mocked<ApacheAirflowApi> = {
    getInstanceStatus: jest.fn().mockResolvedValue({
      metadatabase: { status: 'healthy' },
      scheduler: { status: 'healthy' },
    }),
    getInstanceVersion: jest.fn().mockResolvedValue({
      version: 'v2.0.0',
    }),
    listDags: jest.fn().mockResolvedValue([
      {
        dag_id: 'mock_dag_1',
      },
    ]),
  } as any;

  it('homepage should render', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[apacheAirflowApiRef, mockApi]]}>
        <HomePage />
      </TestApiProvider>,
    );
    expect(getByText('Apache Airflow')).toBeInTheDocument();
  });
});
