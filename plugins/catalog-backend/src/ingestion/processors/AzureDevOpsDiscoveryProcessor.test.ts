/*
 * Copyright 2021 The Backstage Authors
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

import { parseUrl } from './AzureDevOpsDiscoveryProcessor';

describe('AzureDevOpsDiscoveryProcessor', () => {
  describe('parseUrl', () => {
    it('parses well formed URLs', () => {
      expect(parseUrl('https://dev.azure.com/my-org/my-proj')).toEqual({
        baseUrl: 'https://dev.azure.com',
        org: 'my-org',
        project: 'my-proj',
        repo: '',
        catalogPath: '/catalog-info.yaml',
      });

      expect(
        parseUrl(
          'https://dev.azure.com/spotify/engineering/_git/backstage?path=/catalog.yaml',
        ),
      ).toEqual({
        baseUrl: 'https://dev.azure.com',
        org: 'spotify',
        project: 'engineering',
        repo: 'backstage',
        catalogPath: '/catalog.yaml',
      });

      expect(
        parseUrl(
          'https://azuredevops.mycompany.com/spotify/engineering/_git/backstage?path=/src/*/catalog.yaml',
        ),
      ).toEqual({
        baseUrl: 'https://azuredevops.mycompany.com',
        org: 'spotify',
        project: 'engineering',
        repo: 'backstage',
        catalogPath: '/src/*/catalog.yaml',
      });
    });

    it('throws on incorrectly formed URLs', () => {
      expect(() => parseUrl('https://dev.azure.com')).toThrow();
      expect(() => parseUrl('https://dev.azure.com//')).toThrow();
      expect(() => parseUrl('https://dev.azure.com//foo')).toThrow();
    });
  });

  // TODO: add tests for AzureDevOpsDiscoveryProcessor
});
