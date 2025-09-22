/*
 * Copyright 2025 The Backstage Authors
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
import { ResolveOptions, structUtils } from '@yarnpkg/core';
import { BackstageNpmResolver } from './BackstageNpmResolver';
import { NpmSemverResolver } from '@yarnpkg/plugin-npm';

const mockGetCandidates = jest.fn();
const mockGetSatisfying = jest.fn();
jest.mock('@yarnpkg/plugin-npm', () => {
  return {
    ...jest.requireActual('@yarnpkg/plugin-npm'),
    NpmSemverResolver: function MockNpmSemverResolver() {
      return {
        getCandidates: mockGetCandidates,
        getSatisfying: mockGetSatisfying,
      };
    } as unknown as NpmSemverResolver,
  };
});

/*
 * Copyright 2025 The Backstage Authors
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
describe('BackstageNpmResolver', () => {
  const ident = structUtils.makeIdent('backstage', 'core');

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCandidates', () => {
    it('should throw an error if the npm param is missing from the descriptor', async () => {
      const resolver = new BackstageNpmResolver();

      const descriptor = structUtils.bindDescriptor(
        structUtils.makeDescriptor(ident, 'backstage:^'),
        { backstage: '1.0.0' },
      );

      await expect(
        resolver.getCandidates(descriptor, undefined!, undefined!),
      ).rejects.toThrow(/Missing npm parameter/);
    });

    it('should call the npm resolver with the correct descriptor', async () => {
      const resolver = new BackstageNpmResolver();

      mockGetCandidates.mockResolvedValue([
        structUtils.makeLocator(ident, '1.2.5'),
        structUtils.makeLocator(ident, '1.2.4'),
        structUtils.makeLocator(ident, '1.2.3'),
      ]);

      const descriptor = structUtils.bindDescriptor(
        structUtils.makeDescriptor(ident, 'backstage:^'),
        { backstage: '1.0.0', npm: '1.2.3' },
      );

      const deps = {};
      const opts = {};

      await expect(
        resolver.getCandidates(descriptor, deps, opts as ResolveOptions),
      ).resolves.toEqual([
        structUtils.makeLocator(ident, '1.2.5'),
        structUtils.makeLocator(ident, '1.2.4'),
        structUtils.makeLocator(ident, '1.2.3'),
      ]);

      expect(mockGetCandidates).toHaveBeenCalledWith(
        structUtils.makeDescriptor(descriptor, 'npm:^1.2.3'),
        deps,
        opts,
      );
    });
  });

  describe('getResolutionDependencies', () => {
    it('should return the correct resolution dependencies', () => {
      const resolver = new BackstageNpmResolver();

      const descriptor = structUtils.bindDescriptor(
        structUtils.makeDescriptor(ident, 'backstage:^'),
        { backstage: '1.0.0', npm: '1.2.3' },
      );

      expect(resolver.getResolutionDependencies(descriptor)).toEqual({
        '@backstage/core': {
          descriptorHash: expect.any(String),
          identHash: descriptor.identHash,
          name: 'core',
          range: 'npm:^1.2.3',
          scope: 'backstage',
        },
      });
    });
  });

  describe('getSatisfying', () => {
    it('should return the correct satisfying locator', async () => {
      const resolver = new BackstageNpmResolver();

      mockGetSatisfying.mockResolvedValue({
        locators: [
          structUtils.makeLocator(ident, '1.2.5'),
          structUtils.makeLocator(ident, '1.2.4'),
          structUtils.makeLocator(ident, '1.2.3'),
        ],
        sorted: false,
      });

      const descriptor = structUtils.bindDescriptor(
        structUtils.makeDescriptor(ident, 'backstage:^'),
        { backstage: '1.0.0', npm: '1.2.3' },
      );

      await expect(
        resolver.getSatisfying(descriptor, {}, [], {} as ResolveOptions),
      ).resolves.toEqual({
        locators: [
          structUtils.makeLocator(ident, '1.2.5'),
          structUtils.makeLocator(ident, '1.2.4'),
          structUtils.makeLocator(ident, '1.2.3'),
        ],
        sorted: false,
      });

      expect(mockGetSatisfying).toHaveBeenCalledWith(
        {
          descriptorHash: expect.any(String),
          identHash: ident.identHash,
          name: 'core',
          range: 'npm:^1.2.3',
          scope: 'backstage',
        },
        {},
        [],
        {} as ResolveOptions,
      );
    });
  });
});
