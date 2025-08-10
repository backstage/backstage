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
import AdmZip from 'adm-zip'; // For ZIP extraction

/**
 * Creates a new action that dispatches a GitHub Action workflow for a given branch or tag,
 * optionally waits for completion, and fetches output artifact.
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
      'Dispatches a GitHub Action workflow for a given branch or tag, optionally waits for completion and fetches output artifact',
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
                'Inputs keys and values to send to GitHub Action configured on the workflow file. The maximum number of properties is 10.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description:
                'The `GITHUB_TOKEN` to use for authorization to GitHub',
            })
            .optional(),

        // New inputs:
        waitForCompletion: z =>
          z.boolean({
            description:
              'If true, the action will wait for the workflow run to complete before continuing',
          }).optional().default(false),

        outputArtifactName: z =>
          z.string({
            description:
              'If provided, fetch this JSON artifact from the completed workflow run and expose as outputs',
          }).optional(),
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

      await ctx.checkpoint({
        key: `create.workflow.dispatch.${owner}.${repo}.${workflowId}`,
        fn: async () => {
          // Dispatch the workflow
          await client.rest.actions.createWorkflowDispatch({
            owner,
            repo,
            workflow_id: workflowId,
            ref: branchOrTagName,
            inputs: workflowInputs,
          });

          ctx.logger.info(`Workflow ${workflowId} dispatched successfully`);

          if (waitForCompletion) {
            // Poll to find the workflow run that was created by the dispatch
            ctx.logger.info('Waiting for workflow run to be created...');
            let workflowRun;
            const maxRunPollAttempts = 12;
            for (let i = 0; i < maxRunPollAttempts; i++) {
              const { data } = await client.rest.actions.listWorkflowRuns({
                owner,
                repo,
                workflow_id: workflowId,
                event: 'workflow_dispatch',
                branch: branchOrTagName,
                per_page: 5,
              });
              // Pick the most recent run matching the branch/tag
              workflowRun = data.workflow_runs
                .filter(run => run.head_branch === branchOrTagName)
                .sort(
                  (a, b) =>
                    +new Date(b.created_at) - +new Date(a.created_at),
                )[0];
              if (workflowRun) break;
              ctx.logger.info(
                'Workflow run not found yet, retrying in 5 seconds...',
              );
              await new Promise(res => setTimeout(res, 5000));
            }

            if (!workflowRun) {
              throw new Error('Unable to find workflow run for dispatch');
            }

            const runId = workflowRun.id;
            ctx.logger.info(`Found workflow run: ${runId}`);

            // Poll for workflow completion
            const maxPollAttempts = 60;
            const pollIntervalMs = 5000;
            let completed = false;
            let runData = workflowRun;

            ctx.logger.info('Polling workflow run for completion...');
            for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
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
                `Attempt ${attempt + 1}: Workflow status: ${run.status}, waiting ${pollIntervalMs /
                  1000}s...`,
              );
              await new Promise(res => setTimeout(res, pollIntervalMs));
            }

            if (!completed) {
              throw new Error('Timed out waiting for workflow completion');
            }

            ctx.logger.info(
              `Workflow run completed with conclusion: ${runData.conclusion}`,
            );
            ctx.output('conclusion', runData.conclusion);

            // If requested, fetch and parse output artifact JSON
            if (outputArtifactName) {
              ctx.logger.info(
                `Fetching output artifact '${outputArtifactName}' for run ${runId}`,
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

              if (artifact) {
                const { data: zipData } =
                  await client.rest.actions.downloadArtifact({
                    owner,
                    repo,
                    artifact_id: artifact.id,
                    archive_format: 'zip',
                  });

                try {
                  const zip = new AdmZip(Buffer.from(zipData));
                  const zipEntries = zip.getEntries();
                  let outputJson: any = undefined;
                  for (const zipEntry of zipEntries) {
                    if (zipEntry.entryName.endsWith('.json')) {
                      const content = zipEntry.getData().toString('utf8');
                      outputJson = JSON.parse(content);
                      break;
                    }
                  }

                  if (outputJson) {
                    ctx.logger.info('Output artifact JSON parsed successfully');
                    ctx.output('outputs', outputJson);
                  } else {
                    ctx.logger.warn(
                      'No JSON file found inside output artifact ZIP',
                    );
                  }
                } catch (error) {
                  ctx.logger.warn(
                    `Failed to extract or parse output artifact: ${error}`,
                  );
                }
              } else {
                ctx.logger.warn(`Artifact '${outputArtifactName}' not found`);
              }
            }
          } // end if waitForCompletion
        },
      });
    },
  });
}
