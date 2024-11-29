/*
 * Copyright 2020 The Backstage Authors
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

import { EntityPolicy } from './types';
import { Entity } from '../Entity';

const defaultKnownFields = ['apiVersion', 'kind', 'metadata', 'spec'];

/**
 * Ensures that there are no foreign root fields in the entity.
 *
 * @public
 */
export class NoForeignRootFieldsEntityPolicy implements EntityPolicy {
  private readonly knownFields: string[];

  constructor(knownFields: string[] = defaultKnownFields) {
    this.knownFields = knownFields;
  }

  async enforce(entity: Entity): Promise<Entity> {
    for (const field of Object.keys(entity)) {
      if (!this.knownFields.includes(field)) {
        throw new Error(`Unknown field ${field}`);
      }
    }
    return entity;
  }
}
