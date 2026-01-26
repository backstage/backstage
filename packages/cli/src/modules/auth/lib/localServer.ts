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
import { URL } from 'url';

export async function startCallbackServer(_options: {
  state: string;
}): Promise<{
  url: string;
  waitForCode: () => Promise<{ code: string; state?: string }>;
  close: () => Promise<void>;
}> {
  const server = http.createServer();
  let resolveResult:
    | ((v: { code: string; state?: string }) => void)
    | undefined;
  const resultPromise = new Promise<{ code: string; state?: string }>(
    resolve => {
      resolveResult = resolve;
    },
  );

  server.on('request', (req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }
    const u = new URL(req.url, 'http://127.0.0.1');
    if (u.pathname !== '/callback') {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    const code = u.searchParams.get('code') ?? undefined;
    const state = u.searchParams.get('state') ?? undefined;
    if (!code) {
      res.statusCode = 400;
      res.end('Missing code');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('You may now close this window.');
    resolveResult?.({ code, state });
  });

  const port = await new Promise<number>((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (typeof address === 'object' && address && 'port' in address) {
        resolve(address.port);
      } else {
        reject(new Error('Failed to bind local server'));
      }
    });
  });

  return {
    url: `http://127.0.0.1:${port}/callback`,
    waitForCode: () => resultPromise,
    close: async () =>
      new Promise<void>(resolve => server.close(() => resolve())),
  };
}
