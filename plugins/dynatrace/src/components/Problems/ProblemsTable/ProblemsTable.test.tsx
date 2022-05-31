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
import React from 'react';
import { ProblemsTable } from './ProblemsTable';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { problems } from '../../../mocks/problems.json';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

describe('ProblemsTable', () => {
  const apis = TestApiRegistry.from([
    configApiRef,
    new ConfigReader({ dynatrace: { baseUrl: '__dynatrace__' } }),
  ]);
  it('renders the table with some problem data', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ProblemsTable problems={problems} />,
      </ApiProvider>,
    );
    expect(await rendered.findByText('example-service')).toBeInTheDocument();
  });
  it('renders an empty table when no data is provided', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ProblemsTable problems={[]} />
      </ApiProvider>,
    );
    expect(await rendered.findByText('Problems')).toBeInTheDocument();
  });
});
