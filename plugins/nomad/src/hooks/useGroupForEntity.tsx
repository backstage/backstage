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

import { useEntity } from '@backstage/plugin-catalog-react';
import { NOMAD_GROUP_ANNOTATION, NOMAD_NAMESPACE_ANNOTATION } from '../Router';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { nomadApiRef } from '../api';
import useAsync from 'react-use/lib/useAsync';

/**
 * Get the entity's group and query it from the Nomad API.
 */
export const useGroupForEntity = () => {
  const { entity } = useEntity();

  const namespace =
    entity.metadata.annotations?.[NOMAD_NAMESPACE_ANNOTATION] ?? 'default';
  const group = entity.metadata.annotations?.[NOMAD_GROUP_ANNOTATION] ?? '';

  const nomadApi = useApi(nomadApiRef);
  const errorApi = useApi(errorApiRef);

  const response = useAsync(
    () =>
      nomadApi.listAllocations({
        namespace,
        filter: `TaskGroup == "${group}"`,
      }),
    [group],
  );

  if (response.error) {
    errorApi.post(response.error);
  }
  return response;
};
