/*
 * Copyright 2020 Spotify AB
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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { JWKECKey } from 'jose';
import { IdentityClient } from './IdentityClient';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

const server = setupServer();
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discovery: PluginEndpointDiscovery = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
  async getExternalBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};

describe('IdentityClient', () => {
  let client: IdentityClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = new IdentityClient({ discovery });
  });

  describe('listPublicKeys', () => {
    const defaultServiceResponse: {
      keys: JWKECKey[];
    } = {
      keys: [
        {
          crv: 'P-256',
          x: 'JWy80Goa-8C3oaeDLnk0ANVPPMfI9T3u_T5T7W2b_ls',
          y: 'Ge6jAhCDW1PFBfme2RA5ZsXN0cESiCwW29LMRPX5wkw',
          kty: 'EC',
          kid: 'fecd6d82-224f-43d6-b174-9a48bc42ae44',
          alg: 'ES256',
          use: 'sig',
        },
        {
          crv: 'P-256',
          x: 'PYGrR5otsNwGdwQC4Ob6sbkVc80jEwsPMUI25y7eUpY',
          y: 'GB_mlRnp6METpCW5yUWHpPprZaPJ5sK6RD5nEo1FYac',
          kty: 'EC',
          kid: 'c5d8c8a8-ca83-43ef-baca-3fccc198901d',
          alg: 'ES256',
          use: 'sig',
        },
      ],
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/.well-known/jwks.json`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should use the correct endpoint', async () => {
      const response = await client.listPublicKeys();
      expect(response).toEqual(defaultServiceResponse);
    });
  });
});
