/*
 * Copyright 2026 The Backstage Authors
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
  BackstageUserPrincipal,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { CATALOG_FILTER_OWNED_BY_CURRENT_USER } from '@backstage/catalog-client';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  EntitiesSearchFilter,
  EntityFilter,
} from '@backstage/plugin-catalog-node';

const OWNED_BY_KEY = `relations.${RELATION_OWNED_BY}`;

function isEntitiesSearchFilter(
  filter: EntityFilter,
): filter is EntitiesSearchFilter {
  return (
    'key' in filter && typeof (filter as EntitiesSearchFilter).key === 'string'
  );
}

function isAnyOfFilter(
  filter: EntityFilter,
): filter is { anyOf: EntityFilter[] } {
  return (
    'anyOf' in filter &&
    Array.isArray((filter as { anyOf: EntityFilter[] }).anyOf)
  );
}

function isAllOfFilter(
  filter: EntityFilter,
): filter is { allOf: EntityFilter[] } {
  return (
    'allOf' in filter &&
    Array.isArray((filter as { allOf: EntityFilter[] }).allOf)
  );
}

function isNotFilter(filter: EntityFilter): filter is { not: EntityFilter } {
  return 'not' in filter && (filter as { not: EntityFilter }).not !== undefined;
}

/**
 * Recursively expands any `relations.ownedBy = __current_user__` placeholder in
 * the filter with the actual ownership entity refs from the current user's
 * credentials. This avoids sending large lists of group refs from the frontend,
 * which can cause 431 Request Header Fields Too Large when users belong to
 * many groups.
 *
 * @see https://github.com/backstage/backstage/issues/32367
 */
export async function expandCurrentUserFilter(
  filter: EntityFilter | undefined,
  credentials: BackstageCredentials,
  userInfo: UserInfoService,
): Promise<EntityFilter | undefined> {
  if (!filter) {
    return undefined;
  }

  // Only expand for user principals; service or none leave placeholder as-is
  const principal = credentials.principal as BackstageUserPrincipal;
  if (principal.type !== 'user') {
    return filter;
  }

  if (isEntitiesSearchFilter(filter)) {
    if (
      filter.key.toLowerCase() === OWNED_BY_KEY.toLowerCase() &&
      filter.values?.includes(CATALOG_FILTER_OWNED_BY_CURRENT_USER)
    ) {
      try {
        const { ownershipEntityRefs } = await userInfo.getUserInfo(credentials);
        const otherValues = (filter.values ?? []).filter(
          v => v !== CATALOG_FILTER_OWNED_BY_CURRENT_USER,
        );
        return {
          ...filter,
          values: [...otherValues, ...ownershipEntityRefs],
        };
      } catch {
        return filter;
      }
    }
    return filter;
  }

  if (isAnyOfFilter(filter)) {
    return {
      anyOf: await Promise.all(
        filter.anyOf.map(f =>
          expandCurrentUserFilter(f, credentials, userInfo),
        ),
      ).then(filters =>
        filters.filter((f): f is EntityFilter => f !== undefined),
      ),
    };
  }

  if (isAllOfFilter(filter)) {
    return {
      allOf: await Promise.all(
        filter.allOf.map(f =>
          expandCurrentUserFilter(f, credentials, userInfo),
        ),
      ).then(filters =>
        filters.filter((f): f is EntityFilter => f !== undefined),
      ),
    };
  }

  if (isNotFilter(filter)) {
    const expanded = await expandCurrentUserFilter(
      filter.not,
      credentials,
      userInfo,
    );
    return expanded !== undefined ? { not: expanded } : undefined;
  }

  return filter;
}
