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

import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import type { CliCommandContext } from '@backstage/cli-node';

jest.mock('../../lib/verifyYarnPatches', () => ({
  fixYarnPatches: jest.fn(),
  verifyYarnPatches: jest.fn(),
}));

import verifyYarnPatchesCommand from './verifyPatches';
import {
  fixYarnPatches,
  verifyYarnPatches,
  type VerifyYarnPatchesResult,
} from '../../lib/verifyYarnPatches';

const mockFixYarnPatches = jest.mocked(fixYarnPatches);
const mockVerifyYarnPatches = jest.mocked(verifyYarnPatches);

const context: CliCommandContext = {
  args: [],
  info: {
    name: 'verify-patches',
    usage: 'backstage-cli pm verify-patches',
  },
};

function healthyResult(
  patchCount: number,
  backstageCheck: VerifyYarnPatchesResult['backstageCheck'],
): VerifyYarnPatchesResult {
  return { patchCount, backstageCheck, errors: [] };
}

function holdbackResult(): VerifyYarnPatchesResult {
  return {
    patchCount: 1,
    backstageCheck: 'verified',
    errors: [
      {
        kind: 'backstage-patch-holdback',
        message:
          "Patched package '@backstage/example' is at version '1.0.0', but Backstage release '1.0.1' requires version '1.0.1'",
        location: 'package.json#resolutions.@backstage/example',
      },
    ],
  };
}

