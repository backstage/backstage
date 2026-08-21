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

import { getPackages } from '@manypkg/get-packages';
import { Configuration, structUtils } from '@yarnpkg/core';
import type { PluginConfiguration } from '@yarnpkg/core';
import { npath } from '@yarnpkg/fslib';
import { parseSyml } from '@yarnpkg/parsers';
import patchPlugin from '@yarnpkg/plugin-patch';
import fs from 'node:fs/promises';
import path from 'node:path';

export type PatchVerificationErrorKind =
  | 'incompatible-patch-declarations'
  | 'lockfile-mismatch'
  | 'malformed-lockfile'
  | 'malformed-patch-reference'
  | 'missing-lockfile'
  | 'missing-patch-file'
  | 'orphaned-patch-file';

export type PatchVerificationError = {
  kind: PatchVerificationErrorKind;
  message: string;
  location?: string;
};

export type VerifyYarnPatchesOptions = {
  rootDir: string;
  env?: NodeJS.ProcessEnv;
  fetch?: typeof globalThis.fetch;
};

export type VerifyYarnPatchesResult = {
  patchCount: number;
  backstageCheck: 'verified' | 'skipped';
  errors: PatchVerificationError[];
};

type PatchDeclaration = {
  source: string;
  paths: LocalPatchPath[];
  location: string;
};

type LocalPatchPath = {
  absolute: string;
  relative: string;
};

