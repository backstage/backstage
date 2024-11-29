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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';
import { authPlugin } from './authPlugin';

describe('authPlugin', () => {
  it('should provide an OpenID configuration', async () => {
    const { server } = await startTestBackend({
      features: [
        authPlugin,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
          },
        }),
      ],
    });

    const res = await request(server).get(
      '/api/auth/.well-known/openid-configuration',
    );
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      claims_supported: ['sub', 'ent'],
      issuer: `http://localhost:${server.port()}/api/auth`,
    });
  });
});
