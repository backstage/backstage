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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { GerritIntegration } from '@backstage/integration';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { GerritUrlReader } from './GerritUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';

describe('GerritUrlReader authentication', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  it.each([
    ['https://gerrit.com:443', '/gitiles'],
    ['https://GERRIT.COM', '/gitiles'],
    ['http://gerrit.com:80', '/gitiles'],
    ['https://gerrit.com:443', '/gitiles/'],
  ])(
    'authenticates wildcard searches with provider URL %s%s',
    async (origin, gitilesPath) => {
      const integration = new GerritIntegration({
        host: 'gerrit.com',
        baseUrl: origin,
        gitilesBaseUrl: `${origin}${gitilesPath}`,
        username: 'user',
        password: 'password',
      });
      const reader = new GerritUrlReader(integration, {
        treeResponseFactory: DefaultReadTreeResponseFactory.create({
          config: new ConfigReader({}),
        }),
      });
      const revision = '157f862803d45b9d269f0e390f88aece1ded51e8';
      const requests: URL[] = [];
      worker.use(
        http.get('*', ({ request }) => {
          const url = new URL(request.url);
          requests.push(url);
          expect(request.headers.get('Authorization')).toBe(
            `Basic ${Buffer.from('user:password').toString('base64')}`,
          );
          switch (url.pathname) {
            case '/a/projects/docs-service/branches/main':
              return new HttpResponse(`)]}'\n${JSON.stringify({ revision })}`);
            case '/a/gitiles/docs-service/+/refs/heads/main/':
              return new HttpResponse(
                `)]}'\n${JSON.stringify({
                  entries: [{ type: 'blob', name: 'docs/guide.md' }],
                })}`,
              );
            case '/a/projects/docs-service/branches/main/files/docs%2Fguide.md/content':
              return new HttpResponse(Buffer.from('guide').toString('base64'));
            default:
              return new HttpResponse(null, { status: 401 });
          }
        }),
      );

      const result = await reader.search(
        `${origin}/gitiles/docs-service/+/refs/heads/main/docs/*.md`,
      );
      expect(result.etag).toBe(revision);
      expect(result.files.map(file => file.url)).toEqual([
        new URL(
          `${origin}/gitiles/docs-service/+/refs/heads/main/docs/guide.md`,
        ).href,
      ]);
      expect((await result.files[0].content()).toString()).toBe('guide');
      expect(requests.map(request => request.pathname)).toEqual([
        '/a/projects/docs-service/branches/main',
        '/a/gitiles/docs-service/+/refs/heads/main/',
        '/a/projects/docs-service/branches/main/files/docs%2Fguide.md/content',
      ]);
      expect(requests[1].searchParams.get('format')).toBe('JSON');
      expect(requests[1].searchParams.has('recursive')).toBe(true);
    },
  );
});
