/*
 * Copyright 2021 The Backstage Authors
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

import { entityFactRetriever } from './entityFactRetriever';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  PluginEndpointDiscovery,
  getVoidLogger,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { CatalogListResponse } from '@backstage/catalog-client';

const getEntitiesMock = jest.fn();
jest.mock('@backstage/catalog-client', () => {
  return {
    CatalogClient: jest
      .fn()
      .mockImplementation(() => ({ getEntities: getEntitiesMock })),
  };
});
const discovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest.fn(),
  getExternalBaseUrl: jest.fn(),
};

const defaultEntityListResponse: CatalogListResponse<Entity> = {
  items: [
    {
      apiVersion: 'backstage.io/v1beta1',
      metadata: { name: 'service-with-owner' },
      kind: 'Component',
      spec: {
        type: 'service',
        lifecycle: 'test',
        owner: 'group:team-a',
      },
      relations: [
        {
          type: RELATION_OWNED_BY,
          target: { name: 'team-a', kind: 'group', namespace: 'default' },
        },
      ],
    },
    {
      apiVersion: 'backstage.io/v1beta1',
      metadata: {
        name: 'service-without-owner',
      },
      kind: 'Component',
      spec: {
        type: 'service',
        lifecycle: 'test',
        owner: '',
      },
    },
    {
      apiVersion: 'backstage.io/v1beta1',
      metadata: {
        name: 'service-with-user-owner',
      },
      kind: 'Component',
      spec: {
        type: 'service',
        lifecycle: 'test',
        owner: 'user:my-user',
      },
    },
  ],
};

const handlerContext = {
  discovery,
  logger: getVoidLogger(),
  config: ConfigReader.fromConfigs([]),
};

describe('entityFactRetriever', () => {
  beforeEach(() => {
    getEntitiesMock.mockResolvedValue(defaultEntityListResponse);
  });
  afterEach(() => {
    getEntitiesMock.mockClear();
  });

  describe('hasSpecWithOwner', () => {
    describe('where the entity has an owner in the spec', () => {
      it('returns true for hasSpecWithOwner', async () => {
        const facts = await entityFactRetriever.handler(handlerContext);
        expect(
          facts.find(it => it.entity.name === 'service-with-owner'),
        ).toMatchObject({
          facts: {
            hasSpecWithOwner: true,
          },
        });
      });
    });
    describe('where the entity does not have an owner in the spec', () => {
      it('returns false for hasSpecWithOwner', async () => {
        const facts = await entityFactRetriever.handler(handlerContext);
        expect(
          facts.find(it => it.entity.name === 'service-without-owner'),
        ).toMatchObject({
          facts: {
            hasSpecWithOwner: false,
          },
        });
      });
    });
  });
  describe('hasSpecWithGroupOwner', () => {
    describe('where the entity has an group as owner in the spec', () => {
      it('returns true for hasSpecWithGroupOwner', async () => {
        const facts = await entityFactRetriever.handler(handlerContext);
        expect(
          facts.find(it => it.entity.name === 'service-with-owner'),
        ).toMatchObject({
          facts: {
            hasSpecWithGroupOwner: true,
          },
        });
      });
    });
    describe('where the entity has a user as owner in the spec', () => {
      it('returns false for hasSpecWithGroupOwner', async () => {
        const facts = await entityFactRetriever.handler(handlerContext);
        expect(
          facts.find(it => it.entity.name === 'service-with-user-owner'),
        ).toMatchObject({
          facts: {
            hasSpecWithGroupOwner: false,
          },
        });
      });
    });
    describe('where the entity does not have an owner in the spec', () => {
      it('returns false for hasSpecWithGroupOwner', async () => {
        const facts = await entityFactRetriever.handler(handlerContext);
        expect(
          facts.find(it => it.entity.name === 'service-without-owner'),
        ).toMatchObject({
          facts: {
            hasSpecWithGroupOwner: false,
          },
        });
      });
    });
  });
});
