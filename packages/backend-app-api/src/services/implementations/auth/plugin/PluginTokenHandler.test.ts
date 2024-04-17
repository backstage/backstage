/*
 * Copyright 2024 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import { PluginTokenHandler } from './PluginTokenHandler';
import { decodeJwt } from 'jose';

describe('PluginTokenHandler', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('issues token with correct expiration of token and generated key', async () => {
    jest.useFakeTimers({
      now: new Date(0),
    });

    const addKeyMock = jest.fn();
    const handler = PluginTokenHandler.create({
      discovery: mockServices.discovery(),
      keyDuration: { seconds: 10 },
      logger: mockServices.logger.mock(),
      ownPluginId: 'test',
      publicKeyStore: {
        addKey: addKeyMock,
        listKeys: jest.fn(),
      },
    });

    const { token } = await handler.issueToken({
      pluginId: 'test',
      targetPluginId: 'other',
    });
    const payload = decodeJwt(token);
    expect(payload.iat).toBe(0);
    expect(payload.exp).toBe(10);

    expect(addKeyMock).toHaveBeenCalledTimes(1);
    expect(addKeyMock).toHaveBeenCalledWith({
      id: expect.any(String),
      key: expect.any(Object),
      expiresAt: new Date(30_000),
    });

    jest.advanceTimersByTime(5_000);
    await handler.issueToken({
      pluginId: 'test',
      targetPluginId: 'other',
    });
    expect(addKeyMock).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(10_000);
    await handler.issueToken({
      pluginId: 'test',
      targetPluginId: 'other',
    });
    expect(addKeyMock).toHaveBeenCalledTimes(2);

    expect(addKeyMock.mock.calls[0][0].id).not.toBe(
      addKeyMock.mock.calls[1][0].id,
    );

    expect(addKeyMock).toHaveBeenNthCalledWith(2, {
      id: expect.any(String),
      key: expect.any(Object),
      expiresAt: new Date(45_000),
    });
  });
});
