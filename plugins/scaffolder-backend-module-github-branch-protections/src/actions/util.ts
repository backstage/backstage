/*
 * Copyright 2023 The Backstage Authors
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
import { ScmIntegrationRegistry } from '@backstage/integration';

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

  const repo: string = parsed.searchParams.get('repo')!;

  checkRequiredParams(parsed, 'repo', 'owner');

  return { host, owner, repo, organization, workspace, project };
};

function checkRequiredParams(repoUrl: URL, ...params: string[]) {
  for (let i = 0; i < params.length; i++) {
    if (!repoUrl.searchParams.get(params[i])) {
      throw new InputError(
        `Invalid repo URL passed to publisher: ${repoUrl.toString()}, missing ${
          params[i]
        }`,
      );
    }
  }
}
