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
import { SyntheticsLocation } from './SyntheticsLocation';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { dynatraceApiRef } from '../../../api';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

const mockDynatraceApi = {
  getDynatraceSyntheticLocationInfo: jest.fn(),
};
const apis = TestApiRegistry.from(
  [dynatraceApiRef, mockDynatraceApi],
  [configApiRef, new ConfigReader({ dynatrace: { baseUrl: '__dynatrace__' } })],
);

describe('SyntheticsLocation', () => {
  it('renders the SyntheticsLocation chip - recent failure', async () => {
    mockDynatraceApi.getDynatraceSyntheticLocationInfo = jest
      .fn()
      .mockResolvedValue({ name: '__location__' });
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SyntheticsLocation
          lastFailedTimestamp={new Date()}
          locationId="__location_id__"
          key="__key__"
        />
        ,
      </ApiProvider>,
    );
    expect(await rendered.findByText(/failed/)).toBeInTheDocument();
  });
  it('renders the SyntheticsLocation chip - no failures', async () => {
    mockDynatraceApi.getDynatraceSyntheticLocationInfo = jest
      .fn()
      .mockResolvedValue({ name: '__location__' });
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SyntheticsLocation
          lastFailedTimestamp={new Date(0)}
          locationId="__location_id__"
          key="__key__"
        />
        ,
      </ApiProvider>,
    );
    expect(await rendered.findByText(/__location__/)).toBeInTheDocument();
    expect(rendered.queryByText(/failed/)).not.toBeInTheDocument();
  });
});
