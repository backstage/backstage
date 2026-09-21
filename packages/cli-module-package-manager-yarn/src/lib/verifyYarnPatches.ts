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

import {
  getManifestByVersion,
  type ReleaseManifest,
} from '@backstage/release-manifests';
import {
  Configuration,
  httpUtils,
  semverUtils,
  structUtils,
} from '@yarnpkg/core';
import { Project, TAG_REGEXP, Workspace } from '@yarnpkg/core';
import type { Descriptor, PluginConfiguration } from '@yarnpkg/core';
import { npath, ppath } from '@yarnpkg/fslib';
import { parseResolution, parseSyml } from '@yarnpkg/parsers';
import patchPlugin, { patchUtils } from '@yarnpkg/plugin-patch';
import { run } from '@backstage/cli-common';
import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import properLockfile from 'proper-lockfile';

export type PatchVerificationErrorKind =
  | 'backstage-manifest-load-failure'
  | 'backstage-package-missing'
  | 'backstage-patch-holdback'
  | 'incompatible-patch-declarations'
  | 'lockfile-mismatch'
  | 'malformed-lockfile'
  | 'malformed-patch-reference'
  | 'missing-lockfile'
  | 'missing-patch-file'
  | 'orphaned-patch-file'
  | 'unused-resolution';

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
  patchedIdent: string;
  reference: string;
  source: string;
  resolvedSource?: string;
  components: string[];
  parentLocator?: string;
  canMatchManifest: boolean;
  projectOwned: boolean;
  paths: LocalPatchPath[];
  location: string;
};

type LocalPatchPath = {
  absolute: string;
  relative: string;
};

type PatchedBackstagePackage = {
  name: string;
  version: string;
  location: string;
  declaration: PatchDeclaration;
};

type PatchHoldbackFix = {
  packageName: string;
  currentVersion: string;
  targetVersion: string;
  declaration: PatchDeclaration;
};

const patchHoldbackFixes = new WeakMap<
  PatchVerificationError,
  PatchHoldbackFix
>();

type ResolutionDeclaration = {
  pattern: string;
  location: string;
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
  if (patchPath.startsWith('~builtin<')) {
    return patchPath.slice(1);
  }
  const flagIndex = patchPath.lastIndexOf('!');
  return flagIndex === -1 ? patchPath : patchPath.slice(flagIndex + 1);
}

function isBuiltinPatchPath(patchPath: string): boolean {
  const pathWithoutFlags = getPatchPathWithoutFlags(patchPath);
  return (
    pathWithoutFlags.startsWith('builtin<') && pathWithoutFlags.endsWith('>')
  );
}

type PatchParent = {
  directory?: string;
  locator?: string;
};

function getPatchParent(
  rootDir: string,
  fallbackDir: string,
  locatorValue: unknown,
): PatchParent {
  if (typeof locatorValue !== 'string') {
    return { directory: fallbackDir };
  }

  const parentLocator = structUtils.parseLocator(locatorValue, true);
  const locator = structUtils.stringifyLocator(parentLocator);
  const parentRange = structUtils.parseRange(parentLocator.reference);
  if (parentRange.protocol !== 'workspace:') {
    return { locator };
  }

  return {
    directory: path.resolve(rootDir, parentRange.selector),
    locator,
  };
}

function resolvePatchPath(
  rootDir: string,
  parentDir: string | undefined,
  patchPath: string,
): LocalPatchPath | undefined {
  const pathWithoutFlags = getPatchPathWithoutFlags(patchPath);
  if (isBuiltinPatchPath(pathWithoutFlags)) {
    return undefined;
  }

  const portablePatchPath = npath.toPortablePath(pathWithoutFlags);
  let absolute: string | undefined;
  if (pathWithoutFlags.startsWith('~/')) {
    absolute = path.resolve(rootDir, pathWithoutFlags.slice(2));
  } else if (ppath.isAbsolute(portablePatchPath)) {
    absolute = npath.fromPortablePath(portablePatchPath);
  } else if (parentDir !== undefined) {
    absolute = path.resolve(parentDir, pathWithoutFlags);
  }
  if (absolute === undefined) {
    return undefined;
  }
  return {
    absolute,
    relative: relativePath(rootDir, absolute),
  };
}

