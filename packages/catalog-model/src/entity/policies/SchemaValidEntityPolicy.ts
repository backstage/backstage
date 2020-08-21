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

import * as yup from 'yup';
import { EntityPolicy } from '../../types';
import { Entity } from '../Entity';

const DEFAULT_ENTITY_SCHEMA = yup.object({
  apiVersion: yup.string().required(),
  kind: yup.string().required(),
  metadata: yup
    .object({
      uid: yup.string().notRequired().min(1),
      etag: yup.string().notRequired().min(1),
      generation: yup.number().notRequired().integer().min(1),
      name: yup.string().required(),
      namespace: yup.string().notRequired(),
      description: yup.string().notRequired(),
      labels: yup.object<Record<string, string>>().notRequired(),
      annotations: yup.object<Record<string, string>>().notRequired(),
      tags: yup.array<string>().notRequired(),
    })
    .required(),
  spec: yup.object({}).notRequired(),
});

/**
 * Ensures that the entity spec is valid according to a schema.
 *
 * This should be the first policy in the list, to ensure that other downstream
 * policies can work with a structure that is at least valid in therms of the
 * typescript type.
 */
export class SchemaValidEntityPolicy implements EntityPolicy {
  private readonly schema: yup.Schema<Entity>;

  constructor(schema: yup.Schema<Entity> = DEFAULT_ENTITY_SCHEMA) {
    this.schema = schema;
  }

  async enforce(entity: Entity): Promise<Entity> {
    try {
      return await this.schema.validate(entity, { strict: true });
    } catch (e) {
      throw new Error(`Malformed envelope, ${e}`);
    }
  }
}
