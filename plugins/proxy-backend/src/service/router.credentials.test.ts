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

import { createBackend } from '@backstage/backend-defaults';
import {
  mockServices,
  setupRequestMockHandlers,
} from '@backstage/backend-test-utils';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import fetch from 'node-fetch';
import portFinder from 'portfinder';

// this test is stored in its own file to work around the mocked
// http-proxy-middleware module used in the main test file

describe('credentials', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  it('handles all valid credentials settings', async () => {
    const host = 'localhost';
    const port = await portFinder.getPortPromise();
    const baseUrl = `http://${host}:${port}`;

    const config = {
      backend: {
        baseUrl,
        listen: { host, port },
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

    worker.use(
      rest.all(`${baseUrl}/*`, req => req.passthrough()),
      rest.get('http://target.com/*', (req, res, ctx) => {
        const auth = req.headers.get('authorization');
        return res(
          ctx.status(200),
          ctx.json({ payload: { forwardedAuthorization: auth ?? false } }),
        );
      }),
    );

    async function call(options: {
      endpoint: string;
      authorization: string | false;
    }): Promise<JsonObject> {
      const { endpoint, authorization } = options;
      return fetch(`${baseUrl}/api/proxy/${endpoint}/just-some-path`, {
        headers: authorization ? { Authorization: authorization } : {},
      }).then(async res => {
        if (!res.ok) {
          throw await ResponseError.fromResponse(res);
        }
        return res.json();
      });
    }

    // Create an actual backend instead of a test backend, because we want to
    // use the real HTTP server that provides the protection middleware etc. A
    // bit harder to test, but at least we can use static external access tokens
    // for it.
    const backend = createBackend();
    backend.add(import('../alpha'));
    backend.add(mockServices.rootConfig.factory({ data: config }));
    backend.add(mockServices.rootLogger.factory());
    await backend.start();

    try {
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
  });
});
