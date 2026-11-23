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

import { run } from '@backstage/cli-common';
import { semverUtils, structUtils } from '@yarnpkg/core';
import { parseSyml } from '@yarnpkg/parsers';
import { patchUtils } from '@yarnpkg/plugin-patch';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  verifyYarnPatches,
  type PatchDeclaration,
  type PatchHoldbackFix,
  type VerifyYarnPatchesOptions,
  type VerifyYarnPatchesResult,
} from './verifyYarnPatches';

export type FixYarnPatchesOptions = VerifyYarnPatchesOptions & {
  install?: (rootDir: string) => Promise<void>;
  verificationResult?: VerifyYarnPatchesResult;
  writeFile?: (filePath: string, content: string) => Promise<void>;
  /**
   * Extracts the unpatched contents of an installed package and returns the
   * directory they were extracted to. The directory is removed afterwards.
   */
  extractPackage?: (options: {
    rootDir: string;
    packageName: string;
    version: string;
  }) => Promise<string>;
  /**
   * Returns true if the patch file can be reverse-applied in full to the
   * package sources in the given directory.
   */
  isPatchReverseApplicable?: (options: {
    patchPath: string;
    packageDir: string;
  }) => Promise<boolean>;
};

export type FixYarnPatchesResult = {
  status: 'fixed' | 'not-fixable';
  message: string;
};

function hasExactPatchSource(
  declaration: PatchDeclaration,
  packageName: string,
  version: string,
): boolean {
  try {
    const source = structUtils.parseDescriptor(declaration.source, true);
    const range = structUtils.parseRange(source.range);
    return (
      structUtils.stringifyIdent(source) === packageName &&
      range.protocol === 'npm:' &&
      range.selector === version &&
      semverUtils.clean(range.selector) === version
    );
  } catch {
    return false;
  }
}

function getRepairableHoldbacks(
  result: VerifyYarnPatchesResult,
): PatchHoldbackFix[] | undefined {
  if (result.errors.length === 0) {
    return undefined;
  }
  const holdbacks: PatchHoldbackFix[] = [];
  for (const error of result.errors) {
    const holdback = error.repairHint;
    if (
      error.kind !== 'backstage-patch-holdback' ||
      !holdback ||
      !semverUtils.satisfiesWithPrereleases(
        holdback.targetVersion,
        `>${holdback.currentVersion}`,
      )
    ) {
      return undefined;
    }
    holdbacks.push(holdback);
  }
  return holdbacks;
}

