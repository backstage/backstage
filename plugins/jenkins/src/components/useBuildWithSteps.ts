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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useCallback } from 'react';
import { useAsyncRetry } from 'react-use';
import { jenkinsApiRef } from '../api';
import { useAsyncPolling } from './useAsyncPolling';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { getEntityName } from '@backstage/catalog-model';

const INTERVAL_AMOUNT = 1500;

/**
 * Hook to expose a specific build.
 * @param jobFullName the full name of the project (job with builds, not a folder). e.g. "department-A/team-1/project-foo/master"
 * @param buildNumber the number of the build. e.g. "13"
 */
export function useBuildWithSteps({
  jobFullName,
  buildNumber,
}: {
  jobFullName: string;
  buildNumber: string;
}) {
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);
  const { entity } = useEntity();

  const getBuildWithSteps = useCallback(async () => {
    try {
      const entityName = await getEntityName(entity);
      return api.getBuild({ entity: entityName, jobFullName, buildNumber });
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  }, [buildNumber, jobFullName, entity, api, errorApi]);

  const { loading, value, retry } = useAsyncRetry(() => getBuildWithSteps(), [
    getBuildWithSteps,
  ]);

  const { startPolling, stopPolling } = useAsyncPolling(
    getBuildWithSteps,
    INTERVAL_AMOUNT,
  );

  return [
    { loading, value, retry },
    {
      getBuildWithSteps,
      startPolling,
      stopPolling,
    },
  ] as const;
}
