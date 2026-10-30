/*
 * Copyright 2026 The Backstage Authors
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

/**
 * Validators for catalog entities that use ajv to compile schemas into code.
 *
 * @packageDocumentation
 */

// Types are imported from the main entry point, which is not loaded at runtime
import type {
  Entity,
  EntityEnvelope,
  EntityPolicy,
  KindValidator,
} from '@backstage/catalog-model';
import { createSchemaValidEntityPolicy } from './entity/policies/SchemaValidEntityPolicy';
import { ajvCompiledJsonSchemaValidator } from './kinds/util';
import apiSchema from './schema/kinds/API.v1alpha1.schema.json';
import componentSchema from './schema/kinds/Component.v1alpha1.schema.json';
import domainSchema from './schema/kinds/Domain.v1alpha1.schema.json';
import groupSchema from './schema/kinds/Group.v1alpha1.schema.json';
import locationSchema from './schema/kinds/Location.v1alpha1.schema.json';
import resourceSchema from './schema/kinds/Resource.v1alpha1.schema.json';
import systemSchema from './schema/kinds/System.v1alpha1.schema.json';
import userSchema from './schema/kinds/User.v1alpha1.schema.json';
import { ajvSchemaEngine } from './validation/engine/ajvSchemaEngine';
import { createEntityEnvelopeSchemaValidator } from './validation/entityEnvelopeSchemaValidator';
import { createEntityKindSchemaValidator } from './validation/entityKindSchemaValidator';
import { createEntitySchemaValidator } from './validation/entitySchemaValidator';

/**
 * Validators for catalog entities that use ajv, as returned by
 * {@link createAjvEntityValidators}.
 *
 * @public
 */
export interface AjvEntityValidators {
  /**
   * Works like `entitySchemaValidator` from `@backstage/catalog-model`.
   */
  entitySchemaValidator<T extends Entity = Entity>(
    schema?: unknown,
  ): (data: unknown) => T;

  /**
   * Works like `entityEnvelopeSchemaValidator` from `@backstage/catalog-model`.
   */
  entityEnvelopeSchemaValidator<T extends EntityEnvelope = EntityEnvelope>(
    schema?: unknown,
  ): (data: unknown) => T;

  /**
   * Works like `entityKindSchemaValidator` from `@backstage/catalog-model`.
   */
  entityKindSchemaValidator<T extends Entity>(
    schema: unknown,
  ): (data: unknown) => T | false;

  /**
   * Validators for the built-in kinds, such as `Component` and `API`, that
   * work like the ones exported from `@backstage/catalog-model`.
   */
  builtinKindValidators: KindValidator[];

  /**
   * Works like `SchemaValidEntityPolicy` from `@backstage/catalog-model`.
   */
  schemaValidEntityPolicy: EntityPolicy;
}

/**
 * Creates validators for catalog entities that use ajv.
 *
 * @remarks
 *
 * The validators exported from `@backstage/catalog-model` interpret schemas,
 * which works in any environment. Ajv instead compiles schemas into code,
 * which makes validation considerably faster. This is useful in backends that
 * validate large numbers of entities, such as the catalog backend.
 *
 * Do not use these in browser environments, since generating code at runtime
 * requires `'unsafe-eval'` in the Content Security Policy.
 *
 * The wording of validation error messages differs between the two.
 *
 * @public
 */
export function createAjvEntityValidators(): AjvEntityValidators {
  return {
    entitySchemaValidator: schema =>
      createEntitySchemaValidator(ajvSchemaEngine, schema),
    entityEnvelopeSchemaValidator: schema =>
      createEntityEnvelopeSchemaValidator(ajvSchemaEngine, schema),
    entityKindSchemaValidator: schema =>
      createEntityKindSchemaValidator(ajvSchemaEngine, schema),
    builtinKindValidators: [
      apiSchema,
      componentSchema,
      domainSchema,
      groupSchema,
      locationSchema,
      resourceSchema,
      systemSchema,
      userSchema,
    ].map(schema => ajvCompiledJsonSchemaValidator(schema, ajvSchemaEngine)),
    schemaValidEntityPolicy: createSchemaValidEntityPolicy(ajvSchemaEngine),
  };
}
