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
import {
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import {
  CreatedTemplateFilter,
  CreatedTemplateGlobal,
  CreatedTemplateGlobalFunction,
  CreatedTemplateGlobalValue,
  TemplateFilterSchema,
  TemplateGlobalFunctionSchema,
} from '@backstage/plugin-scaffolder-node/alpha';
import { JsonValue } from '@backstage/types';
import { Schema } from 'jsonschema';
import {
  filter,
  fromPairs,
  keyBy,
  mapValues,
  negate,
  pick,
  pickBy,
  toPairs,
} from 'lodash';
import { z, ZodTuple, ZodType } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export function templateFilterImpls(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter[],
): Record<string, TemplateFilter> {
  if (!filters) {
    return {};
  }
  if (Array.isArray(filters)) {
    return mapValues(keyBy(filters, 'id'), f => f.filter as TemplateFilter);
  }
  return filters;
}

type Z2JS<S extends TemplateFilterSchema | TemplateGlobalFunctionSchema> = {
  arguments?: Schema[];
  output?: Schema;
} & (S extends TemplateFilterSchema
  ? {
      input?: Schema;
    }
  : {});

function z2js<S extends TemplateFilterSchema | TemplateGlobalFunctionSchema>(
  schema: S,
): Z2JS<S> {
  let withArgs: Partial<Z2JS<S>>;
  if (schema.arguments) {
    const args = schema.arguments(z);
    if (args instanceof ZodTuple) {
      const items = args.items as ZodType[];
      withArgs = {
        arguments: items.map(zt => zodToJsonSchema(zt as ZodType) as Schema),
      };
    } else {
      withArgs = { arguments: [zodToJsonSchema(args) as Schema] };
    }
  } else {
    withArgs = {};
  }
  const input = Object.hasOwn(schema, 'input')
    ? zodToJsonSchema((schema as TemplateFilterSchema).input!(z))
    : undefined;
  const output = Object.hasOwn(schema, 'output')
    ? zodToJsonSchema(schema.output!(z))
    : undefined;

  return pickBy({
    input,
    output,
    ...withArgs,
  }) as Z2JS<S>;
}

type ExportFilter = Pick<CreatedTemplateFilter, 'description' | 'examples'> & {
  schema?: Z2JS<TemplateFilterSchema>;
};

export function templateFilterMetadata(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter[],
): Record<string, ExportFilter> {
  if (!filters) {
    return {};
  }
  if (Array.isArray(filters)) {
    return mapValues(
      keyBy(filters, 'id'),
      <F extends CreatedTemplateFilter<any, any>>(f: F): ExportFilter => {
        const schema = f.schema ? z2js(f.schema) : undefined;
        return {
          ...pick(f, 'description', 'examples'),
          ...pickBy({ schema }),
        };
      },
    );
  }
  return mapValues(filters, _ => ({}));
}

function isGlobalFunctionInfo(
  global: CreatedTemplateGlobal,
): global is CreatedTemplateGlobalFunction {
  return Object.hasOwn(global, 'fn');
}

type GlobalRecordRow = [string, TemplateGlobal];

export function templateGlobalFunctionMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<string, Omit<CreatedTemplateGlobalFunction, 'id' | 'fn'>> {
  if (!globals) {
    return {};
  }
  if (Array.isArray(globals)) {
    return mapValues(keyBy(filter(globals, isGlobalFunctionInfo), 'id'), v => {
      const schema = v.schema ? z2js(v.schema) : undefined;
      return {
        ...pick(v, 'description', 'examples'),
        ...pickBy({ schema }),
      };
    });
  }
  const rows = toPairs(globals) as GlobalRecordRow[];
  const fns = rows.filter(([_, g]) => typeof g === 'function') as [
    string,
    Exclude<TemplateGlobal, JsonValue>,
  ][];
  return fromPairs(fns.map(([k, _]) => [k, {}]));
}

export function templateGlobalValueMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<string, Omit<CreatedTemplateGlobalValue, 'id'>> {
  if (!globals) {
    return {};
  }
  if (Array.isArray(globals)) {
    return mapValues(
      keyBy(
        filter(
          globals,
          negate(isGlobalFunctionInfo),
        ) as CreatedTemplateGlobalValue[],
        'id',
      ),
      v => pick(v, 'value', 'description') as CreatedTemplateGlobalValue,
    );
  }
  const rows = toPairs(globals) as GlobalRecordRow[];
  const vals = rows.filter(([_, g]) => typeof g !== 'function') as [
    string,
    JsonValue,
  ][];
  return fromPairs(vals.map(([k, value]) => [k, { value }]));
}

export function templateGlobals(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<string, TemplateGlobal> {
  if (!globals) {
    return {};
  }
  if (!Array.isArray(globals)) {
    return globals;
  }
  return mapValues(keyBy(globals, 'id'), v =>
    isGlobalFunctionInfo(v)
      ? (v.fn as Exclude<TemplateGlobal, JsonValue>)
      : v.value,
  );
}
