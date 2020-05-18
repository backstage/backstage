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
import { errorApiRef, useApi } from '@backstage/core';
import { BuildSummary, GitType } from 'circleci-api';
import { useCallback, useEffect, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { circleCIApiRef } from '../api/index';
import { CITableBuildInfo } from '../pages/BuildsPage/lib/CITable';
import { useSettings } from './useSettings';

const makeReadableStatus = (status: string | undefined) => {
  if (!status) return '';
  return ({
    retried: 'Retried',
    canceled: 'Canceled',
    infrastructure_fail: 'Infra fail',
    timedout: 'Timedout',
    not_run: 'Not run',
    running: 'Running',
    failed: 'Failed',
    queued: 'Queued',
    scheduled: 'Scheduled',
    not_running: 'Not running',
    no_tests: 'No tests',
    fixed: 'Fixed',
    success: 'Success',
  } as Record<string, string>)[status];
};

export const transform = (
  buildsData: BuildSummary[],
  restartBuild: { (buildId: number): Promise<void> },
): CITableBuildInfo[] => {
  return buildsData.map((buildData) => {
    const tableBuildInfo: CITableBuildInfo = {
      id: String(buildData.build_num),
      buildName: buildData.subject
        ? buildData.subject +
          (buildData.retry_of ? ` (retry of #${buildData.retry_of})` : '')
        : '',
      onRestartClick: () =>
        typeof buildData.build_num !== 'undefined' &&
        restartBuild(buildData.build_num),
      source: {
        branchName: String(buildData.branch),
        commit: {
          hash: String(buildData.vcs_revision),
          url: 'todo',
        },
      },
      status: makeReadableStatus(buildData.status),
      buildUrl: buildData.build_url,
    };
    return tableBuildInfo;
  });
};

export function useBuilds() {
  const [{ repo, owner, token }] = useSettings();

  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const getBuilds = useCallback(
    async ({ limit, offset }: { limit: number; offset: number }) => {
      if (owner === '' || repo === '' || token === '') {
        return Promise.reject('No credentials provided');
      }

      try {
        return await api.getBuilds(
          { limit, offset },
          {
            token: token,
            vcs: {
              owner: owner,
              repo: repo,
              type: GitType.GITHUB,
            },
          },
        );
      } catch (e) {
        errorApi.post(e);
        return Promise.reject(e);
      }
    },
    [repo, token, owner],
  );

  const restartBuild = async (buildId: number) => {
    try {
      await api.retry(buildId, {
        token: token,
        vcs: {
          owner: owner,
          repo: repo,
          type: GitType.GITHUB,
        },
      });
    } catch (e) {
      errorApi.post(e);
    }
  };

  useEffect(() => {
    getBuilds({ limit: 1, offset: 0 }).then((b) => setTotal(b?.[0].build_num!));
  }, [repo]);

  const { loading, value, retry } = useAsyncRetry(
    () =>
      getBuilds({
        offset: page * pageSize,
        limit: pageSize,
      }).then((builds) => transform(builds ?? [], restartBuild)),
    [page, pageSize, getBuilds],
  );

  const projectName = `${owner}/${repo}`;
  return [
    {
      page,
      pageSize,
      loading,
      value,
      projectName,
      total,
    },
    {
      getBuilds,
      setPage,
      setPageSize,
      restartBuild,
      retry,
    },
  ] as const;
}
