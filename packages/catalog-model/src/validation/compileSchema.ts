/*
 * Copyright 2021 The Backstage Authors
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

import entitySchema from '../schema/Entity.schema.json';
import entityEnvelopeSchema from '../schema/EntityEnvelope.schema.json';
import entityMetaSchema from '../schema/EntityMeta.schema.json';
import commonSchema from '../schema/shared/common.schema.json';
import { getSchemaEngine } from './engine/registry';
import {
  CompiledSchema,
  SchemaEngine,
  SchemaValidationError,
} from './engine/types';

type Schema = object;

// A local cache of compiled schemas per engine, to avoid duplicate work.
// The keys are JSON stringified versions of the schema
const compiledSchemaCache = new WeakMap<
  SchemaEngine,
  Map<string, CompiledSchema>
>();

// The core schemas that others can depend on
const refDependencyCandidates: Schema[] = [
  entityEnvelopeSchema,
  entitySchema,
  entityMetaSchema,
  commonSchema,
];

export function throwSchemaError(
  errors: SchemaValidationError[] | undefined,
): never {
  if (!errors?.length) {
    throw new TypeError('Unknown error');
  }

  const error = errors[0];
  throw new TypeError(
    `${error.instancePath || '<root>'} ${error.message}${
      error.params
        ? ` - ${Object.entries(error.params)
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ')}`
        : ''
    }`,
  );
}

function compileWithEngine(
  engine: SchemaEngine,
  schema: Schema,
  options: { disableCache: boolean; allErrors: boolean },
): CompiledSchema {
  const { disableCache, allErrors } = options;
  const cacheKey = disableCache ? '' : `${allErrors}:${JSON.stringify(schema)}`;

  let cache = compiledSchemaCache.get(engine);
  if (!cache) {
    cache = new Map();
    compiledSchemaCache.set(engine, cache);
  }

  if (!disableCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const compiled = engine.compile({
    schema,
    extraSchemas: getExtraSchemas(schema),
    allErrors,
  });

  if (!disableCache) {
    cache.set(cacheKey, compiled);
  }

  return compiled;
}

// Compiles the given schema, and makes sure to also grab any core dependencies
// that it depends on.
//
// The schema is compiled right away using the current schema engine, so that
// errors in the schema itself are reported early. If the engine is replaced
// later on, for example because the validator was created at module load time
// before the engine was installed, the schema is compiled again with the new
// engine on next use.
export function compileSchema(
  schema: Schema,
  options: { disableCache?: boolean; allErrors?: boolean } = {},
): CompiledSchema {
  const resolvedOptions = {
    disableCache: options.disableCache ?? false,
    allErrors: options.allErrors ?? true,
  };

  let engine = getSchemaEngine();
  let compiled = compileWithEngine(engine, schema, resolvedOptions);

  return data => {
    const currentEngine = getSchemaEngine();
    if (currentEngine !== engine) {
      engine = currentEngine;
      compiled = compileWithEngine(engine, schema, resolvedOptions);
    }
    return compiled(data);
  };
}

// Find refs in the given schema and recursively in all known schemas it
// targets, collecting that list of schemas as we go
function getExtraSchemas(schema: Schema): Schema[] {
  if (typeof schema !== 'object') {
    return [];
  }

  const seen = new Set<string>();
  const id = (schema as { $id?: unknown }).$id;
  if (typeof id === 'string') {
    seen.add(id);
  }

  const selected = new Array<Schema>();

  const todo: Schema[] = [schema];
  while (todo.length) {
    const current = todo.pop()!;

    for (const ref of getAllRefs(current)) {
      if (!seen.has(ref)) {
        seen.add(ref);

        const match = refDependencyCandidates.find(
          c => (c as { $id?: string }).$id === ref,
        );
        if (match) {
          selected.push(match);
          todo.push(match);
        }
      }
    }
  }

  return selected;
}

// Naively step through the entire schema looking for "$ref": "x" pairs. The
// resulting iterator may contain duplicates. Ignores fragments, i.e. for a ref
// of "a#b", it will just yield "a".
function* getAllRefs(schema: Schema): Iterable<string> {
  const todo: any[] = [schema];
  while (todo.length) {
    const current = todo.pop()!;
    if (typeof current === 'object' && current) {
      for (const [key, value] of Object.entries(current)) {
        if (key === '$ref' && typeof value === 'string') {
          yield value.split('#')[0];
        } else {
          todo.push(value);
        }
      }
    }
  }
}
