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

import { authServiceFactory } from '@backstage/backend-defaults/auth';
import { httpAuthServiceFactory } from '@backstage/backend-defaults/httpAuth';
import {
  mockServices,
  registerMswTestHooks,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { HttpResponse, http, passthrough } from 'msw';
import { setupServer } from 'msw/node';

// this test is stored in its own file to work around the mocked
// http-proxy-middleware module used in the main test file

describe('credentials', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  it('handles all valid credentials settings', async () => {
    const config = {
      backend: {
        auth: {
          externalAccess: [
            {
              type: 'static',
              options: {
                token: 'static-token',
                subject: 'static-subject',
              },
            },
          ],
        },
      },
      proxy: {
        endpoints: {
          '/simple': 'http://target.com',
          '/default': {
            target: 'http://target.com',
          },
          '/require': {
            target: 'http://target.com',
            credentials: 'require',
          },
          '/forward': {
            target: 'http://target.com',
            credentials: 'forward',
          },
          '/dangerously-allow-unauthenticated--no-forward': {
            target: 'http://target.com',
            credentials: 'dangerously-allow-unauthenticated',
          },
          '/dangerously-allow-unauthenticated--with-forward': {
            target: 'http://target.com',
            credentials: 'dangerously-allow-unauthenticated',
            allowedHeaders: ['Authorization'],
          },
        },
      },
    };

    const backend = await startTestBackend({
      features: [
        import('../alpha'),
        mockServices.rootConfig.factory({ data: config }),
        authServiceFactory,
        httpAuthServiceFactory,
      ],
    });

    try {
      const baseUrl = `http://localhost:${backend.server.port()}`;
      worker.use(
        http.all(`${baseUrl}/*`, passthrough),
        http.get('http://target.com/*', req => {
          const auth = req.request.headers.get('authorization');
          return HttpResponse.json({
            payload: { forwardedAuthorization: auth ?? false },
          });
        }),
      );

      const call = async (options: {
        endpoint: string;
        authorization: string | false;
      }): Promise<JsonObject> => {
        const { endpoint, authorization } = options;
        return fetch(`${baseUrl}/api/proxy/${endpoint}/just-some-path`, {
          headers: authorization ? { Authorization: authorization } : {},
        }).then(async res => {
          if (!res.ok) {
            throw await ResponseError.fromResponse(res);
          }
          return res.json();
        });
      };

      // simple credentials config
      await expect(
        call({ endpoint: 'simple', authorization: false }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Missing credentials',
            name: 'AuthenticationError',
          },
        },
      });
      await expect(
        call({ endpoint: 'simple', authorization: 'Bearer static-token' }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });
      await expect(
        call({ endpoint: 'simple', authorization: 'Bearer not-valid' }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Illegal token',
            name: 'AuthenticationError',
          },
        },
      });

      // default credentials config
      await expect(
        call({ endpoint: 'default', authorization: false }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Missing credentials',
            name: 'AuthenticationError',
          },
        },
      });
      await expect(
        call({ endpoint: 'default', authorization: 'Bearer static-token' }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });
      await expect(
        call({ endpoint: 'default', authorization: 'Bearer not-valid' }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Illegal token',
            name: 'AuthenticationError',
          },
        },
      });

      // require credentials config
      await expect(
        call({ endpoint: 'require', authorization: false }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Missing credentials',
            name: 'AuthenticationError',
          },
        },
      });
      await expect(
        call({ endpoint: 'require', authorization: 'Bearer static-token' }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });
      await expect(
        call({ endpoint: 'require', authorization: 'Bearer not-valid' }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Illegal token',
            name: 'AuthenticationError',
          },
        },
      });

      // forward credentials config
      await expect(
        call({ endpoint: 'forward', authorization: false }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Missing credentials',
            name: 'AuthenticationError',
          },
        },
      });
      await expect(
        call({ endpoint: 'forward', authorization: 'Bearer static-token' }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: 'Bearer static-token',
        },
      });
      await expect(
        call({ endpoint: 'forward', authorization: 'Bearer not-valid' }),
      ).rejects.toMatchObject({
        body: {
          error: {
            message: 'Illegal token',
            name: 'AuthenticationError',
          },
        },
      });

      // dangerously-allow-unauthenticated credentials config, no forwarding
      await expect(
        call({
          endpoint: 'dangerously-allow-unauthenticated--no-forward',
          authorization: false,
        }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });
      await expect(
        call({
          endpoint: 'dangerously-allow-unauthenticated--no-forward',
          authorization: 'Bearer static-token',
        }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });
      await expect(
        call({
          endpoint: 'dangerously-allow-unauthenticated--no-forward',
          authorization: 'Bearer not-valid',
        }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });

      // dangerously-allow-unauthenticated credentials config, with forwarding
      await expect(
        call({
          endpoint: 'dangerously-allow-unauthenticated--with-forward',
          authorization: false,
        }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: false,
        },
      });
      await expect(
        call({
          endpoint: 'dangerously-allow-unauthenticated--with-forward',
          authorization: 'Bearer static-token',
        }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization: 'Bearer static-token',
        },
      });
      await expect(
        call({
          endpoint: 'dangerously-allow-unauthenticated--with-forward',
          authorization: 'Bearer not-valid-for-backstage-but-valid-for-target',
        }),
      ).resolves.toMatchObject({
        payload: {
          forwardedAuthorization:
            'Bearer not-valid-for-backstage-but-valid-for-target',
        },
      });
    } finally {
      await backend.stop();
    }
  }, 20_000);
});
