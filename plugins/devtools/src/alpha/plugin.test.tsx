/*
 * Copyright 2026 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { useApi } from '@backstage/frontend-plugin-api';
import plugin from './plugin';
import { devToolsApiRef } from '../api/DevToolsApi';

const mockLoadClient = jest.fn();
const mockApi = { getInfo: jest.fn() };

jest.mock('../api/DevToolsClient', () => {
  mockLoadClient();
  return { DevToolsClient: jest.fn(() => mockApi) };
});

it('loads the internal client only when a component requests the API', async () => {
  expect(mockLoadClient).not.toHaveBeenCalled();
  function Consumer() {
    const api = useApi(devToolsApiRef);
    expect(api).toBe(mockApi);
    return <div>DevTools API ready</div>;
  }
  renderInTestApp(<Consumer />, { features: [plugin] });
  expect(await screen.findByText('DevTools API ready')).toBeInTheDocument();
  expect(mockLoadClient).toHaveBeenCalledTimes(1);
});
