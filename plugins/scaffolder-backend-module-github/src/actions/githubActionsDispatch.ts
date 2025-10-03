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
import { Buffer } from 'buffer';
import unzipper from 'unzipper';

/**
 * Dispatches a GitHub Action workflow, optionally waits for completion, and can fetch outputs.
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
      'Dispatches a GitHub Action workflow for a given branch or tag; optionally waits for completion & exposes outputs/artifacts.',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Format: `github.com?repo=reponame&owner=owner`, e.g., for repo and owner.',
          }),
        workflowId: z =>
          z.string({
            description: 'The GitHub Action Workflow filename or number ID.',
          }),
        branchOrTagName: z =>
          z.string({
            description: 'The branch or tag to run the workflow on.',
          }),
        workflowInputs: z =>
          z
            .record(z.string())
            .optional()
            .describe('Workflow input parameters; up to 10 properties.'),
        token: z =>
          z
            .string()
            .optional()
            .describe('Optional GitHub `GITHUB_TOKEN` for authentication.'),
        waitForCompletion: z =>
          z
            .boolean()
            .optional()
            .default(false)
            .describe('If true, will wait for completion before continuing.'),
        outputArtifactName: z =>
          z
            .string()
            .optional()
            .describe(
              'If provided, fetch JSON artifact with this name as output.',
            ),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        workflowId,
        branchOrTagName,
        workflowInputs,
        token: providedToken,
        waitForCompletion = false,
        outputArtifactName,
      } = ctx.input;

      ctx.logger.info(
        `Dispatching workflow ${workflowId} for repo ${repoUrl} on branch/tag ${branchOrTagName}`,
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

      await ctx.checkpoint({
        key: `create.workflow.dispatch.${owner}.${repo}.${workflowId}`,
        fn: async () => {
          // Dispatch workflow
          await client.rest.actions.createWorkflowDispatch({
            owner,
            repo,
            workflow_id: workflowId,
            ref: branchOrTagName,
            inputs: workflowInputs,
          });
          ctx.logger.info(`Workflow ${workflowId} dispatched successfully`);

          if (!waitForCompletion) return;

          // Wait for workflow run to be created
          ctx.logger.info('Waiting for workflow run to appear...');
          let workflowRun;
          for (let i = 0; i < 12; i++) {
            const { data } = await client.rest.actions.listWorkflowRuns({
              owner,
              repo,
              workflow_id: workflowId,
              event: 'workflow_dispatch',
              branch: branchOrTagName,
              per_page: 5,
            });
            workflowRun = data.workflow_runs
              .filter(run => run.head_branch === branchOrTagName)
              .sort(
                (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
              )[0];
            if (workflowRun) break;
            ctx.logger.info(
              `Workflow run not found yet, retrying... (${i + 1}/12)`,
            );
            await new Promise(res => setTimeout(res, 5000));
          }
          if (!workflowRun)
            throw new Error('Unable to find workflow run for dispatch');

          // Poll for completion
          const runId = workflowRun.id;
          let completed = false;
          let runData = workflowRun;

          ctx.logger.info(
            `Polling workflow run (id: ${runId}) for completion...`,
          );

          for (let attempt = 0; attempt < 60; attempt++) {
            const { data: run } = await client.rest.actions.getWorkflowRun({
              owner,
              repo,
              run_id: runId,
            });
            if (run.status === 'completed') {
              completed = true;
              runData = run;
              break;
            }
            ctx.logger.info(
              `Attempt ${attempt + 1}: Workflow status ${
                run.status
              }, waiting...`,
            );
            await new Promise(res => setTimeout(res, 5000));
          }

          if (!completed)
            throw new Error('Timed out waiting for workflow completion');

          ctx.logger.info(`Workflow run completed: ${runData.conclusion}`);
          ctx.output('conclusion', runData.conclusion);

          if (!outputArtifactName) return;

          // Fetch and output artifact JSON if specified
          ctx.logger.info(
            `Fetching output artifact '${outputArtifactName}' from run ${runId}`,
          );
          const { data: artifactsData } =
            await client.rest.actions.listWorkflowRunArtifacts({
              owner,
              repo,
              run_id: runId,
            });

          const artifact = artifactsData.artifacts.find(
            a => a.name === outputArtifactName,
          );
          if (!artifact) {
            ctx.logger.warn(`Artifact '${outputArtifactName}' not found`);
            return;
          }

          const { data: zipData } = await client.rest.actions.downloadArtifact({
            owner,
            repo,
            artifact_id: artifact.id,
            archive_format: 'zip',
          });

          try {
            const zipBuffer = Buffer.from(zipData as Uint8Array);
            const directory = await unzipper.Open.buffer(zipBuffer);

            let outputJson: any = undefined;
            for (const file of directory.files) {
              if (file.path.endsWith('.json')) {
                const content = await file.buffer();
                outputJson = JSON.parse(content.toString('utf8'));
                break;
              }
            }
            if (outputJson) {
              ctx.logger.info('Output artifact JSON parsed successfully');
              ctx.output('outputs', outputJson);
            } else {
              ctx.logger.warn('No JSON file found inside output artifact ZIP');
            }
          } catch (error) {
            ctx.logger.warn(
              `Failed to extract or parse output artifact: ${error}`,
            );
          }
        },
      });
    },
  });
}
