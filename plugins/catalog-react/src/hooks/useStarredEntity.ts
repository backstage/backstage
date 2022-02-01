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
  Entity,
  EntityName,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { useCallback, useEffect, useState } from 'react';
import { starredEntitiesApiRef } from '../apis';

function getEntityRef(entityOrRef: Entity | EntityName | string): string {
  return typeof entityOrRef === 'string'
    ? entityOrRef
    : stringifyEntityRef(entityOrRef);
}

export function useStarredEntity(entityOrRef: Entity | EntityName | string): {
  toggleStarredEntity: () => void;
  isStarredEntity: boolean;
} {
  const starredEntitiesApi = useApi(starredEntitiesApiRef);

  const [isStarredEntity, setIsStarredEntity] = useState(false);

  useEffect(() => {
    const subscription = starredEntitiesApi.starredEntitie$().subscribe({
      next(starredEntities: Set<string>) {
        setIsStarredEntity(starredEntities.has(getEntityRef(entityOrRef)));
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [entityOrRef, starredEntitiesApi]);

  const toggleStarredEntity = useCallback(
    () => starredEntitiesApi.toggleStarred(getEntityRef(entityOrRef)).then(),
    [entityOrRef, starredEntitiesApi],
  );

  return {
    toggleStarredEntity,
    isStarredEntity,
  };
}
