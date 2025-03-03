/*
 * Copyright 2020 The Backstage Authors
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
import { Request, Response } from 'express';
import * as http from 'http';
import {
  createProxyMiddleware,
  fixRequestBody,
  Options,
} from 'http-proxy-middleware';
import { buildMiddleware, createRouter } from './router';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => () => undefined),
  fixRequestBody: jest.fn(),
}));

const mockCreateProxyMiddleware = createProxyMiddleware as jest.MockedFunction<
  typeof createProxyMiddleware
>;

describe('createRouter', () => {
  const deps = {
    logger: mockServices.logger.mock(),
    discovery: mockServices.discovery(),
    httpRouterService: mockServices.httpRouter.mock(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('where all proxy config are valid', () => {
    const config = mockServices.rootConfig({
      data: {
        backend: {
          baseUrl: 'https://example.com:7007',
          listen: {
            port: 7007,
          },
        },
        proxy: {
          endpoints: {
            '/test': {
              target: 'https://example.com',
              headers: {
                Authorization: 'Bearer supersecret',
              },
            },
          },
        },
      },
    });

    beforeEach(() => {
      mockCreateProxyMiddleware.mockClear();
    });

    it('works', async () => {
      const router = await createRouter({
        ...deps,
        config,
      });
      expect(router).toBeDefined();
    });

    it('supports deprecated proxy configuration', async () => {
      const router = await createRouter({
        ...deps,
        config: mockServices.rootConfig({
          data: {
            proxy: {
              endpoints: {
                '/test': {
                  target: 'https://example.com',
                  headers: {
                    Authorization: 'Bearer supersecret',
                  },
                },
              },
            },
          },
        }),
      });
      expect(router).toBeDefined();
      expect(mockCreateProxyMiddleware).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          target: 'https://example.com',
        }),
      );
    });

    it('revives request bodies when set', async () => {
      const router = await createRouter({
        ...deps,
        config: mockServices.rootConfig({
          data: {
            proxy: {
              endpoints: {
                '/test': {
                  target: 'https://example.com',
                  headers: {
                    Authorization: 'Bearer supersecret',
                  },
                },
              },
              reviveConsumedRequestBodies: true,
            },
          },
        }),
      });
      expect(router).toBeDefined();

      expect(
        mockCreateProxyMiddleware.mock.calls[0][1]?.onProxyReq,
      ).toBeDefined();
      expect(mockCreateProxyMiddleware.mock.calls[0][1]?.onProxyReq).toEqual(
        fixRequestBody,
      );
    });

    it('does not revive request bodies when not set', async () => {
      const router = await createRouter({
        config,
        ...deps,
      });
      expect(router).toBeDefined();

      expect(
        mockCreateProxyMiddleware.mock.calls[0][1]?.onProxyReq,
      ).not.toBeDefined();
    });
  });

  describe('where buildMiddleware would fail', () => {
    it('throws an error if skip failures is not set', async () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            baseUrl: 'https://example.com:7007',
            listen: {
              port: 7007,
            },
          },
          // no target would cause the buildMiddleware to fail
          proxy: {
            endpoints: {
              '/test': {
                headers: {
                  Authorization: 'Bearer supersecret',
                },
              },
            },
          },
        },
      });
      await expect(
        createRouter({
          ...deps,
          config,
        }),
      ).rejects.toThrow(
        new Error(
          'Proxy target for route "/test" must be a string, but is of type undefined',
        ),
      );
    });

    it('works if skip failures is set', async () => {
      const config = mockServices.rootConfig({
        data: {
          backend: {
            baseUrl: 'https://example.com:7007',
            listen: {
              port: 7007,
            },
          },
          // no target would cause the buildMiddleware to fail
          proxy: {
            endpoints: {
              '/test': {
                headers: {
                  Authorization: 'Bearer supersecret',
                },
              },
            },
            skipInvalidProxies: true,
          },
        },
      });
      const router = await createRouter({
        ...deps,
        config,
      });
      expect(deps.logger.warn.mock.calls[0][0]).toEqual(
        'skipped configuring /test due to Proxy target for route "/test" must be a string, but is of type undefined',
      );
      expect(router).toBeDefined();
    });
  });
});

describe('buildMiddleware', () => {
  const logger = mockServices.logger.mock();
  const httpRouterService = mockServices.httpRouter.mock();

  beforeEach(() => {
    mockCreateProxyMiddleware.mockClear();
  });

  it('accepts strings prefixed by /', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      'http://mocked',
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(true);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(true);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(true);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);

    expect(logger.info).not.toHaveBeenCalled();
    fullConfig.logProvider!({} as any).log('test');
    expect(logger.info).toHaveBeenCalledWith('test');
  });

  it('accepts routes not prefixed with / when path is not suffixed with /', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      'test',
      'http://mocked',
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(true);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(true);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(true);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
  });

  it('accepts routes prefixed with / when path is suffixed with /', async () => {
    buildMiddleware(
      '/proxy/',
      logger,
      '/test',
      'http://mocked',
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(true);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(true);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(true);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
  });

  it('limits allowedMethods', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
        allowedMethods: ['GET', 'DELETE'],
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(false);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(false);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(false);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
  });

  it('permits default headers', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
    ];

    const testHeaders = {
      'cache-control': 'mocked',
      'content-language': 'mocked',
      'content-length': 'mocked',
      'content-type': 'mocked',
      expires: 'mocked',
      'last-modified': 'mocked',
      pragma: 'mocked',
      host: 'mocked',
      accept: 'mocked',
      'accept-language': 'mocked',
      'user-agent': 'mocked',
      cookie: 'mocked',
    } as Partial<http.IncomingHttpHeaders>;
    const expectedHeaders = {
      ...testHeaders,
    } as Partial<http.IncomingHttpHeaders>;
    delete expectedHeaders.cookie;

    expect(testHeaders).toBeDefined();
    expect(expectedHeaders).toBeDefined();
    expect(testHeaders).not.toEqual(expectedHeaders);
    expect(filter).toBeDefined();

    filter!('', { method: 'GET', headers: testHeaders });

    expect(testHeaders).toEqual(expectedHeaders);
  });

  it('permits default and configured headers', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
        headers: {
          Authorization: 'my-token',
        },
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
    ];

    const testHeaders = {
      authorization: 'mocked',
      cookie: 'mocked',
    } as Partial<http.IncomingHttpHeaders>;
    const expectedHeaders = {
      ...testHeaders,
    } as Partial<http.IncomingHttpHeaders>;
    delete expectedHeaders.cookie;

    expect(testHeaders).toBeDefined();
    expect(expectedHeaders).toBeDefined();
    expect(testHeaders).not.toEqual(expectedHeaders);
    expect(filter).toBeDefined();

    filter!('', { method: 'GET', headers: testHeaders });

    expect(testHeaders).toEqual(expectedHeaders);
  });

  it('permits configured headers', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
        allowedHeaders: ['authorization', 'cookie'],
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
    ];

    const testHeaders = {
      authorization: 'mocked',
      cookie: 'mocked',
      'x-auth-request-user': 'mocked',
    } as Partial<http.IncomingHttpHeaders>;
    const expectedHeaders = {
      ...testHeaders,
    } as Partial<http.IncomingHttpHeaders>;
    delete expectedHeaders['x-auth-request-user'];

    expect(testHeaders).toBeDefined();
    expect(expectedHeaders).toBeDefined();
    expect(testHeaders).not.toEqual(expectedHeaders);
    expect(filter).toBeDefined();

    filter!('', { method: 'GET', headers: testHeaders });

    expect(testHeaders).toEqual(expectedHeaders);
  });

  it('responds default headers', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const config = mockCreateProxyMiddleware.mock.calls[0][1] as Options;

    const testClientResponse = {
      headers: {
        'cache-control': 'value',
        'content-language': 'value',
        'content-length': 'value',
        'content-type': 'value',
        expires: 'value',
        'last-modified': 'value',
        pragma: 'value',
        'set-cookie': ['value'],
      },
    } as Partial<http.IncomingMessage>;

    expect(config).toBeDefined();
    expect(config.onProxyRes).toBeDefined();

    config.onProxyRes!(
      testClientResponse as http.IncomingMessage,
      {} as Request,
      {} as Response,
    );

    expect(Object.keys(testClientResponse.headers!)).toEqual([
      'cache-control',
      'content-language',
      'content-length',
      'content-type',
      'expires',
      'last-modified',
      'pragma',
    ]);
  });

  it('responds configured headers', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
        allowedHeaders: ['set-cookie'],
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const config = mockCreateProxyMiddleware.mock.calls[0][1] as Options;

    const testClientResponse = {
      headers: {
        'set-cookie': [],
        'x-auth-request-user': 'asd',
      },
    } as Partial<http.IncomingMessage>;

    expect(config).toBeDefined();
    expect(config.onProxyRes).toBeDefined();

    config.onProxyRes!(
      testClientResponse as http.IncomingMessage,
      {} as Request,
      {} as Response,
    );

    expect(Object.keys(testClientResponse.headers!)).toEqual(['set-cookie']);
  });

  it('revives request body when configured', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
      },
      httpRouterService,
      true,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const config = mockCreateProxyMiddleware.mock.calls[0][1] as Options;

    expect(config).toBeDefined();
    expect(config.onProxyReq).toBeDefined();

    config.onProxyReq!(
      {} as http.ClientRequest,
      {} as Request,
      {} as Response,
      {},
    );
    expect(fixRequestBody).toHaveBeenCalledTimes(1);
  });

  it('does not revive request body when not configured', async () => {
    buildMiddleware(
      '/proxy',
      logger,
      '/test',
      {
        target: 'http://mocked',
      },
      httpRouterService,
    );

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const config = mockCreateProxyMiddleware.mock.calls[0][1] as Options;

    expect(config).toBeDefined();
    expect(config.onProxyReq).not.toBeDefined();
  });

  it('rejects malformed target URLs', async () => {
    expect(() =>
      buildMiddleware(
        '/proxy',
        logger,
        '/test',
        'backstage.io',
        httpRouterService,
      ),
    ).toThrow(/Proxy target is not a valid URL/);
    expect(() =>
      buildMiddleware(
        '/proxy',
        logger,
        '/test',
        { target: 'backstage.io' },
        httpRouterService,
      ),
    ).toThrow(/Proxy target is not a valid URL/);
  });
});
