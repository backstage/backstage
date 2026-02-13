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

import type { CatalogZ } from '@backstage/catalog-model-extensions';
import type { ZodTypeAny } from 'zod/v4';

export interface ConfigFieldDef {
  type: 'string' | 'enum' | 'boolean' | 'entityRef' | 'array';
  description?: string;
  optional?: boolean;
  values?: string[];
  kind?: string | string[];
  relations?: { forward: string; reverse: string };
  items?: ConfigFieldDef;
}

export interface ConfigKindDef {
  apiVersion: string;
  names: {
    kind: string;
    singular: string;
    plural: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
  schema: {
    spec: Record<string, ConfigFieldDef>;
    metadata?: {
      annotations?: Record<string, ConfigFieldDef>;
      labels?: Record<string, ConfigFieldDef>;
    };
  };
}

/**
 * Converts a config field definition to a CatalogZ schema.
 */
export function configFieldToZodSchema(
  z: CatalogZ,
  field: ConfigFieldDef,
): ZodTypeAny {
  let schema: any;

  switch (field.type) {
    case 'string':
      schema = z.string();
      break;
    case 'boolean':
      schema = z.string();
      break;
    case 'enum':
      schema = z.enum((field.values ?? []) as [string, ...string[]]);
      break;
    case 'entityRef':
      schema = z.entityRef({ kind: field.kind });
      if (field.relations) {
        schema = schema.withRelations(field.relations);
      }
      break;
    case 'array':
      schema = z.array(
        field.items ? configFieldToZodSchema(z, field.items) : z.string(),
      );
      break;
    default:
      schema = z.string();
  }

  if (field.description) {
    schema = schema.meta({ description: field.description });
  }
  if (field.optional) {
    schema = schema.optional();
  }

  return schema;
}
