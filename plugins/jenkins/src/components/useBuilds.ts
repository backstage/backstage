/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { jenkinsApiRef } from '../api';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getEntityName } from '@backstage/catalog-model';

export enum ErrorType {
  CONNECTION_ERROR,
  NOT_FOUND,
}

/**
 * Hook to expose the latest build for all the pipelines/projects for an entity.
 * If `branch` is provided, the latest build for only that branch will be given (but still as a list)
 *
 * TODO: deprecate branch and add a generic filter concept.
 */
export function useBuilds({ branch }: { branch?: string } = {}) {
  const { entity } = useEntity();
  const entityName = getEntityName(entity);
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState<{
    message: string;
    errorType: ErrorType;
  }>();

  const restartBuild = async (jobFullName: string, buildNumber: string) => {
    try {
      await api.retry({ entity: entityName, jobFullName, buildNumber });
    } catch (e) {
      errorApi.post(e);
    }
  };

  const { loading, value: projects, retry } = useAsyncRetry(async () => {
    try {
      const build = await api.getProjects({
        entity: getEntityName(entity),
        filter: { branch },
      });

      setTotal(build.length);

      return build;
    } catch (e) {
      const errorType = e.notFound
        ? ErrorType.NOT_FOUND
        : ErrorType.CONNECTION_ERROR;
      setError({ message: e.message, errorType });
      throw e;
    }
  }, [api, errorApi, entity, branch]);

  return [
    {
      page,
      pageSize,
      loading,
      projects,
      total,
      error,
    },
    {
      setPage,
      setPageSize,
      restartBuild,
      retry, // fetch data again
    },
  ] as const;
}
