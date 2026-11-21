/*
 * Copyright 2026 The Backstage Authors
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

import { buildReleaseMap, fetchReleaseManifests } from './releaseMap';
import * as releaseManifests from '@backstage/release-manifests';

jest.mock('@backstage/release-manifests');

const mockGetManifestByReleaseLine = jest.spyOn(
  releaseManifests,
  'getManifestByReleaseLine',
);
const mockGetManifestByVersion = jest.spyOn(
  releaseManifests,
  'getManifestByVersion',
);

describe('releaseMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildReleaseMap', () => {
    const mockManifests: releaseManifests.ReleaseManifest[] = [
      {
        releaseVersion: '1.45.0',
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.8.0' },
          { name: '@backstage/catalog-model', version: '1.5.0' },
        ],
      },
      {
        releaseVersion: '1.46.0',
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.8.0' },
          { name: '@backstage/catalog-model', version: '1.6.0' },
          { name: '@backstage/plugin-catalog', version: '1.10.0' },
        ],
      },
      {
        releaseVersion: '1.47.0',
        packages: [
          { name: '@backstage/core-plugin-api', version: '1.9.0' },
          { name: '@backstage/catalog-model', version: '1.6.0' },
          { name: '@backstage/plugin-catalog', version: '1.11.0' },
        ],
      },
    ];

    it('maps packages to their earliest release', async () => {
      const result = await buildReleaseMap(
        [
          { name: '@backstage/core-plugin-api', versions: ['1.8.0'] },
          { name: '@backstage/catalog-model', versions: ['1.5.0'] },
        ],
        { manifests: mockManifests },
      );

      // 1.8.0 is in 1.45.0, 1.46.0, and 1.47.0; it should map to earliest (1.45.0)
      expect(result.packageReleases.get('@backstage/core-plugin-api')).toEqual([
        { version: '1.8.0', release: '1.45.0' },
      ]);
      expect(result.packageReleases.get('@backstage/catalog-model')).toEqual([
        { version: '1.5.0', release: '1.45.0' },
      ]);
      expect(result.mostCommonRelease).toBe('1.45.0');
      expect(result.newerPackages).toEqual([]);
    });

    it('detects packages newer than the most common release', async () => {
      const result = await buildReleaseMap(
        [
          { name: '@backstage/core-plugin-api', versions: ['1.8.0'] }, // 1.45.0
          { name: '@backstage/catalog-model', versions: ['1.5.0'] }, // 1.45.0
          { name: '@backstage/plugin-catalog', versions: ['1.11.0'] }, // 1.47.0 (newer!)
        ],
        { manifests: mockManifests },
      );

      expect(result.mostCommonRelease).toBe('1.45.0');
      expect(result.packageReleases.get('@backstage/plugin-catalog')).toEqual([
        { version: '1.11.0', release: '1.47.0', isNewer: true },
      ]);
      expect(result.newerPackages).toEqual([
        {
          name: '@backstage/plugin-catalog',
          version: '1.11.0',
          release: '1.47.0',
        },
      ]);
    });

    it('handles package versions not in any scanned release', async () => {
      const result = await buildReleaseMap(
        [
          { name: '@backstage/unknown-pkg', versions: ['99.9.9'] },
          { name: '@backstage/core-plugin-api', versions: ['1.8.0'] },
        ],
        { manifests: mockManifests },
      );

      expect(result.packageReleases.get('@backstage/unknown-pkg')).toEqual([
        { version: '99.9.9', release: undefined },
      ]);
      expect(result.mostCommonRelease).toBe('1.45.0');
      expect(result.newerPackages).toEqual([]);
    });

    it('respects backstageVersion option as baseline when present', async () => {
      const result = await buildReleaseMap(
        [
          { name: '@backstage/core-plugin-api', versions: ['1.8.0'] }, // 1.45.0
          { name: '@backstage/catalog-model', versions: ['1.6.0'] }, // 1.46.0
          { name: '@backstage/plugin-catalog', versions: ['1.11.0'] }, // 1.47.0
        ],
        { manifests: mockManifests, backstageVersion: '1.46.0' },
      );

      expect(result.mostCommonRelease).toBe('1.46.0');
      expect(result.newerPackages).toEqual([
        {
          name: '@backstage/plugin-catalog',
          version: '1.11.0',
          release: '1.47.0',
        },
      ]);
    });
  });

  describe('fetchReleaseManifests', () => {
    it('fetches main manifest and queries historical minor releases', async () => {
      mockGetManifestByReleaseLine.mockResolvedValueOnce({
        releaseVersion: '1.50.0',
        packages: [],
      });
      mockGetManifestByVersion.mockImplementation(async ({ version }) => ({
        releaseVersion: version,
        packages: [],
      }));

      const manifests = await fetchReleaseManifests();

      expect(mockGetManifestByReleaseLine).toHaveBeenCalledWith(
        expect.objectContaining({ releaseLine: 'main' }),
      );
      expect(manifests.length).toBeGreaterThan(1);
      expect(manifests[0].releaseVersion).toBe('1.50.0');
    });

    it('handles network failure when fetching manifests', async () => {
      mockGetManifestByReleaseLine.mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(fetchReleaseManifests()).rejects.toThrow('Network error');
    });
  });
});
