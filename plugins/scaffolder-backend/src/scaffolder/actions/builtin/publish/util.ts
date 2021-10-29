/*
 * Copyright 2021 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { isChildPath } from '@backstage/backend-common';
import { join as joinPath, normalize as normalizePath } from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';

export const getRepoSourceDirectory = (
  workspacePath: string,
  sourcePath: string | undefined,
) => {
  if (sourcePath) {
    const safeSuffix = normalizePath(sourcePath).replace(
      /^(\.\.(\/|\\|$))+/,
      '',
    );
    const path = joinPath(workspacePath, safeSuffix);
    if (!isChildPath(workspacePath, path)) {
      throw new Error('Invalid source path');
    }
    return path;
  }
  return workspacePath;
};
export type RepoSpec = {
  repo: string;
  host: string;
  owner?: string;
  organization?: string;
  workspace?: string;
  project?: string;
};

export const parseRepoUrl = (
  repoUrl: string,
  integrations: ScmIntegrationRegistry,
): RepoSpec => {
  let parsed;
  try {
    parsed = new URL(`https://${repoUrl}`);
  } catch (error) {
    throw new InputError(
      `Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`,
    );
  }
  const host = parsed.host;
  const owner = parsed.searchParams.get('owner') ?? undefined;
  const organization = parsed.searchParams.get('organization') ?? undefined;
  const workspace = parsed.searchParams.get('workspace') ?? undefined;
  const project = parsed.searchParams.get('project') ?? undefined;

  const type = integrations.byHost(host)?.type;

  if (!type) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  if (type === 'bitbucket') {
    if (host === 'bitbucket.org') {
      if (!workspace) {
        throw new InputError(
          `Invalid repo URL passed to publisher: ${repoUrl}, missing workspace`,
        );
      }
    }
    if (!project) {
      throw new InputError(
        `Invalid repo URL passed to publisher: ${repoUrl}, missing project`,
      );
    }
  } else {
    if (!owner) {
      throw new InputError(
        `Invalid repo URL passed to publisher: ${repoUrl}, missing owner`,
      );
    }
  }

  const repo = parsed.searchParams.get('repo');
  if (!repo) {
    throw new InputError(
      `Invalid repo URL passed to publisher: ${repoUrl}, missing repo`,
    );
  }

  return { host, owner, repo, organization, workspace, project };
};
