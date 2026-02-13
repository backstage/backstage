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

import { z } from 'zod/v4';
import type { CatalogZ, EntityRefSchema, RelationMetadata } from './types';
import { RELATION_METADATA } from './types';

/**
 * Entity reference regex pattern.
 * Format: [kind:][namespace/]name
 */
const ENTITY_REF_PATTERN =
  /^(?:[a-z][a-z0-9-]*:)?(?:[a-z][a-z0-9-]*\/)?[a-z][a-z0-9-]*$/i;

/**
 * Creates an extended Zod instance with catalog-specific helpers.
 * Standard Zod methods are passed through, with additional helpers
 * for entity references and lifecycle enums.
 * @internal
 */
export function createCatalogZ(): CatalogZ {
  const catalogZ: CatalogZ = {
    string: z.string,
    number: z.number,
    boolean: z.boolean,
    object: z.object,
    array: z.array,
    enum: z.enum,
    record: z.record,
    optional: z.optional,
    literal: z.literal,
    union: z.union,

    entityRef(opts?: {
      kind?: string | string[];
      description?: string;
    }): EntityRefSchema {
      let schema = z
        .string()
        .regex(ENTITY_REF_PATTERN, 'Invalid entity reference format') as any;

      if (opts?.description) {
        schema = schema.meta({ description: opts.description });
      }

      let targetKinds: string[] | undefined;
      if (opts?.kind) {
        targetKinds = Array.isArray(opts.kind) ? opts.kind : [opts.kind];
      }

      schema.withRelations = function (
        this: EntityRefSchema,
        relationOpts: { forward: string; reverse: string },
      ): EntityRefSchema {
        (this as any)[RELATION_METADATA] = {
          forward: relationOpts.forward,
          reverse: relationOpts.reverse,
          targetKinds,
        } satisfies RelationMetadata;
        return this;
      };

      return schema as EntityRefSchema;
    },

    lifecycle() {
      return z.enum(['production', 'experimental', 'deprecated']);
    },
  };

  return catalogZ;
}
