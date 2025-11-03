/*
 * Copyright 2025 The Backstage Authors
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

import http from 'http';
import {
  injectLivereloadParameters,
  proxyHtmlWithLivereloadInjection,
  proxyMkdocsLivereload,
} from './livereload';

// Note: This mock returns a singleton proxy object so tests can access the
// registered event handlers (e.g. `proxyRes`) from code under test.
jest.mock('http-proxy', () => {
  const handlers: Record<string, Function> = {};
  const fakeProxy = {
    on: jest.fn((event: string, cb: Function) => {
      handlers[event] = cb;
    }),
    web: jest.fn((_req: unknown, _res: unknown) => {
      // no-op; tests will manually trigger handlers['proxyRes'] when needed
    }),
    __handlers: handlers,
  };
  const create = jest.fn(() => fakeProxy);
  return {
    __esModule: true,
    default: { createProxyServer: create },
    createProxyServer: create,
  };
});

describe('livereload helpers', () => {
  describe('injectLivereloadParameters', () => {
    it('injects live-reload element when mkdocs script is present', () => {
      const html =
        '<html><body><script>livereload(123, 456);</script></body></html>';
      const result = injectLivereloadParameters(html);
      expect(result).toContain('<live-reload');
      expect(result).toContain('live-reload-epoch="123"');
      expect(result).toContain('live-reload-request-id="456"');
      expect(result).toContain('</body>');
    });

    it('returns original html when mkdocs script is absent', () => {
      const html = '<html><body><h1>No livereload</h1></body></html>';
      const result = injectLivereloadParameters(html);
      expect(result).toBe(html);
    });
  });

  describe('proxyHtmlWithLivereloadInjection', () => {
    it('injects parameters into HTML responses and sets CORS headers', () => {
      const { createProxyServer } = jest.requireMock('http-proxy') as any;
      const proxy = createProxyServer();

      const req = {
        url: '/api/techdocs/some/path/index.html',
      } as unknown as http.IncomingMessage;
      const headers: Record<string, string> = {};
      const res = {
        setHeader: (k: string, v: any) => {
          headers[k] = String(v);
        },
        end: jest.fn(),
      } as unknown as http.ServerResponse;

      proxyHtmlWithLivereloadInjection({
        request: req,
        response: res,
        mkdocsTargetAddress: 'http://localhost:8000',
        proxyEndpoint: '/api/techdocs/',
        onError: () => {},
      });

      // Simulate mkdocs proxy response with HTML
      const proxyRes: any = {
        headers: { 'content-type': 'text/html; charset=utf-8' },
        on: (event: string, cb: Function) => {
          if (event === 'data') {
            cb('<html><body><script>livereload(1, 2);</script></body></html>');
          }
          if (event === 'end') {
            cb();
          }
        },
        pipe: jest.fn(),
      };

      (proxy as any).__handlers.proxyRes(proxyRes, {} as any, res);

      expect(res.end).toHaveBeenCalled();
      const injectedHtml = (res.end as jest.Mock).mock.calls[0][0] as string;
      expect(injectedHtml).toContain('<live-reload');
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('GET, OPTIONS');
      // Ensure proxyEndpoint was stripped from request url
      expect(req.url).toBe('some/path/index.html');
    });

    it('passes through non-HTML responses without injection', () => {
      const { createProxyServer } = jest.requireMock('http-proxy') as any;
      const proxy = createProxyServer();

      const req = {
        url: '/api/techdocs/some/path/asset.css',
      } as unknown as http.IncomingMessage;
      const headers: Record<string, string> = {};
      const res = {
        setHeader: (k: string, v: any) => {
          headers[k] = String(v);
        },
        end: jest.fn(),
      } as unknown as http.ServerResponse;

      proxyHtmlWithLivereloadInjection({
        request: req,
        response: res,
        mkdocsTargetAddress: 'http://localhost:8000',
        proxyEndpoint: '/api/techdocs/',
        onError: () => {},
      });

      const proxyRes: any = {
        headers: { 'content-type': 'text/css' },
        on: jest.fn(),
        pipe: jest.fn(),
      };

      (proxy as any).__handlers.proxyRes(proxyRes, {} as any, res);

      expect(res.end).not.toHaveBeenCalled();
      expect(proxyRes.pipe).toHaveBeenCalledWith(res);
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('GET, OPTIONS');
    });
  });

  describe('proxyMkdocsLivereload', () => {
    it('rewrites path and sets CORS headers', () => {
      const { createProxyServer } = jest.requireMock('http-proxy') as any;
      const proxy = createProxyServer();

      const req = {
        url: '/.livereload/1/2',
      } as unknown as http.IncomingMessage;
      const headers: Record<string, string> = {};
      const res = {
        setHeader: (k: string, v: any) => {
          headers[k] = String(v);
        },
      } as unknown as http.ServerResponse;

      proxyMkdocsLivereload({
        request: req,
        response: res,
        mkdocsTargetAddress: 'http://localhost:8000',
        onError: () => {},
      });

      expect(req.url).toBe('/livereload/1/2');
      expect(headers['Access-Control-Allow-Origin']).toBe('*');
      expect(headers['Access-Control-Allow-Methods']).toBe('GET, OPTIONS');
      expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type');
      expect((proxy as any).web).toHaveBeenCalled();
    });
  });
});
