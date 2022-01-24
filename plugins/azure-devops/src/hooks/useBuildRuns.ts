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
  BuildRun,
  BuildRunOptions,
} from '@backstage/plugin-azure-devops-common';

import { AZURE_DEVOPS_DEFAULT_TOP } from '../constants';
import { azureDevOpsApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

export function useBuildRuns(
  projectName: string,
  defaultLimit?: number,
  repoName?: string,
  definitionName?: string,
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
    return api.getBuildRuns(projectName, repoName, definitionName, options);
  }, [api, projectName, repoName, definitionName]);

  return {
    items: value?.items,
    loading,
    error,
  };
}
