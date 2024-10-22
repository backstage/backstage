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

import { TokenManager } from '@backstage/backend-common';
import {
  RELATION_MEMBER_OF,
  UserEntityV1alpha1,
} from '@backstage/catalog-model';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { CatalogIdentityClient } from './CatalogIdentityClient';
import { mockServices } from '@backstage/backend-test-utils';

describe('CatalogIdentityClient', () => {
  const tokenManager: jest.Mocked<TokenManager> = {
    getToken: jest.fn(),
    authenticate: jest.fn(),
  };

  afterEach(() => jest.resetAllMocks());

  it('findUser passes through the correct search params', async () => {
    const catalogApi = catalogServiceMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'User',
          metadata: {
            name: 'user',
            namespace: 'default',
            annotations: { key: 'value' },
          },
          spec: {},
        },
      ],
    });
    jest.spyOn(catalogApi, 'getEntities');

    tokenManager.getToken.mockResolvedValue({ token: 'my-token' });
    const client = new CatalogIdentityClient({
      discovery: mockServices.discovery(),
      catalogApi,
      tokenManager,
    });

    await client.findUser({ annotations: { key: 'value' } });

    expect(catalogApi.getEntities).toHaveBeenCalledWith(
      {
        filter: {
          kind: 'user',
          'metadata.annotations.key': 'value',
        },
      },
      { token: 'my-token' },
    );
    expect(tokenManager.getToken).toHaveBeenCalledWith();
  });

  it('resolveCatalogMembership resolves membership', async () => {
    const mockUsers: Array<UserEntityV1alpha1> = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'User',
        metadata: {
          name: 'inigom',
        },
        spec: {
          memberOf: ['team-a'],
        },
        relations: [
          {
            type: RELATION_MEMBER_OF,
            targetRef: 'group:default/team-a',
          },
        ],
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'User',
        metadata: {
          name: 'mpatinkin',
          namespace: 'reality',
        },
        spec: {
          memberOf: ['screen-actors-guild'],
        },
        relations: [
          {
            type: RELATION_MEMBER_OF,
            targetRef: 'group:reality/screen-actors-guild',
          },
        ],
      },
    ];
    const catalogApi = catalogServiceMock({ entities: mockUsers });
    jest.spyOn(catalogApi, 'getEntities');
    tokenManager.getToken.mockResolvedValue({ token: 'my-token' });

    const client = new CatalogIdentityClient({
      discovery: {} as any,
      catalogApi,
      tokenManager,
    });

    const claims = await client.resolveCatalogMembership({
      entityRefs: ['inigom', 'User:default/imontoya', 'User:reality/mpatinkin'],
    });

    expect(catalogApi.getEntities).toHaveBeenCalledWith(
      {
        filter: [
          {
            kind: 'user',
            'metadata.namespace': 'default',
            'metadata.name': 'inigom',
          },
          {
            kind: 'user',
            'metadata.namespace': 'default',
            'metadata.name': 'imontoya',
          },
          {
            kind: 'user',
            'metadata.namespace': 'reality',
            'metadata.name': 'mpatinkin',
          },
        ],
      },
      { token: 'my-token' },
    );

    expect(claims).toMatchObject([
      'user:default/inigom',
      'user:default/imontoya',
      'user:reality/mpatinkin',
      'group:default/team-a',
      'group:reality/screen-actors-guild',
    ]);
  });
});