function createRetargetedPatchReference(options: {
  packageName: string;
  targetVersion: string;
  reference: string;
}): string {
  const ident = structUtils.parseIdent(options.packageName);
  const descriptor = structUtils.makeDescriptor(ident, options.reference);
  const parsed = patchUtils.parseDescriptor(descriptor);
  return patchUtils.makeDescriptor(ident, {
    ...parsed,
    sourceDescriptor: structUtils.makeDescriptor(
      ident,
      `npm:${options.targetVersion}`,
    ),
  }).range;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createTargetManifest(options: {
  originalManifest: string;
  holdbacks: PatchHoldbackFix[];
  /**
   * Replace patch resolutions with plain `npm:` references to the target
   * version, instead of retargeting the patch.
   */
  unpatched?: boolean;
}): { content: string; transitions: string[] } | undefined {
  let manifest: unknown;
  try {
    manifest = JSON.parse(options.originalManifest);
  } catch {
    return undefined;
  }
  if (!isRecord(manifest) || !isRecord(manifest.resolutions)) {
    return undefined;
  }

  let content = options.originalManifest;
  const transitions: string[] = [];
  for (const holdback of options.holdbacks) {
    const declaration = holdback.declaration;
    if (
      declaration.location !==
        `package.json#resolutions.${holdback.packageName}` ||
      declaration.patchedIdent !== holdback.packageName ||
      manifest.resolutions[holdback.packageName] !== declaration.reference ||
      !hasExactPatchSource(
        declaration,
        holdback.packageName,
        holdback.currentVersion,
      ) ||
      declaration.paths.length !== 1 ||
      declaration.components.length !== 1 ||
      declaration.components[0] !== `local<${declaration.paths[0].absolute}>` ||
      !declaration.projectOwned
    ) {
      return undefined;
    }

    const currentLiteral = JSON.stringify(declaration.reference);
    const firstReference = content.indexOf(currentLiteral);
    if (
      firstReference === -1 ||
      content.indexOf(
        currentLiteral,
        firstReference + currentLiteral.length,
      ) !== -1
    ) {
      return undefined;
    }
    let targetReference: string;
    try {
      targetReference = options.unpatched
        ? `npm:${holdback.targetVersion}`
        : createRetargetedPatchReference({
            packageName: holdback.packageName,
            targetVersion: holdback.targetVersion,
            reference: declaration.reference,
          });
    } catch {
      return undefined;
    }
    content = `${content.slice(0, firstReference)}${JSON.stringify(
      targetReference,
    )}${content.slice(firstReference + currentLiteral.length)}`;
    transitions.push(
      `Retargeted patch for '${holdback.packageName}' from '${holdback.currentVersion}' to '${holdback.targetVersion}'`,
    );
  }
  return { content, transitions };
}

function removeResolutions(
  manifestContent: string,
  packageNames: string[],
): string {
  const manifest = JSON.parse(manifestContent);
  for (const packageName of packageNames) {
    delete manifest.resolutions[packageName];
  }
  if (Object.keys(manifest.resolutions).length === 0) {
    delete manifest.resolutions;
  }
  const indent = manifestContent.match(/^([ \t]+)"/m)?.[1] ?? 2;
  const trailingNewline = manifestContent.endsWith('\n') ? '\n' : '';
  return `${JSON.stringify(manifest, null, indent)}${trailingNewline}`;
}

async function defaultExtractPackage(options: {
  rootDir: string;
  packageName: string;
  version: string;
  env: NodeJS.ProcessEnv | undefined;
}): Promise<string> {
  const stdoutChunks: Buffer[] = [];
  const child = run(
    [
      'yarn',
      'patch',
      `${options.packageName}@npm:${options.version}`,
      '--json',
    ],
    {
      cwd: options.rootDir,
      env: createYarnEnvironment(options.env),
      onStdout: data => stdoutChunks.push(data),
    },
  );
  await child.waitForExit();
  if (child.signalCode) {
    throw new Error(`Yarn patch was terminated by ${child.signalCode}`);
  }
  for (const line of Buffer.concat(stdoutChunks).toString().split('\n')) {
    try {
      const entry = JSON.parse(line);
      if (isRecord(entry) && typeof entry.path === 'string') {
        return entry.path;
      }
    } catch {
      // Not a JSON line
    }
  }
  throw new Error(
    `Yarn did not report where '${options.packageName}' was extracted`,
  );
}

async function defaultIsPatchReverseApplicable(options: {
  patchPath: string;
  packageDir: string;
  env: NodeJS.ProcessEnv | undefined;
}): Promise<boolean> {
  // Stop git from discovering an enclosing repository, since paths would then
  // be resolved relative to that repository root rather than the package.
  const child = run(['git', 'apply', '--check', '-R', options.patchPath], {
    cwd: options.packageDir,
    env: {
      ...(options.env ?? process.env),
      GIT_CEILING_DIRECTORIES: path.dirname(options.packageDir),
    },
    stdio: 'ignore',
  });
  try {
    await child.waitForExit();
  } catch {
    return false;
  }
  return !child.signalCode;
}

async function removeExtractedPackage(packageDir: string): Promise<void> {
  // Yarn extracts into a "user" folder inside a temporary folder of its own.
  const target =
    path.basename(packageDir) === 'user'
      ? path.dirname(packageDir)
      : packageDir;
  await fs.rm(target, { recursive: true, force: true }).catch(() => {});
}

async function defaultInstall(
  rootDir: string,
  env: NodeJS.ProcessEnv | undefined,
): Promise<void> {
  const child = run(['yarn', 'install', '--mode=update-lockfile'], {
    cwd: rootDir,
    env: createYarnEnvironment(env),
  });
  await child.waitForExit();
  // A signal-terminated process has no exit code, so waitForExit resolves.
  if (child.signalCode) {
    throw new Error(`Yarn install was terminated by ${child.signalCode}`);
  }
}

function createYarnEnvironment(
  env: NodeJS.ProcessEnv | undefined,
): Partial<NodeJS.ProcessEnv> {
  return {
    ...Object.fromEntries(
      Object.entries(env ?? process.env).map(([name, value]) =>
        name.startsWith('npm_') ? [name, undefined] : [name, value],
      ),
    ),
    YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
    YARN_ENABLE_SCRIPTS: 'false',
  };
}

async function getYarnVersion(
  rootDir: string,
  env: NodeJS.ProcessEnv | undefined,
): Promise<string> {
  const stdoutChunks: Buffer[] = [];
  const child = run(['yarn', '--version'], {
    cwd: rootDir,
    env: createYarnEnvironment(env),
    onStdout: data => stdoutChunks.push(data),
  });
  await child.waitForExit();
  if (child.signalCode) {
    throw new Error(`Yarn version check was terminated by ${child.signalCode}`);
  }
  return Buffer.concat(stdoutChunks).toString().trim();
}

async function restoreOriginals(options: {
  manifestPath: string;
  lockfilePath: string;
  originalManifest: string;
  originalLockfile: string;
  writeFile: (filePath: string, content: string) => Promise<void>;
}): Promise<boolean> {
  let restored = true;
  for (const [filePath, content] of [
    [options.manifestPath, options.originalManifest],
    [options.lockfilePath, options.originalLockfile],
  ] as const) {
    try {
      await options.writeFile(filePath, content);
    } catch {
      restored = false;
    }
  }
  return restored;
}

/**
 * Attempts to repair forward-only Backstage patch holdbacks.
 *
 * @internal
 */
export async function fixYarnPatches(
  options: FixYarnPatchesOptions,
): Promise<FixYarnPatchesResult> {
  const rootDir = path.resolve(options.rootDir);
  const initialResult =
    options.verificationResult ?? (await verifyYarnPatches(options));
  const holdbacks = getRepairableHoldbacks(initialResult);
  if (!holdbacks) {
    return {
      status: 'not-fixable',
      message: 'No patch holdback could be repaired safely',
    };
  }

  const manifestPath = path.join(rootDir, 'package.json');
  const lockfilePath = path.join(rootDir, 'yarn.lock');
  const originalManifest = await fs.readFile(manifestPath, 'utf8');
  const originalLockfile = await fs.readFile(lockfilePath, 'utf8');
  const target = createTargetManifest({ originalManifest, holdbacks });
  if (!target) {
    return {
      status: 'not-fixable',
      message:
        'The patch resolutions changed or could not be retargeted safely',
    };
  }

  if (!options.install) {
    let reportedVersion: string;
    try {
      reportedVersion = await getYarnVersion(rootDir, options.env);
    } catch (error) {
      return {
        status: 'not-fixable',
        message: `Could not determine the repository Yarn version: ${String(
          error,
        )}`,
      };
    }
    const yarnVersion = semverUtils.clean(reportedVersion);
    if (
      !yarnVersion ||
      !semverUtils.satisfiesWithPrereleases(yarnVersion, '>=3.0.0')
    ) {
      return {
        status: 'not-fixable',
        message: `Automatic patch repair requires Yarn 3 or later, but the repository uses Yarn '${reportedVersion}'`,
      };
    }
  }

  const writeFile =
    options.writeFile ??
    ((filePath: string, content: string) => fs.writeFile(filePath, content));
  const install =
    options.install ?? ((dir: string) => defaultInstall(dir, options.env));
  const removedPatchFiles = new Map<string, string>();
  const restoreFailure = async (
    reason: string,
  ): Promise<FixYarnPatchesResult> => {
    let restored = await restoreOriginals({
      manifestPath,
      lockfilePath,
      originalManifest,
      originalLockfile,
      writeFile,
    });
    for (const [filePath, content] of removedPatchFiles) {
      try {
        await writeFile(filePath, content);
      } catch {
        restored = false;
      }
    }
    return {
      status: 'not-fixable',
      message: restored
        ? `${reason}; the original project files were restored`
        : `${reason}; project files may contain a partial repair`,
    };
  };

  const applyManifest = async (
    manifestContent: string,
  ): Promise<string | undefined> => {
    await writeFile(manifestPath, manifestContent);
    await install(rootDir);
    const finalManifest = await fs.readFile(manifestPath, 'utf8');
    if (finalManifest !== manifestContent) {
      return 'Yarn changed package.json unexpectedly';
    }
    const verified = await verifyYarnPatches({
      rootDir,
      env: options.env,
      fetch: options.fetch,
    });
    if (verified.errors.length > 0) {
      return `The repaired project did not pass patch verification: ${verified.errors
        .map(error => error.message)
        .join('; ')}`;
    }
    return undefined;
  };

  let retargetFailure: string;
  try {
    const failure = await applyManifest(target.content);
    if (!failure) {
      return { status: 'fixed', message: target.transitions.join('; ') };
    }
    retargetFailure = failure;
  } catch (error) {
    retargetFailure = `Yarn could not repair the patches: ${String(error)}`;
  }

  // Retargeting failed, which commonly happens when a patch was an early
  // backport of a change that has since been released. Check whether each
  // patch reverse-applies in full to the target version, and if so, drop it.
  try {
    const dropped = await findReleasedPatches({
      rootDir,
      holdbacks,
      originalManifest,
      writeFile,
      install,
      manifestPath,
      extractPackage:
        options.extractPackage ??
        (o => defaultExtractPackage({ ...o, env: options.env })),
      isPatchReverseApplicable:
        options.isPatchReverseApplicable ??
        (o => defaultIsPatchReverseApplicable({ ...o, env: options.env })),
    });
    if (dropped.length === 0) {
      return restoreFailure(retargetFailure);
    }

    const remaining = holdbacks.filter(h => !dropped.includes(h));
    const remainingTarget = createTargetManifest({
      originalManifest,
      holdbacks: remaining,
    });
    if (!remainingTarget) {
      return restoreFailure(retargetFailure);
    }
    const finalManifest = removeResolutions(
      remainingTarget.content,
      dropped.map(h => h.packageName),
    );
    for (const holdback of dropped) {
      const patchPath = holdback.declaration.paths[0].absolute;
      removedPatchFiles.set(patchPath, await fs.readFile(patchPath, 'utf8'));
      await fs.rm(patchPath);
    }
    const failure =
      (await applyManifest(finalManifest)) ??
      (await findOutdatedDroppedPackages(lockfilePath, dropped));
    if (failure) {
      return restoreFailure(`${retargetFailure}; ${failure}`);
    }
    return {
      status: 'fixed',
      message: [
        ...remainingTarget.transitions,
        ...dropped.map(
          h =>
            `Removed patch for '${h.packageName}' because it is already included in version '${h.targetVersion}' (deleted '${h.declaration.paths[0].relative}')`,
        ),
      ].join('; '),
    };
  } catch (error) {
    return restoreFailure(
      `${retargetFailure}; checking for released patches failed: ${String(
        error,
      )}`,
    );
  }
}

/**
 * Without its resolution, a dropped package goes back to the ranges its
 * dependents declare, which could select a version older than the one the
 * patch was checked against and that still lacks the change.
 */
async function findOutdatedDroppedPackages(
  lockfilePath: string,
  dropped: PatchHoldbackFix[],
): Promise<string | undefined> {
  const lockfile = parseSyml(await fs.readFile(lockfilePath, 'utf8'));
  const outdated = new Array<string>();
  for (const [key, entry] of Object.entries(lockfile)) {
    if (key === '__metadata' || typeof entry?.resolution !== 'string') {
      continue;
    }
    const locator = structUtils.parseLocator(entry.resolution, true);
    const holdback = dropped.find(
      h => h.packageName === structUtils.stringifyIdent(locator),
    );
    const version = semverUtils.clean(String(entry.version ?? ''));
    if (
      holdback &&
      (!version ||
        !semverUtils.satisfiesWithPrereleases(
          version,
          `>=${holdback.targetVersion}`,
        ))
    ) {
      outdated.push(
        `'${holdback.packageName}' resolved to '${entry.version}', which is older than '${holdback.targetVersion}'`,
      );
    }
  }
  if (outdated.length === 0) {
    return undefined;
  }
  return `Removing the patch resolutions selected versions that the patches were not checked against: ${outdated.join(
    '; ',
  )}`;
}

/**
 * Installs the unpatched target versions and returns the holdbacks whose
 * patch reverse-applies in full to them.
 */
async function findReleasedPatches(options: {
  rootDir: string;
  holdbacks: PatchHoldbackFix[];
  originalManifest: string;
  manifestPath: string;
  writeFile: (filePath: string, content: string) => Promise<void>;
  install: (rootDir: string) => Promise<void>;
  extractPackage: NonNullable<FixYarnPatchesOptions['extractPackage']>;
  isPatchReverseApplicable: NonNullable<
    FixYarnPatchesOptions['isPatchReverseApplicable']
  >;
}): Promise<PatchHoldbackFix[]> {
  const probe = createTargetManifest({
    originalManifest: options.originalManifest,
    holdbacks: options.holdbacks,
    unpatched: true,
  });
  if (!probe) {
    return [];
  }
  await options.writeFile(options.manifestPath, probe.content);
  await options.install(options.rootDir);

  const released: PatchHoldbackFix[] = [];
  for (const holdback of options.holdbacks) {
    // Rollback restores deleted patches by content, which would turn a
    // symbolic link into a regular file, so linked patches are never dropped
    const patchStat = await fs.lstat(holdback.declaration.paths[0].absolute);
    if (patchStat.isSymbolicLink()) {
      continue;
    }
    const packageDir = await options.extractPackage({
      rootDir: options.rootDir,
      packageName: holdback.packageName,
      version: holdback.targetVersion,
    });
    try {
      if (
        await options.isPatchReverseApplicable({
          patchPath: holdback.declaration.paths[0].absolute,
          packageDir,
        })
      ) {
        released.push(holdback);
      }
    } finally {
      await removeExtractedPackage(packageDir);
    }
  }
  return released;
}
