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
import { registerMswTestHooks } from '@backstage/test-utils';
import {
  getManifestByReleaseLine,
  getManifestByVersion,
  withFallback,
} from './manifest';

describe('Release Manifests', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

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

    it('should allow overriding the fetch implementation', async () => {
      const mockFetch = jest.fn().mockImplementation(async url => ({
        status: 200,
        url,
        json: () => ({
          packages: [{ name: '@backstage/core', version: '2.3.4' }],
        }),
      }));

      const pkgs = await getManifestByVersion({
        version: '0.0.0',
        fetch: mockFetch,
      });

      expect(pkgs.packages).toEqual([
        {
          name: '@backstage/core',
          version: '2.3.4',
        },
      ]);

      mockFetch.mockImplementation(async url => ({
        status: 404,
        url,
      }));

      await expect(
        getManifestByVersion({ version: '0.0.0', fetch: mockFetch }),
      ).rejects.toThrow('No release found for 0.0.0 version');
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

describe('withFallback', () => {
  it('should use the first value to resolve', async () => {
    const fn1 = jest.fn((_s: AbortSignal) => Promise.resolve(1));
    const fn2 = jest.fn((_s: AbortSignal) => Promise.resolve(2));
    await expect(withFallback(fn1, fn2, 100)).resolves.toBe(1);
    expect(fn1.mock.lastCall?.[0].aborted).toBe(false);
    expect(fn2).not.toHaveBeenCalled();
  });

  it('should fall back on rejection', async () => {
    const fn1 = jest.fn((_s: AbortSignal) => Promise.reject(new Error('1')));
    const fn2 = jest.fn((_s: AbortSignal) => Promise.resolve(2));
    await expect(withFallback(fn1, fn2, 0)).resolves.toBe(2);
    expect(fn1.mock.lastCall?.[0].aborted).toBe(true);
    expect(fn2.mock.lastCall?.[0].aborted).toBe(false);
  });

  it('should fall back on timeout', async () => {
    const fn1 = jest.fn((_s: AbortSignal) => new Promise<number>(() => {}));
    const fn2 = jest.fn((_s: AbortSignal) => Promise.resolve(2));
    await expect(withFallback(fn1, fn2, 0)).resolves.toBe(2);
    expect(fn1.mock.lastCall?.[0].aborted).toBe(true);
    expect(fn2.mock.lastCall?.[0].aborted).toBe(false);
  });

  it('should always reject with the first error', async () => {
    const fn1 = jest.fn((_s: AbortSignal) => Promise.reject(new Error('1')));
    const fn2 = jest.fn((_s: AbortSignal) => Promise.reject(new Error('2')));
    await expect(withFallback(fn1, fn2, 0)).rejects.toThrow('1');
    expect(fn1.mock.lastCall?.[0].aborted).toBe(false);
    expect(fn2.mock.lastCall?.[0].aborted).toBe(false);
  });

  it('should always reject with the first error even if rejected after', async () => {
    const fn1 = jest.fn(
      (_s: AbortSignal) =>
        new Promise<number>((_resolve, reject) => {
          setTimeout(() => reject(new Error('1')), 100);
        }),
    );
    const fn2 = jest.fn((_s: AbortSignal) => Promise.reject(new Error('2')));
    await expect(withFallback(fn1, fn2, 0)).rejects.toThrow('1');
    expect(fn1.mock.lastCall?.[0].aborted).toBe(false);
    expect(fn2.mock.lastCall?.[0].aborted).toBe(false);
  });
});
