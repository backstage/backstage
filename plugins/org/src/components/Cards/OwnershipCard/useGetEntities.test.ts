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
import { renderHook, waitFor } from '@testing-library/react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const givenParentGroup = 'team.squad1';
const givenLeafGroup = 'team.squad2';
const givenUser = 'user.john';
const givenParentGroupEntity = createGroupEntityFromName(givenParentGroup);
const givenLeafGroupEntity = createGroupEntityFromName(givenLeafGroup);
const givenUserEntity = {
  kind: 'User',
  metadata: {
    name: givenUser,
  },
} as Partial<Entity> as Entity;

const catalogApi = catalogApiMock.mock({
  getEntities: jest.fn(async () => Promise.resolve({ items: [] })),
});

jest.mock('@backstage/core-plugin-api', () => {
  const actual = jest.requireActual('@backstage/core-plugin-api');
  return { ...actual, useApi: jest.fn(() => catalogApi) };
});

const getEntityRelationsMock: jest.Mock<
  CompoundEntityRef[],
  [Entity | undefined]
> = jest.fn();
jest.mock('@backstage/plugin-catalog-react', () => {
  return {
    catalogApiRef: {},
    getEntityRelations: jest.fn(entity => {
      return getEntityRelationsMock(entity);
    }) as any,
  };
});

