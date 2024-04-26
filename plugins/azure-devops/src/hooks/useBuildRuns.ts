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

import {
  AZURE_DEVOPS_DEFAULT_TOP,
  BuildRun,
  BuildRunOptions,
} from '@backstage/plugin-azure-devops-common';

import { azureDevOpsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { getAnnotationValuesFromEntity } from '../utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

export function useBuildRuns(
  entity: Entity,
  defaultLimit?: number,
): {
  items?: BuildRun[];
  loading: boolean;
  error?: Error;
} {
  const top = defaultLimit ?? AZURE_DEVOPS_DEFAULT_TOP;
  const options: BuildRunOptions = {
    top: top,
  };

  const api = useApi(azureDevOpsApiRef);

  const { value, loading, error } = useAsync(() => {
    const { project, repo, definition, host, org } =
      getAnnotationValuesFromEntity(entity);
    return api.getBuildRuns(
      project,
      stringifyEntityRef(entity),
      repo,
      definition,
      host,
      org,
      options,
    );
  }, [api]);

  return {
    items: value?.items,
    loading,
    error,
  };
}
