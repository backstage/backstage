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
import { useCallback, useEffect, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { jenkinsApiRef } from '../api';

export function useBuilds(owner: string, repo: string, branch?: string) {
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const getBuilds = useCallback(async () => {
    try {
      let build;
      if (branch) {
        build = await api.getLastBuild(`${owner}/${repo}/${branch}`);
      } else {
        build = await api.getFolder(`${owner}/${repo}`);
      }
      return build;
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  }, [api, branch, errorApi, owner, repo]);

  const restartBuild = async (buildName: string) => {
    try {
      await api.retry(buildName);
    } catch (e) {
      errorApi.post(e);
    }
  };

  useEffect(() => {
    getBuilds().then(b => {
      const size = Array.isArray(b) ? b?.[0].build_num! : 1;
      setTotal(size);
    });
  }, [repo, getBuilds]);

  const { loading, value, retry } = useAsyncRetry(
    () => getBuilds().then(builds => builds ?? [], restartBuild),
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
