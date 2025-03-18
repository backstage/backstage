/*
 * Copyright 2023 The Backstage Authors
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

import { createMocks } from 'react-idle-timer';
// eslint-disable-next-line no-restricted-imports
import { MessageChannel } from 'worker_threads';
import { ApiProvider } from '@backstage/core-app-api';
import { identityApiRef } from '@backstage/core-plugin-api';
import {
  TestApiRegistry,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import React from 'react';

import { AutoLogout } from './AutoLogout';
import { cleanup } from '@testing-library/react';

const mockIdentityApi = mockApis.identity({ token: 'xxx' });
const apis = TestApiRegistry.from([identityApiRef, mockIdentityApi]);

describe('AutoLogout', () => {
  beforeAll(() => {
    createMocks();
    // @ts-ignore
    global.MessageChannel = MessageChannel;
  });

  afterAll(cleanup);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if idleTimeoutMinutes is smaller than promptBeforeSeconds', async () => {
    await expect(
      async () =>
        await renderInTestApp(
          <ApiProvider apis={apis}>
            <AutoLogout
              enabled
              idleTimeoutMinutes={0.5}
              promptBeforeIdleSeconds={120}
            />
          </ApiProvider>,
        ),
    ).rejects.toThrow();
  });

  it('should throw error if idleTimeoutMinutes is smaller than 30 seconds', async () => {
    await expect(
      async () =>
        await renderInTestApp(
          <ApiProvider apis={apis}>
            <AutoLogout enabled idleTimeoutMinutes={0.49} />
            <div>Test Child</div>
          </ApiProvider>,
        ),
    ).rejects.toThrow();
  });
});
