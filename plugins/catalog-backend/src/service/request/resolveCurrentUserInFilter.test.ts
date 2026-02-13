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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { resolveCurrentUserInFilter } from './resolveCurrentUserInFilter';

describe('resolveCurrentUserInFilter', () => {
  it('returns filter unchanged when filter is undefined', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user();

    const result = await resolveCurrentUserInFilter(
      undefined,
      credentials,
      userInfo,
    );

    expect(result).toBeUndefined();
  });

  it('returns filter unchanged when userInfo is undefined', async () => {
    const credentials = mockCredentials.user();
    const filter = {
      key: 'spec.owner',
      values: [CATALOG_FILTER_CURRENT_USER_REF],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      undefined,
    );

    expect(result).toEqual(filter);
  });

  it('returns filter unchanged when principal is not a user', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.service();
    const filter = {
      key: 'spec.owner',
      values: [CATALOG_FILTER_CURRENT_USER_REF],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toEqual(filter);
  });

  it('expands CATALOG_FILTER_CURRENT_USER_REF to user entity ref', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user('user:default/test-user-1');
    const filter = {
      key: 'spec.owner',
      values: [CATALOG_FILTER_CURRENT_USER_REF],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toEqual({
      key: 'spec.owner',
      values: ['user:default/test-user-1'],
    });
  });

  it('expands CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS to ownership refs', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/test-user-1', 'group:default/team-a'],
    });
    const credentials = mockCredentials.user('user:default/test-user-1');
    const filter = {
      key: 'relations.ownedBy',
      values: [CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toEqual({
      key: 'relations.ownedBy',
      values: ['user:default/test-user-1', 'group:default/team-a'],
    });
  });

  it('leaves non-magic values unchanged', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user();
    const filter = { key: 'kind', values: ['Component', 'API'] };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toEqual(filter);
  });

  it('expands magic value alongside other values in same condition', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user('user:default/bob');
    const filter = {
      key: 'spec.owner',
      values: ['user:default/test-user-1', CATALOG_FILTER_CURRENT_USER_REF],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toEqual({
      key: 'spec.owner',
      values: ['user:default/test-user-1', 'user:default/bob'],
    });
  });

  it('expands magic values in allOf', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/test-user-1'],
    });
    const credentials = mockCredentials.user('user:default/test-user-1');
    const filter = {
      allOf: [
        { key: 'kind', values: ['Component'] },
        {
          key: 'relations.ownedBy',
          values: [CATALOG_FILTER_CURRENT_USER_OWNERSHIP_REFS],
        },
      ],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toEqual({
      allOf: [
        { key: 'kind', values: ['Component'] },
        { key: 'relations.ownedBy', values: ['user:default/test-user-1'] },
      ],
    });
  });

  it('removes condition when getUserInfo throws and only magic value', async () => {
    const userInfo = mockServices.userInfo.mock();
    userInfo.getUserInfo.mockRejectedValueOnce(new Error('User not found'));
    const credentials = mockCredentials.user();
    const filter = {
      key: 'spec.owner',
      values: [CATALOG_FILTER_CURRENT_USER_REF],
    };

    const result = await resolveCurrentUserInFilter(
      filter,
      credentials,
      userInfo,
    );

    expect(result).toBeUndefined();
  });
});
