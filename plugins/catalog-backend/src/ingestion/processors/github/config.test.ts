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

import { ConfigReader } from '@backstage/config';
import { readGithubConfig } from './config';

describe('config', () => {
  describe('readGithubConfig', () => {
    function config(
      providers: { target: string; apiBaseUrl?: string; token?: string }[],
    ) {
      return new ConfigReader({
        catalog: { processors: { githubOrg: { providers } } },
      });
    }

    it('adds a default GitHub entry when missing', () => {
      const output = readGithubConfig(config([]));
      expect(output).toEqual([
        {
          target: 'https://github.com',
          apiBaseUrl: 'https://api.github.com',
        },
      ]);
    });

    it('injects the correct GitHub API base URL when missing', () => {
      const output = readGithubConfig(
        config([{ target: 'https://github.com' }]),
      );
      expect(output).toEqual([
        {
          target: 'https://github.com',
          apiBaseUrl: 'https://api.github.com',
        },
      ]);
    });

    it('rejects custom targets with no base URLs', () => {
      expect(() =>
        readGithubConfig(config([{ target: 'https://ghe.company.com' }])),
      ).toThrow(
        'Provider at https://ghe.company.com must configure an explicit apiBaseUrl',
      );
    });

    it('rejects funky configs', () => {
      expect(() => readGithubConfig(config([{ target: 7 } as any]))).toThrow(
        /target/,
      );
      expect(() =>
        readGithubConfig(config([{ noTarget: '7' } as any])),
      ).toThrow(/target/);
      expect(() =>
        readGithubConfig(
          config([{ target: 'https://github.com', apiBaseUrl: 7 } as any]),
        ),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readGithubConfig(
          config([{ target: 'https://github.com', token: 7 } as any]),
        ),
      ).toThrow(/token/);
    });
  });
});
