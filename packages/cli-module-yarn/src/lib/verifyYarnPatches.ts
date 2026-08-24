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
import patchPlugin from '@yarnpkg/plugin-patch';
import fs from 'node:fs/promises';
import path from 'node:path';

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
  patchedIdent: string;
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
    structUtils.parseDescriptor(descriptorRange.source, true),
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
): Promise<PatchDeclaration[]> {
  const project = new Project(npath.toPortablePath(rootDir), { configuration });
  const pendingWorkspaces = [npath.toPortablePath(rootDir)];
  const visitedWorkspaces = new Set<string>();
  const declarations: PatchDeclaration[] = [];

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
      errors.push({
        kind: 'backstage-patch-holdback',
        message: `Patched package '${patchedPackage.name}' is at version '${patchedPackage.version}', but Backstage release '${backstageVersion}' requires version '${releaseVersion}'`,
        location: patchedPackage.location,
      });
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
  const manifestDeclarations = await discoverManifestDeclarations(
    rootDir,
    configuration,
    errors,
  );
  const uniqueManifestDeclarations = uniqueDeclarations(manifestDeclarations);
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
