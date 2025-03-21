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
import {
  Entity,
  GroupEntity,
  UserEntity,
  isGroupEntity,
  isUserEntity,
} from '@backstage/catalog-model';

export function areGroupEntities(
  entities: Entity[],
): entities is GroupEntity[] {
  return entities.every(e => isGroupEntity(e));
}

export function areUserEntities(entities: Entity[]): entities is UserEntity[] {
  return entities.every(e => isUserEntity(e));
}
