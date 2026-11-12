/*
 * Copyright 2026 The Backstage Authors
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

import http from 'node:http';
import HTTPServer from './httpServer';
import { getEngineConfig } from './engines';

describe('HTTPServer', () => {
  it('keeps source preview loopback-only and preserves its CORS policy while legacy HTML uses the engine transform', async () => {
    const upstream = http.createServer((_req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.end('<body>docs</body>');
    });
    await new Promise<void>(resolve =>
      upstream.listen(0, '127.0.0.1', resolve),
    );
    const upstreamAddress = upstream.address();
    if (!upstreamAddress || typeof upstreamAddress === 'string')
      throw new Error('No upstream address');
    const engineConfig = {
      ...getEngineConfig('mkdocs'),
      transformHtml: (html: string) => `${html} transformed`,
    };
    const servers: http.Server[] = [upstream];
    try {
      const source = await new HTTPServer(
        '.',
        0,
        `http://127.0.0.1:${upstreamAddress.port}`,
        false,
        engineConfig,
        true,
      ).serve();
      servers.push(source);
      const sourceAddress = source.address();
      if (!sourceAddress || typeof sourceAddress === 'string')
        throw new Error('No source address');
      expect(sourceAddress.address).toBe('127.0.0.1');
      const sourceUrl = `http://127.0.0.1:${sourceAddress.port}/api/techdocs/index.html`;
      const allowed = await fetch(sourceUrl, {
        headers: { origin: 'http://localhost:3000' },
      });
      expect(allowed.headers.get('access-control-allow-origin')).toBe(
        'http://localhost:3000',
      );
      expect(allowed.headers.get('access-control-allow-credentials')).toBe(
        'true',
      );
      expect(await allowed.text()).toBe('<body>docs</body>');
      const denied = await fetch(sourceUrl, {
        headers: { origin: 'https://example.com' },
      });
      expect(denied.headers.get('access-control-allow-origin')).toBeNull();
      const preflight = await fetch(sourceUrl, {
        method: 'OPTIONS',
        headers: { origin: 'http://localhost:3000' },
      });
      expect(preflight.status).toBe(204);
      expect(preflight.headers.get('access-control-allow-origin')).toBe(
        'http://localhost:3000',
      );

      const legacy = await new HTTPServer(
        '.',
        0,
        `http://127.0.0.1:${upstreamAddress.port}`,
        false,
        engineConfig,
      ).serve();
      servers.push(legacy);
      const legacyAddress = legacy.address();
      if (!legacyAddress || typeof legacyAddress === 'string')
        throw new Error('No legacy address');
      const response = await fetch(
        `http://127.0.0.1:${legacyAddress.port}/api/techdocs/index.html`,
      );
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      expect(await response.text()).toBe('<body>docs</body> transformed');
    } finally {
      await Promise.all(
        servers.map(
          server =>
            new Promise<void>((resolve, reject) =>
              server.close(error => (error ? reject(error) : resolve())),
            ),
        ),
      );
    }
  });
});
