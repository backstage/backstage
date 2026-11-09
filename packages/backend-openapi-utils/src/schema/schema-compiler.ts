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

import { z } from 'zod';
import { OpenAPIObject, ReferenceObject, SchemaObject } from 'openapi3-ts';

const COMPONENT_SCHEMAS_PREFIX = '#/components/schemas/';

type JsonSchemaTarget = 'openapi-3.0' | 'draft-2020-12';

/**
 * Compiles OpenAPI schema objects into zod schemas.
 *
 * Any remaining `#/components/schemas/*` references (for example recursive
 * schemas that were left in place during dereferencing) are rewritten to point
 * at a local definitions block, which `z.fromJSONSchema` can resolve.
 */
export class SchemaCompiler {
  readonly #target: JsonSchemaTarget;
  readonly #definitionsKey: '$defs' | 'definitions';
  readonly #definitions: Record<string, unknown>;
  readonly #cache = new WeakMap<object, z.ZodType>();

  constructor(spec?: Pick<OpenAPIObject, 'openapi' | 'components'>) {
    const isOpenApi31 = spec?.openapi?.startsWith('3.1') ?? false;
    this.#target = isOpenApi31 ? 'draft-2020-12' : 'openapi-3.0';
    // zod only resolves refs against "$defs" for draft 2020-12, and against
    // "definitions" for every other target, including OpenAPI 3.0.
    this.#definitionsKey = isOpenApi31 ? '$defs' : 'definitions';
    this.#definitions = rewriteRefs(
      spec?.components?.schemas ?? {},
      this.#definitionsKey,
    ) as Record<string, unknown>;
  }

  compile(schema: SchemaObject | ReferenceObject): z.ZodType {
    const cached = this.#cache.get(schema);
    if (cached) {
      return cached;
    }
    const rewritten = rewriteRefs(schema, this.#definitionsKey) as Record<
      string,
      unknown
    >;
    const compiled = z.fromJSONSchema(
      {
        ...rewritten,
        [this.#definitionsKey]: this.#definitions,
      } as z.core.JSONSchema.JSONSchema,
      {
        defaultTarget: this.#target,
        // Use a private registry so schema metadata is not collected in the
        // global zod registry across test runs.
        registry: z.registry(),
      },
    );
    this.#cache.set(schema, compiled);
    return compiled;
  }
}

function rewriteRefs(value: unknown, definitionsKey: string): unknown {
  if (Array.isArray(value)) {
    return value.map(item => rewriteRefs(item, definitionsKey));
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === '$ref' && typeof child === 'string') {
      result[key] = rewriteRef(child, definitionsKey);
    } else if (key === 'format' && child === 'uri-reference') {
      // zod validates "uri-reference" as an absolute URL, which rejects valid
      // relative references such as "/foo". Skip the format check instead.
      continue;
    } else {
      result[key] = rewriteRefs(child, definitionsKey);
    }
  }
  return result;
}

function rewriteRef(ref: string, definitionsKey: string) {
  if (!ref.startsWith(COMPONENT_SCHEMAS_PREFIX)) {
    throw new Error(
      `Unsupported schema reference "${ref}", only references to "${COMPONENT_SCHEMAS_PREFIX}<name>" are supported`,
    );
  }
  const name = ref.slice(COMPONENT_SCHEMAS_PREFIX.length);
  if (!name || name.includes('/')) {
    throw new Error(
      `Unsupported schema reference "${ref}", references must point directly at a named component schema`,
    );
  }
  return `#/${definitionsKey}/${name}`;
}
