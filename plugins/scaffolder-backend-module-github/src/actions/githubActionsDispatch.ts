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

import { assertError, InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Octokit } from 'octokit';
import { getOctokitOptions } from '../util';
import { examples } from './githubActionsDispatch.examples';

/**
 * Creates a new action that dispatches a GitHub Action workflow for a given branch or tag.
 * @public
 */
export function createGithubActionsDispatchAction(options: {
  integrations: ScmIntegrations;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:actions:dispatch',
    description:
      'Dispatches a GitHub Action workflow for a given branch or tag',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
        workflowId: z =>
          z.string({
            description: 'The GitHub Action Workflow filename',
          }),
        branchOrTagName: z =>
          z.string({
            description:
              'The git branch or tag name used to dispatch the workflow',
          }),
        workflowInputs: z =>
          z
            .record(z.string(), {
              description:
                'Inputs keys and values to send to GitHub Action configured on the workflow file. The maximum number of properties is 25.',
            })
            .optional(),
        returnWorkflowRunDetails: z =>
          z
            .boolean({
              description:
                'If true, returns the workflow run ID and URLs as action outputs.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description:
                'The `GITHUB_TOKEN` to use for authorization to GitHub',
            })
            .optional(),
      },
      output: {
        workflowRunId: z =>
          z.number({ description: 'The triggered workflow run ID' }).optional(),
        workflowRunUrl: z =>
          z.string({ description: 'API URL of the workflow run' }).optional(),
        workflowRunHtmlUrl: z =>
          z.string({ description: 'HTML URL of the workflow run' }).optional(),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        workflowId,
        branchOrTagName,
        workflowInputs,
        returnWorkflowRunDetails,
        token: providedToken,
      } = ctx.input;

      ctx.logger.info(
        `Dispatching workflow ${workflowId} for repo ${repoUrl} on ${branchOrTagName}`,
      );

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        host,
        owner,
        repo,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
      });
      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      try {
        const runDetails = await ctx.checkpoint({
          key: `create.workflow.dispatch.${owner}.${repo}.${workflowId}`,
          fn: async () => {
            const dispatchParams = {
              owner,
              repo,
              workflow_id: workflowId,
              ref: branchOrTagName,
              inputs: workflowInputs,
              ...(returnWorkflowRunDetails ? { return_run_details: true } : {}),
            };
            const response = await client.rest.actions.createWorkflowDispatch(
              dispatchParams,
            );

            ctx.logger.info(`Workflow ${workflowId} dispatched successfully`);

            if (returnWorkflowRunDetails && response.data) {
              // GitHub's API returns 200 with run details when return_run_details is true.
              // @octokit/openapi-types still types this as OctokitResponse<never, 204> because
              // it hasn't picked up the updated GitHub OpenAPI spec yet.
              // See: https://github.blog/changelog/2026-02-19-workflow-dispatch-api-now-returns-run-ids/
              // This cast can be removed once @octokit/openapi-types includes the updated spec.
              // Note: only supported on GitHub.com and GitHub Enterprise Cloud, not GitHub Enterprise Server
              const data = response.data as unknown as {
                workflow_run_id: number;
                run_url: string;
                html_url: string;
              };

              return {
                workflowRunId: data.workflow_run_id,
                workflowRunUrl: data.run_url,
                workflowRunHtmlUrl: data.html_url,
              };
            }
            return null;
          },
        });

        if (runDetails) {
          ctx.output('workflowRunId', runDetails.workflowRunId);
          ctx.output('workflowRunUrl', runDetails.workflowRunUrl);
          ctx.output('workflowRunHtmlUrl', runDetails.workflowRunHtmlUrl);

          if (runDetails.workflowRunHtmlUrl) {
            ctx.logger.info(
              `Workflow run url: ${runDetails.workflowRunHtmlUrl}`,
            );
          }
        }
      } catch (e) {
        assertError(e);
        ctx.logger.warn(
          `Failed: dispatching workflow '${workflowId}' on repo: '${repo}', ${e.message}`,
        );
        throw e;
      }
    },
  });
}
