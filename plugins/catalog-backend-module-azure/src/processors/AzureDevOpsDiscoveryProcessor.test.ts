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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { LocationSpec } from '@backstage/plugin-catalog-backend';
import {
  AzureDevOpsDiscoveryProcessor,
  parseUrl,
} from './AzureDevOpsDiscoveryProcessor';
import { codeSearch } from '../lib';

jest.mock('../lib');
const mockCodeSearch = codeSearch as jest.MockedFunction<typeof codeSearch>;

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

  describe('reject unrelated entries', () => {
    it('rejects unknown types', async () => {
      const processor = AzureDevOpsDiscoveryProcessor.fromConfig(
        new ConfigReader({
          integrations: {
            azure: [{ host: 'dev.azure.com', token: 'blob' }],
          },
        }),
        { logger: getVoidLogger() },
      );
      const location: LocationSpec = {
        type: 'not-azure-discovery',
        target: 'https://dev.azure.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });
  });

  it('rejects unknown targets', async () => {
    const processor = AzureDevOpsDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          github: [
            { host: 'dev.azure.com', token: 'blob' },
            { host: 'azure.myorg.com', token: 'blob' },
          ],
        },
      }),
      { logger: getVoidLogger() },
    );
    const location: LocationSpec = {
      type: 'azure-discovery',
      target: 'https://not.azure.com/org/project',
    };
    await expect(
      processor.readLocation(location, false, () => {}),
    ).rejects.toThrow(
      /There is no Azure integration that matches https:\/\/not.azure.com\/org\/project. Please add a configuration entry for it under integrations.azure/,
    );
  });

  describe('handles repositories', () => {
    const processor = AzureDevOpsDiscoveryProcessor.fromConfig(
      new ConfigReader({
        integrations: {
          github: [{ host: 'dev.azure.com', token: 'blob' }],
        },
      }),
      { logger: getVoidLogger() },
    );

    beforeEach(() => {
      mockCodeSearch.mockClear();
    });

    it('output all locations found on from code search', async () => {
      const location: LocationSpec = {
        type: 'azure-discovery',
        target: 'https://dev.azure.com/shopify/engineering',
      };
      mockCodeSearch.mockResolvedValueOnce([
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'backstage',
          },
        },
        {
          fileName: 'catalog-info.yaml',
          path: '/src/catalog-info.yaml',
          repository: {
            name: 'ios-app',
          },
        },
      ]);
      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(mockCodeSearch).toHaveBeenCalledWith(
        { host: 'dev.azure.com' },
        'shopify',
        'engineering',
        '',
        '/catalog-info.yaml',
      );
      expect(emitter).toHaveBeenCalledTimes(2);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://dev.azure.com/shopify/engineering/_git/backstage?path=/catalog-info.yaml',
          presence: 'optional',
        },
      });
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://dev.azure.com/shopify/engineering/_git/ios-app?path=/src/catalog-info.yaml',
          presence: 'optional',
        },
      });
    });

    it('output single locations from code search', async () => {
      const location: LocationSpec = {
        type: 'azure-discovery',
        target: 'https://dev.azure.com/shopify/engineering/_git/backstage',
      };
      mockCodeSearch.mockResolvedValueOnce([
        {
          fileName: 'catalog-info.yaml',
          path: '/catalog-info.yaml',
          repository: {
            name: 'backstage',
          },
        },
      ]);
      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(mockCodeSearch).toHaveBeenCalledWith(
        { host: 'dev.azure.com' },
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
      );
      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://dev.azure.com/shopify/engineering/_git/backstage?path=/catalog-info.yaml',
          presence: 'optional',
        },
      });
    });

    it('output single locations with different file name from code search', async () => {
      const location: LocationSpec = {
        type: 'azure-discovery',
        target:
          'https://dev.azure.com/shopify/engineering?path=/src/*/catalog.yaml',
      };
      mockCodeSearch.mockResolvedValueOnce([
        {
          fileName: 'catalog.yaml',
          path: '/src/main/catalog.yaml',
          repository: {
            name: 'backstage',
          },
        },
      ]);
      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(mockCodeSearch).toHaveBeenCalledWith(
        { host: 'dev.azure.com' },
        'shopify',
        'engineering',
        '',
        '/src/*/catalog.yaml',
      );
      expect(emitter).toHaveBeenCalledTimes(1);
      expect(emitter).toHaveBeenCalledWith({
        type: 'location',
        location: {
          type: 'url',
          target:
            'https://dev.azure.com/shopify/engineering/_git/backstage?path=/src/main/catalog.yaml',
          presence: 'optional',
        },
      });
    });

    it('output nothing when code search does not find anything', async () => {
      const location: LocationSpec = {
        type: 'azure-discovery',
        target: 'https://dev.azure.com/shopify/engineering/_git/backstage',
      };
      mockCodeSearch.mockResolvedValueOnce([]);
      const emitter = jest.fn();

      await processor.readLocation(location, false, emitter);

      expect(mockCodeSearch).toHaveBeenCalledWith(
        { host: 'dev.azure.com' },
        'shopify',
        'engineering',
        'backstage',
        '/catalog-info.yaml',
      );
      expect(emitter).not.toHaveBeenCalled();
    });
  });
});
