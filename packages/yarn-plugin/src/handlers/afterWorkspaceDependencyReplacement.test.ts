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
  httpUtils,
  IdentHash,
  Workspace,
} from '@yarnpkg/core';
import { npath, ppath } from '@yarnpkg/fslib';
import { suggestUtils } from '@yarnpkg/plugin-essentials';
import { afterWorkspaceDependencyReplacement } from './afterWorkspaceDependencyReplacement';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('afterWorkspaceDependencyReplacement.test', () => {
  const mockDir = createMockDirectory();
  const workspace = {
    project: {
      configuration: {},
    },
  } as Workspace;
  const target = {} as suggestUtils.Target;

  const consoleWarnSpy = jest
    .spyOn(console, 'warn')
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(httpUtils, 'get').mockResolvedValue({
      releaseVersion: '1.23.45',
      packages: [
        {
          name: '@backstage/test-package',
          version: '6.7.8',
        },
      ],
    });

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
    });
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

    await afterWorkspaceDependencyReplacement(
      workspace,
      target,
      fromDescriptor,
      toDescriptor,
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'test-package should be set to "backstage:^" instead of "^1.0.0". Make sure this change is intentional and not a mistake.',
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

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(toDescriptor.range).toBe('^1.0.0');
  });
});
