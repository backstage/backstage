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
  Project,
  ResolveOptions,
  structUtils,
  ThrowReport,
  httpUtils,
} from '@yarnpkg/core';
import { npath, ppath } from '@yarnpkg/fslib';
import { BackstageResolver } from './BackstageResolver';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('BackstageResolver', () => {
  const mockDir = createMockDirectory();
  let backstageResolver: BackstageResolver;
  let resolveOptions: ResolveOptions;

  beforeEach(() => {
    jest
      .spyOn(ppath, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    jest.spyOn(httpUtils, 'get').mockResolvedValue({
      releaseVersion: '1.23.45',
      packages: [
        {
          name: '@backstage/core',
          version: '6.7.8',
        },
      ],
    });

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

    resolveOptions = {
      resolver: backstageResolver,
      project: new Project(ppath.cwd(), {
        configuration: Configuration.create(ppath.cwd()),
      }),
      report: new ThrowReport(),
    };
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
      it('returns a descriptor with a version range for the current Backstage version', () => {
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
            'backstage:^::v=1.23.45',
          ),
        );
      });
    });

    describe('with range "backstage:^::v=1.23.45"', () => {
      it('returns the correct descriptor', () => {
        expect(
          backstageResolver.bindDescriptor(
            structUtils.makeDescriptor(
              structUtils.makeIdent('backstage', 'core'),
              'backstage:^::v=1.23.45',
            ),
          ),
        ).toEqual(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:^::v=1.23.45',
          ),
        );
      });
    });
  });

  describe('getCandidates', () => {
    it('returns an npm: descriptor based on the manifest for the appropriate backstage version', async () => {
      const descriptor = structUtils.makeDescriptor(
        structUtils.makeIdent('backstage', 'core'),
        'backstage:^::v=1.23.45',
      );

      await expect(
        backstageResolver.getCandidates(descriptor, {}, resolveOptions),
      ).resolves.toEqual([structUtils.makeLocator(descriptor, 'npm:6.7.8')]);
    });

    it('rejects descriptors not using the backstage: protocol', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'npm:1.2.3',
          ),
          {},
          resolveOptions,
        ),
      ).rejects.toThrow(/unsupported version protocol/i);
    });

    it('rejects backstage: ranges missing a version parameter', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:^',
          ),
          {},
          resolveOptions,
        ),
      ).rejects.toThrow(/missing Backstage version/i);
    });

    it('rejects backstage: ranges with multiple version parameters', async () => {
      await expect(
        backstageResolver.getCandidates(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:^::v=1&v=2',
          ),
          {},
          resolveOptions,
        ),
      ).rejects.toThrow(/multiple Backstage versions/i);
    });

    it.each`
      selector
      ${'*'}
      ${'latest'}
    `(
      'rejects backstage: ranges with invalid selector "$selector"',
      async ({ selector }) => {
        await expect(
          backstageResolver.getCandidates(
            structUtils.makeDescriptor(
              structUtils.makeIdent('backstage', 'core'),
              `backstage:${selector}`,
            ),
            {},
            resolveOptions,
          ),
        ).rejects.toThrow(/unexpected version selector/i);
      },
    );
  });

  describe('getSatisfying', () => {
    it('filters out locators for other packages', async () => {
      await expect(
        backstageResolver.getSatisfying(
          structUtils.makeDescriptor(
            structUtils.makeIdent('backstage', 'core'),
            'backstage:^::v=1.23.45',
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
          resolveOptions,
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
            'backstage:^::v=1.23.45',
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
          resolveOptions,
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
          resolveOptions,
        ),
      ).rejects.toThrow(/unsupported version protocol/i);
    });
  });
});
