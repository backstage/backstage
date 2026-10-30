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

import entitySchema from '../../schema/Entity.schema.json';
import { Entity } from '../Entity';
import { EntityPolicy } from './types';
import { compileSchema } from '../../validation/compileSchema';
import { CompiledSchema } from '../../validation/engine/types';

/**
 * Ensures that the entity spec is valid according to a schema.
 *
 * @remarks
 *
 * This should be the first policy in the list, to ensure that other downstream
 * policies can work with a structure that is at least valid in therms of the
 * typescript type.
 *
 * @public
 */
export class SchemaValidEntityPolicy implements EntityPolicy {
  private validate: CompiledSchema | undefined;

  async enforce(entity: Entity): Promise<Entity> {
    if (!this.validate) {
      this.validate = compileSchema(entitySchema, { allErrors: false });
    }

    const errors = this.validate(entity);
    if (!errors) {
      return entity;
    }

    const [error] = errors;
    if (!error) {
      throw new Error(`Malformed envelope, Unknown error`);
    }

    throw new Error(
      `Malformed envelope, ${error.instancePath || '<root>'} ${error.message}`,
    );
  }
}
