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

import { map } from 'already';
import { uniqBy } from 'lodash';
import {
  Build,
  CicdStatisticsApi,
  CicdState,
  FetchBuildsOptions,
  FilterStatusType,
  FilterBranchType,
  AbortError,
  CicdConfiguration,
} from '@backstage/plugin-cicd-statistics';
import {
  GithubOctokitApi,
  OctokitWithOwnerRepo,
} from '@backstage/plugin-github-octokit';

import { jobsToStages, parseBuild, ParsedBuild } from './types';

const compareAsc = (a: Date, b: Date) => {
  if (a.getTime() === b.getTime()) {
    return 0;
  }
  return a.getTime() > b.getTime() ? 1 : -1;
};
const isBefore = (a: Date, b: Date) => a.getTime() < b.getTime();

type PushProgress = (percentBuilds: number, percentJobs: number) => void;

export class CicdStatisticsApiGithub implements CicdStatisticsApi {
  constructor(private githubOctokitApi: GithubOctokitApi) {}

  private async getDefaultBranch(octo: OctokitWithOwnerRepo) {
    const { octokit, ...ownerRepo } = octo;
    const repo = await octokit.rest.repos.get({ ...ownerRepo });
    return repo.data.default_branch ?? 'master';
  }

  private async listWorkflowRuns(
    { octokit, ...ownerRepo }: OctokitWithOwnerRepo,
    pageSize = 100,
    page = 0,
    branch?: string,
  ) {
    const workflowRuns = await octokit.rest.actions.listWorkflowRunsForRepo({
      ...ownerRepo,
      per_page: pageSize,
      page,
      ...(branch ? { branch } : {}),
    });
    return workflowRuns.data;
  }

  private async listJobsForWorkflowRun(
    { octokit, ...ownerRepo }: OctokitWithOwnerRepo,
    id: number,
    pageSize = 100,
    page = 0,
  ) {
    const jobs = await octokit.rest.actions.listJobsForWorkflowRun({
      ...ownerRepo,
      run_id: id,
      per_page: pageSize,
      page,
    });
    return jobs.data;
  }

  /**
   * Fetches builds (workflow runs)
   */
  private async fetchBuildInfos(
    octo: OctokitWithOwnerRepo,
    timeFrom: Date,
    timeTo: Date,
    filterStatus: Array<FilterStatusType | 'all'>,
    filterType: FilterBranchType | 'all',
    abortSignal: AbortSignal,
    pushProgress: PushProgress,
  ) {
    const builds: Array<ParsedBuild> = [];

    const branch =
      filterType === 'master' ? await this.getDefaultBranch(octo) : undefined;

    const rawBuilds = await this.listWorkflowRuns(
      octo,
      undefined,
      undefined,
      branch,
    );

    const pageSize = rawBuilds.workflow_runs.length;

    const firstBuilds = rawBuilds.workflow_runs.map(build => parseBuild(build));

    if (!firstBuilds?.length) return [];

    builds.push(...firstBuilds);

    const getFirstBuild = () => {
      builds.sort((a, b) => compareAsc(a.requestedAt, b.requestedAt));
      return builds[0];
    };

    const getProgress = () => {
      if (builds.length === 0) return 0;

      const start = timeFrom.getTime();

      const first = builds[0].requestedAt.getTime();
      const last = builds[builds.length - 1].requestedAt.getTime();

      const progress = (last - first) / (last - start);

      return progress > 1 ? 1 : progress;
    };

    let page = 0;
    while (isBefore(timeFrom, getFirstBuild().requestedAt)) {
      if (abortSignal.aborted) throw new AbortError('');

      pushProgress(getProgress(), 0);
      ++page;
      const nextRawBuilds = await this.listWorkflowRuns(
        octo,
        pageSize,
        page,
        branch,
      );

      if (
        nextRawBuilds.total_count === 0 ||
        nextRawBuilds.workflow_runs.length === 0
      ) {
        break;
      }

      builds.push(
        ...nextRawBuilds.workflow_runs.map(build => parseBuild(build)),
      );
    }

    return uniqBy(builds, 'id')
      .filter(
        build =>
          filterStatus.includes('all') || filterStatus.includes(build.status),
      )
      .filter(build => filterType === 'all' || build.branchType === filterType)
      .filter(
        build =>
          isBefore(build.requestedAt, timeTo) &&
          isBefore(timeFrom, build.requestedAt),
      );
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

  public async fetchBuilds(options: FetchBuildsOptions): Promise<CicdState> {
    const {
      entity,
      updateProgress,
      abortSignal,
      timeFrom,
      timeTo,
      filterStatus = ['all'],
      filterType = 'all',
    } = options;

    const octo = await this.githubOctokitApi.getOctokitForEntity(entity, [
      'repo',
    ]);

    updateProgress(0, 0, 0);

    const pushProgress = (percentBuilds: number, percentJobs: number) =>
      updateProgress([
        {
          title: 'Fetching workflows runs',
          completed: percentBuilds,
          total: 1,
        },
        {
          title: 'Fetching workflow jobs',
          completed: percentJobs,
          total: 1,
        },
      ]);

    const builds = await this.fetchBuildInfos(
      octo,
      timeFrom,
      timeTo,
      filterStatus,
      filterType,
      abortSignal,
      pushProgress,
    );

    let finished = 0;
    const pushProgressJob = () => {
      pushProgress(1, finished / builds.length);
    };

    // Fetch workflow jobs per run

    const buildsWithInfo = (
      await map(
        builds,
        { concurrency: 8 },
        async (build): Promise<Build | undefined> => {
          if (abortSignal.aborted) throw new AbortError();

          pushProgressJob();

          try {
            const jobs = await this.listJobsForWorkflowRun(octo, build.raw.id);

            const stages = jobsToStages(jobs);

            const { raw, ...buildWithoutRaw } = build;

            return { ...buildWithoutRaw, stages };
          } catch (err: any) {
            console.error(
              `Failed to fetch and parse job ${build.raw.id}`,
              err?.message,
            );
            return undefined;
          } finally {
            ++finished;
          }
        },
      )
    ).filter((v): v is NonNullable<typeof v> => !!v);

    return {
      builds: buildsWithInfo,
    };
  }
}
