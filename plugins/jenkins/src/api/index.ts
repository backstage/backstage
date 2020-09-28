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

import { createApiRef, DiscoveryApi } from '@backstage/core';
import { CITableBuildInfo } from '../components/BuildsPage/lib/CITable';

const jenkins = require('jenkins');

export const jenkinsApiRef = createApiRef<JenkinsApi>({
  id: 'plugin.jenkins.service',
  description: 'Used by the Jenkins plugin to make requests',
});

const DEFAULT_PROXY_PATH = '/jenkins/api';

type Options = {
  discoveryApi: DiscoveryApi;
  /**
   * Path to use for requests via the proxy, defaults to /jenkins/api
   */
  proxyPath?: string;
};

export class JenkinsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.proxyPath = options.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  private async getClient() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return jenkins({ baseUrl: proxyUrl + this.proxyPath, promisify: true });
  }

  async retry(buildName: string) {
    const client = await this.getClient();
    // looks like the current SDK only supports triggering a new build
    // can't see any support for replay (re-running the specific build with the same SCM info)
    return await client.job.build(buildName);
  }

  async getLastBuild(jobName: string) {
    const client = await this.getClient();
    const job = await client.job.get(jobName);

    const lastBuild = await client.build.get(jobName, job.lastBuild.number);
    return lastBuild;
  }

  extractScmDetailsFromJob(jobDetails: any): any {
    const scmInfo = jobDetails.actions
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

    const author = jobDetails.actions
      .filter(
        (action: any) =>
          action._class ===
          'jenkins.scm.api.metadata.ContributorMetadataAction',
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

  async getJob(jobName: string) {
    const client = await this.getClient();
    return client.job.get({
      name: jobName,
      depth: 1,
    });
  }

  async getFolder(folderName: string) {
    const client = await this.getClient();
    const folder = await client.job.get(folderName);
    const results = [];
    for (const jobSummary of folder.jobs) {
      const jobDetails = await client.job.get({
        name: `${folderName}/${jobSummary.name}`,
        depth: 1,
      });

      const jobScmInfo = this.extractScmDetailsFromJob(jobDetails);
      if (jobDetails.jobs) {
        // skipping folders inside folders for now
      } else {
        for (const buildDetails of jobDetails.builds) {
          const build = await client.build.get({
            name: `${folderName}/${jobSummary.name}`,
            number: buildDetails.number,
            depth: 1,
          });

          const ciTable = this.mapJenkinsBuildToCITable(build, jobScmInfo);
          results.push(ciTable);
        }
      }
    }
    return results;
  }

  private getTestReport(
    jenkinsResult: any,
  ): {
    total: number;
    passed: number;
    skipped: number;
    failed: number;
    testUrl: string;
  } {
    return jenkinsResult.actions
      .filter(
        (action: any) =>
          action._class === 'hudson.tasks.junit.TestResultAction',
      )
      .map((action: any) => {
        return {
          total: action.totalCount,
          passed: action.totalCount - action.failCount - action.skipCount,
          skipped: action.skipCount,
          failed: action.failCount,
          testUrl: `${jenkinsResult.url}${action.urlName}/`,
        };
      })
      .pop();
  }

  mapJenkinsBuildToCITable(
    jenkinsResult: any,
    jobScmInfo?: any,
  ): CITableBuildInfo {
    const source =
      jenkinsResult.actions
        .filter(
          (action: any) =>
            action._class === 'hudson.plugins.git.util.BuildData',
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
      source.url = jobScmInfo?.url;
      source.displayName = jobScmInfo?.displayName;
      source.author = jobScmInfo?.author;
    }

    const path = new URL(jenkinsResult.url).pathname;

    return {
      id: path,
      buildNumber: jenkinsResult.number,
      buildUrl: jenkinsResult.url,
      buildName: jenkinsResult.fullDisplayName,
      status: jenkinsResult.building ? 'running' : jenkinsResult.result,
      onRestartClick: () => {
        // TODO: this won't handle non root context path, need a better way to get the job name
        const { jobName } = this.extractJobDetailsFromBuildName(path);
        return this.retry(jobName);
      },
      source: source,
      tests: this.getTestReport(jenkinsResult),
    };
  }

  async getBuild(buildName: string) {
    const client = await this.getClient();
    const { jobName, buildNumber } = this.extractJobDetailsFromBuildName(
      buildName,
    );
    const buildResult = await client.build.get(jobName, buildNumber);
    return buildResult;
  }

  extractJobDetailsFromBuildName(buildName: string) {
    const trimmedBuild = buildName.replace(/\/job/g, '').replace(/\/$/, '');

    const split = trimmedBuild.split('/');
    const buildNumber = parseInt(split[split.length - 1], 10);
    const jobName = trimmedBuild.slice(
      0,
      trimmedBuild.length - buildNumber.toString(10).length - 1,
    );

    return {
      jobName,
      buildNumber,
    };
  }
}
