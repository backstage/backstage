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

import { BackstageUserPrincipal } from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { JsonObject } from '@backstage/types';
import { SignJWT, base64url, importJWK } from 'jose';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { InternalBackstageCredentials } from '../auth/types';
import { DefaultUserInfoService } from './DefaultUserInfoService';

describe('DefaultUserInfoService', () => {
  const server = setupServer();
  registerMswTestHooks(server);

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

  function encodeData(data: JsonObject) {
    return base64url.encode(JSON.stringify(data));
  }

  async function createToken(options: {
    header: JsonObject;
    payload: JsonObject;
    signature?: string;
  }) {
    if (options.signature) {
      const header = encodeData(options.header);
      const payload = encodeData(options.payload);

      return `${header}.${payload}.${options.signature}`;
    }

    return await new SignJWT(options.payload)
      .setProtectedHeader({ ...options.header, alg: 'ES256' })
      .sign(await importJWK(mockPrivateKey));
  }

  const discovery = mockServices.discovery.mock({
    getBaseUrl: async pluginId => `https://example.com/api/${pluginId}`,
  });

  it('makes the expected call when no ent in the token', async () => {
    const token = await createToken({
      header: {
        typ: 'vnd.backstage.user',
        alg: 'ES256',
        kid: mockPublicKey.kid,
      },
      payload: {
        sub: 'user:default/alice',
      },
    });
    const credentials = {
      $$type: '@backstage/BackstageCredentials',
      version: 'v1',
      token: token,
      principal: {
        type: 'user',
        userEntityRef: 'user:default/alice',
      },
    } as InternalBackstageCredentials<BackstageUserPrincipal>;

    server.use(
      rest.get('https://example.com/api/auth/v1/userinfo', (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
        return res(ctx.json({ claims: { ent: ['group:default/my-team'] } }));
      }),
    );

    const service = new DefaultUserInfoService({ discovery });
    await expect(service.getUserInfo(credentials)).resolves.toEqual({
      userEntityRef: 'user:default/alice',
      ownershipEntityRefs: ['group:default/my-team'],
    });
  });

  it('uses the ent from the token when present', async () => {
    const token = await createToken({
      header: {
        typ: 'vnd.backstage.user',
        alg: 'ES256',
        kid: mockPublicKey.kid,
      },
      payload: {
        sub: 'user:default/alice',
        ent: ['group:default/my-team'],
      },
    });
    const credentials = {
      $$type: '@backstage/BackstageCredentials',
      version: 'v1',
      token: token,
      principal: {
        type: 'user',
        userEntityRef: 'user:default/alice',
      },
    } as InternalBackstageCredentials<BackstageUserPrincipal>;

    const service = new DefaultUserInfoService({ discovery });
    await expect(service.getUserInfo(credentials)).resolves.toEqual({
      userEntityRef: 'user:default/alice',
      ownershipEntityRefs: ['group:default/my-team'],
    });
  });

  it('passes on server errors', async () => {
    const token = await createToken({
      header: {
        typ: 'vnd.backstage.user',
        alg: 'ES256',
        kid: mockPublicKey.kid,
      },
      payload: {
        sub: 'user:default/alice',
      },
    });
    const credentials = {
      $$type: '@backstage/BackstageCredentials',
      version: 'v1',
      token: token,
      principal: {
        type: 'user',
        userEntityRef: 'user:default/alice',
      },
    } as InternalBackstageCredentials<BackstageUserPrincipal>;

    server.use(
      rest.get('https://example.com/api/auth/v1/userinfo', (_req, res, ctx) => {
        return res(ctx.status(404));
      }),
    );

    const service = new DefaultUserInfoService({ discovery });
    await expect(
      service.getUserInfo(credentials),
    ).rejects.toMatchInlineSnapshot(
      `[ResponseError: Request failed with 404 Not Found]`,
    );
  });
});
