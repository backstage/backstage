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

import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { CATALOG_FILTER_OWNED_BY_CURRENT_USER } from '@backstage/catalog-client';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import { expandCurrentUserFilter } from './expandCurrentUserFilter';

const OWNED_BY_KEY = `relations.${RELATION_OWNED_BY}`;

describe('expandCurrentUserFilter', () => {
  const userCredentials = mockCredentials.user('user:default/alice');
  const serviceCredentials = mockCredentials.service();

  it('returns undefined when filter is undefined', async () => {
    const userInfo = mockServices.userInfo();
    const result = await expandCurrentUserFilter(
      undefined,
      userCredentials,
      userInfo,
    );
    expect(result).toBeUndefined();
  });

  it('returns filter unchanged when credentials are service principal', async () => {
    const userInfo = mockServices.userInfo();
    const filter: EntityFilter = {
      key: OWNED_BY_KEY,
      values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER],
    };
    const result = await expandCurrentUserFilter(
      filter,
      serviceCredentials,
      userInfo,
    );
    expect(result).toEqual(filter);
  });

  it('expands relations.ownedBy with __current_user__ for user principal', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/alice', 'group:default/team-a'],
    });
    const filter: EntityFilter = {
      key: OWNED_BY_KEY,
      values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual({
      key: OWNED_BY_KEY,
      values: ['user:default/alice', 'group:default/team-a'],
    });
  });

  it('leaves filter unchanged when key is not relations.ownedBy', async () => {
    const userInfo = mockServices.userInfo();
    const filter: EntityFilter = {
      key: 'metadata.name',
      values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual(filter);
  });

  it('leaves filter unchanged when values do not include __current_user__', async () => {
    const userInfo = mockServices.userInfo();
    const filter: EntityFilter = {
      key: OWNED_BY_KEY,
      values: ['user:default/bob'],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual(filter);
  });

  it('merges other values with ownership refs when expanding', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/alice', 'group:default/team-a'],
    });
    const filter: EntityFilter = {
      key: OWNED_BY_KEY,
      values: ['user:default/other', CATALOG_FILTER_OWNED_BY_CURRENT_USER],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual({
      key: OWNED_BY_KEY,
      values: [
        'user:default/other',
        'user:default/alice',
        'group:default/team-a',
      ],
    });
  });

  it('leaves filter unchanged when getUserInfo throws', async () => {
    const userInfo = {
      getUserInfo: async () => {
        throw new Error('Token has no user claims');
      },
    };
    const filter: EntityFilter = {
      key: OWNED_BY_KEY,
      values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual(filter);
  });

  it('recursively expands anyOf filters', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/alice'],
    });
    const filter: EntityFilter = {
      anyOf: [
        { key: OWNED_BY_KEY, values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER] },
        { key: 'metadata.name', values: ['foo'] },
      ],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual({
      anyOf: [
        { key: OWNED_BY_KEY, values: ['user:default/alice'] },
        { key: 'metadata.name', values: ['foo'] },
      ],
    });
  });

  it('recursively expands allOf filters', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/alice'],
    });
    const filter: EntityFilter = {
      allOf: [
        { key: OWNED_BY_KEY, values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER] },
        { key: 'kind', values: ['Component'] },
      ],
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual({
      allOf: [
        { key: OWNED_BY_KEY, values: ['user:default/alice'] },
        { key: 'kind', values: ['Component'] },
      ],
    });
  });

  it('recursively expands not filters', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/alice'],
    });
    const filter: EntityFilter = {
      not: {
        key: OWNED_BY_KEY,
        values: [CATALOG_FILTER_OWNED_BY_CURRENT_USER],
      },
    };
    const result = await expandCurrentUserFilter(
      filter,
      userCredentials,
      userInfo,
    );
    expect(result).toEqual({
      not: { key: OWNED_BY_KEY, values: ['user:default/alice'] },
    });
  });
});
