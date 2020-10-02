/*
 * Copyright 2020 Spotify AB
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

import { getVoidLogger } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  GithubOrgReaderProcessor,
  parseUrl,
  readConfig,
} from './GithubOrgReaderProcessor';

describe('GithubOrgReaderProcessor', () => {
  describe('readConfig', () => {
    function config(
      providers: { target: string; apiBaseUrl?: string; token?: string }[],
    ) {
      return ConfigReader.fromConfigs([
        {
          context: '',
          data: {
            catalog: { processors: { githubOrg: { providers } } },
          },
        },
      ]);
    }

    it('adds a default GitHub entry when missing', () => {
      const output = readConfig(config([]));
      expect(output).toEqual([
        {
          target: 'https://github.com',
          apiBaseUrl: 'https://api.github.com',
        },
      ]);
    });

    it('injects the correct GitHub API base URL when missing', () => {
      const output = readConfig(config([{ target: 'https://github.com' }]));
      expect(output).toEqual([
        {
          target: 'https://github.com',
          apiBaseUrl: 'https://api.github.com',
        },
      ]);
    });

    it('rejects custom targets with no base URLs', () => {
      expect(() =>
        readConfig(config([{ target: 'https://ghe.company.com' }])),
      ).toThrow(
        'Provider at https://ghe.company.com must configure an explicit apiBaseUrl',
      );
    });

    it('rejects funky configs', () => {
      expect(() => readConfig(config([{ target: 7 } as any]))).toThrow(
        /target/,
      );
      expect(() => readConfig(config([{ noTarget: '7' } as any]))).toThrow(
        /target/,
      );
      expect(() =>
        readConfig(
          config([{ target: 'https://github.com', apiBaseUrl: 7 } as any]),
        ),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readConfig(config([{ target: 'https://github.com', token: 7 } as any])),
      ).toThrow(/token/);
    });
  });

  describe('parseUrl', () => {
    it('only supports clean org urls, and decodes them', () => {
      expect(() => parseUrl('https://github.com')).toThrow();
      expect(() => parseUrl('https://github.com/org/foo')).toThrow();
      expect(() => parseUrl('https://github.com/org/foo/teams')).toThrow();
      expect(parseUrl('https://github.com/foo%32')).toEqual({ org: 'foo2' });
    });
  });

  describe('implementation', () => {
    it('rejects unknown types', async () => {
      const processor = new GithubOrgReaderProcessor(
        [
          {
            target: 'https://github.com',
            apiBaseUrl: 'https://api.github.com',
          },
        ],
        getVoidLogger(),
      );
      const location: LocationSpec = {
        type: 'not-github-org',
        target: 'https://github.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = new GithubOrgReaderProcessor(
        [
          {
            target: 'https://github.com',
            apiBaseUrl: 'https://api.github.com',
          },
        ],
        getVoidLogger(),
      );
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://not.github.com/apa',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no GitHub Org provider that matches https:\/\/not.github.com\/apa/,
      );
    });
  });
});
