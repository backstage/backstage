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
import { rest } from 'msw';
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

  it('should mock network requests', async () => {
    server.use(
      rest.get('http://example.com', (_, res, ctx) =>
        res(ctx.json({ ok: true })),
      ),
      rest.get('https://example.com', (_, res, ctx) =>
        res(ctx.json({ ok: true })),
      ),
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

    await expect(
      new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://example.com');
        xhr.onload = () => {
          resolve(JSON.parse(xhr.responseText));
        };
        xhr.send();
      }),
    ).resolves.toEqual({ ok: true });
  });
});
