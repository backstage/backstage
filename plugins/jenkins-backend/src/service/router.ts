/*
 * Copyright 2020 Spotify AB
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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import jenkins from 'jenkins';
import {
  BackstageBuild,
  BackstageProject,
  JenkinsBuild,
  JenkinsProject,
  ScmDetails,
} from '../types';
import { JenkinsInfo, JenkinsInfoProvider } from './jenkinsInfoProvider';

const lastBuildTreeSpec = `lastBuild[
                    number,
                    url,
                    fullDisplayName,
                    displayName,
                    building,
                    result,
                    timestamp,
                    duration,
                    actions[
                      *[
                        *[
                          *[
                            *
                          ]
                        ]
                      ]
                    ]
                  ],`;

const jobTreeSpec = `actions[*],
                   ${lastBuildTreeSpec}
                   jobs{0,1},
                   name,
                   displayName,
                   fullDisplayName`;

const jobsTreeSpec = `jobs[
                   ${jobTreeSpec}
                 ]{0,50}`;

export interface RouterOptions {
  logger: Logger;
  jenkinsInfoProvider: JenkinsInfoProvider;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  // @ts-ignore keeping unused logger for future use
  const { logger, jenkinsInfoProvider } = options;

  const router = Router();
  router.use(express.json());

  router.get(
    '/v1/entity/:namespace/:kind/:name/projects',
    async (request, response) => {
      const { namespace, kind, name } = request.params;
      const branch = request.query.branch;

      const jenkinsInfo = await jenkinsInfoProvider.getInstance({
        entityRef: {
          kind,
          namespace,
          name,
        },
      });

      const client = await getClient(jenkinsInfo);
      const projects: BackstageProject[] = [];

      if (branch) {
        // we have been asked to filter to a single branch.
        // Assume jenkinsInfo.jobName is a folder which contains one job per branch.
        // TODO: extract a strategy interface for this
        const job = await client.job.get({
          name: `${jenkinsInfo.jobName}/${branch}`,
          tree: jobTreeSpec.replace(/\s/g, ''),
        });
        projects.push(augmentProject(job));
      } else {
        // We aren't filtering
        // Assume jenkinsInfo.jobName is a folder which contains one job per branch.
        const folder = await client.job.get({
          name: jenkinsInfo.jobName,
          // Filter only be the information we need, instead of loading all fields.
          // Limit to only show the latest build for each job and only load 50 jobs
          // at all.
          // Whitespaces are only included for readablity here and stripped out
          // before sending to Jenkins
          tree: jobsTreeSpec.replace(/\s/g, ''),
        });

        // TODO: support this being a project itself.
        for (const jobDetails of folder.jobs) {
          // for each branch (we assume)
          if (jobDetails?.jobs) {
            // skipping folders inside folders for now
            // TODO: recurse
          } else {
            projects.push(augmentProject(jobDetails));
          }
        }
      }

      response.send({
        projects: projects,
      });
    },
  );

  router.get(
    '/v1/entity/:namespace/:kind/:name/job/:jobName/:buildNumber',
    async (request, response) => {
      const {
        namespace,
        kind,
        name,
        jobName: jobNameEnc,
        buildNumber,
      } = request.params;

      const jobName = decodeURIComponent(jobNameEnc);

      const jenkinsInfo = await jenkinsInfoProvider.getInstance({
        entityRef: {
          kind,
          namespace,
          name,
        },
        jobName,
      });

      const client = await getClient(jenkinsInfo);

      const project = await client.job.get({
        name: jobName,
        depth: 1,
      });

      const build = await client.build.get(jobName, parseInt(buildNumber, 10));

      const jobScmInfo = extractScmDetailsFromJob(project);

      response.send({
        build: augmentBuild(build, jobScmInfo),
      });
    },
  );

  router.use(errorHandler());
  return router;
}

function augmentProject(project: JenkinsProject): BackstageProject {
  const jobScmInfo = extractScmDetailsFromJob(project);

  let status: string;
  if (project.inQueue) {
    status = 'queued';
  } else if (project.lastBuild.building) {
    status = 'running';
  } else if (!project.lastBuild.result) {
    status = 'unknown';
  } else {
    status = project.lastBuild.result;
  }

  return {
    ...project,
    lastBuild: augmentBuild(project.lastBuild, jobScmInfo),
    status,
    // actions: undefined,
  };
}

function augmentBuild(
  build: JenkinsBuild,
  jobScmInfo: ScmDetails | undefined,
): BackstageBuild {
  const source =
    build.actions
      .filter(
        (action: any) => action._class === 'hudson.plugins.git.util.BuildData',
      )
      .map((action: any) => {
        const [first]: any = Object.values(action.buildsByBranchName);
        const branch = first.revision.branch[0];
        return {
          branchName: branch.name,
          commit: {
            hash: branch.SHA1.substring(0, 8),
          },
        };
      })
      .pop() || {};

  if (jobScmInfo) {
    source.url = jobScmInfo.url;
    source.displayName = jobScmInfo.displayName;
    source.author = jobScmInfo.author;
  }

  let status: string;
  if (build.building) {
    status = 'running';
  } else if (!build.result) {
    status = 'unknown';
  } else {
    status = build.result;
  }
  return {
    ...build,
    status,
    source: source,
    tests: getTestReport(build),
  };
}

function extractScmDetailsFromJob(
  project: JenkinsProject,
): ScmDetails | undefined {
  const scmInfo: ScmDetails | undefined = project.actions
    .filter(
      (action: any) =>
        action._class === 'jenkins.scm.api.metadata.ObjectMetadataAction',
    )
    .map((action: any) => {
      return {
        url: action?.objectUrl,
        // https://javadoc.jenkins.io/plugin/scm-api/jenkins/scm/api/metadata/ObjectMetadataAction.html
        // branch name for regular builds, pull request title on pull requests
        displayName: action?.objectDisplayName,
      };
    })
    .pop();

  if (!scmInfo) {
    return undefined;
  }

  const author = project.actions
    .filter(
      (action: any) =>
        action._class === 'jenkins.scm.api.metadata.ContributorMetadataAction',
    )
    .map((action: any) => {
      return action.contributorDisplayName;
    })
    .pop();

  if (author) {
    scmInfo.author = author;
  }

  return scmInfo;
}

function getTestReport(
  build: JenkinsBuild,
): {
  total: number;
  passed: number;
  skipped: number;
  failed: number;
  testUrl: string;
} {
  return build.actions
    .filter(
      (action: any) => action._class === 'hudson.tasks.junit.TestResultAction',
    )
    .map((action: any) => {
      return {
        total: action.totalCount,
        passed: action.totalCount - action.failCount - action.skipCount,
        skipped: action.skipCount,
        failed: action.failCount,
        testUrl: `${build.url}${action.urlName}/`,
      };
    })
    .pop();
}

async function getClient(jenkinsInfo: JenkinsInfo) {
  // The typings for the jenkins library are out of date so just cast to any
  return jenkins({
    baseUrl: jenkinsInfo.baseUrl,
    headers: jenkinsInfo.headers,
    promisify: true,
  }) as any;
}
