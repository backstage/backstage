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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabRepoExists.examples';

/**
 * Creates a `gitlab:repo:exists` Scaffolder action.
 *
 * @public
 */
export const createGitlabRepoExistsAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'gitlab:repo:exists',
    description: 'Validates that a GitLab repository exists',
    supportsDryRun: false,
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          }),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitLab',
            })
            .optional(),
      },
      output: {
        exists: z =>
          z.boolean({
            description: 'Whether the GitLab repository exists',
          }),
      },
    },  
    async handler(ctx) {
      const { token, repoUrl } = ctx.input;
      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner || !repo) {
        throw new InputError(
          `Invalid repoUrl: ${repoUrl}. Expected format 'gitlab.com?repo=project_name&owner=group_name'`,
        );
      }

      const api = getClient({ host, integrations, token });
      const repoID = `${owner}/${repo}`;

      try {
        // Use the Gitbeaker Projects.show() API call to check if the repository exists.
        await api.Projects.show(repoID);
      } catch (error: any) {
        // A 404 means the repository does not exist. For any other error, rethrow it and fail the action.
        if (error.cause?.response?.status === 404) {
          throw new InputError(
            `GitLab repository ${repoID} does not exist on ${host}`,
          );
        }
        throw error;
      }
    },
  });
};
