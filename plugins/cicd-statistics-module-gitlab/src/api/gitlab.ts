/*
 * Copyright 2022 The Backstage Authors
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
  CicdStatisticsApi,
  CicdState,
  CicdConfiguration,
  Build,
  FilterStatusType,
  FetchBuildsOptions,
  Stage,
} from '@backstage/plugin-cicd-statistics';
import { Gitlab } from '@gitbeaker/browser';
import { OAuthApi } from '@backstage/core-plugin-api';
import limiterFactory from 'p-limit';

import { Types } from '@gitbeaker/core';
import { Entity, getEntitySourceLocation } from '@backstage/catalog-model';

const statusMap: Record<string, FilterStatusType> = {
  manual: 'unknown',
  created: 'enqueued',
  waiting_for_resource: 'stalled',
  preparing: 'unknown',
  pending: 'scheduled',
  running: 'running',
  success: 'succeeded',
  failed: 'failed',
  canceled: 'aborted',
  skipped: 'aborted',
  scheduled: 'scheduled',
};

function jobtToBuild(jobs: Array<Types.PipelineSchema>): Build[] {
  return jobs.map(j => {
    return {
      id: j.id.toString(),
      status: statusMap[j.status],
      branchType: 'master',
      duration: 0, // will get filled in later in a seperate API call
      requestedAt: new Date(j.created_at),
      stages: [],
    };
  });
}

function jobsToStages(jobs: Array<Types.JobSchema>): Stage[] {
  return jobs.map(j => {
    const status = statusMap[j.status] ? statusMap[j.status] : 'unknown';
    return {
      name: j.name,
      status: status,
      duration: j.duration ? ((j.duration * 1000) as number) : 0,
    };
  });
}

/**
 * This type represents a initialized gitlab client with gitbeaker
 *
 * @public
 */
export type GitlabClient = {
  /* the actual API of gitbeaker */
  api: InstanceType<typeof Gitlab>;
  /* the owner the repository, retrieved from the entity source location  */
  owner: string;
};

/**
 * Extracts the CI/CD statistics from a Gitlab repository
 *
 * @public
 */
export class CicdStatisticsApiGitlab implements CicdStatisticsApi {
  readonly #gitLabAuthApi: OAuthApi;

  constructor(gitLabAuthApi: OAuthApi) {
    this.#gitLabAuthApi = gitLabAuthApi;
  }

  public async createGitlabApi(
    entity: Entity,
    scopes: string[],
  ): Promise<GitlabClient> {
    const entityInfo = getEntitySourceLocation(entity);
    const url = new URL(entityInfo.target);
    const owner = url.pathname.split('/-/blob/')[0];
    const oauthToken = await this.#gitLabAuthApi.getAccessToken(scopes);
    return {
      api: new Gitlab({
        host: `https://${url.host}`,
        oauthToken,
      }),
      owner: owner.substring(1),
    };
  }

  private static async updateBuildWithStages(
    gitbeaker: InstanceType<typeof Gitlab>,
    owner: string,
    build: Build,
  ): Promise<Stage[]> {
    const jobs = await gitbeaker.Jobs.showPipelineJobs(
      owner,
      parseInt(build.id, 10),
    );
    const stages = jobsToStages(jobs);
    return stages;
  }

  private static async getDurationOfBuild(
    gitbeaker: InstanceType<typeof Gitlab>,
    owner: string,
    build: Build,
  ): Promise<number> {
    const pipeline = (await gitbeaker.Pipelines.show(
      owner,
      parseInt(build.id, 10),
    )) as Types.PipelineExtendedSchema;
    return parseInt(pipeline.duration as string, 10) * 1000;
  }

  private static async getDefaultBranch(
    gitbeaker: InstanceType<typeof Gitlab>,
    owner: string,
  ): Promise<string | undefined> {
    const branches = await gitbeaker.Branches.all(owner);
    return branches.find(b => b.default)?.name;
  }

  public async fetchBuilds(options: FetchBuildsOptions): Promise<CicdState> {
    const {
      entity,
      updateProgress,
      timeFrom,
      timeTo,
      filterStatus = ['all'],
      filterType = 'all',
    } = options;
    const { api, owner } = await this.createGitlabApi(entity as Entity, [
      'read_api',
    ]);
    updateProgress(0, 0, 0);

    const branch =
      filterType === 'master'
        ? await CicdStatisticsApiGitlab.getDefaultBranch(api, owner)
        : undefined;
    const pipelines = await api.Pipelines.all(owner, {
      perPage: 25,
      updated_after: timeFrom.toISOString(),
      updated_before: timeTo.toISOString(),
      ref: branch,
    });

    const limiter = limiterFactory(10);
    const builds = jobtToBuild(pipelines).map(async build => ({
      ...build,
      duration: await limiter(() =>
        CicdStatisticsApiGitlab.getDurationOfBuild(api, owner, build),
      ),
      stages: await limiter(() =>
        CicdStatisticsApiGitlab.updateBuildWithStages(api, owner, build),
      ),
    }));
    const promisedBuilds = (await Promise.all(builds)).filter(b =>
      filterStatus.includes(b.status),
    ) as unknown as Build[];

    return { builds: promisedBuilds };
  }

  public async getConfiguration(): Promise<Partial<CicdConfiguration>> {
    return {
      availableStatuses: [
        'succeeded',
        'failed',
        'enqueued',
        'running',
        'aborted',
        'stalled',
        'expired',
        'unknown',
      ] as const,
    };
  }
}
