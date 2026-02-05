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
import { applyOwnershipFilter } from './applyOwnershipFilter';

describe('applyOwnershipFilter', () => {
  it('returns filter unchanged when ownedByCurrentUser is false', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user();
    const filter = { key: 'spec.type', values: ['service'] };

    const result = await applyOwnershipFilter(
      filter,
      credentials,
      false,
      userInfo,
    );

    expect(result).toBe(filter);
    expect(result).toEqual({ key: 'spec.type', values: ['service'] });
  });

  it('returns filter unchanged when userInfo is undefined', async () => {
    const credentials = mockCredentials.user();
    const filter = { key: 'spec.type', values: ['service'] };

    const result = await applyOwnershipFilter(
      filter,
      credentials,
      true,
      undefined,
    );

    expect(result).toBe(filter);
  });

  it('returns filter unchanged when principal is not a user', async () => {
    const userInfo = mockServices.userInfo();
    const serviceCredentials = mockCredentials.service();
    const filter = { key: 'spec.type', values: ['service'] };

    const result = await applyOwnershipFilter(
      filter,
      serviceCredentials,
      true,
      userInfo,
    );

    expect(result).toBe(filter);
  });

  it('applies ownership filter for user principal when no existing filter', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user('user:default/test-user');

    const result = await applyOwnershipFilter(
      undefined,
      credentials,
      true,
      userInfo,
    );

    expect(result).toEqual({
      key: 'relations.ownedBy',
      values: ['user:default/test-user'],
    });
  });

  it('applies ownership filter with custom ownership refs from userInfo', async () => {
    const userInfo = mockServices.userInfo({
      ownershipEntityRefs: ['user:default/test-user', 'group:default/team-a'],
    });
    const credentials = mockCredentials.user('user:default/test-user');

    const result = await applyOwnershipFilter(
      undefined,
      credentials,
      true,
      userInfo,
    );

    expect(result).toEqual({
      key: 'relations.ownedBy',
      values: ['user:default/test-user', 'group:default/team-a'],
    });
  });

  it('combines ownership filter with existing filter via allOf', async () => {
    const userInfo = mockServices.userInfo();
    const credentials = mockCredentials.user('user:default/test-user');
    const filter = { key: 'spec.type', values: ['service'] };

    const result = await applyOwnershipFilter(
      filter,
      credentials,
      true,
      userInfo,
    );

    expect(result).toEqual({
      allOf: [
        { key: 'spec.type', values: ['service'] },
        { key: 'relations.ownedBy', values: ['user:default/test-user'] },
      ],
    });
  });

  it('returns filter unchanged when getUserInfo throws', async () => {
    const userInfo = mockServices.userInfo.mock();
    userInfo.getUserInfo.mockRejectedValueOnce(new Error('User not found'));
    const credentials = mockCredentials.user();
    const filter = { key: 'spec.type', values: ['service'] };

    const result = await applyOwnershipFilter(
      filter,
      credentials,
      true,
      userInfo,
    );

    expect(result).toBe(filter);
  });
});
