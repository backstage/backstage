/*
 * Copyright 2023 The Backstage Authors
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
  CompoundEntityRef,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApiHolder } from '@backstage/core-plugin-api';
import { useMemo } from 'react';
import {
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
  entityPresentationApiRef,
} from './EntityPresentationApi';
import { defaultEntityPresentation } from './defaultEntityPresentation';
import { useUpdatingObservable } from './useUpdatingObservable';

/**
 * Returns information about how to represent an entity in the interface.
 *
 * @public
 * @param entityOrRef - The entity to represent, or an entity ref to it. If you
 *   pass in an entity, it is assumed that it is NOT a partial one - i.e. only
 *   pass in an entity if you know that it was fetched in such a way that it
 *   contains all of the fields that the representation renderer needs.
 * @param context - Optional context that control details of the presentation.
 * @returns A snapshot of the entity presentation, which may change over time
 */
export function useEntityPresentation(
  entityOrRef: Entity | CompoundEntityRef | string,
  context?: {
    defaultKind?: string;
    defaultNamespace?: string;
  },
): EntityRefPresentationSnapshot {
  // Defensively allow for a missing presentation API, which makes this hook
  // safe to use in tests.
  const apis = useApiHolder();
  const entityPresentationApi = apis.get(entityPresentationApiRef);

  const deps = [
    entityPresentationApi,
    JSON.stringify(entityOrRef),
    JSON.stringify(context || null),
  ];

  const presentation = useMemo<EntityRefPresentation>(
    () => {
      if (!entityPresentationApi) {
        const fallback = defaultEntityPresentation(entityOrRef, context);
        return { snapshot: fallback, promise: Promise.resolve(fallback) };
      }

      return entityPresentationApi.forEntity(
        typeof entityOrRef === 'string' || 'metadata' in entityOrRef
          ? entityOrRef
          : stringifyEntityRef(entityOrRef),
        context,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  // NOTE(freben): We intentionally do not use the plain useObservable from the
  // react-use library here. That hook does not support a dependencies array,
  // and also it only subscribes once to the initially passed in observable and
  // won't properly react when either initial value or the actual observable
  // changes.
  return useUpdatingObservable(presentation.snapshot, presentation.update$, [
    presentation,
  ]);
}
