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
import { afterWorkspaceDependencyAddition } from './afterWorkspaceDependencyAddition';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('afterWorkspaceDependencyAddition', () => {
  const mockDir = createMockDirectory();
  const workspace = {
    project: {
      configuration: {},
    },
  } as Workspace;
  const target = {} as suggestUtils.Target;
  const strategies: Array<suggestUtils.Strategy> = [];

  const consoleInfoSpy = jest
    .spyOn(console, 'info')
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

  it('should replace the range for a backstage scoped dependency', async () => {
    const input: Descriptor = {
      scope: 'backstage',
      name: 'test-package',
      range: '^1.0.0',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };

    await afterWorkspaceDependencyAddition(
      workspace,
      target,
      input,
      strategies,
    );

    expect(input.range).toBe('backstage:^');
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      `Setting ${input.scope}/${input.name} to backstage:^`,
    );
  });

  it('should not replace the range for a backstage scoped dependency where it cant find a version from remote', async () => {
    const input: Descriptor = {
      scope: 'backstage',
      name: 'missing-package',
      range: '^1.0.0',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };

    await afterWorkspaceDependencyAddition(
      workspace,
      target,
      input,
      strategies,
    );

    expect(input.range).toBe('^1.0.0');
  });

  it('should not replace the range for a non-backstage scoped dependency', async () => {
    const input: Descriptor = {
      scope: 'backstage-community',
      name: 'test-package',
      range: '^1.0.0',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };

    await afterWorkspaceDependencyAddition(
      workspace,
      target,
      input,
      strategies,
    );

    expect(input.range).toBe('^1.0.0');
  });

  it('should not replace the range for a dependency with backstage:^ version', async () => {
    const input: Descriptor = {
      scope: 'backstage',
      name: 'another-test-package',
      range: 'backstage:^',
      descriptorHash: {} as DescriptorHash,
      identHash: {} as IdentHash,
    };

    await afterWorkspaceDependencyAddition(
      workspace,
      target,
      input,
      strategies,
    );

    expect(input.range).toBe('backstage:^');
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });
});
