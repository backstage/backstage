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
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '../../createTemplateAction';
import { getOctokit } from './helpers';

export function createGithubActionsDispatchAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    workflowId: string;
    branchOrTagName: string;
  }>({
    id: 'github:actions:dispatch',
    description:
      'Dispatches a GitHub Action workflow for a given branch or tag',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'workflowId', 'branchOrTagName'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description: `Accepts the format 'github.com?repo=reponame&owner=owner' where 'reponame' is the new repository name and 'owner' is an organization or username`,
            type: 'string',
          },
          workflowId: {
            title: 'Workflow ID',
            description: 'The GitHub Action Workflow filename',
            type: 'string',
          },
          branchOrTagName: {
            title: 'Branch or Tag name',
            description:
              'The git branch or tag name used to dispatch the workflow',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { repoUrl, workflowId, branchOrTagName } = ctx.input;

      ctx.logger.info(
        `Dispatching workflow ${workflowId} for repo ${repoUrl} on ${branchOrTagName}`,
      );

      const { client, owner, repo } = await getOctokit({
        integrations,
        repoUrl,
      });

      await client.rest.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: workflowId,
        ref: branchOrTagName,
      });

      ctx.logger.info(`Workflow ${workflowId} dispatched successfully`);
    },
  });
}
