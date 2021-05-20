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
import {
  GitHubIntegration,
  ScmIntegrations,
  ScmIntegrationsGroup,
} from '@backstage/integration';
import {
  GitHubOrgLocationSpec,
  GithubOrgReaderProcessor,
  parseUrl,
} from './GithubOrgReaderProcessor';

describe('GithubOrgReaderProcessor', () => {
  describe('parseUrl', () => {
    it('only supports clean org urls, and decodes them', () => {
      expect(() => parseUrl('https://github.com')).toThrow();
      expect(() => parseUrl('https://github.com/org/foo')).toThrow();
      expect(() => parseUrl('https://github.com/org/foo/teams')).toThrow();
      expect(parseUrl('https://github.com/foo%32')).toEqual({ org: 'foo2' });
    });
  });

  describe('implementation', () => {
    let integrations: ScmIntegrations;
    let github: jest.Mocked<ScmIntegrationsGroup<GitHubIntegration>>;

    beforeEach(() => {
      github = {
        byHost: jest.fn(),
        byUrl: jest.fn(),
        list: jest.fn(),
      };
      integrations = ({
        github,
      } as Partial<ScmIntegrations>) as ScmIntegrations;
    });

    it('rejects unknown types', async () => {
      const processor = new GithubOrgReaderProcessor({
        providers: [
          {
            target: 'https://github.com',
            apiBaseUrl: 'https://api.github.com',
          },
        ],
        integrations,
        logger: getVoidLogger(),
      });
      const location: GitHubOrgLocationSpec = {
        type: 'not-github-org',
        target: 'https://github.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets from providers', async () => {
      const processor = new GithubOrgReaderProcessor({
        providers: [
          {
            target: 'https://github.com',
            apiBaseUrl: 'https://api.github.com',
          },
        ],
        integrations,
        logger: getVoidLogger(),
      });
      const location: GitHubOrgLocationSpec = {
        type: 'github-org',
        target: 'https://not.github.com/apa',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no GitHub Org provider that matches https:\/\/not.github.com\/apa/,
      );
    });

    it('rejects unknown targets from integrations', async () => {
      const processor = new GithubOrgReaderProcessor({
        providers: [],
        integrations,
        logger: getVoidLogger(),
      });
      const location: GitHubOrgLocationSpec = {
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
