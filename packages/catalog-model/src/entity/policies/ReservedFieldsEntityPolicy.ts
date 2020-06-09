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

type ExceptWhere = 'metadata' | 'spec' | 'labels' | 'annotations';
type ReservedFields = Record<string, ExceptWhere[]>;

const DEFAULT_RESERVED_ENTITY_FIELDS: ReservedFields = {
  apiVersion: [],
  kind: [],
  spec: [],
  uid: ['metadata'],
  etag: ['metadata'],
  generation: ['metadata'],
  name: ['metadata'],
  namespace: ['metadata'],
  description: ['metadata'],
  labels: ['metadata'],
  annotations: ['metadata'],
  // The below items are known to appear in core kinds, and therefore should
  // not be appearing in metadata (which would indicate that the user made a
  // mistake in where to place them).
  lifecycle: ['spec'],
  owner: ['spec'],
};

/**
 * Ensures that fields are not given certain reserved names.
 */
export class ReservedFieldsEntityPolicy implements EntityPolicy {
  private readonly reservedFields: ReservedFields;

  constructor(fields?: ReservedFields) {
    this.reservedFields = {
      ...(fields ?? {}),
      ...DEFAULT_RESERVED_ENTITY_FIELDS,
    };
  }

  async enforce(entity: Entity): Promise<Entity> {
    for (const [name, exceptWhere] of Object.entries(this.reservedFields)) {
      if (
        !exceptWhere.includes('metadata') &&
        entity.metadata.hasOwnProperty(name)
      ) {
        throw new Error(
          `The metadata may not contain the field ${name}, because it has reserved meaning`,
        );
      }
      if (!exceptWhere.includes('spec') && entity.spec?.hasOwnProperty(name)) {
        throw new Error(
          `The spec may not contain the field ${name}, because it has reserved meaning`,
        );
      }
      if (
        !exceptWhere.includes('labels') &&
        entity.metadata.labels?.hasOwnProperty(name)
      ) {
        throw new Error(
          `A label may not have the field ${name}, because it has reserved meaning`,
        );
      }
      if (
        !exceptWhere.includes('annotations') &&
        entity.metadata.annotations?.hasOwnProperty(name)
      ) {
        throw new Error(
          `An annotation may not have the field ${name}, because it has reserved meaning`,
        );
      }
    }
    return entity;
  }
}
