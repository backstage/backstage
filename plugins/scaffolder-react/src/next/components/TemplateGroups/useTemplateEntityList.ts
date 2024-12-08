/*
 * Copyright 2024 The Backstage Authors
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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/frontend-plugin-api';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { templateExecutePermission } from '@backstage/plugin-scaffolder-common/alpha';
import useSWR from 'swr';

export const useTemplateEntityList = () => {
  const { loading, error: listError, entities } = useEntityList();
  const permissionsApi = useApi(permissionApiRef);

  const { data, error: permissionsError } = useSWR(
    entities,
    async (templates: typeof entities) =>
      asyncFilter(templates, async template => {
        const { result } = await permissionsApi.authorize({
          permission: templateExecutePermission,
          resourceRef: stringifyEntityRef(template),
        });

        return result === AuthorizeResult.ALLOW;
      }),
  );

  return { loading, error: listError || permissionsError, entities: data };
};

async function asyncFilter<T>(
  array: T[],
  filterFn: (item: T) => Promise<boolean>,
): Promise<T[]> {
  return Promise.all(
    array.map(async item => ((await filterFn(item)) ? item : null)),
  ).then(items => items.filter((item): item is Awaited<T> => item !== null));
}
