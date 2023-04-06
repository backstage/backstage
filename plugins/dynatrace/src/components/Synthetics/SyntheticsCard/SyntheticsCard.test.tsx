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
import { SyntheticsCard } from './SyntheticsCard';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { dynatraceApiRef } from '../../../api';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

const mockDynatraceApi = {
  getDynatraceSyntheticFailures: jest.fn(),
};
const apis = TestApiRegistry.from(
  [dynatraceApiRef, mockDynatraceApi],
  [configApiRef, new ConfigReader({ dynatrace: { baseUrl: '__dynatrace__' } })],
);

describe('SyntheticsCard', () => {
  it('renders the card with Synthetics data', async () => {
    mockDynatraceApi.getDynatraceSyntheticFailures = jest
      .fn()
      .mockResolvedValue({
        locationsExecutionResults: [
          {
            locationId: '__location__',
            requestResults: [{ startTimestamp: 0 }],
          },
        ],
      });
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SyntheticsCard syntheticsId="HTTP_CHECK-1234" />,
      </ApiProvider>,
    );
    expect(
      await rendered.findByText('View this Synthetic in Dynatrace'),
    ).toBeInTheDocument();
  });
});
