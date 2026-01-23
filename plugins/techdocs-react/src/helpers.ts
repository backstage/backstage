/*
 * Copyright 2022 The Backstage Authors
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

import { Config } from '@backstage/config';
import {
  CompoundEntityRef,
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import {
  TECHDOCS_EXTERNAL_ANNOTATION,
  TECHDOCS_EXTERNAL_PATH_ANNOTATION,
} from '@backstage/plugin-techdocs-common';
import { RouteFunc } from '@backstage/core-plugin-api';

/**
 * Lower-case entity triplets by default, but allow override.
 *
 * @public
 */
export function toLowercaseEntityRefMaybe(
  entityRef: CompoundEntityRef,
  config: Config,
): CompoundEntityRef {
  if (config.getOptionalBoolean('techdocs.legacyUseCaseSensitiveTripletPaths'))
    return entityRef;

  entityRef.kind = entityRef.kind.toLocaleLowerCase();
  entityRef.name = entityRef.name.toLocaleLowerCase();
  entityRef.namespace = entityRef.namespace.toLocaleLowerCase();

  return entityRef;
}

/**
 * Get the entity path annotation from the given entity and ensure it starts with a slash.
 *
 * @public
 */
export function getEntityRootTechDocsPath(entity: Entity): string {
  let path = entity.metadata.annotations?.[TECHDOCS_EXTERNAL_PATH_ANNOTATION];
  if (!path) {
    return '';
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
}

/**
 * Build the TechDocs URL for the given entity. This helper should be used anywhere there
 * is a link to an entity's TechDocs.
 *
 * @public
 */
export const buildTechDocsURL = (
  entity: Entity,
  routeFunc:
    | RouteFunc<{
        namespace: string;
        kind: string;
        name: string;
      }>
    | undefined,
) => {
  if (!routeFunc) {
    return undefined;
  }

  let { namespace, kind, name } = getCompoundEntityRef(entity);

  if (entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]) {
    try {
      const techdocsRef = parseEntityRef(
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION],
      );
      namespace = techdocsRef.namespace;
      kind = techdocsRef.kind;
      name = techdocsRef.name;
    } catch {
      // not a fan of this but we don't care if the parseEntityRef fails
    }
  }

  const url = routeFunc({
    namespace,
    kind,
    name,
  });

  // Add on the external entity path to the url if one exists. This allows deep linking into another
  // entity's TechDocs.
  const path = getEntityRootTechDocsPath(entity);

  return `${url}${path}`;
};
