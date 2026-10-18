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
  DEFAULT_NAMESPACE,
  CompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import { createRouteRef } from '@backstage/core-plugin-api';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';

/**
 * A stable route ref that points to the catalog page for an individual entity.
 *
 * This `RouteRef` can be imported and used directly, and does not need to be referenced
 * via an `ExternalRouteRef`.
 *
 * In the new frontend system, this reference targets `page:catalog/entity`.
 * Keep it as the mount point when replacing the entity page to support older
 * frontend system versions.
 * @public
 */
export const entityRouteRef = getOrCreateGlobalSingleton(
  'catalog:entity-route-ref',
  () =>
    createRouteRef({
      id: 'catalog:entity',
      params: ['namespace', 'kind', 'name'],
    }),
);

// An older package copy may have created the singleton first. Add the target
// after retrieving it so all copies share both its identity and extension target.
if (!('getExtensionId' in entityRouteRef)) {
  Object.assign(entityRouteRef, {
    getExtensionId: () => 'page:catalog/entity',
  });
}

/**
 * Configurable options for `entityRouteParams`
 * @public
 */
export type EntityRouteParamsOptions = {
  encodeParams?: boolean;
};

/**
 * Utility function to get suitable route params for entityRoute, given an
 * @public
 */
export function entityRouteParams(
  entityOrRef: Entity | CompoundEntityRef | string,
  options?: EntityRouteParamsOptions,
) {
  let kind;
  let namespace;
  let name;

  if (typeof entityOrRef === 'string') {
    const parsed = parseEntityRef(entityOrRef);
    kind = parsed.kind;
    namespace = parsed.namespace;
    name = parsed.name;
  } else if ('metadata' in entityOrRef) {
    kind = entityOrRef.kind;
    namespace = entityOrRef.metadata.namespace;
    name = entityOrRef.metadata.name;
  } else {
    kind = entityOrRef.kind;
    namespace = entityOrRef.namespace;
    name = entityOrRef.name;
  }

  kind = kind.toLowerCase();
  namespace = namespace?.toLowerCase() ?? DEFAULT_NAMESPACE;

  const { encodeParams = false } = options || {};
  if (encodeParams) {
    kind = encodeURIComponent(kind);
    namespace = encodeURIComponent(namespace);
    name = encodeURIComponent(name);
  }

  return {
    kind,
    namespace,
    name,
  } as const;
}
