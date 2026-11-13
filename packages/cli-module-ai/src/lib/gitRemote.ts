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

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import parseGitUrl from 'git-url-parse';
import { errorMessage } from './errorMessage';

export type ExecFn = (
  file: string,
  args: string[],
) => Promise<{ stdout: string }>;

const execFileAsync = promisify(execFile);
export const defaultExec: ExecFn = (file, args) => execFileAsync(file, args);

/**
 * Normalizes a git remote URL (ssh, https, with or without `.git`) to the
 * canonical `https://<host>/<full name>` form.
 */
export function repoUrlFromRemote(url: string): string {
  const hint = 'Use --entity to select the component instead.';
  let parsed: ReturnType<typeof parseGitUrl>;
  try {
    parsed = parseGitUrl(url.trim());
  } catch (error) {
    throw new Error(
      `Could not parse git remote "${url}": ${errorMessage(error)}. ${hint}`,
    );
  }
  const host = parsed.resource;
  const fullName = parsed.full_name;
  if (!host || !fullName || !fullName.includes('/')) {
    throw new Error(`Could not parse git remote "${url}". ${hint}`);
  }
  return `https://${host}/${fullName}`;
}

/**
 * Returns the current directory relative to the repository root, without a
 * trailing slash. This is an empty string at the repository root.
 */
export async function getRepoPrefix(
  exec: ExecFn = defaultExec,
): Promise<string> {
  let stdout: string;
  try {
    ({ stdout } = await exec('git', ['rev-parse', '--show-prefix']));
  } catch (error) {
    throw new Error(
      `Could not determine the current folder in the git repository (${errorMessage(
        error,
      )}). Run from inside a git repository, or pass --entity.`,
    );
  }
  return stdout.trim().replace(/\/+$/, '');
}

/**
 * Parses a `backstage.io/managed-by-location` annotation value, which is the
 * URL of the catalog file that an entity was read from, such as
 * `url:<repo>/blob/<ref>/<path>/catalog-info.yaml`. Returns the possible
 * repo-relative folders of that file, split from the ref with the same rules
 * as {@link parseSourceLocationFolder}. Returns undefined when the location is
 * not a file inside the repository or has an unsupported shape.
 */