function parsePatchDeclaration(options: {
  rootDir: string;
  parentDir: string;
  parentLocator?: string;
  patchedIdent: string;
  range: string;
  location: string;
  origin: 'manifest' | 'lockfile';
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
  const parent = getPatchParent(
    options.rootDir,
    options.parentDir,
    parsedRange.params?.locator,
  );
  const paths: LocalPatchPath[] = [];
  let hasDependencyOwnedPath = false;
  let hasProjectRelativePath = false;
  const patchPaths =
    parsedRange.selector === '' ? [] : parsedRange.selector.split('&');
  const components = patchPaths.map(patchPath => {
    const flagIndex = patchPath.lastIndexOf('!');
    const flags = flagIndex === -1 ? '' : patchPath.slice(0, flagIndex + 1);
    const pathWithoutFlags = getPatchPathWithoutFlags(patchPath);
    if (isBuiltinPatchPath(patchPath)) {
      return patchPath;
    }

    const localPath = resolvePatchPath(
      options.rootDir,
      parent.directory,
      patchPath,
    );
    if (localPath) {
      paths.push(localPath);
      if (
        !pathWithoutFlags.startsWith('~/') &&
        !ppath.isAbsolute(npath.toPortablePath(pathWithoutFlags))
      ) {
        hasProjectRelativePath = true;
      }
      return `${flags}local<${localPath.absolute}>`;
    }
    hasDependencyOwnedPath = true;
    return `${flags}relative<${pathWithoutFlags}>`;
  });

  if (components.length === 0) {
    return undefined;
  }

  return {
    patchedIdent: options.patchedIdent,
    reference: options.range,
    source,
    components,
    parentLocator:
      parent.locator ??
      (hasProjectRelativePath ? options.parentLocator : undefined),
    canMatchManifest: !hasDependencyOwnedPath,
    projectOwned:
      paths.length > 0 ||
      (options.origin === 'manifest' && !hasDependencyOwnedPath),
    paths,
    location: options.location,
  };
}

function declarationKey(declaration: PatchDeclaration): string {
  return `${declaration.parentLocator ?? ''}\0${declaration.patchedIdent}\0${
    declaration.source
  }\0${declaration.components.join('\0')}`;
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

function getNpmResolutionRange(
  range: ReturnType<typeof structUtils.parseRange>,
): string | undefined {
  if (
    range.protocol === 'npm:' &&
    semverUtils.validRange(range.selector) !== null
  ) {
    return range.selector;
  }

  const npmVersion = range.params?.npm;
  if (
    range.protocol === 'backstage:' &&
    range.selector === '^' &&
    typeof npmVersion === 'string' &&
    semverUtils.clean(npmVersion) !== null
  ) {
    return `^${npmVersion}`;
  }

  return undefined;
}

function normalizeNpmAliasSource(descriptor: Descriptor): Descriptor {
  const range = structUtils.parseRange(descriptor.range);
  if (range.protocol !== 'npm:') {
    return descriptor;
  }

  const aliasTarget = structUtils.tryParseDescriptor(range.selector, true);
  if (!aliasTarget) {
    return descriptor;
  }

  const aliasTargetRange = structUtils.parseRange(aliasTarget.range);
  return aliasTargetRange.protocol === null
    ? structUtils.makeDescriptor(aliasTarget, `npm:${aliasTarget.range}`)
    : aliasTarget;
}

function npmSourceAgrees(
  descriptorRange: ReturnType<typeof structUtils.parseRange>,
  locatorRange: ReturnType<typeof structUtils.parseRange>,
): boolean | undefined {
  if (locatorRange.protocol !== 'npm:') {
    return undefined;
  }

  const resolvedVersion = semverUtils.clean(locatorRange.selector);
  if (resolvedVersion === null) {
    return false;
  }

  const resolutionRange = getNpmResolutionRange(descriptorRange);
  if (resolutionRange !== undefined) {
    return semverUtils.satisfiesWithPrereleases(
      resolvedVersion,
      resolutionRange,
    );
  }

  return descriptorRange.protocol === 'npm:'
    ? TAG_REGEXP.test(descriptorRange.selector)
    : undefined;
}

function nonNpmSourceAgrees(
  descriptorRange: ReturnType<typeof structUtils.parseRange>,
  locatorRange: ReturnType<typeof structUtils.parseRange>,
): boolean {
  if (descriptorRange.protocol !== locatorRange.protocol) {
    return false;
  }

  if (descriptorRange.protocol === 'workspace:') {
    const selector = descriptorRange.selector;
    if (
      selector === '*' ||
      selector === '^' ||
      selector === '~' ||
      semverUtils.validRange(selector) !== null
    ) {
      return true;
    }
  }

  const descriptorIdentity = descriptorRange.source ?? descriptorRange.selector;
  const locatorIdentity = locatorRange.source ?? locatorRange.selector;
  if (descriptorIdentity !== locatorIdentity) {
    return false;
  }

  const descriptorParent = descriptorRange.params?.locator;
  if (
    typeof descriptorParent === 'string' &&
    descriptorParent !== locatorRange.params?.locator
  ) {
    return false;
  }

  if (
    descriptorRange.source !== null &&
    descriptorRange.selector.startsWith('commit=')
  ) {
    return descriptorRange.selector === locatorRange.selector;
  }

  return true;
}

function patchDescriptorAgreesWithLocator(options: {
  configuration: Configuration;
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
  const sourceDescriptor = normalizeNpmAliasSource(
    options.configuration.normalizeDependency(
      structUtils.parseDescriptor(descriptorRange.source, true),
    ),
  );
  const sourceLocator = structUtils.parseLocator(locatorRange.source, true);
  if (!structUtils.areIdentsEqual(sourceDescriptor, sourceLocator)) {
    return false;
  }

  const descriptorSourceRange = structUtils.parseRange(sourceDescriptor.range);
  const locatorSourceRange = structUtils.parseRange(sourceLocator.reference);
  const npmAgreement = npmSourceAgrees(
    descriptorSourceRange,
    locatorSourceRange,
  );
  if (
    npmAgreement === false ||
    (npmAgreement === undefined &&
      !nonNpmSourceAgrees(descriptorSourceRange, locatorSourceRange))
  ) {
    return false;
  }

  return (
    options.descriptorDeclaration?.parentLocator ===
      options.locatorDeclaration?.parentLocator &&
    arraysEqual(
      options.descriptorDeclaration?.components ?? [],
      options.locatorDeclaration?.components ?? [],
    )
  );
}

async function discoverManifestDeclarations(
  rootDir: string,
  configuration: Configuration,
  errors: PatchVerificationError[],
): Promise<{
  patchDeclarations: PatchDeclaration[];
  resolutionDeclarations: ResolutionDeclaration[];
}> {
  const project = new Project(npath.toPortablePath(rootDir), { configuration });
  const pendingWorkspaces = [npath.toPortablePath(rootDir)];
  const visitedWorkspaces = new Set<string>();
  const patchDeclarations: PatchDeclaration[] = [];
  const resolutionDeclarations: ResolutionDeclaration[] = [];

  while (pendingWorkspaces.length > 0) {
    const workspaceCwd = pendingWorkspaces.shift();
    if (workspaceCwd === undefined || visitedWorkspaces.has(workspaceCwd)) {
      continue;
    }
    visitedWorkspaces.add(workspaceCwd);

    const workspace = new Workspace(workspaceCwd, { project });
    await workspace.setup();
    pendingWorkspaces.push(...workspace.workspacesCwds);

    const manifestDir = npath.fromPortablePath(workspace.cwd);
    const manifestPath = relativePath(
      rootDir,
      path.join(manifestDir, 'package.json'),
    );
    const manifestJson: Record<string, unknown> = workspace.manifest.raw;
    const parentLocator = structUtils.stringifyLocator(
      workspace.anchoredLocator,
    );

    for (const field of MANIFEST_FIELDS) {
      const entries = manifestJson[field];
      if (typeof entries !== 'object' || entries === null) {
        continue;
      }

      for (const [name, range] of Object.entries(entries)) {
        if (
          field === 'resolutions' &&
          workspace.cwd === project.cwd &&
          typeof range === 'string'
        ) {
          resolutionDeclarations.push({
            pattern: name,
            location: `${manifestPath}#${field}.${name}`,
          });
        }
        if (typeof range !== 'string' || !range.startsWith('patch:')) {
          continue;
        }

        const location = `${manifestPath}#${field}.${name}`;
        try {
          const declaration = parsePatchDeclaration({
            rootDir,
            parentDir: manifestDir,
            parentLocator,
            patchedIdent:
              field === 'resolutions'
                ? parseResolution(name).descriptor.fullName
                : structUtils.stringifyIdent(structUtils.parseIdent(name)),
            range,
            location,
            origin: 'manifest',
          });
          if (declaration) {
            patchDeclarations.push(declaration);
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

  return { patchDeclarations, resolutionDeclarations };
}

function parseLockfile(
  lockfileContent: string,
  errors: PatchVerificationError[],
): Record<string, unknown> | undefined {
  try {
    return parseSyml(lockfileContent);
  } catch (error) {
    errors.push({
      kind: 'malformed-lockfile',
      message: `Failed to parse yarn.lock: ${String(error)}`,
      location: 'yarn.lock',
    });
    return undefined;
  }
}

function discoverLockfileDeclarations(
  rootDir: string,
  configuration: Configuration,
  lockfileData: Record<string, unknown>,
  errors: PatchVerificationError[],
): PatchDeclaration[] {
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
          patchedIdent: structUtils.stringifyIdent(descriptor),
          range: descriptor.range,
          location: 'yarn.lock',
          origin: 'lockfile',
        });
        if (declaration?.canMatchManifest) {
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
        patchedIdent: structUtils.stringifyIdent(locator),
        range: locator.reference,
        location: 'yarn.lock',
        origin: 'lockfile',
      });
      const locatorRange = structUtils.parseRange(locator.reference, {
        requireProtocol: 'patch:',
        requireSource: true,
      });
      const resolvedSource = structUtils.stringifyLocator(
        structUtils.parseLocator(locatorRange.source, true),
      );
      for (const { declaration } of patchDescriptors) {
        if (declaration) {
          declaration.resolvedSource = resolvedSource;
        }
      }
      if (
        patchDescriptors.some(
          ({ descriptor, declaration }) =>
            !patchDescriptorAgreesWithLocator({
              configuration,
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

function getLockfileLocator(
  lockfileEntry: Record<string, unknown>,
  configuration: Configuration,
): ReturnType<typeof structUtils.parseLocator> | undefined {
  if (typeof lockfileEntry.resolution !== 'string') {
    return undefined;
  }
  try {
    return configuration.normalizeLocator(
      structUtils.parseLocator(lockfileEntry.resolution, true),
    );
  } catch {
    return undefined;
  }
}

function resolutionMatchesDependency(options: {
  resolution: ReturnType<typeof parseResolution>;
  dependencyName: string;
  dependencyRange: string;
  parentLocator: ReturnType<typeof structUtils.parseLocator> | undefined;
  configuration: Configuration;
}): boolean {
  const { resolution, configuration, parentLocator } = options;
  if (resolution.from) {
    if (
      parentLocator === undefined ||
      resolution.from.fullName !== structUtils.stringifyIdent(parentLocator)
    ) {
      return false;
    }
    const normalizedFrom = configuration.normalizeLocator(
      structUtils.makeLocator(
        structUtils.parseIdent(resolution.from.fullName),
        resolution.from.description ?? parentLocator.reference,
      ),
    );
    if (normalizedFrom.locatorHash !== parentLocator.locatorHash) {
      return false;
    }
  }

  const dependency = configuration.normalizeDependency(
    structUtils.makeDescriptor(
      structUtils.parseIdent(options.dependencyName),
      options.dependencyRange,
    ),
  );
  if (
    resolution.descriptor.fullName !== structUtils.stringifyIdent(dependency)
  ) {
    return false;
  }
  const normalizedDescriptor = configuration.normalizeDependency(
    structUtils.makeDescriptor(
      structUtils.parseIdent(resolution.descriptor.fullName),
      resolution.descriptor.description ?? dependency.range,
    ),
  );
  return normalizedDescriptor.descriptorHash === dependency.descriptorHash;
}

function validateResolutions(options: {
  declarations: ResolutionDeclaration[];
  lockfileData: Record<string, unknown>;
  configuration: Configuration;
}): {
  errors: PatchVerificationError[];
  unusedLocations: Set<string>;
} {
  const lockfileEntries = Object.entries(options.lockfileData)
    .filter(([key, value]) => key !== '__metadata' && isRecord(value))
    .map(([, value]) => ({
      entry: value as Record<string, unknown>,
      parentLocator: getLockfileLocator(
        value as Record<string, unknown>,
        options.configuration,
      ),
    }));
  const hasRootWorkspace = lockfileEntries.some(
    ({ parentLocator }) => parentLocator?.reference === 'workspace:.',
  );
  // Without the root workspace entry, the lockfile does not contain the
  // complete project dependency graph, so absence cannot prove that a
  // resolution is unused.
  if (!hasRootWorkspace) {
    return { errors: [], unusedLocations: new Set() };
  }

  const errors: PatchVerificationError[] = [];
  const unusedLocations = new Set<string>();
  for (const declaration of options.declarations) {
    let resolution;
    try {
      resolution = parseResolution(declaration.pattern);
    } catch {
      continue;
    }

    const matches = lockfileEntries.some(({ entry, parentLocator }) => {
      return ['dependencies', 'optionalDependencies'].some(field => {
        const dependencies = entry[field];
        if (!isRecord(dependencies)) {
          return false;
        }
        return Object.entries(dependencies).some(
          ([dependencyName, dependencyRange]) => {
            if (typeof dependencyRange !== 'string') {
              return false;
            }
            try {
              return resolutionMatchesDependency({
                resolution,
                dependencyName,
                dependencyRange,
                parentLocator,
                configuration: options.configuration,
              });
            } catch {
              return false;
            }
          },
        );
      });
    });
    if (!matches) {
      unusedLocations.add(declaration.location);
      errors.push({
        kind: 'unused-resolution',
        message: `Resolution '${declaration.pattern}' does not match any dependency request in yarn.lock`,
        location: declaration.location,
      });
    }
  }
  return { errors, unusedLocations };
}

async function readYarnConfiguration(
  rootDir: string,
  env: NodeJS.ProcessEnv | undefined,
): Promise<Configuration> {
  return withConfigurationEnvironment(env, async () => {
    // Yarn still applies inherited rc files when useRc is false; this only
    // prevents project rc files from loading arbitrary third-party plugins.
    return Configuration.find(
      npath.toPortablePath(rootDir),
      PATCH_PLUGIN_CONFIGURATION,
      {
        strict: false,
        useRc: false,
      },
    );
  });
}

async function findPatchFiles(
  directory: string,
  realpathAncestry: ReadonlySet<string> = new Set(),
): Promise<string[]> {
  let realDirectory;
  try {
    realDirectory = await fs.realpath(directory);
  } catch (error) {
    if (isErrorWithCode(error, 'ENOENT')) {
      return [];
    }
    throw error;
  }
  if (realpathAncestry.has(realDirectory)) {
    return [];
  }
  const nextAncestry = new Set(realpathAncestry).add(realDirectory);

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
        return findPatchFiles(entryPath, nextAncestry);
      }
      if (entry.isSymbolicLink()) {
        try {
          const targetStats = await fs.stat(entryPath);
          if (targetStats.isDirectory()) {
            return findPatchFiles(entryPath, nextAncestry);
          }
        } catch (error) {
          if (!isErrorWithCode(error, 'ENOENT')) {
            throw error;
          }
        }
        return [entryPath];
      }
      return entry.isFile() ? [entryPath] : [];
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

function getPatchedBackstagePackages(
  declarations: Iterable<PatchDeclaration>,
): PatchedBackstagePackage[] {
  const packages: PatchedBackstagePackage[] = [];
  for (const declaration of declarations) {
    const declaredSource = normalizeNpmAliasSource(
      structUtils.parseDescriptor(declaration.source, true),
    );
    const resolvedSource = declaration.resolvedSource;
    const source = resolvedSource
      ? structUtils.parseLocator(resolvedSource, true)
      : declaredSource;
    if (source.scope !== 'backstage') {
      continue;
    }
    const range = structUtils.parseRange(
      'reference' in source ? source.reference : source.range,
    );
    if (
      range.protocol !== 'npm:' ||
      semverUtils.clean(range.selector) === null
    ) {
      continue;
    }
    packages.push({
      name: structUtils.stringifyIdent(source),
      version: range.selector,
      location: declaration.location,
      declaration,
    });
  }
  return packages;
}

function isReleaseManifest(value: unknown): value is ReleaseManifest {
  return (
    isRecord(value) &&
    typeof value.releaseVersion === 'string' &&
    Array.isArray(value.packages) &&
    value.packages.every(
      packageEntry =>
        isRecord(packageEntry) &&
        typeof packageEntry.name === 'string' &&
        typeof packageEntry.version === 'string',
    )
  );
}

async function readBackstageVersion(
  rootDir: string,
): Promise<string | undefined> {
  try {
    const backstageJson: unknown = JSON.parse(
      await fs.readFile(path.join(rootDir, 'backstage.json'), 'utf8'),
    );
    if (!isRecord(backstageJson) || typeof backstageJson.version !== 'string') {
      throw new Error(
        "backstage.json must contain a string 'version' property",
      );
    }
    return backstageJson.version;
  } catch (error) {
    if (isErrorWithCode(error, 'ENOENT')) {
      return undefined;
    }
    throw error;
  }
}

async function loadReleaseManifest(options: {
  backstageVersion: string;
  configuration: Configuration;
  env: NodeJS.ProcessEnv | undefined;
  fetch: typeof globalThis.fetch | undefined;
}): Promise<ReleaseManifest> {
  const manifestFile = options.env?.BACKSTAGE_MANIFEST_FILE;
  const fetch =
    options.fetch ??
    (async (url: string) => {
      const manifest = await httpUtils.get(url, {
        configuration: options.configuration,
        jsonResponse: true,
      });
      return {
        status: 200,
        url,
        json: async () => manifest,
      };
    });
  const manifest: unknown = manifestFile
    ? JSON.parse(await fs.readFile(manifestFile, 'utf8'))
    : await getManifestByVersion({
        version: options.backstageVersion,
        versionsBaseUrl: options.env?.BACKSTAGE_VERSIONS_BASE_URL,
        fetch,
      });
  if (!isReleaseManifest(manifest)) {
    throw new Error('Backstage release manifest has an invalid format');
  }
  if (manifest.releaseVersion !== options.backstageVersion) {
    throw new Error(
      `Backstage release manifest version '${manifest.releaseVersion}' does not match selected version '${options.backstageVersion}'`,
    );
  }
  return manifest;
}

async function validateBackstagePatches(options: {
  rootDir: string;
  declarations: Iterable<PatchDeclaration>;
  configuration: Configuration;
  env: NodeJS.ProcessEnv | undefined;
  fetch: typeof globalThis.fetch | undefined;
}): Promise<{
  backstageCheck: VerifyYarnPatchesResult['backstageCheck'];
  errors: PatchVerificationError[];
}> {
  const patchedPackages = getPatchedBackstagePackages(options.declarations);
  if (patchedPackages.length === 0) {
    return { backstageCheck: 'skipped', errors: [] };
  }

  let backstageVersion: string | undefined;
  try {
    backstageVersion = await readBackstageVersion(options.rootDir);
  } catch (error) {
    return {
      backstageCheck: 'verified',
      errors: [
        {
          kind: 'backstage-manifest-load-failure',
          message: `Failed to read Backstage release version: ${String(error)}`,
          location: 'backstage.json',
        },
      ],
    };
  }
  if (backstageVersion === undefined) {
    return { backstageCheck: 'skipped', errors: [] };
  }

  let releaseManifest: ReleaseManifest;
  try {
    releaseManifest = await loadReleaseManifest({
      backstageVersion,
      configuration: options.configuration,
      env: options.env,
      fetch: options.fetch,
    });
  } catch (error) {
    return {
      backstageCheck: 'verified',
      errors: [
        {
          kind: 'backstage-manifest-load-failure',
          message: `Failed to load Backstage release manifest for '${backstageVersion}': ${String(
            error,
          )}`,
          location: 'backstage.json',
        },
      ],
    };
  }

  const packageVersions = new Map(
    releaseManifest.packages.map(packageEntry => [
      packageEntry.name,
      packageEntry.version,
    ]),
  );
  const errors: PatchVerificationError[] = [];
  for (const patchedPackage of patchedPackages) {
    const releaseVersion = packageVersions.get(patchedPackage.name);
    if (releaseVersion === undefined) {
      errors.push({
        kind: 'backstage-package-missing',
        message: `Patched package '${patchedPackage.name}' is absent from Backstage release '${backstageVersion}'`,
        location: patchedPackage.location,
      });
    } else if (releaseVersion !== patchedPackage.version) {
      const error: PatchVerificationError = {
        kind: 'backstage-patch-holdback',
        message: `Patched package '${patchedPackage.name}' is at version '${patchedPackage.version}', but Backstage release '${backstageVersion}' requires version '${releaseVersion}'`,
        location: patchedPackage.location,
      };
      patchHoldbackFixes.set(error, {
        packageName: patchedPackage.name,
        currentVersion: patchedPackage.version,
        targetVersion: releaseVersion,
        declaration: patchedPackage.declaration,
      });
      errors.push(error);
    }
  }

  return { backstageCheck: 'verified', errors };
}

export async function verifyYarnPatches(
  options: VerifyYarnPatchesOptions,
): Promise<VerifyYarnPatchesResult> {
  const rootDir = path.resolve(options.rootDir);
  const errors: PatchVerificationError[] = [];
  const configuration = await readYarnConfiguration(rootDir, options.env);
  const { patchDeclarations, resolutionDeclarations } =
    await discoverManifestDeclarations(rootDir, configuration, errors);

  let lockfileData: Record<string, unknown> | undefined;
  try {
    const lockfileContent = await fs.readFile(
      path.join(rootDir, 'yarn.lock'),
      'utf8',
    );
    lockfileData = parseLockfile(lockfileContent, errors);
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

  let unusedResolutionLocations = new Set<string>();
  if (lockfileData !== undefined) {
    const resolutionValidation = validateResolutions({
      declarations: resolutionDeclarations,
      lockfileData,
      configuration,
    });
    errors.push(...resolutionValidation.errors);
    unusedResolutionLocations = resolutionValidation.unusedLocations;
  }

  const manifestDeclaredPatchFiles = new Set(
    patchDeclarations.flatMap(declaration =>
      declaration.paths.map(patchPath => patchPath.absolute),
    ),
  );
  const uniqueManifestDeclarations = uniqueDeclarations(
    patchDeclarations.filter(
      declaration => !unusedResolutionLocations.has(declaration.location),
    ),
  );
  const referencedPatchFiles = new Map<string, LocalPatchPath>();

  for (const declaration of uniqueManifestDeclarations.values()) {
    for (const patchPath of declaration.paths) {
      referencedPatchFiles.set(patchPath.absolute, patchPath);
    }
  }

  for (const [absolute, patchPath] of referencedPatchFiles) {
    try {
      const stats = await fs.stat(absolute);
      if (!stats.isFile()) {
        errors.push({
          kind: 'missing-patch-file',
          message: `Patch path '${patchPath.relative}' is not a regular file`,
          location: patchPath.relative,
        });
      }
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

  const patchFolder = npath.fromPortablePath(configuration.get('patchFolder'));
  const patchFiles = await findPatchFiles(patchFolder);
  for (const patchFile of patchFiles) {
    if (!manifestDeclaredPatchFiles.has(patchFile)) {
      const relative = relativePath(rootDir, patchFile);
      errors.push({
        kind: 'orphaned-patch-file',
        message: `Patch file '${relative}' is not referenced by any manifest`,
        location: relative,
      });
    }
  }

  if (lockfileData !== undefined) {
    const lockfileDeclarations = uniqueDeclarations(
      discoverLockfileDeclarations(
        rootDir,
        configuration,
        lockfileData,
        errors,
      ),
    );

    for (const [key, declaration] of uniqueManifestDeclarations) {
      const lockfileDeclaration = lockfileDeclarations.get(key);
      if (!lockfileDeclaration) {
        errors.push({
          kind: 'lockfile-mismatch',
          message: `Patch declaration for '${
            declaration.source
          }' using '${declarationDescription(
            declaration,
          )}' is missing from yarn.lock`,
          location: declaration.location,
        });
      } else {
        declaration.resolvedSource = lockfileDeclaration.resolvedSource;
      }
    }

    for (const [key, declaration] of lockfileDeclarations) {
      if (declaration.projectOwned && !uniqueManifestDeclarations.has(key)) {
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

  const sourcesByPatchFile = new Map<string, Set<string>>();
  for (const declaration of uniqueManifestDeclarations.values()) {
    for (const patchPath of declaration.paths) {
      let sources = sourcesByPatchFile.get(patchPath.absolute);
      if (!sources) {
        sources = new Set();
        sourcesByPatchFile.set(patchPath.absolute, sources);
      }
      sources.add(declaration.resolvedSource ?? declaration.source);
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

  const backstageValidation = await validateBackstagePatches({
    rootDir,
    declarations: uniqueManifestDeclarations.values(),
    configuration,
    env: options.env,
    fetch: options.fetch,
  });
  errors.push(...backstageValidation.errors);

  return {
    patchCount: referencedPatchFiles.size,
    backstageCheck: backstageValidation.backstageCheck,
    errors: sortErrors(errors),
  };
}

export type FixYarnPatchesOptions = VerifyYarnPatchesOptions & {
  dryRun?: boolean;
  install?: (rootDir: string) => Promise<void>;
  publishFile?: (filePath: string, content: string) => Promise<void>;
};

export type FixYarnPatchesResult = {
  status: 'fixed' | 'fixable' | 'not-fixable';
  message: string;
};

function getRepairableHoldback(
  result: VerifyYarnPatchesResult,
): PatchHoldbackFix | undefined {
  if (result.errors.length !== 1) {
    return undefined;
  }
  return patchHoldbackFixes.get(result.errors[0]);
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

function isPathInside(rootDir: string, targetPath: string): boolean {
  const relative = path.relative(rootDir, targetPath);
  return (
    relative !== '' &&
    !relative.startsWith(`..${path.sep}`) &&
    relative !== '..'
  );
}

async function copyFileToShadow(options: {
  rootDir: string;
  shadowDir: string;
  sourcePath: string;
}): Promise<void> {
  const relative = path.relative(options.rootDir, options.sourcePath);
  if (
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`Cannot stage project file outside the repository`);
  }
  const targetPath = path.join(options.shadowDir, relative);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(options.sourcePath, targetPath);
}

async function copyPathToShadow(options: {
  rootDir: string;
  shadowDir: string;
  relativePath: string;
}): Promise<void> {
  const sourcePath = path.join(options.rootDir, options.relativePath);
  try {
    await fs.cp(
      sourcePath,
      path.join(options.shadowDir, options.relativePath),
      {
        recursive: true,
      },
    );
  } catch (error) {
    if (!isErrorWithCode(error, 'ENOENT')) {
      throw error;
    }
  }
}

async function fingerprintProjectInputs(
  rootDir: string,
  inputPaths: string[],
): Promise<{ state: string; content: string }> {
  const stateHash = createHash('sha256');
  const contentHash = createHash('sha256');

  const updateBoth = (value: string | Buffer) => {
    stateHash.update(value);
    contentHash.update(value);
  };

  const visit = async (inputPath: string): Promise<void> => {
    const relative = relativePath(rootDir, inputPath);
    let stats;
    try {
      stats = await fs.lstat(inputPath);
    } catch (error) {
      if (isErrorWithCode(error, 'ENOENT')) {
        updateBoth(`missing\0${relative}\0`);
        return;
      }
      throw error;
    }
    if (stats.isSymbolicLink()) {
      throw new Error(`Cannot safely stage symbolic link '${relative}'`);
    }
    stateHash.update(`${stats.mode}\0`);
    updateBoth(`${relative}\0`);
    if (stats.isDirectory()) {
      updateBoth('directory\0');
      const entries = await fs.readdir(inputPath);
      for (const entry of entries.sort(compareStrings)) {
        await visit(path.join(inputPath, entry));
      }
    } else if (stats.isFile()) {
      updateBoth('file\0');
      updateBoth(await fs.readFile(inputPath));
    } else {
      throw new Error(`Cannot safely stage '${relative}'`);
    }
  };

  for (const inputPath of [...new Set(inputPaths)].sort(compareStrings)) {
    await visit(inputPath);
  }
  return {
    state: stateHash.digest('hex'),
    content: contentHash.digest('hex'),
  };
}

async function createShadowProject(options: {
  rootDir: string;
  shadowDir: string;
  configuration: Configuration;
  patchPaths: string[];
}): Promise<{
  patchFolder: string;
  inputPaths: string[];
  inputFingerprint: { state: string; content: string };
}> {
  const { project } = await Project.find(
    options.configuration,
    npath.toPortablePath(options.rootDir),
  );
  const workspaceManifests = project.workspaces.map(workspace =>
    path.join(npath.fromPortablePath(workspace.cwd), 'package.json'),
  );
  const requiredFiles = [
    ...workspaceManifests,
    path.join(options.rootDir, 'yarn.lock'),
    path.join(options.rootDir, 'backstage.json'),
  ];
  const optionalPaths = [
    path.join(options.rootDir, '.yarnrc.yml'),
    path.join(options.rootDir, '.yarn/plugins'),
    path.join(options.rootDir, '.yarn/releases'),
  ];
  const patchFolder = npath.fromPortablePath(
    options.configuration.get('patchFolder'),
  );
  if (!isPathInside(options.rootDir, patchFolder)) {
    throw new Error(`Cannot stage a patch folder outside the repository`);
  }
  const inputPaths = [
    ...requiredFiles,
    ...optionalPaths,
    patchFolder,
    ...options.patchPaths,
  ];
  const inputFingerprint = await fingerprintProjectInputs(
    options.rootDir,
    inputPaths,
  );

  for (const sourcePath of requiredFiles) {
    await copyFileToShadow({
      ...options,
      sourcePath,
    });
  }
  await Promise.all(
    ['.yarnrc.yml', '.yarn/plugins', '.yarn/releases'].map(projectPath =>
      copyPathToShadow({ ...options, relativePath: projectPath }),
    ),
  );

  const relativePatchFolder = path.relative(options.rootDir, patchFolder);
  await fs.cp(patchFolder, path.join(options.shadowDir, relativePatchFolder), {
    recursive: true,
  });
  for (const patchPath of options.patchPaths) {
    await copyFileToShadow({
      ...options,
      sourcePath: patchPath,
    });
  }
  const shadowInputFingerprint = await fingerprintProjectInputs(
    options.shadowDir,
    inputPaths.map(inputPath =>
      path.join(options.shadowDir, path.relative(options.rootDir, inputPath)),
    ),
  );
  if (shadowInputFingerprint.content !== inputFingerprint.content) {
    throw new Error('The shadow project did not match the project inputs');
  }
  const copiedInputFingerprint = await fingerprintProjectInputs(
    options.rootDir,
    inputPaths,
  );
  if (copiedInputFingerprint.state !== inputFingerprint.state) {
    throw new Error('Project files changed while the patch repair was staged');
  }
  return {
    patchFolder: path.join(options.shadowDir, relativePatchFolder),
    inputPaths,
    inputFingerprint,
  };
}

function createRetargetedPatchReference(options: {
  packageName: string;
  targetVersion: string;
  reference: string;
}): string {
  const ident = structUtils.parseIdent(options.packageName);
  const descriptor = structUtils.makeDescriptor(ident, options.reference);
  const parsed = patchUtils.parseDescriptor(descriptor);
  const sourceDescriptor = structUtils.makeDescriptor(
    ident,
    `npm:${options.targetVersion}`,
  );
  return patchUtils.makeDescriptor(ident, {
    ...parsed,
    sourceDescriptor,
  }).range;
}

async function defaultInstall(options: {
  rootDir: string;
  env: NodeJS.ProcessEnv | undefined;
  patchFolder: string;
}): Promise<void> {
  let command = ['corepack', 'yarn'];
  try {
    const yarnRc = parseSyml(
      await fs.readFile(path.join(options.rootDir, '.yarnrc.yml'), 'utf8'),
    );
    if (typeof yarnRc.yarnPath === 'string') {
      const yarnPath = path.resolve(options.rootDir, yarnRc.yarnPath);
      if (!isPathInside(options.rootDir, yarnPath)) {
        throw new Error('The configured Yarn binary is outside the project');
      }
      command = [process.execPath, yarnPath];
    }
  } catch (error) {
    if (!isErrorWithCode(error, 'ENOENT')) {
      throw error;
    }
  }

  await run([...command, 'install', '--mode=update-lockfile'], {
    cwd: options.rootDir,
    env: Object.assign({}, options.env, {
      YARN_CACHE_FOLDER: path.join(options.rootDir, '.yarn/cache'),
      YARN_ENABLE_SCRIPTS: 'false',
      YARN_ENABLE_GLOBAL_CACHE: 'false',
      YARN_ENABLE_IMMUTABLE_INSTALLS: 'false',
      YARN_ENABLE_TELEMETRY: 'false',
      YARN_GLOBAL_FOLDER: path.join(options.rootDir, '.yarn/global'),
      YARN_IGNORE_PATH: '1',
      YARN_INSTALL_STATE_PATH: path.join(
        options.rootDir,
        '.yarn/install-state.gz',
      ),
      YARN_PATCH_FOLDER: options.patchFolder,
      YARN_VIRTUAL_FOLDER: path.join(options.rootDir, '.yarn/__virtual__'),
    }),
  }).waitForExit();
}

async function writeFileAtomically(filePath: string, content: string) {
  const temporaryPath = `${filePath}.backstage-cli-${randomUUID()}.tmp`;
  const stats = await fs.stat(filePath);
  try {
    await fs.writeFile(temporaryPath, content, {
      flag: 'wx',
      mode: stats.mode,
    });
    await fs.rename(temporaryPath, filePath);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
}

function lockfileOnlyChangesPatch(options: {
  before: string;
  after: string;
  packageName: string;
  currentVersion: string;
  targetVersion: string;
  currentReference: string;
}): boolean {
  const ident = structUtils.parseIdent(options.packageName);
  const expectedPatchPaths = patchUtils.parseDescriptor(
    structUtils.makeDescriptor(ident, options.currentReference),
  ).patchPaths;
  const isTargetDescriptor = (descriptorText: string) => {
    try {
      const descriptor = structUtils.parseDescriptor(descriptorText, true);
      if (structUtils.stringifyIdent(descriptor) !== options.packageName) {
        return false;
      }
      const range = structUtils.parseRange(descriptor.range);
      if (range.protocol === 'npm:') {
        return (
          range.selector === options.currentVersion ||
          range.selector === options.targetVersion
        );
      }
      if (!patchUtils.isPatchDescriptor(descriptor)) {
        return false;
      }
      const parsed = patchUtils.parseDescriptor(descriptor);
      const sourceRange = structUtils.parseRange(parsed.sourceDescriptor.range);
      return (
        structUtils.stringifyIdent(parsed.sourceDescriptor) ===
          options.packageName &&
        sourceRange.protocol === 'npm:' &&
        (sourceRange.selector === options.currentVersion ||
          sourceRange.selector === options.targetVersion) &&
        arraysEqual(parsed.patchPaths, expectedPatchPaths)
      );
    } catch {
      return false;
    }
  };
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
      if (range !== undefined) {
        changedDependencyDescriptors.add(
          structUtils.stringifyDescriptor(
            structUtils.makeDescriptor(structUtils.parseIdent(name), range),
          ),
        );
      }
    }
  }

  const normalize = (lockfile: Record<string, unknown>) => {
    const normalized: Array<[string, unknown]> = [];
    for (const [key, value] of Object.entries(lockfile)) {
      const normalizedKey = key
        .split(', ')
        .filter(
          descriptor =>
            !isTargetDescriptor(descriptor) &&
            !changedDependencyDescriptors.has(descriptor),
        )
        .join(', ');
      if (normalizedKey === '') {
        continue;
      }
      normalized.push([normalizedKey, value]);
    }
    return normalized.sort((left, right) => {
      return (
        compareStrings(left[0], right[0]) ||
        compareStrings(JSON.stringify(left[1]), JSON.stringify(right[1]))
      );
    });
  };
  return isDeepStrictEqual(normalize(before), normalize(after));
}

async function fixYarnPatchesUnlocked(
  options: FixYarnPatchesOptions,
): Promise<FixYarnPatchesResult> {
  const rootDir = path.resolve(options.rootDir);
  const initialResult = await verifyYarnPatches(options);
  const holdback = getRepairableHoldback(initialResult);
  const declaration = holdback?.declaration;
  const rootResolutionPrefix = 'package.json#resolutions.';
  if (
    !holdback ||
    !declaration ||
    declaration.location !== `${rootResolutionPrefix}${holdback.packageName}` ||
    declaration.patchedIdent !== holdback.packageName ||
    !hasExactPatchSource(
      declaration,
      holdback.packageName,
      holdback.currentVersion,
    ) ||
    declaration.paths.length !== 1 ||
    declaration.components.length !== 1 ||
    declaration.components[0] !== `local<${declaration.paths[0].absolute}>` ||
    !declaration.projectOwned ||
    !isPathInside(rootDir, declaration.paths[0].absolute)
  ) {
    return {
      status: 'not-fixable',
      message: 'No patch holdback could be repaired safely',
    };
  }

  const [realRootDir, realPatchPath, patchStats] = await Promise.all([
    fs.realpath(rootDir),
    fs.realpath(declaration.paths[0].absolute),
    fs.lstat(declaration.paths[0].absolute),
  ]);
  if (
    patchStats.isSymbolicLink() ||
    !isPathInside(realRootDir, realPatchPath)
  ) {
    return {
      status: 'not-fixable',
      message: 'The patch file is not owned by the project',
    };
  }

  const manifestPath = path.join(rootDir, 'package.json');
  const lockfilePath = path.join(rootDir, 'yarn.lock');
  const originalManifest = await fs.readFile(manifestPath, 'utf8');
  const originalLockfile = await fs.readFile(lockfilePath, 'utf8');
  const manifest: unknown = JSON.parse(originalManifest);
  if (!isRecord(manifest) || !isRecord(manifest.resolutions)) {
    return {
      status: 'not-fixable',
      message: 'The root resolutions could not be read safely',
    };
  }
  const currentReference = manifest.resolutions[holdback.packageName];
  if (typeof currentReference !== 'string') {
    return {
      status: 'not-fixable',
      message: 'The patch resolution could not be read safely',
    };
  }
  if (currentReference !== declaration.reference) {
    return {
      status: 'not-fixable',
      message: 'The patch resolution changed during verification',
    };
  }

  let targetReference: string;
  try {
    targetReference = createRetargetedPatchReference({
      packageName: holdback.packageName,
      targetVersion: holdback.targetVersion,
      reference: currentReference,
    });
  } catch {
    return {
      status: 'not-fixable',
      message: 'The patch resolution could not be retargeted safely',
    };
  }
  const currentLiteral = JSON.stringify(currentReference);
  const firstReference = originalManifest.indexOf(currentLiteral);
  if (
    firstReference === -1 ||
    originalManifest.indexOf(
      currentLiteral,
      firstReference + currentLiteral.length,
    ) !== -1
  ) {
    return {
      status: 'not-fixable',
      message: 'The patch resolution is not unique in package.json',
    };
  }
  const targetManifest = `${originalManifest.slice(
    0,
    firstReference,
  )}${JSON.stringify(targetReference)}${originalManifest.slice(
    firstReference + currentLiteral.length,
  )}`;

  const shadowDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'backstage-verify-patches-'),
  );
  const message = `Retargeted patch for '${holdback.packageName}' from '${holdback.currentVersion}' to '${holdback.targetVersion}'`;
  try {
    const configuration = await readYarnConfiguration(rootDir, options.env);
    const stagedProject = await createShadowProject({
      rootDir,
      shadowDir,
      configuration,
      patchPaths: declaration.paths.map(patchPath => patchPath.absolute),
    });
    await fs.writeFile(path.join(shadowDir, 'package.json'), targetManifest);

    try {
      if (options.install) {
        await options.install(shadowDir);
      } else {
        await defaultInstall({
          rootDir: shadowDir,
          env: options.env,
          patchFolder: stagedProject.patchFolder,
        });
      }
    } catch (error) {
      return {
        status: 'not-fixable',
        message: `Yarn could not validate the retargeted patch: ${String(
          error,
        )}`,
      };
    }

    const shadowEnvironment = Object.assign({}, options.env, {
      YARN_PATCH_FOLDER: stagedProject.patchFolder,
    }) as NodeJS.ProcessEnv;
    const verified = await verifyYarnPatches({
      rootDir: shadowDir,
      env: shadowEnvironment,
      fetch: options.fetch,
    });
    if (verified.errors.length > 0) {
      return {
        status: 'not-fixable',
        message: `The repaired project did not pass patch verification: ${verified.errors
          .map(error => error.message)
          .join('; ')}`,
      };
    }
    const targetLockfile = await fs.readFile(
      path.join(shadowDir, 'yarn.lock'),
      'utf8',
    );
    if (
      !lockfileOnlyChangesPatch({
        before: originalLockfile,
        after: targetLockfile,
        packageName: holdback.packageName,
        currentVersion: holdback.currentVersion,
        targetVersion: holdback.targetVersion,
        currentReference,
      })
    ) {
      return {
        status: 'not-fixable',
        message: 'Yarn produced unrelated lockfile changes',
      };
    }
    if (
      (await fingerprintProjectInputs(rootDir, stagedProject.inputPaths))
        .state !== stagedProject.inputFingerprint.state
    ) {
      return {
        status: 'not-fixable',
        message: 'Project files changed while the patch repair was staged',
      };
    }
    if (options.dryRun) {
      return { status: 'fixable', message };
    }

    const [currentManifest, currentLockfile] = await Promise.all([
      fs.readFile(manifestPath, 'utf8'),
      fs.readFile(lockfilePath, 'utf8'),
    ]);
    if (
      currentManifest !== originalManifest ||
      currentLockfile !== originalLockfile
    ) {
      if (
        currentManifest === targetManifest &&
        currentLockfile === targetLockfile
      ) {
        return { status: 'fixed', message };
      }
      return {
        status: 'not-fixable',
        message: 'Project files changed while the patch repair was staged',
      };
    }
    try {
      const publishFile = options.publishFile ?? writeFileAtomically;
      await publishFile(manifestPath, targetManifest);
      const [publishedManifest, lockfileBeforePublish] = await Promise.all([
        fs.readFile(manifestPath, 'utf8'),
        fs.readFile(lockfilePath, 'utf8'),
      ]);
      if (
        publishedManifest !== targetManifest ||
        lockfileBeforePublish !== originalLockfile
      ) {
        return {
          status: 'not-fixable',
          message: 'Project files changed while the patch repair was published',
        };
      }
      await publishFile(lockfilePath, targetLockfile);
    } catch (error) {
      return {
        status: 'not-fixable',
        message: `Could not publish the patch repair; project files may contain a partial repair: ${String(
          error,
        )}`,
      };
    }
    return { status: 'fixed', message };
  } catch (error) {
    return {
      status: 'not-fixable',
      message: `Could not safely stage the patch repair: ${String(error)}`,
    };
  } finally {
    await fs.rm(shadowDir, { recursive: true, force: true });
  }
}

/**
 * Attempts to repair one simple Backstage patch holdback.
 *
 * @internal
 */
export async function fixYarnPatches(
  options: FixYarnPatchesOptions,
): Promise<FixYarnPatchesResult> {
  if (options.dryRun) {
    return fixYarnPatchesUnlocked(options);
  }

  const manifestPath = path.join(path.resolve(options.rootDir), 'package.json');
  let releaseLock: (() => Promise<void>) | undefined;
  try {
    releaseLock = await properLockfile.lock(manifestPath, {
      realpath: false,
      retries: {
        retries: 20,
        factor: 1.2,
        minTimeout: 50,
        maxTimeout: 250,
      },
    });
  } catch (error) {
    return {
      status: 'not-fixable',
      message: `Could not lock the project for patch repair: ${String(error)}`,
    };
  }

  try {
    return await fixYarnPatchesUnlocked(options);
  } finally {
    await releaseLock();
  }
}
