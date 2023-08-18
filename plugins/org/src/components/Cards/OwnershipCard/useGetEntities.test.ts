/*
 * Copyright 2023 The Backstage Authors
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
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { useGetEntities } from './useGetEntities';
import { CatalogApi } from '@backstage/catalog-client';
import { renderHook } from '@testing-library/react-hooks';
import { getEntityRelations } from '@backstage/plugin-catalog-react';

const givenParentGroup = 'team.squad1';
const givenLeafGroup = 'team.squad2';
const givenUser = 'user.john';
const givenParentGroupEntity = {
  kind: 'Group',
  metadata: {
    name: givenParentGroup,
  },
} as Partial<Entity> as Entity;
const givenLeafGroupEntity = {
  kind: 'Group',
  metadata: {
    name: givenLeafGroup,
  },
} as Partial<Entity> as Entity;
const givenUserEntity = {
  kind: 'User',
  metadata: {
    name: givenUser,
  },
} as Partial<Entity> as Entity;

const catalogApiMock: Pick<CatalogApi, 'getEntities' | 'getEntitiesByRefs'> = {
  getEntities: jest.fn(async () => Promise.resolve({ items: [] })),
  getEntitiesByRefs: jest.fn(async ({ entityRefs: [ref] }) =>
    ref.includes(givenParentGroup)
      ? { items: [givenParentGroupEntity] }
      : { items: [givenLeafGroupEntity] },
  ),
};

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(() => catalogApiMock),
}));
jest.mock('@backstage/plugin-catalog-react', () => ({
  catalogApiRef: {},
  getEntityRelations: jest.fn(entity => {
    if (entity?.metadata.name === givenParentGroup) {
      return [
        {
          kind: 'Group',
          namespace: 'default',
          name: givenLeafGroup,
        } as CompoundEntityRef,
      ];
    } else if (entity?.kind === 'User') {
      return [
        {
          kind: 'Group',
          namespace: 'default',
          name: givenLeafGroup,
        } as CompoundEntityRef,
      ];
    }

    return [];
  }) as typeof getEntityRelations,
}));

describe('useGetEntities', () => {
  const ownersFilter = (...owners: string[]) =>
    expect.objectContaining({
      filter: expect.arrayContaining([
        expect.objectContaining({
          'relations.ownedBy': owners,
        }),
      ]),
    });

  describe('given aggregated relationsType', () => {
    const whenHookIsCalledWith = async (_entity: Entity) => {
      const hook = renderHook(
        ({ entity }) => useGetEntities(entity, 'aggregated'),
        {
          initialProps: { entity: _entity },
        },
      );

      await hook.waitForNextUpdate();
    };

    it('given group entity should aggregate child ownership', async () => {
      await whenHookIsCalledWith(givenParentGroupEntity);
      expect(catalogApiMock.getEntities).toHaveBeenCalledWith(
        ownersFilter(
          `group:default/${givenParentGroup}`,
          `group:default/${givenLeafGroup}`,
        ),
      );
    });

    it('given user entity should aggregate parent ownership and direct', async () => {
      await whenHookIsCalledWith(givenUserEntity);
      expect(catalogApiMock.getEntities).toHaveBeenCalledWith(
        ownersFilter(
          `group:default/${givenLeafGroup}`,
          `user:default/${givenUser}`,
        ),
      );
    });
  });

  describe('given direct relationsType', () => {
    const whenHookIsCalledWith = async (_entity: Entity) => {
      const hook = renderHook(
        ({ entity }) => useGetEntities(entity, 'direct'),
        {
          initialProps: { entity: _entity },
        },
      );

      await hook.waitForNextUpdate();
    };

    it('given group entity should return directly owned entities', async () => {
      await whenHookIsCalledWith(givenLeafGroupEntity);
      expect(catalogApiMock.getEntities).toHaveBeenCalledWith(
        ownersFilter(`group:default/${givenLeafGroup}`),
      );
    });

    it('given user entity should return directly owned entities', async () => {
      await whenHookIsCalledWith(givenUserEntity);
      expect(catalogApiMock.getEntities).toHaveBeenCalledWith(
        ownersFilter(`user:default/${givenUser}`),
      );
    });
  });
});
