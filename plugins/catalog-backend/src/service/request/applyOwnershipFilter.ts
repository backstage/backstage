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
  HttpAuthService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { EntityFilter } from '@backstage/plugin-catalog-node';

const OWNED_BY_KEY = `relations.${RELATION_OWNED_BY}`;

/**
 * If requested, applies the ownership (user + groups) filter to the given filter.
 * Returns the filter unchanged if not requested or if the user is not authenticated.
 */
export async function applyOwnershipFilter(
  filter: EntityFilter | undefined,
  credentials: Awaited<ReturnType<HttpAuthService['credentials']>>,
  ownedByCurrentUser: boolean,
  userInfo: UserInfoService | undefined,
): Promise<EntityFilter | undefined> {
  if (!ownedByCurrentUser || !userInfo) return filter;
  const principal = credentials.principal as { type: string };
  if (principal.type !== 'user') return filter;
  try {
    const { ownershipEntityRefs } = await userInfo.getUserInfo(credentials);
    const ownershipFilter: EntityFilter = {
      key: OWNED_BY_KEY,
      values: ownershipEntityRefs,
    };
    if (filter) return { allOf: [filter, ownershipFilter] };
    return ownershipFilter;
  } catch {
    return filter;
  }
}