const MANIFEST_FIELDS = [
  'resolutions',
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const;

const PATCH_PLUGIN_CONFIGURATION: PluginConfiguration = {
  modules: new Map([['@yarnpkg/plugin-patch', patchPlugin]]),
  plugins: new Set(['@yarnpkg/plugin-patch']),
};

// Yarn Configuration.find has no environment parameter and reads process.env.
// Serialize the narrow overlay so concurrent verifications cannot interleave.
let configurationEnvironmentQueue = Promise.resolve();

function relativePath(rootDir: string, targetPath: string): string {
  return path.relative(rootDir, targetPath).split(path.sep).join('/');
}

function compareStrings(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function sortErrors(
  errors: PatchVerificationError[],
): PatchVerificationError[] {
  return errors.sort((left, right) => {
    return (
      compareStrings(left.location ?? '', right.location ?? '') ||
      compareStrings(left.kind, right.kind) ||
      compareStrings(left.message, right.message)
    );
  });
}

function isErrorWithCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

function getPatchPathWithoutFlags(patchPath: string): string {
  const flagIndex = patchPath.lastIndexOf('!');
  return flagIndex === -1 ? patchPath : patchPath.slice(flagIndex + 1);
}

function isBuiltinPatchPath(patchPath: string): boolean {
  const pathWithoutFlags = getPatchPathWithoutFlags(patchPath);
  return (
    pathWithoutFlags.startsWith('builtin<') && pathWithoutFlags.endsWith('>')
  );
}

function getParentDirectory(
  rootDir: string,
  fallbackDir: string,
  locatorValue: unknown,
): string {
  if (typeof locatorValue !== 'string') {
    return fallbackDir;
  }

  const parentLocator = structUtils.parseLocator(locatorValue, true);
  const parentRange = structUtils.parseRange(parentLocator.reference);
  if (parentRange.protocol !== 'workspace:') {
    return fallbackDir;
  }

  return path.resolve(rootDir, parentRange.selector);
}

function resolvePatchPath(
  rootDir: string,
  parentDir: string,
  patchPath: string,
): LocalPatchPath | undefined {
  const pathWithoutFlags = getPatchPathWithoutFlags(patchPath);
  if (isBuiltinPatchPath(pathWithoutFlags)) {
    return undefined;
  }

  const absolute = pathWithoutFlags.startsWith('~/')
    ? path.resolve(rootDir, pathWithoutFlags.slice(2))
    : path.resolve(parentDir, pathWithoutFlags);
  return {
    absolute,
    relative: relativePath(rootDir, absolute),
  };
}

function parsePatchDeclaration(options: {
  rootDir: string;
  parentDir: string;
  range: string;
  location: string;
}): PatchDeclaration | undefined {
  const parsedRange = structUtils.parseRange(options.range, {
    requireProtocol: 'patch:',
    requireSource: true,
  });
  const sourceDescriptor = structUtils.parseDescriptor(
    parsedRange.source,
    true,
  );
  const source = structUtils.stringifyDescriptor(sourceDescriptor);
  const parentDir = getParentDirectory(
    options.rootDir,
    options.parentDir,
    parsedRange.params?.locator,
  );
  const paths = parsedRange.selector
    .split('&')
    .map(patchPath => resolvePatchPath(options.rootDir, parentDir, patchPath))
    .filter((patchPath): patchPath is LocalPatchPath => Boolean(patchPath));

  if (paths.length === 0) {
    return undefined;
  }

  return { source, paths, location: options.location };
}

function declarationKey(declaration: PatchDeclaration): string {
  return `${declaration.source}\0${declaration.paths
    .map(patchPath => patchPath.absolute)
    .join('\0')}`;
}

function declarationDescription(declaration: PatchDeclaration): string {
  return declaration.paths.map(patchPath => patchPath.relative).join(', ');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isYarnPluginsKey(key: string): boolean {
  return key.toLowerCase() === 'yarn_plugins';
}

function setEnvironmentValue(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

async function withConfigurationEnvironment<T>(
  env: NodeJS.ProcessEnv | undefined,
  action: () => Promise<T>,
): Promise<T> {
  const waitForTurn = configurationEnvironmentQueue;
  let releaseTurn = () => {};
  const turnComplete = new Promise<void>(resolve => {
    releaseTurn = resolve;
  });
  configurationEnvironmentQueue = waitForTurn.then(() => turnComplete);
  await waitForTurn;

  const environmentState = new Map<
    string,
    { previous: string | undefined; applied: string | undefined }
  >();

  try {
    const targetEnvironment = env ? { ...env } : undefined;
    if (targetEnvironment) {
      for (const key of Object.keys(targetEnvironment)) {
        if (isYarnPluginsKey(key)) {
          delete targetEnvironment[key];
        }
      }
    }

    const keysToScope = new Set(
      targetEnvironment
        ? [...Object.keys(process.env), ...Object.keys(env ?? {})]
        : Object.keys(process.env).filter(isYarnPluginsKey),
    );
    for (const key of keysToScope) {
      const previous = process.env[key];
      const applied = isYarnPluginsKey(key)
        ? undefined
        : targetEnvironment?.[key];
      environmentState.set(key, { previous, applied });
      setEnvironmentValue(key, applied);
    }

    return await action();
  } finally {
    for (const [key, { previous, applied }] of environmentState) {
      // Keep values changed by unrelated async work while Yarn was loading.
      if (process.env[key] === applied) {
        setEnvironmentValue(key, previous);
      }
    }
    releaseTurn();
  }
}

function arraysEqual(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function getBuiltinPatchPaths(range: string): string[] {
  const parsedRange = structUtils.parseRange(range, {
    requireProtocol: 'patch:',
    requireSource: true,
  });
  return parsedRange.selector.split('&').filter(isBuiltinPatchPath);
}

function patchDescriptorAgreesWithLocator(options: {
  descriptor: ReturnType<typeof structUtils.parseDescriptor>;
  descriptorDeclaration: PatchDeclaration | undefined;
  locator: ReturnType<typeof structUtils.parseLocator>;
  locatorDeclaration: PatchDeclaration | undefined;
}): boolean {
  if (!structUtils.areIdentsEqual(options.descriptor, options.locator)) {
    return false;
  }

  const descriptorRange = structUtils.parseRange(options.descriptor.range, {
    requireProtocol: 'patch:',
    requireSource: true,
  });
  const locatorRange = structUtils.parseRange(options.locator.reference, {
    requireProtocol: 'patch:',
    requireSource: true,
  });
  const sourceDescriptor = structUtils.parseDescriptor(
    descriptorRange.source,
    true,
  );
  const sourceLocator = structUtils.parseLocator(locatorRange.source, true);
  if (!structUtils.areIdentsEqual(sourceDescriptor, sourceLocator)) {
    return false;
  }

  const descriptorPaths =
    options.descriptorDeclaration?.paths.map(patchPath => patchPath.absolute) ??
    [];
  const locatorPaths =
    options.locatorDeclaration?.paths.map(patchPath => patchPath.absolute) ??
    [];
  return (
    arraysEqual(descriptorPaths, locatorPaths) &&
    arraysEqual(
      getBuiltinPatchPaths(options.descriptor.range),
      getBuiltinPatchPaths(options.locator.reference),
    )
  );
}

async function discoverManifestDeclarations(
  rootDir: string,
  errors: PatchVerificationError[],
): Promise<PatchDeclaration[]> {
  const { root, packages } = await getPackages(rootDir);
  const manifests = [
    root,
    ...packages.filter(packageEntry => packageEntry.dir !== root.dir),
  ];
  const declarations: PatchDeclaration[] = [];

  for (const manifest of manifests) {
    const manifestPath = relativePath(
      rootDir,
      path.join(manifest.dir, 'package.json'),
    );
    const manifestJson: Record<string, unknown> = manifest.packageJson;

    for (const field of MANIFEST_FIELDS) {
      const entries = manifestJson[field];
      if (typeof entries !== 'object' || entries === null) {
        continue;
      }

      for (const [name, range] of Object.entries(entries)) {
        if (typeof range !== 'string' || !range.startsWith('patch:')) {
          continue;
        }

        const location = `${manifestPath}#${field}.${name}`;
        try {
          const declaration = parsePatchDeclaration({
            rootDir,
            parentDir: manifest.dir,
            range,
            location,
          });
          if (declaration) {
            declarations.push(declaration);
          }
        } catch (error) {
          errors.push({
            kind: 'malformed-patch-reference',
            message: `Invalid patch reference for '${name}' in ${field}: ${String(
              error,
            )}`,
            location,
          });
        }
      }
    }
  }

  return declarations;
}

function discoverLockfileDeclarations(
  rootDir: string,
  lockfileContent: string,
  errors: PatchVerificationError[],
): PatchDeclaration[] {
  let lockfileData: Record<string, unknown>;
  try {
    lockfileData = parseSyml(lockfileContent);
  } catch (error) {
    errors.push({
      kind: 'malformed-lockfile',
      message: `Failed to parse yarn.lock: ${String(error)}`,
      location: 'yarn.lock',
    });
    return [];
  }

  const declarations: PatchDeclaration[] = [];
  for (const [key, lockfileEntry] of Object.entries(lockfileData)) {
    if (key === '__metadata') {
      continue;
    }

    const patchDescriptors: Array<{
      descriptor: ReturnType<typeof structUtils.parseDescriptor>;
      declaration: PatchDeclaration | undefined;
    }> = [];
    for (const entry of key.split(', ')) {
      try {
        const descriptor = structUtils.parseDescriptor(entry, true);
        if (!descriptor.range.startsWith('patch:')) {
          continue;
        }
        const declaration = parsePatchDeclaration({
          rootDir,
          parentDir: rootDir,
          range: descriptor.range,
          location: 'yarn.lock',
        });
        if (declaration) {
          declarations.push(declaration);
        }
        patchDescriptors.push({ descriptor, declaration });
      } catch (error) {
        errors.push({
          kind: 'malformed-lockfile',
          message: `Invalid patch entry '${entry}' in yarn.lock: ${String(
            error,
          )}`,
          location: 'yarn.lock',
        });
      }
    }

    if (patchDescriptors.length === 0) {
      continue;
    }

    const resolution = isRecord(lockfileEntry)
      ? lockfileEntry.resolution
      : undefined;
    if (typeof resolution !== 'string') {
      errors.push({
        kind: 'malformed-lockfile',
        message: `Patch entry '${key}' is missing its resolution locator`,
        location: 'yarn.lock',
      });
      continue;
    }

    try {
      const locator = structUtils.parseLocator(resolution, true);
      if (!locator.reference.startsWith('patch:')) {
        errors.push({
          kind: 'lockfile-mismatch',
          message: `Patch entry '${key}' disagrees with its resolution locator '${resolution}'`,
          location: 'yarn.lock',
        });
        continue;
      }
      const locatorDeclaration = parsePatchDeclaration({
        rootDir,
        parentDir: rootDir,
        range: locator.reference,
        location: 'yarn.lock',
      });
      if (
        patchDescriptors.some(
          ({ descriptor, declaration }) =>
            !patchDescriptorAgreesWithLocator({
              descriptor,
              descriptorDeclaration: declaration,
              locator,
              locatorDeclaration,
            }),
        )
      ) {
        errors.push({
          kind: 'lockfile-mismatch',
          message: `Patch entry '${key}' disagrees with its resolution locator '${resolution}'`,
          location: 'yarn.lock',
        });
      }
    } catch (error) {
      errors.push({
        kind: 'malformed-lockfile',
        message: `Patch entry '${key}' has an invalid resolution locator '${resolution}': ${String(
          error,
        )}`,
        location: 'yarn.lock',
      });
    }
  }

  return declarations;
}

async function readPatchFolder(
  rootDir: string,
  env: NodeJS.ProcessEnv | undefined,
): Promise<string> {
  return withConfigurationEnvironment(env, async () => {
    // Yarn still applies inherited rc files when useRc is false; this only
    // prevents project rc files from loading arbitrary third-party plugins.
    const configuration = await Configuration.find(
      npath.toPortablePath(rootDir),
      PATCH_PLUGIN_CONFIGURATION,
      {
        strict: false,
        useRc: false,
      },
    );
    return npath.fromPortablePath(configuration.get('patchFolder'));
  });
}

async function findPatchFiles(directory: string): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isErrorWithCode(error, 'ENOENT')) {
      return [];
    }
    throw error;
  }

  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return findPatchFiles(entryPath);
      }
      return entry.isFile() && entry.name.endsWith('.patch') ? [entryPath] : [];
    }),
  );
  return files.flat().sort();
}

