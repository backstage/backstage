/*
 * Copyright 2025 The Backstage Authors
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
  BackstageCredentials,
  PermissionsRegistryService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import { catalogEntityPermissionResourceRef } from '@backstage/plugin-catalog-node/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createConditionTransformer } from '@backstage/plugin-permission-node';

export type EntityPermissionFilterBuilder = (
  credentials: BackstageCredentials,
  originalFilter: EntityFilter | undefined,
) => Promise<EntityFilter | undefined>;

/**
 * Encapsulates the logic for taking a credentials object and translating it
 * into the entity filter that corresponds to the permissions of that set of
 * credentials. Note that this only applies to the filtering of entities, no
 * other types of resource.
 */
export function createEntityPermissionFilterBuilder(
  permissions: PermissionsService,
  permissionsRegistry: PermissionsRegistryService,
): EntityPermissionFilterBuilder {
  const transformConditions = createConditionTransformer(
    permissionsRegistry.getPermissionRuleset(
      catalogEntityPermissionResourceRef,
    ),
  );

  return async (
    credentials: BackstageCredentials,
    originalFilter?: EntityFilter | undefined,
  ): Promise<EntityFilter | undefined> => {
    const authorizeDecision = (
      await permissions.authorizeConditional(
        [{ permission: catalogEntityReadPermission }],
        { credentials: credentials },
      )
    )[0];

    if (authorizeDecision.result === AuthorizeResult.ALLOW) {
      return originalFilter;
    }

    if (authorizeDecision.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = transformConditions(
        authorizeDecision.conditions,
      );
      return originalFilter
        ? { allOf: [permissionFilter, originalFilter] }
        : permissionFilter;
    }

    throw new NotAllowedError();
  };
}
