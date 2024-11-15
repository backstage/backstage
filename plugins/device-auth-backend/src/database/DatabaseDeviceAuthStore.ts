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

import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import { DeviceAuthStore, type DeviceAuthEntry } from './DeviceAuthStore';

/**
 * @public
 */
export type RawDbDeviceAuthRow = {
  user_code: string;
  client_id: string;
  device_code: string;
  access_token?: string;
  is_validated: boolean;
  expires_at: Date;
};

/**
 * Store to manage device authorization data in the database.
 *
 * @public
 */
export class DatabaseDeviceAuthStore implements DeviceAuthStore {
  static async create(options: {
    database: DatabaseService;
  }): Promise<DatabaseDeviceAuthStore> {
    const { database } = options;
    const client = await database.getClient();
    const migrationsDir = resolvePackagePath(
      '@backstage/plugin-device-auth-backend',
      'migrations',
    );
    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseDeviceAuthStore(client);
  }

  private constructor(private readonly db: Knex) {}

  private rowToEntry(row: RawDbDeviceAuthRow): DeviceAuthEntry {
    return {
      userCode: row.user_code,
      clientId: row.client_id,
      deviceCode: row.device_code,
      accessToken: row.access_token,
      isValidated: row.is_validated,
      expiresAt: new Date(row.expires_at),
    };
  }

  async getByUserCode(options: { userCode: string }): Promise<DeviceAuthEntry> {
    const row = await this.db<RawDbDeviceAuthRow>('user_codes')
      .where('user_code', options.userCode)
      .first();

    if (!row) {
      throw new NotFoundError(
        `No device auth entry found for user code ${options.userCode}`,
      );
    }

    return this.rowToEntry(row);
  }

  async getByDeviceCode(options: {
    deviceCode: string;
  }): Promise<DeviceAuthEntry> {
    const row = await this.db<RawDbDeviceAuthRow>('user_codes')
      .where('device_code', options.deviceCode)
      .first();

    if (!row) {
      throw new NotFoundError(
        `No device auth entry found for device code ${options.deviceCode}`,
      );
    }

    return this.rowToEntry(row);
  }

  async create(options: {
    userCode: string;
    clientId: string;
    deviceCode: string;
    accessToken?: string;
    isValidated?: boolean;
    expiresAt: Date;
  }): Promise<void> {
    const existingRow = await this.db<RawDbDeviceAuthRow>('user_codes')
      .where({ user_code: options.userCode })
      .first();

    if (existingRow) {
      throw new Error(
        `Device auth entry already exists for user code ${options.userCode}`,
      );
    }

    await this.db<RawDbDeviceAuthRow>('user_codes').insert({
      user_code: options.userCode,
      client_id: options.clientId,
      device_code: options.deviceCode,
      access_token: options.accessToken ?? '',
      is_validated: options.isValidated ?? false,
      expires_at: options.expiresAt,
    });
  }

  async setValidated(options: {
    userCode: string;
    accessToken: string;
  }): Promise<void> {
    const affectedRows = await this.db<RawDbDeviceAuthRow>('user_codes')
      .where('user_code', options.userCode)
      .update({
        is_validated: true,
        access_token: options.accessToken,
      });

    if (affectedRows === 0) {
      throw new NotFoundError(
        `No device auth entry found for user code ${options.userCode}`,
      );
    }
  }

  async deleteByUserCode(options: { userCode: string }): Promise<void> {
    await this.db<RawDbDeviceAuthRow>('user_codes')
      .where('user_code', options.userCode)
      .delete();
  }

  async deleteByDeviceCode(options: { deviceCode: string }): Promise<void> {
    await this.db<RawDbDeviceAuthRow>('user_codes')
      .where('device_code', options.deviceCode)
      .delete();
  }
}
