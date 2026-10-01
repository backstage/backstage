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
import { promisify } from 'node:util';
import parseGitUrl from 'git-url-parse';
import { isError } from '@backstage/errors';

/** A parsed git remote that the catalog can be queried with. */
export interface GitRemote {
  host: string;
  /** `owner/repo`, or `group/subgroup/repo` for GitLab. */
  fullName: string;
  provider: 'github' | 'gitlab';
}

export type ExecFn = (
  file: string,
  args: string[],
) => Promise<{ stdout: string }>;

const execFileAsync = promisify(execFile);
const defaultExec: ExecFn = (file, args) => execFileAsync(file, args);

function errorMessage(error: unknown): string {
  return isError(error) ? error.message : String(error);
}

export function parseGitRemote(url: string): GitRemote {
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
  let provider: GitRemote['provider'];
  if (/gitlab/i.test(host)) {
    provider = 'gitlab';
  } else if (/github/i.test(host)) {
    provider = 'github';
  } else {
    throw new Error(
      `Unsupported git host "${host}"; only GitHub and GitLab remotes can be matched to a component. ${hint}`,
    );
  }
  return { host, fullName, provider };
}

export function projectSlugAnnotation(remote: GitRemote): string {
  return remote.provider === 'github'
    ? 'github.com/project-slug'
    : 'gitlab.com/project-slug';
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