describe('useGetEntities', () => {
  const ownersFilter = (...owners: string[]) =>
    expect.objectContaining({
      filter: expect.arrayContaining([
        expect.objectContaining({
          'relations.ownedBy': expect.arrayContaining(owners),
        }),
      ]),
    });

  describe('given aggregated relationAggregation', () => {
    const whenHookIsCalledWith = async (_entity: Entity) => {
      const { result } = renderHook(
        ({ entity }) => useGetEntities(entity, 'aggregated'),
        {
          initialProps: { entity: _entity },
        },
      );

      await waitFor(() => expect(result.current.loading).toBe(false));
    };

    beforeEach(() => {
      catalogApi.getEntitiesByRefs.mockImplementation(
        async ({ entityRefs: [ref] }) =>
          ref.includes(givenParentGroup)
            ? { items: [givenParentGroupEntity] }
            : { items: [givenLeafGroupEntity] },
      );
    });

    afterEach(() => {
      getEntityRelationsMock.mockRestore();
      catalogApi.getEntitiesByRefs.mockRestore();
    });

    describe('when given entity is a group', () => {
      beforeEach(() => {
        getEntityRelationsMock
          .mockReturnValueOnce([createGroupRefFromName(givenLeafGroup)])
          .mockReturnValue([]);
      });

      it('should aggregate child ownership', async () => {
        await whenHookIsCalledWith(givenParentGroupEntity);
        expect(catalogApi.getEntities).toHaveBeenCalledWith(
          ownersFilter(
            `group:default/${givenParentGroup}`,
            `group:default/${givenLeafGroup}`,
          ),
        );
      });

      it('should retrieve child with their relations', async () => {
        await whenHookIsCalledWith(givenParentGroupEntity);
        expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledWith({
          entityRefs: [`group:default/${givenLeafGroup}`],
          fields: ['kind', 'metadata.namespace', 'metadata.name', 'relations'],
        });
      });

      describe('when relations are deep (children of children)', () => {
        const givenIntermediateGroup = 'intermediate-group';
        const givenIntermediateGroupEntity = createGroupEntityFromName(
          givenIntermediateGroup,
        );

        beforeEach(() => {
          catalogApi.getEntitiesByRefs.mockRestore();
          catalogApi.getEntitiesByRefs.mockImplementation(
            async ({ entityRefs: [ref] }) => {
              if (ref.includes(givenParentGroup)) {
                return { items: [givenParentGroupEntity] };
              }

              if (ref.includes(givenIntermediateGroup)) {
                return { items: [givenIntermediateGroupEntity] };
              }

              return { items: [givenLeafGroupEntity] };
            },
          );
        });

        it('should retrieve entities owned by any children', async () => {
          getEntityRelationsMock.mockRestore();
          getEntityRelationsMock.mockImplementation(entity => {
            if (entity?.metadata.name === givenParentGroup) {
              return [createGroupRefFromName(givenIntermediateGroup)];
            }

            if (entity?.metadata.name === givenIntermediateGroup) {
              return [createGroupRefFromName(givenLeafGroup)];
            }

            return [];
          });

          await whenHookIsCalledWith(givenParentGroupEntity);
          expect(catalogApi.getEntities).toHaveBeenCalledWith(
            ownersFilter(
              `group:default/${givenParentGroup}`,
              `group:default/${givenIntermediateGroup}`,
              `group:default/${givenLeafGroup}`,
            ),
          );
        });

        it('should retrieve entities owned by any children when circular relation', async () => {
          getEntityRelationsMock.mockRestore();
          getEntityRelationsMock.mockImplementation(entity => {
            if (entity?.metadata.name === givenParentGroup) {
              return [createGroupRefFromName(givenIntermediateGroup)];
            }

            if (entity?.metadata.name === givenIntermediateGroup) {
              return [createGroupRefFromName(givenLeafGroup)];
            }

            // returns parent by default so givenLeafGroup will have the givenParentGroup as child
            return [createGroupRefFromName(givenParentGroup)];
          });

          await whenHookIsCalledWith(givenParentGroupEntity);
          expect(catalogApi.getEntities).toHaveBeenCalledWith(
            ownersFilter(
              `group:default/${givenParentGroup}`,
              `group:default/${givenIntermediateGroup}`,
              `group:default/${givenLeafGroup}`,
            ),
          );
        });
      });
    });

    describe('when given entity is a user', () => {
      it('should aggregate parent ownership and direct', async () => {
        getEntityRelationsMock.mockReturnValue([
          createGroupRefFromName(givenLeafGroup),
        ]);

        await whenHookIsCalledWith(givenUserEntity);
        expect(catalogApi.getEntities).toHaveBeenCalledWith(
          ownersFilter(
            `group:default/${givenLeafGroup}`,
            `user:default/${givenUser}`,
          ),
        );
      });
    });
  });

  describe('given direct relationAggregation', () => {
    const whenHookIsCalledWith = async (_entity: Entity) => {
      const { result } = renderHook(
        ({ entity }) => useGetEntities(entity, 'direct'),
        {
          initialProps: { entity: _entity },
        },
      );

      await waitFor(() => expect(result.current.loading).toBe(false));
    };

    it('given group entity should return directly owned entities', async () => {
      await whenHookIsCalledWith(givenLeafGroupEntity);
      expect(catalogApi.getEntities).toHaveBeenCalledWith(
        ownersFilter(`group:default/${givenLeafGroup}`),
      );
    });

    it('given user entity should return directly owned entities', async () => {
      await whenHookIsCalledWith(givenUserEntity);
      expect(catalogApi.getEntities).toHaveBeenCalledWith(
        ownersFilter(`user:default/${givenUser}`),
      );
    });
  });

  describe('useGetEntities with 500+ relations', () => {
    const manyGroups = Array.from({ length: 555 }, (_, i) =>
      createGroupEntityFromName(`group${i + 1}`),
    );

    const givenUserWithManyGroups = {
      kind: 'User',
      metadata: {
        name: givenUser,
      },
      spec: {
        memberOf: manyGroups.map(
          group => `group:default/${group.metadata.name}`,
        ),
      },
    } as Partial<Entity> as Entity;

    beforeEach(() => {
      getEntityRelationsMock.mockImplementation(entity =>
        entity?.kind === 'User'
          ? manyGroups.map(group => createGroupRefFromName(group.metadata.name))
          : [],
      );
      catalogApi.getEntities.mockClear();
    });

    it('should handle 500+ relations without exceeding URL length limits', async () => {
      const { result } = renderHook(
        ({ entity }) => useGetEntities(entity, 'aggregated'),
        {
          initialProps: { entity: givenUserWithManyGroups },
        },
      );

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });

      const callArgs = catalogApi.getEntities.mock.calls[0][0];

      expect(
        (callArgs!.filter as any)[0]['relations.ownedBy'].length,
      ).toBeLessThanOrEqual(100);

      const owners = (callArgs!.filter as any)[0]['relations.ownedBy'];

      expect(Array.isArray(owners)).toBeTruthy();
      expect(owners.length).toBeLessThanOrEqual(100);
    });
  });

  describe('useGetEntities exceeding default 16384 bytes header size', () => {
    const largeNumberOfGroups = Array.from({ length: 600 }, (_, i) =>
      createGroupEntityFromName(`very-long-group-name-${i + 1}`),
    );

    const givenUserWithLargeNumberOfGroups = {
      kind: 'User',
      metadata: {
        name: givenUser,
      },
      spec: {
        memberOf: largeNumberOfGroups.map(
          group => `group:default/${group.metadata.name}`,
        ),
      },
    } as Partial<Entity> as Entity;

    beforeEach(() => {
      getEntityRelationsMock.mockImplementation(entity =>
        entity?.kind === 'User'
          ? largeNumberOfGroups.map(group =>
              createGroupRefFromName(group.metadata.name),
            )
          : [],
      );
      catalogApi.getEntities.mockClear();
    });

    it('should batch the request to avoid exceeding header size limits', async () => {
      const { result } = renderHook(
        ({ entity }) => useGetEntities(entity, 'aggregated'),
        {
          initialProps: { entity: givenUserWithLargeNumberOfGroups },
        },
      );

      await waitFor(() => expect(result.current.loading).toBe(false), {
        timeout: 5000,
      });
      const callArgs = catalogApi.getEntities.mock.calls[0][0];

      const url = new URL(
        `http://localhost/api/catalog/entities?${new URLSearchParams(
          callArgs as any,
        )}`,
      );
      const headerSize = url.href.length;
      expect(headerSize).toBeLessThanOrEqual(16384);

      const owners = (callArgs!.filter as any)[0]['relations.ownedBy'];
      expect(Array.isArray(owners)).toBeTruthy();
      expect(owners.length).toBeLessThanOrEqual(100);
    });
  });
});

function createGroupEntityFromName(name: string): Entity {
  return {
    kind: 'Group',
    metadata: {
      name: name,
    },
  } as Partial<Entity> as Entity;
}

function createGroupRefFromName(name: string): CompoundEntityRef {
  return {
    kind: 'Group',
    namespace: 'default',
    name: name,
  };
}
