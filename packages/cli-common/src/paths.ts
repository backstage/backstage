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
  /** The target package directory. */
  dir: string;

  /** The target monorepo root directory. */
  rootDir: string;

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
  /** The package root directory. */
  dir: string;

  /** The monorepo root directory containing the package. */
  rootDir: string;

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

// Finds the root of the monorepo that the package exists in.
export function findOwnRootDir(ownDir: string) {
  const isLocal = fs.existsSync(resolvePath(ownDir, 'src'));
  if (!isLocal) {
    throw new Error(
      'Tried to access monorepo package root dir outside of Backstage repository',
    );
  }

  const rootDir = findRootPath(ownDir, pkgJsonPath => {
    try {
      const content = fs.readFileSync(pkgJsonPath, 'utf8');
      const data = JSON.parse(content);
      return Boolean(data.workspaces);
    } catch (error) {
      throw new Error(
        `Failed to read package.json at '${pkgJsonPath}', ${error}`,
      );
    }
  });

  if (!rootDir) {
    throw new Error(`No monorepo root found when searching from '${ownDir}'`);
  }

  return rootDir;
}

// Hierarchical directory cache shared across all OwnPathsImpl instances.
// When we resolve a searchDir to its package root, we also cache every
// intermediate directory, so sibling directories share work.
const dirCache = new Map<string, string>();

class OwnPathsImpl implements OwnPaths {
  static #instanceCache = new Map<string, OwnPathsImpl>();

  static find(searchDir: string): OwnPathsImpl {
    const dir = OwnPathsImpl.findDir(searchDir);
    let instance = OwnPathsImpl.#instanceCache.get(dir);
    if (!instance) {
      instance = new OwnPathsImpl(dir);
      OwnPathsImpl.#instanceCache.set(dir, instance);
    }
    return instance;
  }

  static findDir(searchDir: string): string {
    const visited: string[] = [];
    let dir = searchDir;

    for (let i = 0; i < 1000; i++) {
      const cached = dirCache.get(dir);
      if (cached !== undefined) {
        for (const d of visited) {
          dirCache.set(d, cached);
        }
        return cached;
      }

      visited.push(dir);

      if (fs.existsSync(resolvePath(dir, 'package.json'))) {
        for (const d of visited) {
          dirCache.set(d, dir);
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

  #dir: string;
  #rootDir: string | undefined;

  private constructor(dir: string) {
    this.#dir = dir;
  }

  get dir(): string {
    return this.#dir;
  }

  get rootDir(): string {
    this.#rootDir ??= findOwnRootDir(this.#dir);
    return this.#rootDir;
  }

  resolve = (...paths: string[]): string => {
    return resolvePath(this.#dir, ...paths);
  };

  resolveRoot = (...paths: string[]): string => {
    return resolvePath(this.rootDir, ...paths);
  };
}

// Used by the test utility in testUtils.ts to override targetPaths
export let targetPathsOverride: TargetPaths | undefined;

/** @internal */
export function setTargetPathsOverride(override: TargetPaths | undefined) {
  targetPathsOverride = override;
}

class TargetPathsImpl implements TargetPaths {
  #cwd: string | undefined;
  #dir: string | undefined;
  #rootDir: string | undefined;

  get dir(): string {
    if (targetPathsOverride) {
      return targetPathsOverride.dir;
    }
    const cwd = process.cwd();
    if (this.#dir !== undefined && this.#cwd === cwd) {
      return this.#dir;
    }
    this.#cwd = cwd;
    this.#rootDir = undefined;
    // Drive letter can end up being lowercased here on Windows, bring back to uppercase for consistency
    this.#dir = fs
      .realpathSync(cwd)
      .replace(/^[a-z]:/, str => str.toLocaleUpperCase('en-US'));
    return this.#dir;
  }

  get rootDir(): string {
    if (targetPathsOverride) {
      return targetPathsOverride.rootDir;
    }
    // Access dir first to ensure cwd is fresh, which also invalidates rootDir on cwd change
    const dir = this.dir;
    if (this.#rootDir !== undefined) {
      return this.#rootDir;
    }
    // Lazy init to only crash commands that require a monorepo when we're not in one
    this.#rootDir =
      findRootPath(dir, path => {
        try {
          const content = fs.readFileSync(path, 'utf8');
          const data = JSON.parse(content);
          return Boolean(data.workspaces);
        } catch (error) {
          throw new Error(
            `Failed to parse package.json file while searching for root, ${error}`,
          );
        }
      }) ?? dir;
    return this.#rootDir;
  }

  resolve = (...paths: string[]): string => {
    if (targetPathsOverride) {
      return targetPathsOverride.resolve(...paths);
    }
    return resolvePath(this.dir, ...paths);
  };

  resolveRoot = (...paths: string[]): string => {
    if (targetPathsOverride) {
      return targetPathsOverride.resolveRoot(...paths);
    }
    return resolvePath(this.rootDir, ...paths);
  };
}

/**
 * Lazily resolved paths relative to the target project. Import this directly
 * for cwd-based path resolution without needing `__dirname`.
 *
 * @public
 */
export const targetPaths: TargetPaths = new TargetPathsImpl();

/**
 * Find paths relative to the package that the calling code lives in.
 *
 * Results are cached per package root, and the package root lookup uses a
 * hierarchical directory cache so that multiple calls from different
 * subdirectories within the same package share work.
 *
 * @public
 */
export function findOwnPaths(searchDir: string): OwnPaths {
  return OwnPathsImpl.find(searchDir);
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
      return own.dir;
    },
    get ownRoot() {
      return own.rootDir;
    },
    get targetDir() {
      return targetPaths.dir;
    },
    get targetRoot() {
      return targetPaths.rootDir;
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
