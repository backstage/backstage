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

import fs from 'fs-extra';
import { isBuiltin } from 'node:module';
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join as joinPath,
  posix,
  relative as relativePath,
  resolve as resolvePath,
  sep as pathSep,
} from 'node:path';

// pnpm loads the first of these that exists when the pnpmfile setting is unset
const DEFAULT_PNPMFILES = ['.pnpmfile.mjs', '.pnpmfile.cjs'];

// require() and import() calls and import statements of relative paths
const LOCAL_IMPORT_PATTERN =
  /(?:\brequire(?:\.resolve)?\s*\(|\bimport\s*\(|\bfrom|\bimport)\s*(['"`])(\.\.?\/[^'"`]*)\1/g;

// require() and import() calls, and import and export statements, of
// packages, which includes the built-in modules of Node.js. Subpath imports
// that start with # are not packages.
const PACKAGE_IMPORT_PATTERN =
  /(?:\brequire(?:\.resolve)?\s*\(\s*|\bimport\s*\(\s*|^\s*import\s*(?:[^'"`;]*?\bfrom\s*)?|^\s*export\s[^'"`;]*?\bfrom\s*)(['"`])([@a-zA-Z0-9][^'"`]*)\1/gm;

/**
 * Copies the files that the settings of a pnpm workspace point at into
 * another directory that is installed with the same lockfile. These are the
 * patch files of `patchedDependencies` and the pnpmfiles, whose checksum is
 * part of the lockfile.
 *
 * A file inside the workspace keeps its relative path. A patch file outside of
 * it is copied into `patches`, and a pnpmfile outside of it into the root of
 * the target directory, under a name that no other copied file uses, also
 * when names are compared without case. A
 * pnpmfile that loads other local files fails, since those are not copied.
 * With `checkPackageImports`, a pnpmfile also fails when it loads a package
 * that is not installed where the target directory is.
 *
 * Returns the copied files, relative to the target directory, and the
 * settings that point at the copies. `pnpmfile` is only returned when the
 * workspace sets it, since the default pnpmfile keeps its name.
 */
export async function copyPnpmWorkspaceFiles(options: {
  workspaceRootDir: string;
  targetDir: string;
  settings: { patchedDependencies?: unknown; pnpmfile?: unknown };
  /** Names the target directory in errors, for example "the bundle". */
  targetName: string;
  /**
   * Whether to check that the packages that pnpmfiles load are found from the
   * target directory, for a target that pnpm runs in before it has a
   * `node_modules` directory of its own.
   */
  checkPackageImports?: boolean;
}): Promise<{
  files: string[];
  patchedDependencies: Record<string, string>;
  missingPatches: Array<{ name: string; path: string }>;
  pnpmfile?: string | string[];
}> {
  const {
    workspaceRootDir,
    targetDir,
    settings,
    targetName,
    checkPackageImports,
  } = options;

  const patches = Object.entries(
    (settings.patchedDependencies ?? {}) as Record<string, unknown>,
  ).filter((entry): entry is [string, string] => typeof entry[1] === 'string');

  let pnpmfiles: string[];
  if (typeof settings.pnpmfile === 'string') {
    pnpmfiles = [settings.pnpmfile];
  } else if (Array.isArray(settings.pnpmfile)) {
    pnpmfiles = settings.pnpmfile.filter(
      (path): path is string => typeof path === 'string',
    );
  } else {
    pnpmfiles = [];
    for (const path of DEFAULT_PNPMFILES) {
      if (await fs.pathExists(resolvePath(workspaceRootDir, path))) {
        pnpmfiles.push(path);
        break;
      }
    }
  }

  // Files inside the workspace are placed first, so that the files from
  // outside of it can be given names that don't collide with them
  const sources = new Array<{ sourcePath: string; outsideDir: string }>();
  const missingPatches = new Array<{ name: string; path: string }>();
  for (const [name, path] of patches) {
    const sourcePath = resolvePath(workspaceRootDir, path);
    if (await fs.pathExists(sourcePath)) {
      sources.push({ sourcePath, outsideDir: 'patches' });
    } else {
      missingPatches.push({ name, path: sourcePath });
    }
  }
  for (const path of pnpmfiles) {
    const sourcePath = resolvePath(workspaceRootDir, path);
    if (await fs.pathExists(sourcePath)) {
      sources.push({ sourcePath, outsideDir: '.' });
    }
  }

  const targetPaths = new Map<string, string>();
  const outside = new Array<{ sourcePath: string; outsideDir: string }>();
  for (const source of sources) {
    const fromRoot = relativePath(workspaceRootDir, source.sourcePath);
    if (fromRoot && !fromRoot.startsWith('..') && !isAbsolute(fromRoot)) {
      targetPaths.set(source.sourcePath, toPosixPath(fromRoot));
    } else {
      outside.push(source);
    }
  }
  // Names are compared without case, for case-insensitive file systems
  const usedPaths = new Set(
    Array.from(targetPaths.values(), path => path.toLocaleLowerCase('en-US')),
  );
  for (const { sourcePath, outsideDir } of outside) {
    if (targetPaths.has(sourcePath)) {
      continue;
    }
    const extension = extname(sourcePath);
    const stem = basename(sourcePath, extension);
    let targetPath = posix.join(outsideDir, `${stem}${extension}`);
    for (let i = 2; usedPaths.has(targetPath.toLocaleLowerCase('en-US')); i++) {
      targetPath = posix.join(outsideDir, `${stem}-${i}${extension}`);
    }
    targetPaths.set(sourcePath, targetPath);
    usedPaths.add(targetPath.toLocaleLowerCase('en-US'));
  }

  const files = new Array<string>();
  for (const [sourcePath, targetPath] of targetPaths) {
    await fs.copy(sourcePath, joinPath(targetDir, targetPath));
    files.push(targetPath);
  }

  const patchedDependencies: Record<string, string> = {};
  for (const [name, path] of patches) {
    const targetPath = targetPaths.get(resolvePath(workspaceRootDir, path));
    if (targetPath) {
      patchedDependencies[name] = targetPath;
    }
  }

  const copiedPnpmfiles = new Array<string>();
  for (const path of pnpmfiles) {
    const targetPath = targetPaths.get(resolvePath(workspaceRootDir, path));
    if (targetPath) {
      await checkPnpmfileImports(
        joinPath(targetDir, targetPath),
        path,
        targetName,
        checkPackageImports,
      );
      copiedPnpmfiles.push(targetPath);
    }
  }

  let pnpmfile: string | string[] | undefined;
  if (typeof settings.pnpmfile === 'string') {
    pnpmfile = copiedPnpmfiles[0];
  } else if (Array.isArray(settings.pnpmfile)) {
    pnpmfile = copiedPnpmfiles;
  }

  return { files, patchedDependencies, missingPatches, pnpmfile };
}

/**
 * Fails when a pnpmfile loads local files, since only the pnpmfile itself is
 * copied and the install would not find them. Optionally also fails when it
 * loads a package that is not installed in a parent directory of the copy.
 */
async function checkPnpmfileImports(
  pnpmfilePath: string,
  name: string,
  targetName: string,
  checkPackageImports?: boolean,
) {
  const source = (await fs.readFile(pnpmfilePath, 'utf8'))
    // Imports in comments don't count
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
  const imports = Array.from(
    source.matchAll(LOCAL_IMPORT_PATTERN),
    match => match[2],
  );
  if (imports.length > 0) {
    throw new Error(
      `The pnpmfile ${name} loads ${imports.join(
        ', ',
      )}, but only the pnpmfile itself is copied into ${targetName}. Move that code into the pnpmfile.`,
    );
  }

  if (!checkPackageImports) {
    return;
  }
  const packageNames = new Set(
    Array.from(source.matchAll(PACKAGE_IMPORT_PATTERN), match => match[2])
      // Template literals with placeholders can't be resolved here
      .filter(specifier => !specifier.includes('${') && !isBuiltin(specifier))
      .map(specifier =>
        specifier
          .split('/')
          .slice(0, specifier.startsWith('@') ? 2 : 1)
          .join('/'),
      ),
  );
  const missing = new Array<string>();
  for (const packageName of packageNames) {
    if (!(await isInstalledAbove(dirname(pnpmfilePath), packageName))) {
      missing.push(packageName);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `The pnpmfile ${name} loads ${missing.join(
        ', ',
      )}, which is not installed where ${targetName} is written. Write ${targetName} inside the project, or remove the import from the pnpmfile.`,
    );
  }
}

// Whether Node.js finds the package from the directory, like it does for a
// file in it
async function isInstalledAbove(dir: string, packageName: string) {
  for (let current = dir; ; current = dirname(current)) {
    if (
      await fs.pathExists(
        joinPath(current, 'node_modules', packageName, 'package.json'),
      )
    ) {
      return true;
    }
    if (dirname(current) === current) {
      return false;
    }
  }
}

function toPosixPath(path: string) {
  return path.split(pathSep).join('/');
}
