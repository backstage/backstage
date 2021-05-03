/*
 * Copyright 2021 Spotify AB
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
import { v4 as uuid } from 'uuid';
import { BackgroundContext, Context, TransactionValue } from './Context';
import { DatabaseManager } from './database/DatabaseManager';
import { DefaultLocationStore } from './DefaultLocationStore';

describe('DefaultLocationStore', () => {
  const createLocationStore = async () => {
    const knex = await DatabaseManager.createTestDatabaseConnection();
    const db = await DatabaseManager.createDatabase(knex);
    const connection = { applyMutation: jest.fn() };
    const store = new DefaultLocationStore(knex);
    await store.connect(connection);

    const withContext = async (handler: (ctx: Context) => Promise<any>) => {
      return await db.transaction(async tx => {
        const ctx = TransactionValue.in(new BackgroundContext(), tx as any);
        return await handler(ctx);
      });
    };
    return { store, connection, db, withContext };
  };

  it('should do a full sync with the locations on connect', async () => {
    const { connection } = await createLocationStore();

    expect(connection.applyMutation).toHaveBeenCalledWith({
      type: 'full',
      entities: [],
    });
  });

  describe('listLocations', () => {
    it('lists empty locations when there is no locations', async () => {
      expect.assertions(1);

      const { store, withContext } = await createLocationStore();
      await withContext(async ctx => {
        expect(await store.listLocations(ctx)).toEqual([]);
      });
    });

    it('lists locations that are added to the db', async () => {
      expect.assertions(2);

      const { store, withContext } = await createLocationStore();

      await withContext(async ctx => {
        await store.createLocation(ctx, {
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        const listLocations = await store.listLocations(ctx);
        expect(listLocations).toHaveLength(1);
        expect(listLocations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              target:
                'https://github.com/backstage/demo/blob/master/catalog-info.yml',
              type: 'url',
            }),
          ]),
        );
      });
    });
  });

  describe('createLocation', () => {
    it('throws when the location already exists', async () => {
      expect.assertions(1);

      const { store, withContext } = await createLocationStore();
      const spec = {
        target:
          'https://github.com/backstage/demo/blob/master/catalog-info.yml',
        type: 'url',
      };
      await withContext(async ctx => {
        await store.createLocation(ctx, spec);

        await expect(() => store.createLocation(ctx, spec)).rejects.toThrow(
          new RegExp(`Location ${spec.type}:${spec.target} already exists`),
        );
      });
    });

    it('calls apply mutation when adding a new location', async () => {
      expect.assertions(1);

      const { store, connection, withContext } = await createLocationStore();

      await withContext(async ctx => {
        await store.createLocation(ctx, {
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        expect(connection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          removed: [],
          added: expect.arrayContaining([
            expect.objectContaining({
              spec: {
                target:
                  'https://github.com/backstage/demo/blob/master/catalog-info.yml',
                type: 'url',
              },
            }),
          ]),
        });
      });
    });
  });

  describe('deleteLocation', () => {
    it('throws if the location does not exist', async () => {
      expect.assertions(1);
      const { store, withContext } = await createLocationStore();
      await withContext(async ctx => {
        const id = uuid();
        await expect(() => store.deleteLocation(ctx, id)).rejects.toThrow(
          new RegExp(`Found no location with ID ${id}`),
        );
      });
    });

    it('calls apply mutation when adding a new location', async () => {
      expect.assertions(1);

      const { store, connection, withContext } = await createLocationStore();

      await withContext(async ctx => {
        const location = await store.createLocation(ctx, {
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        await store.deleteLocation(ctx, location.id);

        expect(connection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [],
          removed: expect.arrayContaining([
            expect.objectContaining({
              spec: {
                target:
                  'https://github.com/backstage/demo/blob/master/catalog-info.yml',
                type: 'url',
              },
            }),
          ]),
        });
      });
    });
  });
});
