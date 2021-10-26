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

import {
  Entity,
  EntityName,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { useCallback } from 'react';
import { useObservable } from 'react-use';
import { starredEntitiesApiRef } from '../apis';

function getEntityRef(entityOrRef: Entity | EntityName | string): string {
  return typeof entityOrRef === 'string'
    ? entityOrRef
    : stringifyEntityRef(entityOrRef);
}

export function useStarredEntities(): {
  starredEntities: Set<string>;
  toggleStarredEntity: (entityOrRef: Entity | EntityName | string) => void;
  isStarredEntity: (entityOrRef: Entity | EntityName | string) => boolean;
} {
  const starredEntitiesApi = useApi(starredEntitiesApiRef);

  const starredEntities = useObservable(
    starredEntitiesApi.starredEntitie$(),
    new Set<string>(),
  );

  const isStarredEntity = useCallback(
    (entityOrRef: Entity | EntityName | string) =>
      starredEntities.has(getEntityRef(entityOrRef)),
    [starredEntities],
  );

  const toggleStarredEntity = useCallback(
    (entityOrRef: Entity | EntityName | string) =>
      starredEntitiesApi.toggleStarred(getEntityRef(entityOrRef)).then(),
    [starredEntitiesApi],
  );

  return {
    starredEntities,
    toggleStarredEntity,
    isStarredEntity,
  };
}
