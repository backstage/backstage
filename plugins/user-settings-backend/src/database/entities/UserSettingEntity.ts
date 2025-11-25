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

import { defineEntity, type InferEntity } from '@mikro-orm/core';
import { JsonValue } from '@backstage/types';

export const UserSettingEntity = defineEntity({
  name: 'UserSettingEntity',
  tableName: 'user_settings',
  properties: p => ({
    userEntityRef: p.string().primary().name('user_entity_ref'),
    bucket: p.string().primary(),
    key: p.string().primary(),
    value: p.json().columnType('text') as unknown as JsonValue,
  }),
});

export interface IUserSettingEntity
  extends InferEntity<typeof UserSettingEntity> {}