function uniqueDeclarations(
  declarations: PatchDeclaration[],
): Map<string, PatchDeclaration> {
  const unique = new Map<string, PatchDeclaration>();
  for (const declaration of declarations) {
    const key = declarationKey(declaration);
    if (!unique.has(key)) {
      unique.set(key, declaration);
    }
  }
  return unique;
}

export async function verifyYarnPatches(
  options: VerifyYarnPatchesOptions,
): Promise<VerifyYarnPatchesResult> {
  const rootDir = path.resolve(options.rootDir);
  const errors: PatchVerificationError[] = [];
  const manifestDeclarations = await discoverManifestDeclarations(
    rootDir,
    errors,
  );
  const uniqueManifestDeclarations = uniqueDeclarations(manifestDeclarations);
  const referencedPatchFiles = new Map<string, LocalPatchPath>();
  const sourcesByPatchFile = new Map<string, Set<string>>();

  for (const declaration of uniqueManifestDeclarations.values()) {
    for (const patchPath of declaration.paths) {
      referencedPatchFiles.set(patchPath.absolute, patchPath);
      let sources = sourcesByPatchFile.get(patchPath.absolute);
      if (!sources) {
        sources = new Set();
        sourcesByPatchFile.set(patchPath.absolute, sources);
      }
      sources.add(declaration.source);
    }
  }

  for (const [absolute, patchPath] of referencedPatchFiles) {
    try {
      await fs.access(absolute);
    } catch (error) {
      if (!isErrorWithCode(error, 'ENOENT')) {
        throw error;
      }
      errors.push({
        kind: 'missing-patch-file',
        message: `Patch file '${patchPath.relative}' does not exist`,
        location: patchPath.relative,
      });
    }
  }

  for (const [absolute, sources] of sourcesByPatchFile) {
    if (sources.size <= 1) {
      continue;
    }
    const patchPath = referencedPatchFiles.get(absolute);
    if (!patchPath) {
      continue;
    }
    const sortedSources = [...sources].sort();
    errors.push({
      kind: 'incompatible-patch-declarations',
      message: `Patch file '${
        patchPath.relative
      }' is used for incompatible sources: ${sortedSources
        .map(source => `'${source}'`)
        .join(', ')}`,
      location: patchPath.relative,
    });
  }

  const patchFolder = await readPatchFolder(rootDir, options.env);
  const patchFiles = await findPatchFiles(patchFolder);
  for (const patchFile of patchFiles) {
    if (!referencedPatchFiles.has(patchFile)) {
      const relative = relativePath(rootDir, patchFile);
      errors.push({
        kind: 'orphaned-patch-file',
        message: `Patch file '${relative}' is not referenced by any manifest`,
        location: relative,
      });
    }
  }

  let lockfileContent: string | undefined;
  try {
    lockfileContent = await fs.readFile(
      path.join(rootDir, 'yarn.lock'),
      'utf8',
    );
  } catch (error) {
    if (!isErrorWithCode(error, 'ENOENT')) {
      throw error;
    }
    errors.push({
      kind: 'missing-lockfile',
      message: 'No yarn.lock found',
      location: 'yarn.lock',
    });
  }

  if (lockfileContent !== undefined) {
    const lockfileDeclarations = uniqueDeclarations(
      discoverLockfileDeclarations(rootDir, lockfileContent, errors),
    );

    for (const [key, declaration] of uniqueManifestDeclarations) {
      if (!lockfileDeclarations.has(key)) {
        errors.push({
          kind: 'lockfile-mismatch',
          message: `Patch declaration for '${
            declaration.source
          }' using '${declarationDescription(
            declaration,
          )}' is missing from yarn.lock`,
          location: declaration.location,
        });
      }
    }

    for (const [key, declaration] of lockfileDeclarations) {
      if (!uniqueManifestDeclarations.has(key)) {
        errors.push({
          kind: 'lockfile-mismatch',
          message: `yarn.lock contains patch declaration for '${
            declaration.source
          }' using '${declarationDescription(
            declaration,
          )}' that is absent from manifests`,
          location: 'yarn.lock',
        });
      }
    }
  }

  return {
    patchCount: referencedPatchFiles.size,
    backstageCheck: 'skipped',
    errors: sortErrors(errors),
  };
}
