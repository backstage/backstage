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
import { ProblemsList } from './ProblemsList';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { dynatraceApiRef } from '../../../api';
import { problems } from '../../../mocks/problems.json';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

const mockDynatraceApi = {
  getDynatraceProblems: jest.fn(),
};
const apis = TestApiRegistry.from(
  [dynatraceApiRef, mockDynatraceApi],
  [configApiRef, new ConfigReader({ dynatrace: { baseUrl: '__dynatrace__' } })],
);

describe('ProblemStatus', () => {
  it('renders a table with problem data', async () => {
    mockDynatraceApi.getDynatraceProblems = jest
      .fn()
      .mockResolvedValue({ problems });
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ProblemsList dynatraceEntityId="example-service-3" />
      </ApiProvider>,
    );
    expect(await rendered.findByText('example-service')).toBeInTheDocument();
  });
  it('renders "nothing to report :)" if no problems are found', async () => {
    mockDynatraceApi.getDynatraceProblems = jest.fn().mockResolvedValue({});
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ProblemsList dynatraceEntityId="example-service-3" />
      </ApiProvider>,
    );
    expect(
      await rendered.findByText('Nothing to report :)'),
    ).toBeInTheDocument();
  });
});
