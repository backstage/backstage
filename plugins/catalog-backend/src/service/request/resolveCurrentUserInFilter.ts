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
  CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS,
  CATALOG_FILTER_CURRENT_USER_REF,
} from '@backstage/catalog-client/filterConstants';
import {
  HttpAuthService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { EntityFilter } from '@backstage/plugin-catalog-node';

/**
 * Resolves current-user magic constants in the filter by substituting them with the
 * authenticated user's entity ref and ownership refs from UserInfoService.
 * getUserInfo is called once and reused for all replacements.
 */
export async function resolveCurrentUserInFilter(
  filter: EntityFilter | undefined,
  credentials: Awaited<ReturnType<HttpAuthService['credentials']>>,
  userInfo: UserInfoService | undefined,
): Promise<EntityFilter | undefined> {
  if (!filter || !userInfo) return filter;

  const principalType = (credentials.principal as any)?.type;
  if (principalType !== 'user') return filter;

  let userEntityRef: string | undefined;
  let ownershipEntityRefs: string[] | undefined;

  const getRefs = async (): Promise<{
    userEntityRef: string;
    ownershipEntityRefs: string[];
  }> => {
    if (userEntityRef !== undefined) {
      return {
        userEntityRef: userEntityRef!,
        ownershipEntityRefs: ownershipEntityRefs!,
      };
    }
    try {
      const info = await userInfo.getUserInfo(credentials);
      userEntityRef = info.userEntityRef;
      ownershipEntityRefs = info.ownershipEntityRefs;
      return { userEntityRef, ownershipEntityRefs };
    } catch {
      // Preserve the current-user magic values on failure so the resulting
      // filter remains restrictive (typically matching nothing) instead of
      // being dropped and unintentionally broadening the query.
      userEntityRef = CATALOG_FILTER_CURRENT_USER_REF;
      ownershipEntityRefs = [CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS];
      return { userEntityRef, ownershipEntityRefs };
    }
  };

  async function expand(f: EntityFilter): Promise<EntityFilter | undefined> {
    if ('key' in f) {
      const values = f.values;
      if (!values || values.length === 0) return f;

      const hasCurrentUserRef = values.includes(
        CATALOG_FILTER_CURRENT_USER_REF,
      );
      const hasOwnershipRefs = values.includes(
        CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS,
      );
      if (!hasCurrentUserRef && !hasOwnershipRefs) return f;

      const { userEntityRef: uRef, ownershipEntityRefs: oRefs } =
        await getRefs();

      const expandedValues = values.flatMap(v => {
        if (v === CATALOG_FILTER_CURRENT_USER_REF) {
          return uRef ? [uRef] : [];
        }
        if (v === CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS) {
          return oRefs ?? [];
        }
        return [v];
      });

      return { key: f.key, values: expandedValues };
    }

    if ('allOf' in f) {
      const expanded = await Promise.all(f.allOf.map(expand));
      const defined = expanded.filter(
        (x): x is EntityFilter => x !== undefined,
      );
      if (defined.length === 0) return undefined;
      if (defined.length === 1) return defined[0];
      return { allOf: defined };
    }

    if ('anyOf' in f) {
      const expanded = await Promise.all(f.anyOf.map(expand));
      const defined = expanded.filter(
        (x): x is EntityFilter => x !== undefined,
      );
      if (defined.length === 0) return undefined;
      if (defined.length === 1) return defined[0];
      return { anyOf: defined };
    }

    if ('not' in f) {
      const inner = await expand(f.not);
      return inner !== undefined ? { not: inner } : undefined;
    }

    return f;
  }

  return expand(filter);
}