export function parseCatalogFileFolder(
  location: string,
  repoUrl: string,
): string[][] | undefined {
  const segments = location.split(/[?#]/)[0].split('/');
  // A catalog file location never ends with a slash; drop the file name.
  if (!segments[segments.length - 1]) {
    return undefined;
  }
  return parseSourceLocationFolder(segments.slice(0, -1).join('/'), repoUrl);
}

/**
 * Parses a `backstage.io/source-location` annotation value that points into
 * the given repository, as `url:<repo>/tree/<ref>/<path>` (GitHub) or
 * `url:<repo>/-/tree/<ref>/<path>` (GitLab), also with `blob`. Returns the
 * possible repo-relative folders as segment lists, one for each way to split
 * the ref from the path, since refs can contain slashes. The repo root is only
 * returned when the location has nothing but a ref. Returns undefined when the
 * location is not inside the repository or has an unsupported shape.
 */
export function parseSourceLocationFolder(
  location: string,
  repoUrl: string,
): string[][] | undefined {
  const prefix = `url:${repoUrl}/`;
  if (!startsWithIgnoreCase(location, prefix)) {
    return undefined;
  }
  const segments = location
    .slice(prefix.length)
    .split(/[?#]/)[0]
    .split('/')
    .filter(Boolean);
  if (segments[0] === '-') {
    segments.shift();
  }
  if (segments[0] !== 'tree' && segments[0] !== 'blob') {
    return undefined;
  }
  const rest = segments.slice(1);
  if (rest.length === 0) {
    return undefined;
  }
  if (rest.length === 1) {
    return [[]];
  }
  return rest.slice(1).map((_, i) => rest.slice(i + 1));
}

/**
 * Parses a `file:<absolute path>` annotation value. For
 * `backstage.io/managed-by-location` the path is the catalog file, and for
 * `backstage.io/source-location` it is the folder itself, which is selected
 * with the `isFolder` option. Returns the folder relative to the first of the
 * given checkout roots that contains it, as a segment list, or undefined if it
 * is not inside any of the roots. Paths are compared by their real paths, so
 * symlinks do not matter.
 */
export function parseFileLocationFolder(
  location: string,
  roots: string[],
  options?: { isFolder?: boolean },
): string[] | undefined {
  if (!location.startsWith('file:')) {
    return undefined;
  }
  const filePath = location.slice('file:'.length);
  if (!path.isAbsolute(filePath)) {
    return undefined;
  }
  const dir = realpathOrResolve(
    options?.isFolder ? filePath : path.dirname(filePath),
  );
  for (const root of roots) {
    const relative = path.relative(realpathOrResolve(root), dir);
    if (
      relative === '..' ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      continue;
    }
    return relative.split(path.sep).filter(Boolean);
  }
  return undefined;
}

/**
 * Checks that the `backstage.io/managed-by-location` of an entity is in the
 * same place as its `backstage.io/source-location`, so that the entity cannot
 * claim a folder of a repository it was not registered from. A `url:` source
 * location requires a `url:` managed-by location in the same repository. A
 * `file:` source location requires a `file:` managed-by location inside the
 * checkout, which includes the main checkout and its linked worktrees.
 */
export function isManagedWithinSameRepo(
  sourceLocation: string,
  managedByLocation: string,
  repoUrl: string,
  roots: string[],
): boolean {
  if (sourceLocation.startsWith('file:')) {
    // The roots are the worktree and the main checkout of the same repository,
    // so a location in either of them is in the same checkout.
    return (
      parseFileLocationFolder(sourceLocation, roots, { isFolder: true }) !==
        undefined &&
      parseFileLocationFolder(managedByLocation, roots) !== undefined
    );
  }
  return startsWithIgnoreCase(managedByLocation, `url:${repoUrl}/`);
}

function startsWithIgnoreCase(value: string, prefix: string): boolean {
  return value
    .toLocaleLowerCase('en-US')
    .startsWith(prefix.toLocaleLowerCase('en-US'));
}

function realpathOrResolve(target: string): string {
  try {
    return fs.realpathSync(target);
  } catch {
    return path.resolve(target);
  }
}

export async function getOriginUrl(
  exec: ExecFn = defaultExec,
): Promise<string> {
  const hint =
    'Run from inside a git repository with an origin remote, or pass --entity.';
  let stdout: string;
  try {
    ({ stdout } = await exec('git', ['remote', 'get-url', 'origin']));
  } catch (error) {
    throw new Error(
      `Could not read the "origin" git remote (${errorMessage(
        error,
      )}). ${hint}`,
    );
  }
  const url = stdout.trim();
  if (!url) {
    throw new Error(`The "origin" git remote is empty. ${hint}`);
  }
  return url;
}

/**
 * Finds the top-level directory of the git repository around the current
 * directory, or undefined when not inside one.
 */
export async function getRepoRoot(
  exec: ExecFn = defaultExec,
): Promise<string | undefined> {
  try {
    const { stdout } = await exec('git', ['rev-parse', '--show-toplevel']);
    return stdout.trim() || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Finds the root of the main checkout of the current repository. This is the
 * repository root, except in a linked worktree, where it is the root of the
 * checkout that the worktree was created from.
 */
export async function getMainCheckoutRoot(
  exec: ExecFn = defaultExec,
): Promise<string | undefined> {
  try {
    const { stdout } = await exec('git', [
      'rev-parse',
      '--path-format=absolute',
      '--git-common-dir',
    ]);
    const gitDir = stdout.trim();
    return path.basename(gitDir) === '.git' ? path.dirname(gitDir) : undefined;
  } catch {
    return undefined;
  }
}
