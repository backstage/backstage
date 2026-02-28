/*
 * Copyright 2025 The Backstage Authors
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
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { JSONSchema7 } from 'json-schema';
import {
  CatalogModelService,
  CatalogModelAnnotationDescriptor,
  CatalogModelValidationResult,
} from '@backstage/backend-plugin-api/alpha';
import { CatalogModelStore } from '../catalogModelRegistry/CatalogModelStore';

export class DefaultCatalogModelService implements CatalogModelService {
  private readonly store: CatalogModelStore;

  constructor(store: CatalogModelStore) {
    this.store = store;
  }

  listAnnotations(
    options?: { entityKind?: string } | undefined,
  ): CatalogModelAnnotationDescriptor[] {
    const registrations = this.store.getAnnotations(options?.entityKind);
    const descriptors: CatalogModelAnnotationDescriptor[] = [];

    for (const registration of registrations) {
      const jsonSchema = zodToJsonSchema(registration.schema) as JSONSchema7;
      const properties = jsonSchema.properties ?? {};

      for (const [key, propSchema] of Object.entries(properties)) {
        const prop = propSchema as JSONSchema7;
        descriptors.push({
          key,
          pluginId: registration.pluginId,
          entityKind: registration.entityKind,
          description: prop.description,
          schema: prop,
        });
      }
    }

    return descriptors;
  }

  validateEntity(entity: {
    kind: string;
    metadata: { annotations?: Record<string, string> };
  }): CatalogModelValidationResult {
    const registrations = this.store.getAnnotations(entity.kind);
    const annotations = entity.metadata.annotations ?? {};
    const errors: CatalogModelValidationResult['errors'] = [];

    for (const registration of registrations) {
      const shape = registration.schema.shape;

      for (const [key, fieldSchema] of Object.entries(shape)) {
        const value = annotations[key];
        if (value === undefined) {
          continue;
        }

        const result = (fieldSchema as z.ZodType).safeParse(value);
        if (!result.success) {
          for (const issue of result.error.issues) {
            errors.push({
              pluginId: registration.pluginId,
              annotation: key,
              message: issue.message,
            });
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
