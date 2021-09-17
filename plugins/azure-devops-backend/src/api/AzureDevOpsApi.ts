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

import { Logger } from 'winston';
import { WebApi } from 'azure-devops-node-api';
import { RepoBuild } from './types';
import {
  BuildResult,
  BuildStatus,
} from 'azure-devops-node-api/interfaces/BuildInterfaces';

export class AzureDevOpsApi {
  constructor(
    private readonly logger: Logger,
    private readonly webApi: WebApi,
    private readonly top: number,
  ) {}

  async getGitRepository(projectName: string, repoName: string) {
    if (this.logger) {
      this.logger.info(
        `Calling Azure DevOps REST API, getting Repository ${repoName} for Project ${projectName}`,
      );
    }

    const client = await this.webApi.getGitApi();
    return client.getRepository(repoName, projectName);
  }

  async getBuildList(projectName: string, repoId: string) {
    if (this.logger) {
      this.logger.info(
        `Calling Azure DevOps REST API, getting up to ${this.top} Builds for Repository Id ${repoId} for Project ${projectName}`,
      );
    }

    const client = await this.webApi.getBuildApi();
    return client.getBuilds(
      projectName,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.top,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      repoId,
      'TfsGit',
    );
  }

  async getRepoBuilds(projectName: string, repoName: string) {
    if (this.logger) {
      this.logger.info(
        `Calling Azure DevOps REST API, getting up to ${this.top} Builds for Repository ${repoName} for Project ${projectName}`,
      );
    }

    const gitRepository = await this.getGitRepository(projectName, repoName);
    const buildList = await this.getBuildList(
      projectName,
      gitRepository.id as string,
    );

    const repoBuilds = buildList.map(build => {
      const repoBuild: RepoBuild = {
        id: build.id as number,
        title: `${build.definition?.name} - ${build.buildNumber}`,
        link: build._links?.web.href,
        status: BuildStatus[build.status as BuildStatus],
        result: BuildResult[build.result as BuildResult],
        queueTime: build.queueTime as Date,
        source: `${build.sourceBranch} (${build.sourceVersion?.substr(0, 8)})`,
      };
      return repoBuild;
    });

    return repoBuilds;
  }
}
