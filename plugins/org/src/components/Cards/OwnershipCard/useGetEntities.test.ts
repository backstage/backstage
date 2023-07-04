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
import { Entity } from '@backstage/catalog-model';
import { useGetEntities } from './useGetEntities';
import { CatalogApi } from '@backstage/catalog-client';
import { renderHook } from '@testing-library/react-hooks';

const catalogApiMock: Pick<CatalogApi, 'getEntities'> = {
  getEntities: jest.fn(async () => {
    return Promise.resolve({ items: [] });
  }),
};

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(() => catalogApiMock),
}));
jest.mock('@backstage/plugin-catalog-react', () => ({
  catalogApiRef: {},
  getEntityRelations: jest.fn(() => []),
}));

describe('useGetEntities', () => {
  describe('given aggregated relationsType', () => {
    it('when entity is group should aggregate child ownership', async () => {
      const givenSquad = 'team.squad1';
      const whenEntity = {
        kind: 'Group',
        metadata: {
          name: givenSquad,
        },
      } as Partial<Entity> as Entity;

      const hook = renderHook(
        ({ entity }) => useGetEntities(entity, 'aggregated'),
        {
          initialProps: { entity: whenEntity },
        },
      );

      await hook.waitForNextUpdate();
      expect(catalogApiMock.getEntities).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: expect.arrayContaining([
            expect.objectContaining({
              'relations.ownedBy': [`group:default/${givenSquad}`],
            }),
          ]),
        }),
      );
    });
  });
});
