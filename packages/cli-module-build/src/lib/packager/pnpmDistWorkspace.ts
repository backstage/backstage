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
import { isDeepStrictEqual } from 'node:util';
import { resolve as resolvePath, sep as pathSep } from 'node:path';
import {
  Document,
  isMap,
  isScalar,
  parseAllDocuments,
  parseDocument,
} from 'yaml';
import { copyPnpmWorkspaceFiles } from '../pnpmWorkspaceFiles';

const LOCKFILE = 'pnpm-lock.yaml';
const WORKSPACE_FILE = 'pnpm-workspace.yaml';
const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

// Keeps the formatting that pnpm writes as far as possible
const STRINGIFY_OPTIONS = { lineWidth: 0, flowCollectionPadding: false };

/**
 * Prepares a dist workspace that was created from a pnpm workspace, so that
 * `pnpm install --frozen-lockfile` works in it. The lockfile and
 * `pnpm-workspace.yaml` must already be copied into the dist workspace.
 *
 * - The lockfile entries of bundled packages are emptied, since their
 *   dependencies are removed from their `package.json` in the dist workspace.
 * - The lockfile entries of the workspace packages that are not copied into
 *   the dist workspace are removed. A frozen install fails on such an entry
 *   when its directory exists, as the root of a Backstage installation in a
 *   subdirectory does when its packages are copied.
 * - The patch files that `patchedDependencies` points at, and the pnpmfiles,
 *   are copied. Patch files outside of the workspace root are copied into
 *   `patches`, and pnpmfiles outside of it into the root of the dist
 *   workspace, and the settings are changed to point at the copies. A
 *   pnpmfile that loads other local files fails, since those are not copied.
 *
 * Returns the files that were written, relative to the dist workspace.
 */
export async function preparePnpmDistWorkspace(options: {
  workspaceRootDir: string;
  targetDir: string;
  bundledPackageDirs: string[];
}): Promise<string[]> {
  const { workspaceRootDir, targetDir, bundledPackageDirs } = options;
  const files = new Array<string>();

  const lockfilePath = resolvePath(targetDir, LOCKFILE);
  if (await fs.pathExists(lockfilePath)) {
    await pruneLockfileImporters(lockfilePath, targetDir, bundledPackageDirs);
    files.push(LOCKFILE);
  }

  const workspaceFilePath = resolvePath(targetDir, WORKSPACE_FILE);
  if (!(await fs.pathExists(workspaceFilePath))) {
    return files;
  }
  files.push(WORKSPACE_FILE);

  const doc = parseDocument(await fs.readFile(workspaceFilePath, 'utf8'));
  const settings = (doc.toJS() ?? {}) as {
    patchedDependencies?: Record<string, unknown>;
    pnpmfile?: unknown;
  };
  let changed = false;

  // A patch is applied through a file, so the files come along with the
  // setting that names them. The checksum of the pnpmfiles is part of the
  // lockfile.
  const copied = await copyPnpmWorkspaceFiles({
    workspaceRootDir,
    targetDir,
    settings,
    targetName: 'the dist workspace',
  });
  files.push(...copied.files);
  for (const [name, path] of Object.entries(copied.patchedDependencies)) {
    if (settings.patchedDependencies?.[name] !== path) {
      doc.setIn(['patchedDependencies', name], path);
      changed = true;
    }
  }
  if (
    copied.pnpmfile !== undefined &&
    !isDeepStrictEqual(copied.pnpmfile, settings.pnpmfile)
  ) {
    doc.set('pnpmfile', copied.pnpmfile);
    changed = true;
  }

  if (changed) {
    await fs.writeFile(workspaceFilePath, doc.toString(STRINGIFY_OPTIONS));
  }
  return files;
}

/**
 * Puts back the dependency ranges from the source `package.json` that
 * `pnpm pack` replaced, such as `workspace:^` and `catalog:`. The dist
 * workspace is a pnpm workspace with the same catalogs, so the source ranges
 * resolve there and match the lockfile.
 */
export async function restorePnpmDependencyRanges(
  packageJsonPath: string,
  sourcePackageJson: object,
): Promise<void> {
  const packageJson = await fs.readJson(packageJsonPath);
  for (const field of DEPENDENCY_FIELDS) {
    const ranges = (sourcePackageJson as Record<string, unknown>)[field];
    if (ranges) {
      packageJson[field] = ranges;
    } else {
      delete packageJson[field];
    }
  }
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function pruneLockfileImporters(
  lockfilePath: string,
  targetDir: string,
  bundledPackageDirs: string[],
): Promise<void> {
  const bundledDirs = new Set(bundledPackageDirs.map(toPosixPath));

  // A lockfile can have a separate document for the package manager itself
  const docs = parseAllDocuments(await fs.readFile(lockfilePath, 'utf8'));
  let changed = false;
  for (const doc of docs) {
    if (!(doc instanceof Document)) {
      continue;
    }
    const importers = doc.get('importers');
    if (!isMap(importers)) {
      continue;
    }
    for (const item of [...importers.items]) {
      const dir = String(isScalar(item.key) ? item.key.value : item.key);
      if (bundledDirs.has(dir)) {
        item.value = doc.createNode({});
        changed = true;
      } else if (
        dir !== '.' &&
        !(await fs.pathExists(resolvePath(targetDir, dir, 'package.json')))
      ) {
        importers.delete(item.key);
        changed = true;
      }
    }
  }

  if (changed) {
    await fs.writeFile(
      lockfilePath,
      // pnpm separates the documents with an empty line
      docs.map(doc => doc.toString(STRINGIFY_OPTIONS)).join('\n'),
    );
  }
}

function toPosixPath(path: string) {
  return path.split(pathSep).join('/');
}
