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

import { CatalogApi } from '@backstage/catalog-client';
import {
  RELATION_MEMBER_OF,
  UserEntity,
  UserEntityV1alpha1,
} from '@backstage/catalog-model';
import { TokenIssuer } from '../../identity';
import { CatalogIdentityClient } from './CatalogIdentityClient';

describe('CatalogIdentityClient', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
  };
  const tokenIssuer: jest.Mocked<TokenIssuer> = {
    issueToken: jest.fn(),
    listPublicKeys: jest.fn(),
  };

  afterEach(() => jest.resetAllMocks());

  it('findUser passes through the correct search params', async () => {
    catalogApi.getEntities.mockResolvedValueOnce({ items: [{} as UserEntity] });
    tokenIssuer.issueToken.mockResolvedValue('my-token');
    const client = new CatalogIdentityClient({
      catalogApi,
      tokenIssuer,
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
    expect(tokenIssuer.issueToken).toHaveBeenCalledWith({
      claims: {
        sub: 'backstage.io/auth-backend',
      },
    });
  });

  it('resolveCatalogMemberClaims resolves membership', async () => {
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
            target: {
              kind: 'Group',
              namespace: 'default',
              name: 'team-a',
            },
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
            target: {
              kind: 'Group',
              namespace: 'reality',
              name: 'screen-actors-guild',
            },
          },
        ],
      },
    ];
    catalogApi.getEntities.mockResolvedValueOnce({ items: mockUsers });

    const client = new CatalogIdentityClient({
      catalogApi,
      tokenIssuer,
    });

    const claims = await client.resolveCatalogMemberClaims('inigom', [
      'User:default/imontoya',
      'User:reality/mpatinkin',
    ]);

    expect(catalogApi.getEntities).toHaveBeenCalledWith({
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
    });

    expect(claims).toMatchObject({
      claims: {
        sub: 'inigom',
        ent: [
          'user:default/imontoya',
          'user:reality/mpatinkin',
          'group:default/team-a',
          'group:reality/screen-actors-guild',
        ],
      },
    });
  });
});
