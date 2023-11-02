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
import useAsync from 'react-use/lib/useAsync';
import { circleCIApiRef } from '../api';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { useProjectSlugFromEntity } from '.';

export function useStepOutput(
  buildNumber: number,
  step?: number,
  index?: number,
) {
  const { projectSlug } = useProjectSlugFromEntity();
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const { loading, value: output } = useAsync(async () => {
    try {
      if (typeof step === 'undefined' || typeof index === 'undefined') {
        return '';
      }

      const data = await api.getStepOutput(
        projectSlug,
        buildNumber,
        index,
        step,
      );
      return data;
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      return Promise.reject(e);
    }
  });

  return { loading, output };
}
