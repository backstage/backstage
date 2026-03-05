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

import { SrvResolvers } from './SrvResolvers';

describe('SrvResolvers', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isSrvUrl', () => {
    it('distinguishes SRV URLs', () => {
      const resolvers = new SrvResolvers({
        resolveSrv: () => Promise.resolve([]),
      });

      expect(resolvers.isSrvUrl('http+srv://example.com')).toBe(true);
      expect(resolvers.isSrvUrl('http+srv://example.com/')).toBe(true);
      expect(resolvers.isSrvUrl('http+srv://example.com/a/{{pluginId}}')).toBe(
        true,
      );
      expect(resolvers.isSrvUrl('https+srv://example.com')).toBe(true);
      expect(resolvers.isSrvUrl('https+srv://example.com/')).toBe(true);
      expect(resolvers.isSrvUrl('https+srv://example.com/a/{{pluginId}}')).toBe(
        true,
      );

      expect(resolvers.isSrvUrl('ftp+srv://example.com/a/{{pluginId}}')).toBe(
        false,
      );
      expect(resolvers.isSrvUrl('https://example.com/a/{{pluginId}}')).toBe(
        false,
      );
      expect(resolvers.isSrvUrl('://')).toBe(false);
      expect(resolvers.isSrvUrl('broken')).toBe(false);
    });
  });

  describe('getResolver', () => {
    it('throws for invalid URLs', () => {
      const resolvers = new SrvResolvers({
        resolveSrv: () => Promise.resolve([]),
      });
      expect(() =>
        resolvers.getResolver('://'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV resolver expected a valid URL starting with http(s)+srv:// but got '://'"`,
      );
      expect(() =>
        resolvers.getResolver('https://example.com/a/{{pluginId}}'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV resolver expected a URL with protocol http(s)+srv:// but got 'https://example.com/a/{{pluginId}}'"`,
      );
      expect(() =>
        resolvers.getResolver('http+srv://example.com:8080'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV resolver URLs cannot contain a port but got 'http+srv://example.com:8080'"`,
      );
      expect(() =>
        resolvers.getResolver('http+srv://a:b@example.com'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV resolver URLs cannot contain username or password but got 'http+srv://a:b@example.com'"`,
      );
      expect(() =>
        resolvers.getResolver('http+srv://example.com?a=1'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV resolver URLs cannot contain search params or a hash but got 'http+srv://example.com?a=1'"`,
      );
      expect(() =>
        resolvers.getResolver('http+srv://example.com#a'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV resolver URLs cannot contain search params or a hash but got 'http+srv://example.com#a'"`,
      );
      expect(() =>
        resolvers.getResolver('ftp+srv://example.com/a/{{pluginId}}'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"SRV URLs must be based on http or https but got 'ftp+srv://example.com/a/{{pluginId}}'"`,
      );
    });

    it('works for simple cases', async () => {
      const resolveSrv = jest.fn(async (host: string) => {
        expect(host).toBe('input.example.com');
        return [
          {
            name: 'output.example.com',
            port: 8080,
            priority: 10,
            weight: 10,
          },
        ];
      });

      const resolvers = new SrvResolvers({ resolveSrv, cacheTtlMillis: 100 });

      await expect(
        resolvers.getResolver('http+srv://input.example.com')(),
      ).resolves.toEqual('http://output.example.com:8080');
      await expect(
        resolvers.getResolver('https+srv://input.example.com')(),
      ).resolves.toEqual('https://output.example.com:8080');
      await expect(
        resolvers.getResolver('http+srv://input.example.com/some/path')(),
      ).resolves.toEqual('http://output.example.com:8080/some/path');
    });

    it('only picks among the highest priority records', async () => {
      const resolveSrv = jest.fn(async (host: string) => {
        expect(host).toBe('input.example.com');
        return [
          {
            name: 'output1.example.com',
            port: 8081,
            priority: 10,
            weight: 10,
          },
          {
            name: 'output1.example.com',
            port: 8082,
            priority: 10,
            weight: 20,
          },
          {
            name: 'output2.example.com',
            port: 8083,
            priority: 20,
            weight: 10,
          },
        ];
      });

      const resolvers = new SrvResolvers({ resolveSrv });

      const resolver = resolvers.getResolver('http+srv://input.example.com');
      for (let i = 0; i < 1000; i++) {
        expect([
          'http://output1.example.com:8081',
          'http://output1.example.com:8082',
        ]).toContain(await resolver());
      }
    });

    it('uses caching', async () => {
      jest.useFakeTimers();

      const resolveSrv = jest.fn(async (host: string) => {
        expect(host).toBe('input.example.com');
        return [
          {
            name: 'output.example.com',
            port: 8080,
            priority: 10,
            weight: 10,
          },
        ];
      });

      const resolvers = new SrvResolvers({ resolveSrv, cacheTtlMillis: 100 });
      const resolver1 = resolvers.getResolver('http+srv://input.example.com/a');
      const resolver2 = resolvers.getResolver('http+srv://input.example.com/b');

      await expect(resolver1()).resolves.toEqual(
        'http://output.example.com:8080/a',
      );
      await expect(resolver1()).resolves.toEqual(
        'http://output.example.com:8080/a',
      );
      await expect(resolver2()).resolves.toEqual(
        'http://output.example.com:8080/b',
      );
      expect(resolveSrv).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(99);

      await expect(resolver1()).resolves.toEqual(
        'http://output.example.com:8080/a',
      );
      await expect(resolver1()).resolves.toEqual(
        'http://output.example.com:8080/a',
      );
      await expect(resolver2()).resolves.toEqual(
        'http://output.example.com:8080/b',
      );
      expect(resolveSrv).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1);

      await expect(resolver1()).resolves.toEqual(
        'http://output.example.com:8080/a',
      );
      await expect(resolver1()).resolves.toEqual(
        'http://output.example.com:8080/a',
      );
      await expect(resolver2()).resolves.toEqual(
        'http://output.example.com:8080/b',
      );
      expect(resolveSrv).toHaveBeenCalledTimes(2);
    });
  });
});
