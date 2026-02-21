/*
 * Copyright 2020 The Backstage Authors
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

import fs from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';

/**
 * A function that takes a set of path fragments and resolves them into a
 * single complete path, relative to some root.
 *
 * @public
 */
export type ResolveFunc = (...paths: string[]) => string;

/**
 * Resolved paths relative to the target project, based on `process.cwd()`.
 * Lazily initialized on first property access. Re-resolves automatically
 * when `process.cwd()` changes.
 *
 * @public
 */
export type TargetPaths = {
  /** Resolve a path relative to the target package directory. */
  resolve: ResolveFunc;

  /** Resolve a path relative to the target repo root. */
  resolveRoot: ResolveFunc;
};

/**
 * Resolved paths relative to a specific package in the repository.
 *
 * @public
 */
export type OwnPaths = {
  /** Resolve a path relative to the package root. */
  resolve: ResolveFunc;

  /** Resolve a path relative to the monorepo root containing the package. */
  resolveRoot: ResolveFunc;
};

/**
 * Common paths and resolve functions used by the cli.
 * Currently assumes it is being executed within a monorepo.
 *
 * @public
 * @deprecated Use {@link targetPaths} and {@link findOwnPaths} instead.
 */
export type Paths = {
  ownDir: string;
  ownRoot: string;
  targetDir: string;
  targetRoot: string;
  resolveOwn: ResolveFunc;
  resolveOwnRoot: ResolveFunc;
  resolveTarget: ResolveFunc;
  resolveTargetRoot: ResolveFunc;
};

// Looks for a package.json with a workspace config to identify the root of the monorepo
export function findRootPath(
  searchDir: string,
  filterFunc: (pkgJsonPath: string) => boolean,
): string | undefined {
  let path = searchDir;

  // Some confidence check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = resolvePath(path, 'package.json');
    const exists = fs.existsSync(packagePath);
    if (exists && filterFunc(packagePath)) {
      return path;
    }

    const newPath = dirname(path);
    if (newPath === path) {
      return undefined;
    }
    path = newPath;
  }

  throw new Error(
    `Iteration limit reached when searching for root package.json at ${searchDir}`,
  );
}

// Hierarchical cache for ownDir lookups. When we resolve a searchDir to its
// package root, we also cache every intermediate directory along the way. This
// means sibling directories only need to walk up until they hit a cached ancestor.
const ownDirCache = new Map<string, string>();

// Finds the root of a given package
export function findOwnDir(searchDir: string) {
  const visited: string[] = [];
  let dir = searchDir;

  for (let i = 0; i < 1000; i++) {
    const cached = ownDirCache.get(dir);
    if (cached !== undefined) {
      for (const d of visited) {
        ownDirCache.set(d, cached);
      }
      return cached;
    }

    visited.push(dir);

    const packagePath = resolvePath(dir, 'package.json');
    if (fs.existsSync(packagePath)) {
      for (const d of visited) {
        ownDirCache.set(d, dir);
      }
      return dir;
    }

    const newDir = dirname(dir);
    if (newDir === dir) {
      break;
    }
    dir = newDir;
  }

  throw new Error(
    `No package.json found while searching for package root of ${searchDir}`,
  );
}

// Finds the root of the monorepo that the package exists in. Only accessible when running inside Backstage repo.
export function findOwnRootDir(ownDir: string) {
  const isLocal = fs.existsSync(resolvePath(ownDir, 'src'));
  if (!isLocal) {
    throw new Error(
      'Tried to access monorepo package root dir outside of Backstage repository',
    );
  }

  return resolvePath(ownDir, '../..');
}

// Cached target path state. Re-resolves when process.cwd() changes.
let cachedTargetCwd: string | undefined;
let cachedTargetDir: string | undefined;
let cachedTargetRoot: string | undefined;

