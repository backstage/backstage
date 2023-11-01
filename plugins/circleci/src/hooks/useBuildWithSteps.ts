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
import { circleCIApiRef } from '../api';
import { useProjectSlugFromEntity } from '.';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

export function useBuildWithSteps(jobNumber: number) {
  const { projectSlug } = useProjectSlugFromEntity();
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const getBuildWithSteps = useCallback(async () => {
    try {
      const build = await api.getBuild(projectSlug, jobNumber);
      return Promise.resolve(build);
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  }, [projectSlug, jobNumber, api, errorApi]);

  const {
    loading,
    value: build,
    retry,
  } = useAsyncRetry(() => getBuildWithSteps(), [getBuildWithSteps]);

  return { loading, build, retry };
}
