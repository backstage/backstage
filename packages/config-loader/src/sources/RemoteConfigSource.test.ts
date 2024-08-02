/*
 * Copyright 2023 The Backstage Authors
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

import { rest } from 'msw';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { setupServer } from 'msw/node';
import { RemoteConfigSource } from './RemoteConfigSource';
import { readN } from './__testUtils__/testUtils';

describe('RemoteConfigSource', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  it('should load config from a remote URL', async () => {
    worker.use(
      rest.get('http://localhost/config.yaml', (_req, res, ctx) =>
        res(
          ctx.body(`
app:
  title: Example App
  substituted: \${VALUE}
  escaped: \$\${VALUE}
`),
        ),
      ),
    );

    const source = RemoteConfigSource.create({
      url: 'http://localhost/config.yaml',
      substitutionFunc: async () => 'x',
    });

    await expect(readN(source, 1)).resolves.toEqual([
      [
        {
          context: 'http://localhost/config.yaml',
          data: {
            app: {
              title: 'Example App',
              substituted: 'x',
              escaped: '${VALUE}',
            },
          },
        },
      ],
    ]);
  });

  it('should load and parse config from a remote URL', async () => {
    worker.use(
      rest.get('http://localhost/config.json', (_req, res, ctx) =>
        res(
          ctx.body(
            JSON.stringify({
              app: {
                title: 'Example App',
                substituted: 'x',
                escaped: '$${VALUE}',
              },
            }),
          ),
        ),
      ),
    );

    const source = RemoteConfigSource.create({
      url: 'http://localhost/config.json',
      substitutionFunc: async () => 'x',
      parser: async ({ contents }) => ({ result: JSON.parse(contents) }),
    });

    await expect(readN(source, 1)).resolves.toEqual([
      [
        {
          context: 'http://localhost/config.json',
          data: {
            app: {
              title: 'Example App',
              substituted: 'x',
              escaped: '${VALUE}',
            },
          },
        },
      ],
    ]);
  });

  it('should reload config from a remote URL', async () => {
    let fetched = false;

    worker.use(
      rest.get('http://localhost/config.yaml', (_req, res, ctx) => {
        if (!fetched) {
          fetched = true;
          return res(ctx.body('x: 1'));
        }
        return res(ctx.body('x: 2'));
      }),
    );

    const source = RemoteConfigSource.create({
      url: 'http://localhost/config.yaml',
      reloadInterval: { seconds: 0 },
    });

    await expect(readN(source, 2)).resolves.toEqual([
      [{ context: 'http://localhost/config.yaml', data: { x: 1 } }],
      [{ context: 'http://localhost/config.yaml', data: { x: 2 } }],
    ]);
  });
});
