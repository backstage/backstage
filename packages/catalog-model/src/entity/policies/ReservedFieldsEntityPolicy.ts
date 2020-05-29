/*
 * Copyright 2020 Spotify AB
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

import { EntityPolicy } from '../../types';
import { Entity } from '../Entity';

const DEFAULT_RESERVED_ENTITY_FIELDS = [
  'apiVersion',
  'kind',
  'uid',
  'etag',
  'generation',
  'name',
  'namespace',
  'labels',
  'annotations',
  'spec',
];

/**
 * Ensures that fields are not given certain reserved names.
 */
export class ReservedFieldsEntityPolicy implements EntityPolicy {
  private readonly reservedFields: string[];

  constructor(fields?: string[]) {
    this.reservedFields = [
      ...(fields ?? []),
      ...DEFAULT_RESERVED_ENTITY_FIELDS,
    ];
  }

  async enforce(entity: Entity): Promise<Entity> {
    for (const field of this.reservedFields) {
      if (entity.spec?.hasOwnProperty(field)) {
        throw new Error(
          `The spec may not contain the field ${field}, because it has reserved meaning`,
        );
      }
      if (entity.metadata?.labels?.hasOwnProperty(field)) {
        throw new Error(
          `A label may not have the field ${field}, because it has reserved meaning`,
        );
      }
      if (entity.metadata?.annotations?.hasOwnProperty(field)) {
        throw new Error(
          `An annotation may not have the field ${field}, because it has reserved meaning`,
        );
      }
    }
    return entity;
  }
}