function getTargetDir(): string {
  const cwd = process.cwd();
  if (cachedTargetDir !== undefined && cachedTargetCwd === cwd) {
    return cachedTargetDir;
  }
  cachedTargetCwd = cwd;
  cachedTargetRoot = undefined;
  // Drive letter can end up being lowercased here on Windows, bring back to uppercase for consistency
  cachedTargetDir = fs
    .realpathSync(cwd)
    .replace(/^[a-z]:/, str => str.toLocaleUpperCase('en-US'));
  return cachedTargetDir;
}

function getTargetRoot(): string {
  // Ensure targetDir is fresh, which also invalidates targetRoot on cwd change
  const targetDir = getTargetDir();
  if (cachedTargetRoot !== undefined) {
    return cachedTargetRoot;
  }
  // We're not always running in a monorepo, so we lazy init this to only crash
  // commands that require a monorepo when we're not in one.
  cachedTargetRoot =
    findRootPath(targetDir, path => {
      try {
        const content = fs.readFileSync(path, 'utf8');
        const data = JSON.parse(content);
        return Boolean(data.workspaces);
      } catch (error) {
        throw new Error(
          `Failed to parse package.json file while searching for root, ${error}`,
        );
      }
    }) ?? targetDir;
  return cachedTargetRoot;
}

/**
 * Lazily resolved paths relative to the target project. Import this directly
 * for cwd-based path resolution without needing `__dirname`.
 *
 * @public
 * @example
 *
 * import { targetPaths } from '\@backstage/cli-common';
 *
 * const lockfile = targetPaths.resolveRoot('yarn.lock');
 */
export const targetPaths: TargetPaths = {
  resolve: (...paths) => resolvePath(getTargetDir(), ...paths),
  resolveRoot: (...paths) => resolvePath(getTargetRoot(), ...paths),
};

const ownPathsCache = new Map<string, OwnPaths>();

/**
 * Find paths relative to the package that the calling code lives in.
 *
 * Results are cached per package root, and the package root lookup uses a
 * hierarchical directory cache so that multiple calls from different
 * subdirectories within the same package share work.
 *
 * @public
 * @example
 *
 * import { findOwnPaths } from '\@backstage/cli-common';
 *
 * const own = findOwnPaths(__dirname);
 * const config = own.resolve('config/jest.js');
 */
export function findOwnPaths(searchDir: string): OwnPaths {
  const ownDir = findOwnDir(searchDir);
  const cached = ownPathsCache.get(ownDir);
  if (cached) {
    return cached;
  }

  let ownRoot = '';
  const getOwnRoot = () => {
    if (!ownRoot) {
      ownRoot = findOwnRootDir(ownDir);
    }
    return ownRoot;
  };

  const paths: OwnPaths = {
    resolve: (...p) => resolvePath(ownDir, ...p),
    resolveRoot: (...p) => resolvePath(getOwnRoot(), ...p),
  };

  ownPathsCache.set(ownDir, paths);
  return paths;
}

/**
 * Find paths related to a package and its execution context.
 *
 * @public
 * @deprecated Use {@link targetPaths} for cwd-based paths and
 * {@link findOwnPaths} for package-relative paths instead.
 *
 * @example
 *
 * const paths = findPaths(__dirname)
 */
export function findPaths(searchDir: string): Paths {
  const own = findOwnPaths(searchDir);
  return {
    get ownDir() {
      return own.resolve();
    },
    get ownRoot() {
      return own.resolveRoot();
    },
    get targetDir() {
      return targetPaths.resolve();
    },
    get targetRoot() {
      return targetPaths.resolveRoot();
    },
    resolveOwn: own.resolve,
    resolveOwnRoot: own.resolveRoot,
    resolveTarget: targetPaths.resolve,
    resolveTargetRoot: targetPaths.resolveRoot,
  };
}

/**
 * The name of the backstage's config file
 *
 * @public
 */
export const BACKSTAGE_JSON = 'backstage.json';
