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

import { MikroORM } from '@mikro-orm/core';
import { MikroOrmService } from '@backstage/backend-plugin-api';
import { UserSettingsStore, UserSetting } from './UserSettingsStore';
import { UserSettingEntity } from './entities/UserSettingEntity';
import { JsonValue } from '@backstage/types';
import { NotFoundError } from '@backstage/errors';

export class MikroOrmUserSettingsStore implements UserSettingsStore {
  static async create(options: {
    mikroOrm: MikroOrmService;
  }): Promise<MikroOrmUserSettingsStore> {
    const orm = await options.mikroOrm.init([UserSettingEntity]);
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    return new MikroOrmUserSettingsStore(orm);
  }

  constructor(private readonly orm: MikroORM) {}

  async get(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
  }): Promise<UserSetting> {
    const em = this.orm.em.fork();
    const setting = await em.findOne(UserSettingEntity, {
      userEntityRef: options.userEntityRef,
      bucket: options.bucket,
      key: options.key,
    });

    if (!setting) {
      throw new NotFoundError(
        `Unable to find '${options.key}' in bucket '${options.bucket}'`,
      );
    }

    return {
      bucket: setting.bucket,
      key: setting.key,
      value: setting.value,
    };
  }

  async set(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
    value: JsonValue;
  }): Promise<void> {
    const em = this.orm.em.fork();
    await em.upsert(UserSettingEntity, {
      userEntityRef: options.userEntityRef,
      bucket: options.bucket,
      key: options.key,
      value: options.value,
    });
  }

  async delete(options: {
    userEntityRef: string;
    bucket: string;
    key: string;
  }): Promise<void> {
    const em = this.orm.em.fork();
    await em.nativeDelete(UserSettingEntity, {
      userEntityRef: options.userEntityRef,
      bucket: options.bucket,
      key: options.key,
    });
  }
}
