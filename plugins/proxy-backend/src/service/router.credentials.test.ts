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
import * as nodeHttp from 'node:http';

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
        import('..'),
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

  it('applies credential requirements to overlapping proxy routes', async () => {
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
          '/child-first/protected': {
            target: 'http://child-first-protected.com',
            credentials: 'require',
            headers: {
              Authorization: 'Bearer upstream-static-token',
            },
          },
          '/child-first': {
            target: 'http://child-first-public.com',
            credentials: 'dangerously-allow-unauthenticated',
          },
          '/parent-first': {
            target: 'http://parent-first-public.com',
            credentials: 'dangerously-allow-unauthenticated',
          },
          '/parent-first/protected': {
            target: 'http://parent-first-protected.com',
            credentials: 'require',
          },
          '/parameterized/bar/baz': {
            target: 'http://parameterized-protected.com',
            credentials: 'forward',
          },
          '/parameterized/:id': {
            target: 'http://parameterized-public.com',
            credentials: 'dangerously-allow-unauthenticated',
          },
          '/method-fallback/protected': {
            target: 'http://method-fallback-protected.com',
            credentials: 'require',
            allowedMethods: ['GET'],
          },
          '/method-fallback': {
            target: 'http://method-fallback-public.com',
            credentials: 'dangerously-allow-unauthenticated',
          },
        },
      },
    };

    const backend = await startTestBackend({
      features: [
        import('..'),
        mockServices.rootConfig.factory({ data: config }),
        authServiceFactory,
        httpAuthServiceFactory,
      ],
    });

    try {
      const baseUrl = `http://localhost:${backend.server.port()}`;
      const childFirstProtected = jest.fn(req =>
        HttpResponse.json({
          target: 'child-first-protected',
          upstreamAuthorization:
            req.request.headers.get('authorization') ?? false,
        }),
      );
      const parentFirstProtected = jest.fn(() =>
        HttpResponse.json({ target: 'parent-first-protected' }),
      );

      worker.use(
        http.all(`${baseUrl}/*`, passthrough),
        http.get('http://child-first-protected.com/*', childFirstProtected),
        http.get('http://child-first-public.com/*', () =>
          HttpResponse.json({ target: 'child-first-public' }),
        ),
        http.get('http://parent-first-public.com/*', () =>
          HttpResponse.json({ target: 'parent-first-public' }),
        ),
        http.get('http://parent-first-protected.com/*', parentFirstProtected),
        http.get('http://parameterized-protected.com/*', req =>
          HttpResponse.json({
            target: 'parameterized-protected',
            forwardedAuthorization:
              req.request.headers.get('authorization') ?? false,
          }),
        ),
        http.get('http://parameterized-public.com/*', () =>
          HttpResponse.json({ target: 'parameterized-public' }),
        ),
        http.get('http://method-fallback-protected.com/*', () =>
          HttpResponse.json({ target: 'method-fallback-protected' }),
        ),
        http.post('http://method-fallback-public.com/*', () =>
          HttpResponse.json({ target: 'method-fallback-public' }),
        ),
      );

      const call = async (path: string, authorization?: string) => {
        const response = await fetch(`${baseUrl}/api/proxy${path}`, {
          headers: authorization ? { Authorization: authorization } : {},
        });
        const body = await response.json();
        return { status: response.status, body };
      };

      await expect(call('/child-first/protected')).resolves.toMatchObject({
        status: 401,
        body: {
          error: {
            message: 'Missing credentials',
            name: 'AuthenticationError',
          },
        },
      });
      expect(childFirstProtected).not.toHaveBeenCalled();
      await expect(
        call('/child-first/protected', 'Bearer not-valid'),
      ).resolves.toMatchObject({
        status: 401,
        body: {
          error: {
            message: 'Illegal token',
            name: 'AuthenticationError',
          },
        },
      });
      expect(childFirstProtected).not.toHaveBeenCalled();
      await expect(
        call('/child-first/protected', 'Bearer static-token'),
      ).resolves.toMatchObject({
        status: 200,
        body: {
          target: 'child-first-protected',
          upstreamAuthorization: 'Bearer upstream-static-token',
        },
      });
      expect(childFirstProtected).toHaveBeenCalledTimes(1);

      await expect(call('/parent-first/protected')).resolves.toMatchObject({
        status: 200,
        body: { target: 'parent-first-public' },
      });
      expect(parentFirstProtected).not.toHaveBeenCalled();

      await expect(call('/parameterized/bar/baz')).resolves.toMatchObject({
        status: 401,
        body: {
          error: {
            message: 'Missing credentials',
            name: 'AuthenticationError',
          },
        },
      });
      await expect(
        call('/parameterized/bar/baz', 'Bearer static-token'),
      ).resolves.toMatchObject({
        status: 200,
        body: {
          target: 'parameterized-protected',
          forwardedAuthorization: 'Bearer static-token',
        },
      });

      await expect(call('/method-fallback/protected')).resolves.toMatchObject({
        status: 401,
      });
      const fallbackResponse = await fetch(
        `${baseUrl}/api/proxy/method-fallback/protected`,
        { method: 'POST' },
      );
      expect(fallbackResponse.status).toBe(200);
      await expect(fallbackResponse.json()).resolves.toEqual({
        target: 'method-fallback-public',
      });
    } finally {
      await backend.stop();
    }
  }, 20_000);

  it('respects the disabled default auth policy', async () => {
    const backend = await startTestBackend({
      features: [
        import('..'),
        mockServices.rootConfig.factory({
          data: {
            backend: {
              auth: {
                dangerouslyDisableDefaultAuthPolicy: true,
              },
            },
            proxy: {
              endpoints: {
                '/test': {
                  target: 'http://target.com',
                  credentials: 'require',
                },
              },
            },
          },
        }),
        authServiceFactory,
        httpAuthServiceFactory,
      ],
    });

    try {
      const baseUrl = `http://localhost:${backend.server.port()}`;
      worker.use(
        http.all(`${baseUrl}/*`, passthrough),
        http.get('http://target.com/*', () =>
          HttpResponse.json({ target: 'test' }),
        ),
      );

      const response = await fetch(`${baseUrl}/api/proxy/test`);
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ target: 'test' });
    } finally {
      await backend.stop();
    }
  }, 20_000);
});

describe('request path handling', () => {
  it.each(['/api/proxy/test/../../other', '/api/proxy/test/%2e%2e/other'])(
    'returns 400 for %s',
    async requestPath => {
      const backend = await startTestBackend({
        features: [
          import('..'),
          mockServices.rootConfig.factory({
            data: {
              proxy: {
                endpoints: {
                  '/test': {
                    target: 'http://target.com',
                    credentials: 'dangerously-allow-unauthenticated',
                  },
                },
              },
            },
          }),
        ],
      });

      try {
        const port = backend.server.port();
        const status = await new Promise<number>((resolve, reject) => {
          nodeHttp
            .get({ hostname: 'localhost', port, path: requestPath }, res => {
              res.resume();
              resolve(res.statusCode!);
            })
            .on('error', reject);
        });
        expect(status).toBe(400);
      } finally {
        await backend.stop();
      }
    },
  );
});
