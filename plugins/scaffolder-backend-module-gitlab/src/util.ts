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

import { LoggerService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import {
  GitLabIntegration,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Gitlab, GroupSchema, RepositoryTreeSchema } from '@gitbeaker/rest';
import { z } from 'zod';
import commonGitlabConfig from './commonGitlabConfig';

import { SerializedFile } from '@backstage/plugin-scaffolder-node';

import { createHash } from 'crypto';
import path from 'path';

export const parseRepoHost = (repoUrl: string): string => {
  let parsed;
  try {
    parsed = new URL(`https://${repoUrl}`);
  } catch (error) {
    throw new InputError(
      `Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`,
    );
  }
  return parsed.host;
};

export const getToken = (
  config: z.infer<typeof commonGitlabConfig>,
  integrations: ScmIntegrationRegistry,
): { token: string; integrationConfig: GitLabIntegration } => {
  const host = parseRepoHost(config.repoUrl);
  const integrationConfig = integrations.gitlab.byHost(host);

  if (!integrationConfig) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  const token = config.token || integrationConfig.config.token!;

  return { token: token, integrationConfig: integrationConfig };
};

export type RepoSpec = {
  repo: string;
  host: string;
  owner?: string;
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
  const repo: string = parsed.searchParams.get('repo')!;

  const type = integrations.byHost(host)?.type;

  if (!type) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  return { host, owner, repo };
};

export function getClient(props: {
  host: string;
  token?: string;
  integrations: ScmIntegrationRegistry;
}): InstanceType<typeof Gitlab> {
  const { host, token, integrations } = props;
  const integrationConfig = integrations.gitlab.byHost(host);

  if (!integrationConfig) {
    throw new InputError(
      `No matching integration configuration for host ${host}, please check your integrations config`,
    );
  }

  const { config } = integrationConfig;

  if (!config.token && !token) {
    throw new InputError(`No token available for host ${host}`);
  }

  const requestToken = token || config.token!;
  const tokenType = token ? 'oauthToken' : 'token';

  const gitlabOptions: any = {
    host: config.baseUrl,
  };

  gitlabOptions[tokenType] = requestToken;
  return new Gitlab(gitlabOptions);
}

export function convertDate(
  inputDate: string | undefined,
  defaultDate: string,
) {
  try {
    return inputDate
      ? new Date(inputDate).toISOString()
      : new Date(defaultDate).toISOString();
  } catch (error) {
    throw new InputError(`Error converting input date - ${error}`);
  }
}

export async function getTopLevelParentGroup(
  client: InstanceType<typeof Gitlab>,
  groupId: number,
): Promise<GroupSchema> {
  try {
    const topParentGroup = await client.Groups.show(groupId);
    if (topParentGroup.parent_id) {
      return getTopLevelParentGroup(client, topParentGroup.parent_id as number);
    }
    return topParentGroup as GroupSchema;
  } catch (error: any) {
    throw new InputError(
      `Error finding top-level parent group ID: ${error.message}`,
    );
  }
}

export async function checkEpicScope(
  client: InstanceType<typeof Gitlab>,
  projectId: number,
  epicId: number,
) {
  try {
    // If project exists, get the top level group id
    const project = await client.Projects.show(projectId);
    if (!project) {
      throw new InputError(
        `Project with id ${projectId} not found. Check your GitLab instance.`,
      );
    }
    const topParentGroup = await getTopLevelParentGroup(
      client,
      project.namespace.id,
    );
    if (!topParentGroup) {
      throw new InputError(`Couldn't find a suitable top-level parent group.`);
    }
    // Get the epic
    const epic = (await client.Epics.all(topParentGroup.id)).find(
      (x: any) => x.id === epicId,
    );
    if (!epic) {
      throw new InputError(
        `Epic with id ${epicId} not found in the top-level parent group ${topParentGroup.name}.`,
      );
    }

    const epicGroup = await client.Groups.show(epic.group_id as number);
    const projectNamespace: string = project.path_with_namespace as string;
    return projectNamespace.startsWith(epicGroup.full_path as string);
  } catch (error: any) {
    throw new InputError(`Could not find epic scope: ${error.message}`);
  }
}

function computeSha256(file: SerializedFile): string {
  const hash = createHash('sha256');
  hash.update(file.content);
  return hash.digest('hex');
}

export async function getFileAction(
  fileInfo: { file: SerializedFile; targetPath?: string },
  target: { repoID: string; branch: string },
  api: InstanceType<typeof Gitlab>,
  logger: LoggerService,
  remoteFiles: RepositoryTreeSchema[],
  defaultCommitAction:
    | 'create'
    | 'delete'
    | 'update'
    | 'skip'
    | 'auto' = 'auto',
): Promise<'create' | 'delete' | 'update' | 'skip'> {
  if (defaultCommitAction === 'auto') {
    const filePath = path.join(fileInfo.targetPath ?? '', fileInfo.file.path);

    if (remoteFiles?.some(remoteFile => remoteFile.path === filePath)) {
      try {
        const targetFile = await api.RepositoryFiles.show(
          target.repoID,
          filePath,
          target.branch,
        );
        if (computeSha256(fileInfo.file) === targetFile.content_sha256) {
          return 'skip';
        }
      } catch (error) {
        logger.warn(
          `Unable to retrieve detailed information for remote file ${filePath}`,
        );
      }
      return 'update';
    }
    return 'create';
  }
  return defaultCommitAction;
}
