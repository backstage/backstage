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

import { GitLabIntegrationConfig } from './config';
import {
  getGitLabFileFetchUrl,
  getGitLabRequestOptions,
  extractProjectPath,
} from './core';

describe('gitlab core', () => {
  const configWithNoToken: GitLabIntegrationConfig = {
    host: 'gitlab.com',
    apiBaseUrl: '<ignored>',
    baseUrl: '<ignored>',
  };

  const configSelfHosteWithRelativePath: GitLabIntegrationConfig = {
    host: 'gitlab.mycompany.com',
    token: '0123456789',
    apiBaseUrl: '<ignored>',
    baseUrl: 'https://gitlab.mycompany.com/gitlab',
  };

  const configSelfHostedWithoutRelativePath: GitLabIntegrationConfig = {
    host: 'gitlab.mycompany.com',
    token: '0123456789',
    apiBaseUrl: '<ignored>',
    baseUrl: 'https://gitlab.mycompany.com',
  };

  describe('getGitLabFileFetchUrl', () => {
    describe('when target has a scoped route', () => {
      it('returns a projects API URL', () => {
        const target =
          'https://gitlab.com/group/project/-/blob/branch/folder/file.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      it('supports folder named "blob"', () => {
        const target =
          'https://gitlab.com/group/project/-/blob/branch/blob/file.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fproject/repository/files/blob%2Ffile.yaml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      it('locates projects in subgroups', () => {
        const target =
          'https://gitlab.com/group/subgroup/project/-/blob/branch/folder/file.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fsubgroup%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      it('supports filename with .yml extension', () => {
        const target =
          'https://gitlab.com/group/project/-/blob/branch/folder/file.yml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile.yml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      it('supports non-URI-encoded target', () => {
        const target =
          'https://gitlab.com/group/project/-/blob/branch/folder/file with spaces.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile%20with%20spaces.yaml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      describe('when gitlab is self-hosted', () => {
        it('returns projects API URL', () => {
          const target =
            'https://gitlab.mycompany.com/group/project/-/blob/branch/folder/file.yaml';
          const fetchUrl =
            'https://gitlab.mycompany.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=branch';
          expect(
            getGitLabFileFetchUrl(target, configSelfHostedWithoutRelativePath),
          ).toBe(fetchUrl);
        });

        it('handles non-URI-encoded target', () => {
          const target =
            'https://gitlab.mycompany.com/group/project/-/blob/branch/folder/file with spaces.yaml';
          const fetchUrl =
            'https://gitlab.mycompany.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile%20with%20spaces.yaml/raw?ref=branch';
          expect(
            getGitLabFileFetchUrl(target, configSelfHostedWithoutRelativePath),
          ).toBe(fetchUrl);
        });

        describe('with a relative path', () => {
          it('returns projects API URL', () => {
            const target =
              'https://gitlab.mycompany.com/gitlab/group/project/-/blob/branch/folder/file.yaml';
            const fetchUrl =
              'https://gitlab.mycompany.com/gitlab/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=branch';
            expect(
              getGitLabFileFetchUrl(target, configSelfHosteWithRelativePath),
            ).toBe(fetchUrl);
          });

          it('handles non-URI-encoded target', () => {
            const target =
              'https://gitlab.mycompany.com/gitlab/group/project/-/blob/branch/folder/file with spaces.yaml';
            const fetchUrl =
              'https://gitlab.mycompany.com/gitlab/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile%20with%20spaces.yaml/raw?ref=branch';
            expect(
              getGitLabFileFetchUrl(target, configSelfHosteWithRelativePath),
            ).toBe(fetchUrl);
          });
        });
      });
    });

    describe('when target has an unscoped route', () => {
      it('returns projects API URL', () => {
        const target =
          'https://gitlab.com/group/project/blob/branch/folder/file.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      it('supports project in subgroup', () => {
        const target =
          'https://gitlab.com/group/subgroup/project/blob/branch/folder/file.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fsubgroup%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=branch';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });

      it('supports repo with branch named "blob"', () => {
        const target =
          'https://gitlab.com/group/project/blob/blob/folder/file.yaml';
        const fetchUrl =
          'https://gitlab.com/api/v4/projects/group%2Fproject/repository/files/folder%2Ffile.yaml/raw?ref=blob';
        expect(getGitLabFileFetchUrl(target, configWithNoToken)).toBe(fetchUrl);
      });
    });
  });

  describe('extractProjectPath', () => {
    it('extracts project path from scoped route', () => {
      const target =
        'https://gitlab.com/group/project/-/blob/branch/folder/file.yaml';
      expect(extractProjectPath(target, configWithNoToken)).toBe(
        'group/project',
      );
    });

    it('extracts project path from subgroup', () => {
      const target =
        'https://gitlab.com/group/subgroup/project/-/blob/branch/folder/file.yaml';
      expect(extractProjectPath(target, configWithNoToken)).toBe(
        'group/subgroup/project',
      );
    });

    it('extracts project path from unscoped route', () => {
      const target =
        'https://gitlab.com/group/project/blob/branch/folder/file.yaml';
      expect(extractProjectPath(target, configWithNoToken)).toBe(
        'group/project',
      );
    });

    it('extracts project path from self-hosted gitlab with relative path', () => {
      const target =
        'https://gitlab.mycompany.com/gitlab/group/project/-/blob/branch/folder/file.yaml';
      expect(extractProjectPath(target, configSelfHosteWithRelativePath)).toBe(
        'group/project',
      );
    });

    it('throws error for invalid URLs without blob path', () => {
      const target = 'https://gitlab.com/some/random/endpoint';
      expect(() => extractProjectPath(target, configWithNoToken)).toThrow(
        'Failed extracting project path from /some/random/endpoint. Url path must include /blob/.',
      );
    });
  });

  describe('getGitLabRequestOptions', () => {
    it('should return Authorization bearer header when a token is provided', () => {
      const token = '1234567890';
      const result = getGitLabRequestOptions(
        configSelfHosteWithRelativePath,
        token,
      );

      expect(result).toEqual({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });

    it('should return Authorization bearer header using the config token when no token is provided', () => {
      const result = getGitLabRequestOptions(configSelfHosteWithRelativePath);

      expect(result).toEqual({
        headers: {
          Authorization: `Bearer ${configSelfHosteWithRelativePath.token}`,
        },
      });
    });
  });
});
