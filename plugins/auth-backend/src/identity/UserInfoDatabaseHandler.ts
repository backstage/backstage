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

import { DateTime } from 'luxon';
import { Knex } from 'knex';

import { BackstageTokenPayload } from './TokenFactory';

const TABLE = 'user_info';

type Row = {
  user_entity_ref: string;
  user_info: string;
  exp: string;
};

type UserInfo = {
  claims: Omit<BackstageTokenPayload, 'aud' | 'iat' | 'iss' | 'uip'>;
};

export class UserInfoDatabaseHandler {
  constructor(private readonly client: Knex) {}

  async addUserInfo(userInfo: UserInfo): Promise<void> {
    await this.client<Row>(TABLE)
      .insert({
        user_entity_ref: userInfo.claims.sub as string,
        user_info: JSON.stringify(userInfo),
        exp: DateTime.fromSeconds(userInfo.claims.exp as number, {
          zone: 'utc',
        }).toSQL({ includeOffset: false }),
      })
      .onConflict('user_entity_ref')
      .merge();
  }

  async getUserInfo(userEntityRef: string): Promise<UserInfo | undefined> {
    const info = await this.client<Row>(TABLE)
      .where({ user_entity_ref: userEntityRef })
      .first();

    if (!info) {
      return undefined;
    }

    const userInfo = JSON.parse(info.user_info);
    return userInfo;
  }
}
