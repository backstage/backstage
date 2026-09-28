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
import { isDeepStrictEqual } from 'node:util';
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
};

export type FixYarnPatchesResult = {
  status: 'fixed' | 'not-fixable';
  message: string;
};

function compareStrings(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

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
      targetReference = createRetargetedPatchReference({
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

function lockfileOnlyChangesRepairs(options: {
  before: string;
  after: string;
  holdbacks: PatchHoldbackFix[];
}): boolean {
  const targetDescriptors = options.holdbacks.map(holdback => {
    const ident = structUtils.parseIdent(holdback.packageName);
    const expectedPatchPaths = patchUtils.parseDescriptor(
      structUtils.makeDescriptor(ident, holdback.declaration.reference),
    ).patchPaths;
    return (descriptorText: string) => {
      try {
        const descriptor = structUtils.parseDescriptor(descriptorText, true);
        if (structUtils.stringifyIdent(descriptor) !== holdback.packageName) {
          return false;
        }
        const range = structUtils.parseRange(descriptor.range);
        if (range.protocol === 'npm:') {
          return (
            range.selector === holdback.currentVersion ||
            range.selector === holdback.targetVersion
          );
        }
        if (!patchUtils.isPatchDescriptor(descriptor)) {
          return false;
        }
        const parsed = patchUtils.parseDescriptor(descriptor);
        const sourceRange = structUtils.parseRange(
          parsed.sourceDescriptor.range,
        );
        return (
          structUtils.stringifyIdent(parsed.sourceDescriptor) ===
            holdback.packageName &&
          sourceRange.protocol === 'npm:' &&
          (sourceRange.selector === holdback.currentVersion ||
            sourceRange.selector === holdback.targetVersion) &&
          isDeepStrictEqual(parsed.patchPaths, expectedPatchPaths)
        );
      } catch {
        return false;
      }
    };
  });
  const isTargetDescriptor = (descriptor: string) =>
    targetDescriptors.some(predicate => predicate(descriptor));
  const before = parseSyml(options.before);
  const after = parseSyml(options.after);

  const dependencyRanges = (lockfile: Record<string, unknown>) => {
    const ranges = new Map<string, string>();
    for (const [key, value] of Object.entries(lockfile)) {
      if (
        !key.split(', ').some(isTargetDescriptor) ||
        !isRecord(value) ||
        !isRecord(value.dependencies)
      ) {
        continue;
      }
      for (const [name, range] of Object.entries(value.dependencies)) {
        if (typeof range === 'string') {
          ranges.set(name, range);
        }
      }
    }
    return ranges;
  };
  const beforeDependencies = dependencyRanges(before);
  const afterDependencies = dependencyRanges(after);
  const changedDependencyDescriptors = new Set<string>();
  for (const name of new Set([
    ...beforeDependencies.keys(),
    ...afterDependencies.keys(),
  ])) {
    const beforeRange = beforeDependencies.get(name);
    const afterRange = afterDependencies.get(name);
    if (beforeRange === afterRange) {
      continue;
    }
    for (const range of [beforeRange, afterRange]) {
      if (range) {
        changedDependencyDescriptors.add(
          structUtils.stringifyDescriptor(
            structUtils.makeDescriptor(structUtils.parseIdent(name), range),
          ),
        );
      }
    }
  }

  const normalize = (lockfile: Record<string, unknown>) =>
    Object.entries(lockfile)
      .flatMap(([key, value]) => {
        const normalizedKey = key
          .split(', ')
          .filter(
            descriptor =>
              !isTargetDescriptor(descriptor) &&
              !changedDependencyDescriptors.has(descriptor),
          )
          .join(', ');
        return normalizedKey
          ? [{ key: normalizedKey, value, serialized: JSON.stringify(value) }]
          : [];
      })
      .sort(
        (left, right) =>
          compareStrings(left.key, right.key) ||
          compareStrings(left.serialized, right.serialized),
      )
      .map(({ key, value }) => [key, value] as const);

  return isDeepStrictEqual(normalize(before), normalize(after));
}

async function defaultInstall(
  rootDir: string,
  env: NodeJS.ProcessEnv | undefined,
): Promise<void> {
  const child = run(['yarn', 'install', '--mode=update-lockfile'], {
    cwd: rootDir,
    env: {
      ...Object.fromEntries(
        Object.entries(env ?? process.env).map(([name, value]) =>
          name.startsWith('npm_') ? [name, undefined] : [name, value],
        ),
      ),
      YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
      YARN_ENABLE_SCRIPTS: 'false',
    },
  });
  await child.waitForExit();
  if (child.signalCode) {
    throw new Error(`Yarn install was terminated by ${child.signalCode}`);
  }
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
      restored &&= (await fs.readFile(filePath, 'utf8')) === content;
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

  const writeFile =
    options.writeFile ??
    ((filePath: string, content: string) => fs.writeFile(filePath, content));
  const restoreFailure = async (
    reason: string,
  ): Promise<FixYarnPatchesResult> => {
    const restored = await restoreOriginals({
      manifestPath,
      lockfilePath,
      originalManifest,
      originalLockfile,
      writeFile,
    });
    return {
      status: 'not-fixable',
      message: restored
        ? `${reason}; the original project files were restored`
        : `${reason}; project files may contain a partial repair`,
    };
  };

  try {
    await writeFile(manifestPath, target.content);
    await (options.install ?? (dir => defaultInstall(dir, options.env)))(
      rootDir,
    );
    const finalManifest = await fs.readFile(manifestPath, 'utf8');
    const finalLockfile = await fs.readFile(lockfilePath, 'utf8');
    const verified = await verifyYarnPatches({
      rootDir,
      env: options.env,
      fetch: options.fetch,
    });
    if (finalManifest !== target.content) {
      return restoreFailure('Yarn changed package.json unexpectedly');
    }
    if (verified.errors.length > 0) {
      return restoreFailure(
        `The repaired project did not pass patch verification: ${verified.errors
          .map(error => error.message)
          .join('; ')}`,
      );
    }
    if (
      !lockfileOnlyChangesRepairs({
        before: originalLockfile,
        after: finalLockfile,
        holdbacks,
      })
    ) {
      return restoreFailure('Yarn produced unrelated lockfile changes');
    }
    return { status: 'fixed', message: target.transitions.join('; ') };
  } catch (error) {
    return restoreFailure(
      `Yarn could not repair the patches: ${String(error)}`,
    );
  }
}
