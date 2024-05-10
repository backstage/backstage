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

import { BackstageUserInfo } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';

const TABLE = 'user_info';

type Row = {
  user_entity_ref: string;
  user_info: string;
};

// TODO: How do we prune stale users?
export class UserInfoDatabaseHandler {
  constructor(private readonly client: Knex) {}

  async addUserInfo(userInfo: BackstageUserInfo): Promise<void> {
    await this.client<Row>(TABLE)
      .insert({
        user_entity_ref: userInfo.userEntityRef,
        user_info: JSON.stringify({
          ownershipEntityRefs: userInfo.ownershipEntityRefs,
        }),
      })
      .onConflict('user_entity_ref')
      .merge();
  }

  async getUserInfo(
    userEntityRef: string,
  ): Promise<BackstageUserInfo | undefined> {
    const info = await this.client<Row>(TABLE)
      .where({ user_entity_ref: userEntityRef })
      .first();

    if (!info) {
      return undefined;
    }

    const { ownershipEntityRefs } = JSON.parse(info.user_info);
    return {
      userEntityRef: info.user_entity_ref,
      ownershipEntityRefs,
    };
  }
}
