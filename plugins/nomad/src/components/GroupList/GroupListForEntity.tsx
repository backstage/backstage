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

import { Progress } from '@backstage/core-components';
import React, { useState } from 'react';
import { GroupListTable } from './GroupListTable';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Allocation, nomadApiRef } from '../../api';
import { ErrorApiError, errorApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import {
  NOMAD_GROUP_ANNOTATION,
  NOMAD_NAMESPACE_ANNOTATION,
} from '../../Router';

export const GroupListForEntity = () => {
  const { entity } = useEntity();

  const namespace =
    entity.metadata.annotations?.[NOMAD_NAMESPACE_ANNOTATION] ?? 'default';
  const group = entity.metadata.annotations?.[NOMAD_GROUP_ANNOTATION] ?? '';

  const nomadApi = useApi(nomadApiRef);
  const errorApi = useApi(errorApiRef);

  // Retrieve allocations for the group
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const response = useAsync(async () => {
    // Wait until entity is loaded
    if (!entity) {
      return;
    }

    // Issue call to nomad-backend
    try {
      const resp = await nomadApi.listAllocations({
        namespace,
        filter: `TaskGroup == "${group}"`,
      });
      setAllocations(resp.allocations);
    } catch (e) {
      errorApi.post(e as ErrorApiError);
    }
  }, [group]);

  if (response.loading) {
    return <Progress />;
  }
  if (response.error) {
    return null;
  }

  return <GroupListTable allocations={allocations} />;
};
