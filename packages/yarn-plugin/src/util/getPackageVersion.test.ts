/*
 * Copyright 2024 The Backstage Authors
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

import {
  Configuration,
  Descriptor,
  httpUtils,
  structUtils,
} from '@yarnpkg/core';
import { xfs } from '@yarnpkg/fslib';
import { getManifestByVersion } from '@backstage/release-manifests';
import { getPackageVersion } from './getPackageVersion';
import { getCurrentBackstageVersion } from './getCurrentBackstageVersion';

jest.mock('@yarnpkg/core');
jest.mock('@backstage/release-manifests');
jest.mock('./getCurrentBackstageVersion');

const mockHttpUtils = httpUtils as jest.Mocked<typeof httpUtils>;
const mockStructUtils = structUtils as jest.Mocked<typeof structUtils>;
const mockGetManifestByVersion = getManifestByVersion as jest.MockedFunction<
  typeof getManifestByVersion
>;
const mockGetCurrentBackstageVersion =
  getCurrentBackstageVersion as jest.MockedFunction<
    typeof getCurrentBackstageVersion
  >;

describe('getPackageVersion', () => {
  const mockConfiguration = {} as Configuration;

  beforeEach(() => {
    mockGetCurrentBackstageVersion.mockReturnValue('1.23.4');
    mockStructUtils.stringifyIdent.mockImplementation(
      (descriptor: any) =>
        `${descriptor.scope || ''}${descriptor.scope ? '/' : ''}${
          descriptor.name
        }`,
    );

    mockStructUtils.parseRange.mockImplementation((range: string) => ({
      protocol: range.includes('backstage:') ? 'backstage:' : 'npm:',
      selector: range.includes('^') ? '^' : range.split(':')[1] || '',
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('successful package resolution', () => {
    beforeEach(() => {
      mockHttpUtils.get.mockResolvedValue({
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.9.0' },
          { name: '@backstage/core-app-api', version: '1.12.0' },
        ],
      });

      mockGetManifestByVersion.mockResolvedValue({
        releaseVersion: '1.23.4',
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.9.0' },
          { name: '@backstage/core-app-api', version: '1.12.0' },
        ],
      });
    });

    it('returns the correct version for a package in the manifest', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      const result = await getPackageVersion(descriptor, mockConfiguration);

      expect(result).toBe('1.9.0');
      expect(mockGetCurrentBackstageVersion).toHaveBeenCalledTimes(1);
      expect(mockGetManifestByVersion).toHaveBeenCalledWith({
        version: '1.23.4',
        versionsBaseUrl: undefined,
        fetch: expect.any(Function),
      });
    });

    it('uses custom versionsBaseUrl from environment when provided', async () => {
      const originalEnv = process.env.BACKSTAGE_VERSIONS_BASE_URL;
      process.env.BACKSTAGE_VERSIONS_BASE_URL = 'https://custom.example.com';

      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      await getPackageVersion(descriptor, mockConfiguration);

      expect(mockGetManifestByVersion).toHaveBeenCalledWith({
        version: '1.23.4',
        versionsBaseUrl: 'https://custom.example.com',
        fetch: expect.any(Function),
      });

      process.env.BACKSTAGE_VERSIONS_BASE_URL = originalEnv;
    });

    it('uses yarn httpUtils for fetching with proper response format', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      const mockResponse = {
        packages: [{ name: '@backstage/core-plugin-api', version: '1.9.0' }],
      };

      mockHttpUtils.get.mockResolvedValue(mockResponse);

      await getPackageVersion(descriptor, mockConfiguration);

      expect(mockGetManifestByVersion).toHaveBeenCalledTimes(1);

      // Get the fetch function that was passed to getManifestByVersion
      const fetchFunction = mockGetManifestByVersion.mock.calls[0][0].fetch;

      // Test the custom fetch function
      const testUrl = 'https://example.com/manifest.json';
      const fetchResult = await fetchFunction!(testUrl);

      expect(mockHttpUtils.get).toHaveBeenCalledWith(testUrl, {
        configuration: mockConfiguration,
        jsonResponse: true,
      });

      expect(fetchResult).toEqual({
        status: 200,
        url: testUrl,
        json: expect.any(Function),
      });

      expect(await fetchResult.json()).toEqual(mockResponse);
    });
  });

  describe('error cases', () => {
    it('throws error for unsupported protocol', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'npm:^1.0.0',
      } as Descriptor;

      mockStructUtils.parseRange.mockReturnValue({
        protocol: 'npm:',
        selector: '^1.0.0',
      });

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow(
        'Unsupported version protocol in version range "npm:^1.0.0" for package @backstage/core-plugin-api',
      );
    });

    it('throws error for unexpected version selector', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:~1.0.0',
      } as Descriptor;

      mockStructUtils.parseRange.mockReturnValue({
        protocol: 'backstage:',
        selector: '~1.0.0',
      });

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow(
        'Unexpected version selector "~1.0.0" for package @backstage/core-plugin-api',
      );
    });

    it('throws error when package is not found in manifest', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'non-existent-package',
        range: 'backstage:^',
      } as Descriptor;

      mockGetManifestByVersion.mockResolvedValue({
        releaseVersion: '1.23.4',
        packages: [{ name: '@backstage/core-plugin-api', version: '1.9.0' }],
      });

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow(
        'Package @backstage/non-existent-package not found in manifest for Backstage v1.23.4. ' +
          'This means the specified package is not included in this Backstage ' +
          'release. This may imply the package has been replaced with an alternative - ' +
          'please review the documentation for the package. If you need to continue ' +
          'using this package, it will be necessary to switch to manually managing its ' +
          'version.',
      );
    });

    it('propagates errors from getManifestByVersion', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      const manifestError = new Error('Failed to fetch manifest');
      mockGetManifestByVersion.mockRejectedValue(manifestError);

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow('Failed to fetch manifest');
    });

    it('propagates errors from getCurrentBackstageVersion', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      const versionError = new Error('Failed to get current version');
      mockGetCurrentBackstageVersion.mockImplementation(() => {
        throw versionError;
      });

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow('Failed to get current version');
    });
  });

  describe('different package name formats', () => {
    beforeEach(() => {
      mockGetManifestByVersion.mockResolvedValue({
        releaseVersion: '1.23.4',
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.9.0' },
          { name: 'backstage-plugin-simple', version: '0.5.0' },
          { name: '@internal/custom-package', version: '2.1.0' },
        ],
      });
    });

    it('handles scoped packages correctly', async () => {
      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      const result = await getPackageVersion(descriptor, mockConfiguration);
      expect(result).toBe('1.9.0');
    });

    it('handles non-scoped packages correctly', async () => {
      const descriptor = {
        name: 'backstage-plugin-simple',
        range: 'backstage:^',
      } as Descriptor;

      mockStructUtils.stringifyIdent.mockReturnValue('backstage-plugin-simple');

      const result = await getPackageVersion(descriptor, mockConfiguration);
      expect(result).toBe('0.5.0');
    });

    it('handles packages with different scopes', async () => {
      const descriptor = {
        scope: '@internal',
        name: 'custom-package',
        range: 'backstage:^',
      } as Descriptor;

      mockStructUtils.stringifyIdent.mockReturnValue(
        '@internal/custom-package',
      );

      const result = await getPackageVersion(descriptor, mockConfiguration);
      expect(result).toBe('2.1.0');
    });
  });

  describe('BACKSTAGE_MANIFEST_FILE environment variable', () => {
    const manifestFilePath = '/path/to/manifest.json';

    beforeEach(() => {
      // Clean up environment variables
      delete process.env.BACKSTAGE_MANIFEST_FILE;
    });

    afterEach(() => {
      // Clean up environment variables
      delete process.env.BACKSTAGE_MANIFEST_FILE;
    });

    it('reads manifest from file when BACKSTAGE_MANIFEST_FILE is set', async () => {
      process.env.BACKSTAGE_MANIFEST_FILE = manifestFilePath;

      const mockManifest = {
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.9.0' },
          { name: '@backstage/core-app-api', version: '1.12.0' },
        ],
      };

      const readJsonSyncSpy = jest.spyOn(xfs, 'readJsonSync');
      readJsonSyncSpy.mockReturnValue(mockManifest);

      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      const result = await getPackageVersion(descriptor, mockConfiguration);

      expect(result).toBe('1.9.0');
      expect(readJsonSyncSpy).toHaveBeenCalledWith(manifestFilePath);
      expect(mockGetManifestByVersion).not.toHaveBeenCalled();
      expect(mockHttpUtils.get).not.toHaveBeenCalled();
    });

    it('finds package in file-based manifest', async () => {
      process.env.BACKSTAGE_MANIFEST_FILE = manifestFilePath;

      const mockManifest = {
        packages: [
          { name: '@backstage/core-plugin-api', version: '2.1.0' },
          { name: '@backstage/backend-common', version: '0.19.5' },
          { name: 'simple-package', version: '1.0.0' },
        ],
      };

      const readJsonSyncSpy = jest.spyOn(xfs, 'readJsonSync');
      readJsonSyncSpy.mockReturnValue(mockManifest);

      const descriptor = {
        scope: '@backstage',
        name: 'backend-common',
        range: 'backstage:^',
      } as Descriptor;

      mockStructUtils.stringifyIdent.mockReturnValue(
        '@backstage/backend-common',
      );

      const result = await getPackageVersion(descriptor, mockConfiguration);

      expect(result).toBe('0.19.5');
      expect(readJsonSyncSpy).toHaveBeenCalledWith(manifestFilePath);
    });

    it('throws error when package not found in file-based manifest', async () => {
      process.env.BACKSTAGE_MANIFEST_FILE = manifestFilePath;

      const mockManifest = {
        packages: [{ name: '@backstage/core-plugin-api', version: '1.9.0' }],
      };

      const readJsonSyncSpy = jest.spyOn(xfs, 'readJsonSync');
      readJsonSyncSpy.mockReturnValue(mockManifest);

      const descriptor = {
        scope: '@backstage',
        name: 'missing-package',
        range: 'backstage:^',
      } as Descriptor;

      mockStructUtils.stringifyIdent.mockReturnValue(
        '@backstage/missing-package',
      );

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow(
        'Package @backstage/missing-package not found in manifest for Backstage v1.23.4. ' +
          'This means the specified package is not included in this Backstage ' +
          'release. This may imply the package has been replaced with an alternative - ' +
          'please review the documentation for the package. If you need to continue ' +
          'using this package, it will be necessary to switch to manually managing its ' +
          'version.',
      );

      expect(readJsonSyncSpy).toHaveBeenCalledWith(manifestFilePath);
      expect(mockGetManifestByVersion).not.toHaveBeenCalled();
    });

    it('propagates errors from xfs.readJsonSync when file cannot be read', async () => {
      process.env.BACKSTAGE_MANIFEST_FILE = manifestFilePath;

      const fileError = new Error('ENOENT: no such file or directory');
      const readJsonSyncSpy = jest.spyOn(xfs, 'readJsonSync');
      readJsonSyncSpy.mockImplementation(() => {
        throw fileError;
      });

      const descriptor = {
        scope: '@backstage',
        name: 'core-plugin-api',
        range: 'backstage:^',
      } as Descriptor;

      await expect(
        getPackageVersion(descriptor, mockConfiguration),
      ).rejects.toThrow('ENOENT: no such file or directory');

      expect(readJsonSyncSpy).toHaveBeenCalledWith(manifestFilePath);
      expect(mockGetManifestByVersion).not.toHaveBeenCalled();
    });

    it('handles non-scoped packages in file-based manifest', async () => {
      process.env.BACKSTAGE_MANIFEST_FILE = manifestFilePath;

      const mockManifest = {
        packages: [
          { name: 'backstage-plugin-simple', version: '0.5.0' },
          { name: '@backstage/core-plugin-api', version: '1.9.0' },
        ],
      };

      const readJsonSyncSpy = jest.spyOn(xfs, 'readJsonSync');
      readJsonSyncSpy.mockReturnValue(mockManifest);

      const descriptor = {
        name: 'backstage-plugin-simple',
        range: 'backstage:^',
      } as Descriptor;

      mockStructUtils.stringifyIdent.mockReturnValue('backstage-plugin-simple');

      const result = await getPackageVersion(descriptor, mockConfiguration);

      expect(result).toBe('0.5.0');
      expect(readJsonSyncSpy).toHaveBeenCalledWith(manifestFilePath);
      expect(mockGetManifestByVersion).not.toHaveBeenCalled();
    });
  });
});
