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

import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Octokit } from 'octokit';
import { getOctokitOptions } from '../util';
import { examples } from './githubActionsDispatch.examples';
import { Buffer } from 'buffer';
import unzipper from 'unzipper';

// Helper to use in loops
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Dispatches a GitHub Action workflow, optionally waits for completion, and can fetch outputs.
 * @public
 */
export function createGithubActionsDispatchAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction({
    id: 'github:actions:dispatch',
    description:
      'Dispatches a GitHub Action workflow; optionally waits for completion & exposes outputs/artifacts.',
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
            description:
              'The git branch or tag name used to dispatch the workflow',
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
        initialWaitSeconds: z =>
          z
            .number()
            .optional()
            .default(5)
            .describe(
              'Time (sec) to wait for the workflow run to appear after dispatching.',
            ),
        pollIntervalSeconds: z =>
          z
            .number()
            .optional()
            .default(10)
            .describe(
              'Time (sec) between polling for workflow completion status.',
            ),
        timeoutMinutes: z =>
          z
            .number()
            .optional()
            .default(30)
            .describe('Max time (min) to wait for workflow completion.'),
      },
      output: {
        conclusion: z =>
          z
            .string()
            .optional()
            .describe(
              'The conclusion of the run (e.g., success, failure). Only available if waitForCompletion is true.',
            ),
        outputs: z =>
          z
            .any()
            .optional()
            .describe(
              'JSON content from the specified outputArtifactName. Only available if artifact is found and parsed.',
            ),
        runUrl: z =>
          z.string().describe('The URL of the triggered GitHub Actions run.'),
        runId: z =>
          z.number().describe('The ID of the triggered GitHub Actions run.'),
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
        initialWaitSeconds,
        pollIntervalSeconds,
        timeoutMinutes,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      const integration = integrations.byHost(host);
      if (!integration) {
        throw new Error(
          `No integration found for host ${host}, supported hosts are ${integrations.hosts.join(
            ', ',
          )}`,
        );
      }

      const token = providedToken ?? integration.config.token;
      const client = new Octokit(
        await getOctokitOptions({ token, integrations, repoUrl }),
      );

      
      // This step is idempotent. If it's re-run, it returns the saved runId/runUrl.
      const { runId, runUrl } = await ctx.checkpoint({
        key: `dispatch-and-find-${owner}-${repo}-${workflowId.replace(
          '.',
          '-',
        )}-${branchOrTagName}`,
        fn: async () => {
          ctx.logger.info(
            `Dispatching workflow ${workflowId} for repo ${repoUrl} on branch/tag ${branchOrTagName}`,
          );

          const dispatchTimestamp = Date.now();
          await client.rest.actions.createWorkflowDispatch({
            owner,
            repo,
            workflow_id: workflowId,
            ref: branchOrTagName,
            inputs: workflowInputs,
          });

          ctx.logger.info(`Workflow dispatched. Waiting for run to appear...`);

          const initialWaitMs = initialWaitSeconds! * 1000;
          let workflowRun;
          const findStartTime = Date.now();
          while (Date.now() - findStartTime < initialWaitMs) {
            const { data } = await client.rest.actions.listWorkflowRuns({
              owner,
              repo,
              workflow_id: workflowId,
              event: 'workflow_dispatch',
              branch: branchOrTagName,
              per_page: 5,
            });

            workflowRun = data.workflow_runs
              .filter(run => +new Date(run.created_at) >= dispatchTimestamp)
              .sort(
                (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
              )[0];

            if (workflowRun) break;

            await sleep(5000); // Wait 5 seconds AFTER checking
          }

          if (!workflowRun) {
            throw new Error(
              `Unable to find workflow run after dispatch. Waited ${initialWaitSeconds}s.`,
            );
          }

          ctx.logger.info(`Found run ${workflowRun.id}`);
          return { runId: workflowRun.id, runUrl: workflowRun.html_url };
        },
      });

      ctx.output('runUrl', runUrl);
      ctx.output('runId', runId);

      if (!waitForCompletion) {
        ctx.logger.info('Not waiting for completion.');
        return;
      }

      
      const conclusion = await ctx.checkpoint({
        key: `poll-${runId}`,
        fn: async () => {
          ctx.logger.info(
            `Polling workflow run ${runId} for completion... (Timeout: ${timeoutMinutes}m)`,
          );

          const timeoutMs = timeoutMinutes! * 60 * 1000;
          const pollIntervalMs = pollIntervalSeconds! * 1000;
          const pollStartTime = Date.now();
          let runData;

          while (Date.now() - pollStartTime < timeoutMs) {
            const { data: run } = await client.rest.actions.getWorkflowRun({
              owner,
              repo,
              run_id: runId,
            });

            if (run.status === 'completed') {
              runData = run;
              break;
            }

            ctx.logger.info(
              `Workflow status is ${run.status}. Waiting ${pollIntervalSeconds}s...`,
            );
            await sleep(pollIntervalMs);
          }

          if (!runData || runData.status !== 'completed') {
            throw new Error(
              `Timed out waiting for workflow completion after ${timeoutMinutes} minutes.`,
            );
          }

          ctx.logger.info(`Workflow run completed: ${runData.conclusion}`);
          return runData.conclusion as string;
        },
      });

      ctx.output('conclusion', conclusion);

      if (conclusion !== 'success') {
        throw new Error(
          `Workflow run failed with conclusion: ${conclusion}. See ${runUrl}`,
        );
      }

      if (!outputArtifactName) {
        return;
      }

      
      const outputs = await ctx.checkpoint({
        key: `artifact-${runId}-${outputArtifactName}`,
        fn: async () => {
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
            return undefined;
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

            for (const file of directory.files) {
              if (file.path.endsWith('.json')) {
                const content = await file.buffer();
                const outputJson = JSON.parse(content.toString('utf8'));
                ctx.logger.info('Output artifact JSON parsed successfully');
                return outputJson;
              }
            }
          } catch (error) {
            ctx.logger.warn(
              `Failed to extract or parse output artifact: ${error}`,
            );
          }
          return undefined;
        },
      });

      if (outputs) {
        ctx.output('outputs', outputs);
      } else {
        ctx.logger.warn('No JSON file found inside output artifact ZIP');
      }
    },
  });
}
