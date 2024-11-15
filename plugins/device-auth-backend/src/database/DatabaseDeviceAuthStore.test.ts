/*
 * Copyright 2024 The Backstage Authors
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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import {
  DatabaseDeviceAuthStore,
  RawDbDeviceAuthRow,
} from './DatabaseDeviceAuthStore';

jest.setTimeout(60_000);

const databases = TestDatabases.create({});

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);
  const databaseManager = {
    getClient: async () => knex,
    migrations: {
      skip: false,
    },
  };

  return {
    knex,
    storage: await DatabaseDeviceAuthStore.create({
      database: databaseManager,
    }),
  };
}

describe.each(databases.eachSupportedId())(
  'DatabaseDeviceAuthStore (%s)',
  databaseId => {
    let storage: DatabaseDeviceAuthStore;
    let knex: Knex;

    beforeAll(async () => {
      ({ knex, storage } = await createStore(databaseId));
    });

    afterEach(async () => {
      jest.resetAllMocks();

      await knex('user_codes').del();
    });

    const insert = (data: RawDbDeviceAuthRow[]) =>
      knex<RawDbDeviceAuthRow>('user_codes').insert(data);
    const query = () =>
      knex<RawDbDeviceAuthRow>('user_codes').orderBy('user_code').select();

    describe('getByUserCode', () => {
      it('should throw an error', async () => {
        await expect(() =>
          storage.getByUserCode({
            userCode: 'abcdefgh',
          }),
        ).rejects.toThrow(`No device auth entry found for user code abcdefgh`);
      });

      it('should return the entry', async () => {
        await insert([
          {
            user_code: 'abcdefgh',
            client_id: 'client-1',
            device_code: 'device-1',
            is_validated: false,
            expires_at: new Date(),
          },
        ]);

        await expect(
          storage.getByUserCode({
            userCode: 'abcdefgh',
          }),
        ).resolves.toEqual({
          userCode: 'abcdefgh',
          clientId: 'client-1',
          deviceCode: 'device-1',
          accessToken: null,
          isValidated: 0,
          expiresAt: expect.any(Date),
        });
      });
    });

    describe('getByDeviceCode', () => {
      it('should throw an error', async () => {
        await expect(() =>
          storage.getByDeviceCode({
            deviceCode: 'abcdefgh',
          }),
        ).rejects.toThrow(
          `No device auth entry found for device code abcdefgh`,
        );
      });

      it('should return the entry', async () => {
        await insert([
          {
            user_code: 'ijklmnop',
            client_id: 'client-2',
            device_code: 'device-2',
            access_token: 'token-2',
            is_validated: true,
            expires_at: new Date(),
          },
        ]);

        await expect(
          storage.getByDeviceCode({
            deviceCode: 'device-2',
          }),
        ).resolves.toEqual({
          userCode: 'ijklmnop',
          clientId: 'client-2',
          deviceCode: 'device-2',
          accessToken: 'token-2',
          isValidated: 1,
          expiresAt: expect.any(Date),
        });
      });
    });

    describe('create', () => {
      it('should create a new entry', async () => {
        await storage.create({
          userCode: 'user-1',
          clientId: 'client-1',
          deviceCode: 'device-1',
          expiresAt: new Date(),
        });

        await expect(query()).resolves.toEqual([
          {
            user_code: 'user-1',
            client_id: 'client-1',
            device_code: 'device-1',
            access_token: '',
            is_validated: 0,
            expires_at: expect.any(Number),
          },
        ]);
      });

      it('should throw an error', async () => {
        await storage.create({
          userCode: 'user-1',
          clientId: 'client-1',
          deviceCode: 'device-1',
          expiresAt: new Date(),
        });

        await expect(() =>
          storage.create({
            userCode: 'user-1',
            clientId: 'client-1',
            deviceCode: 'device-1',
            expiresAt: new Date(),
          }),
        ).rejects.toThrow(
          `Device auth entry already exists for user code user-1`,
        );
      });
    });

    describe('setValidated', () => {
      it('should throw an error if the entry does not exist', async () => {
        await expect(() =>
          storage.setValidated({
            userCode: 'user-1',
            accessToken: 'token-1',
          }),
        ).rejects.toThrow(`No device auth entry found for user code user-1`);
      });

      it('should set the validated flag', async () => {
        await insert([
          {
            user_code: 'user-1',
            client_id: 'client-1',
            device_code: 'device-1',
            is_validated: false,
            expires_at: new Date(),
          },
        ]);

        await storage.setValidated({
          userCode: 'user-1',
          accessToken: 'token-1',
        });

        await expect(query()).resolves.toEqual([
          {
            user_code: 'user-1',
            client_id: 'client-1',
            device_code: 'device-1',
            access_token: 'token-1',
            is_validated: 1,
            expires_at: expect.any(Number),
          },
        ]);
      });
    });

    describe('deleteByUserCode', () => {
      it('should not throw an error if the entry does not exist', async () => {
        await expect(
          storage.deleteByUserCode({
            userCode: 'user-1',
          }),
        ).resolves.toBeUndefined();
      });

      it('should delete the row', async () => {
        await insert([
          {
            user_code: 'user-1',
            client_id: 'client-1',
            device_code: 'device-1',
            is_validated: false,
            expires_at: new Date(),
          },
        ]);

        await storage.deleteByUserCode({
          userCode: 'user-1',
        });
        await expect(query()).resolves.toEqual([]);
      });
    });

    describe('deleteByDeviceCode', () => {
      it('should not throw an error if the entry does not exist', async () => {
        await expect(
          storage.deleteByDeviceCode({
            deviceCode: 'device-1',
          }),
        ).resolves.toBeUndefined();
      });

      it('should delete the row', async () => {
        await insert([
          {
            user_code: 'user-1',
            client_id: 'client-1',
            device_code: 'device-1',
            is_validated: false,
            expires_at: new Date(),
          },
        ]);

        await storage.deleteByDeviceCode({
          deviceCode: 'device-1',
        });
        await expect(query()).resolves.toEqual([]);
      });
    });
  },
);
