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
import { DefaultPluginTokenHandler } from './PluginTokenHandler';
import { decodeJwt } from 'jose';

describe('PluginTokenHandler', () => {
  const mockPublicKey = {
    kty: 'EC',
    x: 'GHlwg744e8JekzukPTdtix6R868D6fcWy0ooOx-NEZI',
    y: 'Lyujcm0M6X9_yQi3l1eH09z0brU8K9cwrLml_fRFKro',
    crv: 'P-256',
    kid: 'mock',
    alg: 'ES256',
  };
  const mockPrivateKey = {
    ...mockPublicKey,
    d: 'KEn_mDqXYbZdRHb-JnCrW53LDOv5x4NL1FnlKcqBsFI',
  };

  beforeEach(() => {
    jest.useRealTimers();
  });

  it('runs issueToken', async () => {
    jest.useFakeTimers({
      now: new Date(0),
    });

    const getKeyMock = jest.fn(async () => mockPrivateKey);
    const handler = DefaultPluginTokenHandler.create({
      discovery: mockServices.discovery(),
      keyDuration: { seconds: 10 },
      logger: mockServices.logger.mock(),
      ownPluginId: 'test',
      keySource: {
        getPrivateSigningKey: getKeyMock,
        listKeys: jest.fn(),
      },
    });

    const { token } = await handler.issueToken({
      pluginId: 'test',
      targetPluginId: 'other',
    });
    const payload = decodeJwt(token);
    expect(payload).toMatchObject({
      iat: 0,
      exp: 10,
      sub: 'test',
      aud: 'other',
    });

    expect(getKeyMock).toHaveBeenCalledTimes(1);
  });
});
