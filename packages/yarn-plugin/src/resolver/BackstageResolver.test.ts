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

import { structUtils } from '@yarnpkg/core';
import { npath, ppath } from '@yarnpkg/fslib';
import { getManifestByVersion } from '@backstage/release-manifests';
import { BackstageResolver } from './BackstageResolver';
import { createMockDirectory } from '@backstage/backend-test-utils';

jest.mock('@backstage/release-manifests', () => ({
  getManifestByVersion: jest.fn().mockResolvedValue({
    releaseVersion: '1.23.45',
    packages: [
      {
        name: '@backstage/core',
        version: '6.7.8',
      },
    ],
  }),
}));

const getManifestByVersionMock = getManifestByVersion as jest.MockedFunction<
  typeof getManifestByVersion
>;

describe('BackstageResolver', () => {
  const mockDir = createMockDirectory();
  let backstageResolver: BackstageResolver;

  beforeEach(() => {
    jest
      .spyOn(ppath, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    mockDir.setContent({
      'backstage.json': JSON.stringify({
        version: '1.23.45',
      }),
      'package.json': JSON.stringify({
        workspaces: {
          packages: ['packages/*'],
        },
      }),
      packages: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/core': 'backstage:^',
            },
          }),
        },
      },
    });

    backstageResolver = new BackstageResolver();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('supportsDescriptor', () => {
    it.each([
      ['backstage:^'],
      ['backstage:1.26.0-next.3'],
      ['backstage:anything'],
    ])('returns true for range "%s"', range => {
      expect(
        backstageResolver.supportsDescriptor(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            range,
          ),
        ),
      ).toEqual(true);
    });
  });

  describe('bindDescriptor', () => {
    describe('with range "backstage:^"', () => {
      it('returns a descriptor basedwith a version range for the current Backstage version', () => {
        expect(
          backstageResolver.bindDescriptor(
            structUtils.makeDescriptor(
              structUtils.makeIdent('backstage', 'core'),
              'backstage:^',
            ),
          ),
        ).toEqual(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:1.23.45',
          ),
        );
      });
    });

    describe('with range "backstage:1.23.45"', () => {
      it('returns the correct descriptor', () => {
        expect(
          backstageResolver.bindDescriptor(
            structUtils.makeDescriptor(
              structUtils.makeIdent('backstage', 'core'),
              'backstage:1.23.45',
            ),
          ),
        ).toEqual(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:1.23.45',
          ),
        );
      });
    });
  });

  describe('getCandidates', () => {
    it('returns an npm: descriptor based on the manifest for the appropriate backstage version', async () => {
      const descriptor = structUtils.makeDescriptor(
        structUtils.makeIdent('backstage', 'core'),
        'backstage:1.23.45',
      );

      await expect(
        backstageResolver.getCandidates(descriptor),
      ).resolves.toEqual([structUtils.makeLocator(descriptor, 'npm:6.7.8')]);
    });

    it('rejects descriptors not using the backstage: protocol', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'npm:1.2.3',
          ),
        ),
      ).rejects.toThrow(/unsupported version protocol/i);
    });

    it('rejects backstage: ranges with a ^ shorthand version', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:^',
          ),
        ),
      ).rejects.toThrow(/invalid backstage version/i);
    });

    it('rejects backstage: ranges with a * shorthand version', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:*',
          ),
        ),
      ).rejects.toThrow(/invalid backstage version/i);
    });

    it('rejects backstage: ranges with an invalid version specified', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:latest',
          ),
        ),
      ).rejects.toThrow(/invalid backstage version/i);
    });

    it('memoizes manifest retrieval', async () => {
      const descriptor1 = structUtils.makeDescriptor(
        structUtils.makeIdent('backstage', 'core'),
        'backstage:1.23.45',
      );

      for (let i = 0; i < 5; i++) {
        await backstageResolver.getCandidates(descriptor1);
      }

      expect(getManifestByVersionMock).toHaveBeenCalledTimes(1);

      const descriptor2 = structUtils.makeDescriptor(
        structUtils.makeIdent('backstage', 'core'),
        'backstage:6.78.90',
      );

      for (let i = 0; i < 5; i++) {
        await backstageResolver.getCandidates(descriptor2);
      }

      expect(getManifestByVersionMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('getSatisfying', () => {
    it('filters out locators for other packages', async () => {
      await expect(
        backstageResolver.getSatisfying(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:1.23.45',
          ),
          {},
          [
            structUtils.makeLocator(
              structUtils.makeIdent('backstage', 'foo'),
              'npm:1.2.3',
            ),
            structUtils.makeLocator(
              structUtils.makeIdent('backstage', 'core'),
              'npm:6.7.8',
            ),
            structUtils.makeLocator(
              structUtils.makeIdent('backstage', 'bar'),
              'npm:1.2.3',
            ),
          ],
        ),
      ).resolves.toEqual({
        locators: [
          structUtils.makeLocator(
            structUtils.makeIdent('backstage', 'core'),
            'npm:6.7.8',
          ),
        ],
        sorted: true,
      });
    });

    it('filters out locators for other package versions', async () => {
      await expect(
        backstageResolver.getSatisfying(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:1.23.45',
          ),
          {},
          [
            structUtils.makeLocator(
              structUtils.makeIdent('backstage', 'core'),
              'npm:5.6.7',
            ),
            structUtils.makeLocator(
              structUtils.makeIdent('backstage', 'core'),
              'npm:6.7.8',
            ),
            structUtils.makeLocator(
              structUtils.makeIdent('backstage', 'bar'),
              'npm:7.8.9',
            ),
          ],
        ),
      ).resolves.toEqual({
        locators: [
          structUtils.makeLocator(
            structUtils.makeIdent('backstage', 'core'),
            'npm:6.7.8',
          ),
        ],
        sorted: true,
      });
    });

    it('throws for non `backstage:` descriptors', async () => {
      await expect(
        backstageResolver.getSatisfying(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'npm:1.2.3',
          ),
          {},
          [],
        ),
      ).rejects.toThrow(/unexpected npm: range/i);
    });
  });
});
