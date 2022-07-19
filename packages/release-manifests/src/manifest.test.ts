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

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { getManifestByReleaseLine, getManifestByVersion } from './manifest';

describe('Release Manifests', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('getManifestByVersion', () => {
    it('should return a list of packages in a release', async () => {
      worker.use(
        rest.get('*/v1/releases/0.0.0/manifest.json', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              packages: [{ name: '@backstage/core', version: '1.2.3' }],
            }),
          ),
        ),
        rest.get('*/v1/releases/999.0.1/manifest.json', (_, res, ctx) =>
          res(ctx.status(404), ctx.json({})),
        ),
      );

      const pkgs = await getManifestByVersion({ version: '0.0.0' });
      expect(pkgs.packages).toEqual([
        {
          name: '@backstage/core',
          version: '1.2.3',
        },
      ]);

      await expect(
        getManifestByVersion({ version: '999.0.1' }),
      ).rejects.toThrow('No release found for 999.0.1 version');
    });
  });

  describe('getManifestByReleaseLine', () => {
    it('should return a list of packages in a release', async () => {
      worker.use(
        rest.get(
          'https://versions.backstage.io/v1/tags/main/manifest.json',
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                packages: [{ name: '@backstage/core', version: '1.2.3' }],
              }),
            ),
        ),
        rest.get(
          'https://versions.backstage.io/v1/tags/foo/manifest.json',
          (_, res, ctx) => res(ctx.status(404), ctx.json({})),
        ),
      );

      const pkgs = await getManifestByReleaseLine({ releaseLine: 'main' });
      expect(pkgs.packages).toEqual([
        {
          name: '@backstage/core',
          version: '1.2.3',
        },
      ]);

      await expect(
        getManifestByReleaseLine({ releaseLine: 'foo' }),
      ).rejects.toThrow("No 'foo' release line found");
    });
  });
});