describe('verifyYarnPatches command', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;
  let targetPathsOverride: ReturnType<typeof overrideTargetPaths>;

  beforeEach(() => {
    jest.resetAllMocks();
    targetPathsOverride = overrideTargetPaths('/test-repository');
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    targetPathsOverride.restore();
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('reports success when the repository has no patches', async () => {
    mockVerifyYarnPatches.mockResolvedValue(healthyResult(0, 'skipped'));

    await verifyYarnPatchesCommand(context);

    expect(stdoutSpy).toHaveBeenCalledWith(
      'Yarn patch verification passed: no patch references found. Backstage release validation was skipped.\n',
    );
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  it('renders help without verifying the repository', async () => {
    const exitError = new Error('process exited');
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      expect(code).toBe(0);
      throw exitError;
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    try {
      await expect(
        verifyYarnPatchesCommand({ ...context, args: ['--help'] }),
      ).rejects.toBe(exitError);

      expect(mockVerifyYarnPatches).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('backstage-cli pm verify-patches [flags...]'),
      );
    } finally {
      exitSpy.mockRestore();
      consoleSpy.mockRestore();
    }
  });

  it('reports successful generic patch validation', async () => {
    mockVerifyYarnPatches.mockResolvedValue(healthyResult(2, 'skipped'));

    await verifyYarnPatchesCommand(context);

    expect(stdoutSpy).toHaveBeenCalledWith(
      'Yarn patch verification passed: 2 patch references verified. Backstage release validation was skipped.\n',
    );
    expect(mockVerifyYarnPatches).toHaveBeenCalledWith({
      rootDir: '/test-repository',
      env: process.env,
    });
  });

  it('reports successful Backstage patch validation', async () => {
    mockVerifyYarnPatches.mockResolvedValue(healthyResult(1, 'verified'));

    await verifyYarnPatchesCommand(context);

    expect(stdoutSpy).toHaveBeenCalledWith(
      'Yarn patch verification passed: 1 patch reference verified. Backstage release validation passed.\n',
    );
  });

  it('repairs safe Backstage patch holdbacks before verifying', async () => {
    const initialResult = holdbackResult();
    mockFixYarnPatches.mockResolvedValue({
      status: 'fixed',
      message:
        "Retargeted patch for '@backstage/example' from '1.0.0' to '1.0.1'",
    });
    mockVerifyYarnPatches
      .mockResolvedValueOnce(initialResult)
      .mockResolvedValueOnce(healthyResult(1, 'verified'));

    await verifyYarnPatchesCommand({ ...context, args: ['--fix'] });

    expect(mockFixYarnPatches).toHaveBeenCalledWith({
      rootDir: '/test-repository',
      env: process.env,
      dryRun: false,
      verificationResult: initialResult,
    });
    expect(stdoutSpy).toHaveBeenCalledWith(
      "Retargeted patch for '@backstage/example' from '1.0.0' to '1.0.1'.\n",
    );
    expect(mockVerifyYarnPatches).toHaveBeenCalledWith({
      rootDir: '/test-repository',
      env: process.env,
    });
    expect(mockVerifyYarnPatches).toHaveBeenCalledTimes(2);
  });

  it('checks a repair without writing or re-verifying during a dry run', async () => {
    const initialResult = holdbackResult();
    mockFixYarnPatches.mockResolvedValue({
      status: 'fixable',
      message:
        "Retargeted patch for '@backstage/example' from '1.0.0' to '1.0.1'",
    });
    mockVerifyYarnPatches.mockResolvedValue(initialResult);

    await verifyYarnPatchesCommand({
      ...context,
      args: ['--fix', '--dry-run'],
    });

    expect(mockFixYarnPatches).toHaveBeenCalledWith({
      rootDir: '/test-repository',
      env: process.env,
      dryRun: true,
      verificationResult: initialResult,
    });
    expect(stdoutSpy).toHaveBeenCalledWith(
      "Retargeted patch for '@backstage/example' from '1.0.0' to '1.0.1' (dry run).\n",
    );
    expect(mockVerifyYarnPatches).toHaveBeenCalledTimes(1);
  });

  it('does not report an error when --fix finds a healthy repository', async () => {
    mockVerifyYarnPatches.mockResolvedValue(healthyResult(1, 'verified'));

    await verifyYarnPatchesCommand({ ...context, args: ['--fix'] });

    expect(stderrSpy).not.toHaveBeenCalled();
    expect(stdoutSpy).toHaveBeenCalledWith(
      'Yarn patch verification passed: 1 patch reference verified. Backstage release validation passed.\n',
    );
    expect(mockVerifyYarnPatches).toHaveBeenCalledTimes(1);
    expect(mockFixYarnPatches).not.toHaveBeenCalled();
  });

  it('rejects --dry-run without --fix', async () => {
    await expect(
      verifyYarnPatchesCommand({ ...context, args: ['--dry-run'] }),
    ).rejects.toThrow('--dry-run can only be used together with --fix');

    expect(mockFixYarnPatches).not.toHaveBeenCalled();
    expect(mockVerifyYarnPatches).not.toHaveBeenCalled();
  });

  it('prints every verification error before failing the command', async () => {
    mockVerifyYarnPatches.mockResolvedValue({
      patchCount: 2,
      backstageCheck: 'verified',
      errors: [
        {
          kind: 'missing-patch-file',
          message: "Patch file '.yarn/patches/example.patch' does not exist",
          location: '.yarn/patches/example.patch',
        },
        {
          kind: 'backstage-patch-holdback',
          message:
            "Patched package '@backstage/example' is at version '1.0.0', but Backstage release '1.0.1' requires version '1.0.1'",
          location: 'package.json#resolutions.@backstage/example',
        },
      ],
    } satisfies VerifyYarnPatchesResult);

    await expect(verifyYarnPatchesCommand(context)).rejects.toThrow(
      'Yarn patch verification failed',
    );

    expect(stderrSpy).toHaveBeenCalledWith('Yarn patch verification failed:\n');
    expect(stderrSpy).toHaveBeenCalledWith(
      "  .yarn/patches/example.patch [missing-patch-file]: Patch file '.yarn/patches/example.patch' does not exist\n",
    );
    expect(stderrSpy).toHaveBeenCalledWith(
      "  package.json#resolutions.@backstage/example [backstage-patch-holdback]: Patched package '@backstage/example' is at version '1.0.0', but Backstage release '1.0.1' requires version '1.0.1'\n",
    );
    expect(stdoutSpy).not.toHaveBeenCalled();
  });

  it('propagates verifier failures', async () => {
    const error = new Error('Unable to inspect repository');
    mockVerifyYarnPatches.mockRejectedValue(error);

    await expect(verifyYarnPatchesCommand(context)).rejects.toBe(error);

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(stderrSpy).not.toHaveBeenCalled();
  });
});
