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
import {
  Descriptor,
  DescriptorHash,
  IdentHash,
  Workspace,
} from '@yarnpkg/core';
import { suggestUtils } from '@yarnpkg/plugin-essentials';
import { getPackageVersion } from '../util';
import { afterWorkspaceDependencyReplacement } from './afterWorkspaceDependencyReplacement';

jest.mock('../util', () => ({
  getPackageVersion: jest.fn(),
}));

describe('afterWorkspaceDependencyReplacement.test', () => {
  const workspace = {
    project: {
      configuration: {},
    },
  } as Workspace;
  const target = {} as suggestUtils.Target;
  const mockGetPackageVersion = getPackageVersion as jest.MockedFunction<
    typeof getPackageVersion
  >;

  beforeEach(() => {
    mockGetPackageVersion.mockReset();
  });

  it('should warn that the range is being changed for a backstage scoped dependency', async () => {
    const fromDescriptor: Descriptor = {
      scope: 'backstage',
      name: 'test-package',
      range: 'backstage:^',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };
    const toDescriptor: Descriptor = {
      scope: 'backstage',
      name: 'test-package',
      range: '^1.0.0',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };

    mockGetPackageVersion.mockImplementation(() => Promise.resolve('success'));

    await afterWorkspaceDependencyReplacement(
      workspace,
      target,
      fromDescriptor,
      toDescriptor,
    );

    expect(toDescriptor.range).toBe('^1.0.0');
    expect(mockGetPackageVersion).toHaveBeenCalledTimes(1);
    expect(mockGetPackageVersion).toHaveBeenCalledWith(
      toDescriptor,
      workspace.project.configuration,
    );
  });

  it('should not warn that the range is being changed for a backstage scoped dependency where it cant find a version from remote', async () => {
    const fromDescriptor: Descriptor = {
      scope: 'backstage',
      name: 'test-package',
      range: 'backstage:^',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };
    const toDescriptor: Descriptor = {
      scope: 'backstage',
      name: 'test-package',
      range: '^1.0.0',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };

    mockGetPackageVersion.mockImplementation(() =>
      Promise.reject(new Error('test error')),
    );

    await afterWorkspaceDependencyReplacement(
      workspace,
      target,
      fromDescriptor,
      toDescriptor,
    );

    expect(toDescriptor.range).toBe('^1.0.0');
    expect(mockGetPackageVersion).toHaveBeenCalledTimes(1);
    expect(mockGetPackageVersion).toHaveBeenCalledWith(
      toDescriptor,
      workspace.project.configuration,
    );
  });

  it('should ignore that the range is being changed for a non-backstage scoped dependency', async () => {
    const fromDescriptor: Descriptor = {
      scope: 'backstage-community',
      name: 'test-package',
      range: 'backstage:^',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };
    const toDescriptor: Descriptor = {
      scope: 'backstage-community',
      name: 'test-package',
      range: '^1.0.0',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };
    await afterWorkspaceDependencyReplacement(
      workspace,
      target,
      fromDescriptor,
      toDescriptor,
    );

    expect(toDescriptor.range).toBe('^1.0.0');
    expect(mockGetPackageVersion).not.toHaveBeenCalled();
  });
});
