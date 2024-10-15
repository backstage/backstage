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
  TemplateGlobalFunctionSchema,
} from '@backstage/plugin-scaffolder-node/alpha';
import { JsonValue } from '@backstage/types';
import { Schema } from 'jsonschema';
import {
  filter,
  fromPairs,
  isEmpty,
  keyBy,
  mapValues,
  negate,
  pick,
  pickBy,
  toPairs,
  wrap,
} from 'lodash';
import { z, ZodType } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export function templateFilterImpls(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter<any, any>[],
): Record<string, TemplateFilter> {
  if (!filters) {
    return {};
  }
  if (Array.isArray(filters)) {
    return mapValues(keyBy(filters, 'id'), f => f.filter as TemplateFilter);
  }
  return filters;
}

type ExportFunctionSchema = {
  arguments?: Schema[];
  output?: Schema;
};

type ExportFilterSchema = {
  input?: Schema;
} & ExportFunctionSchema;

function zodFunctionToJsonSchema(
  t: ReturnType<TemplateGlobalFunctionSchema<any, any>>,
): ExportFunctionSchema {
  const args = (t.parameters().items as ZodType[]).map(
    zt => zodToJsonSchema(zt) as Schema,
  );
  const output = wrap(t.returnType(), rt =>
    rt._unknown ? undefined : (zodToJsonSchema(rt) as Schema),
  )();
  return pickBy({ output, arguments: args }, negate(isEmpty));
}

function toExportFilterSchema(
  fnSchema: ExportFunctionSchema,
): ExportFilterSchema {
  if (fnSchema.arguments?.length) {
    const [input, ...rest] = fnSchema.arguments;
    const { output } = fnSchema;
    return {
      input,
      ...(rest.length ? { arguments: rest } : {}),
      ...(output ? { output } : {}),
    };
  }
  return fnSchema;
}

type ExportFilter = Pick<
  CreatedTemplateFilter<any, any>,
  'description' | 'examples'
> & {
  schema?: ExportFilterSchema;
};

export function templateFilterMetadata(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter<any, any>[],
): Record<string, ExportFilter> {
  if (!filters) {
    return {};
  }
  if (Array.isArray(filters)) {
    return mapValues(
      keyBy(filters, 'id'),
      <F extends CreatedTemplateFilter<any, any>>(f: F): ExportFilter => {
        const schema = f.schema
          ? toExportFilterSchema(zodFunctionToJsonSchema(f.schema(z)))
          : undefined;
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
): global is CreatedTemplateGlobalFunction<
  TemplateGlobalFunctionSchema<any, any> | undefined,
  any
> {
  return Object.hasOwn(global, 'fn');
}

type GlobalRecordRow = [string, TemplateGlobal];

export function templateGlobalFunctionMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<
  string,
  Omit<CreatedTemplateGlobalFunction<any, any>, 'id' | 'fn' | 'schema'> & {
    schema?: ExportFunctionSchema;
  }
> {
  if (!globals) {
    return {};
  }
  if (Array.isArray(globals)) {
    return mapValues(keyBy(filter(globals, isGlobalFunctionInfo), 'id'), v => {
      const schema = v.schema
        ? zodFunctionToJsonSchema(v.schema(z))
        : undefined;

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
      ? (v.fn as TemplateGlobal)
      : (v as CreatedTemplateGlobalValue).value,
  );
}
