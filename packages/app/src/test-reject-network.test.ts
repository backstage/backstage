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

import { registerMswTestHooks } from '@backstage/test-utils';
import { http as mswHttp, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import axios from 'axios';
// eslint-disable-next-line no-restricted-imports
import http from 'http';
// eslint-disable-next-line no-restricted-imports
import https from 'https';

const errorMsg = 'Network requests are not allowed in tests';

// These test relates to the @backstage/cli Jest configuration. It makes sure
// that network requests are properly rejected in JSDom environments.

describe('without msw', () => {
  it('should reject network requests', async () => {
    await expect(fetch('https://example.com')).rejects.toThrow(errorMsg);
    await expect(axios('https://example.com')).rejects.toThrow(errorMsg);
    expect(() => http.get('http://example.com')).toThrow(errorMsg);
    expect(() => https.get('https://example.com')).toThrow(errorMsg);
    await expect(
      new Promise(resolve => {
        const ws = new WebSocket('ws://example.com');
        ws.addEventListener('error', () => resolve('error'));
      }),
    ).resolves.toBe('error');
    expect(typeof EventSource).toBe('undefined');
    expect(() => new XMLHttpRequest()).toThrow(errorMsg);
  });
});

// This makes sure that MSW mocks still work as expected

describe('with msw', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  // Save and restore original agents for MSW interception
  let origHttpAgent: typeof http.globalAgent;
  let origHttpsAgent: typeof https.globalAgent;

  beforeAll(() => {
    origHttpAgent = http.globalAgent;
    origHttpsAgent = https.globalAgent;
    // Reset to default agents so MSW can intercept
    http.globalAgent = new http.Agent();
    https.globalAgent = new https.Agent();
    // Clear axios's cached agent references
    delete (axios.defaults as any).httpAgent;
    delete (axios.defaults as any).httpsAgent;
    // Force axios to use http/fetch adapters instead of xhr in jsdom
    // Default is ['xhr', 'http', 'fetch'] - we skip xhr since MSW v2 doesn't intercept it in Node.js mode
    axios.defaults.adapter = ['http', 'fetch'];
  });

  afterAll(() => {
    http.globalAgent = origHttpAgent;
    https.globalAgent = origHttpsAgent;
  });

  it('should mock network requests', async () => {
    server.use(
      mswHttp.get('http://example.com', () => HttpResponse.json({ ok: true })),
      mswHttp.get('https://example.com', () => HttpResponse.json({ ok: true })),
    );

    await expect(
      fetch('https://example.com').then(res => res.json()),
    ).resolves.toEqual({ ok: true });

    await expect(
      axios('https://example.com').then(res => res.data),
    ).resolves.toEqual({ ok: true });

    await expect(
      new Promise(resolve => {
        const req = http.get('http://example.com');
        req.on('response', res => {
          res.on('data', data => {
            resolve(JSON.parse(data.toString()));
          });
        });
      }),
    ).resolves.toEqual({
      ok: true,
    });

    await expect(
      new Promise(resolve => {
        const req = https.get('https://example.com');
        req.on('response', res => {
          res.on('data', data => {
            resolve(JSON.parse(data.toString()));
          });
        });
      }),
    ).resolves.toEqual({
      ok: true,
    });

    // Note: XMLHttpRequest mocking is not supported with MSW v2 in Node.js/jsdom.
    // MSW v2 intercepts Node's http/https modules, but jsdom's XHR bypasses them.
    // If you need XMLHttpRequest mocking via MSW, consider migrating to fetch instead.
  });
});
