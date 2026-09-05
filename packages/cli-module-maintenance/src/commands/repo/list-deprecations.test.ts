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

import type { CliCommandContext } from '@backstage/cli-node';

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: { json: true } }),
}));
jest.mock('@backstage/cli-node', () => ({
  ...jest.requireActual('@backstage/cli-node'),
  PackageGraph: { listTargetPackages: jest.fn() },
}));

import { PackageGraph } from '@backstage/cli-node';
import listDeprecations from './list-deprecations';

const mockListTargetPackages = jest.mocked(PackageGraph.listTargetPackages);

/** @deprecated Use a current fixture instead. */
function deprecatedFixture() {}

deprecatedFixture();

describe('list-deprecations command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListTargetPackages.mockResolvedValue([
      {
        dir: __filename,
        packageJson: { name: 'test-package', version: '1.0.0' },
      },
    ]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('reports deprecations found by the TypeScript ESLint rule', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);

    await listDeprecations({
      args: [],
      info: {
        name: 'list-deprecations',
        usage: 'backstage-cli repo list-deprecations',
      },
    } as unknown as CliCommandContext);

    expect(JSON.parse(String(logSpy.mock.calls[0][0]))).toEqual([
      expect.objectContaining({
        path: 'packages/cli-module-maintenance/src/commands/repo/list-deprecations.test.ts',
        message:
          '`deprecatedFixture` is deprecated. Use a current fixture instead.',
      }),
    ]);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
