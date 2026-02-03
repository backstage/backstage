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
import {
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import {
  CreatedTemplateFilter,
  CreatedTemplateGlobal,
  CreatedTemplateGlobalFunction,
  CreatedTemplateGlobalValue,
  ZodFunctionSchema,
} from '@backstage/plugin-scaffolder-node/alpha';
import { JsonValue } from '@backstage/types';
import { Schema } from 'jsonschema';
import { ZodType, z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

/**
 * Converts template filters to a record of filter functions
 */
export function convertFiltersToRecord(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter<any, any>[],
): Record<string, TemplateFilter> {
  if (!filters) {
    return {};
  }

  if (Array.isArray(filters)) {
    const result: Record<string, TemplateFilter> = {};
    for (const filter of filters) {
      result[filter.id] = filter.filter as TemplateFilter;
    }
    return result;
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

/**
 * Converts a Zod function schema to JSON schema
 */
function convertZodFunctionToJsonSchema(
  t: ReturnType<ZodFunctionSchema<any, any>>,
): ExportFunctionSchema {
  if (!('parameters' in t) || !('returnType' in t)) {
    throw new Error('Invalid Zod function schema');
  }

  const args = (t.parameters().items as ZodType[]).map(
    zt => zodToJsonSchema(zt) as Schema,
  );

  let output: Schema | undefined = undefined;
  const returnType = t.returnType();
  if (!returnType._unknown) {
    output = zodToJsonSchema(returnType) as Schema;
  }

  const result: ExportFunctionSchema = {};
  if (args.length > 0) {
    result.arguments = args;
  }
  if (output) {
    result.output = output;
  }

  return result;
}

/**
 * Converts a function schema to a filter schema
 */
function convertToFilterSchema(
  fnSchema: ExportFunctionSchema,
): ExportFilterSchema {
  if (fnSchema.arguments?.length) {
    const [input, ...rest] = fnSchema.arguments;
    const result: ExportFilterSchema = { input };

    if (rest.length > 0) {
      result.arguments = rest;
    }

    if (fnSchema.output) {
      result.output = fnSchema.output;
    }

    return result;
  }
  return fnSchema;
}

type ExportFilter = Pick<
  CreatedTemplateFilter<any, any>,
  'description' | 'examples'
> & {
  schema?: ExportFilterSchema;
};

/**
 * Extracts metadata from template filters
 */
export function extractFilterMetadata(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter<any, any>[],
): Record<string, ExportFilter> {
  if (!filters) {
    return {};
  }

  if (Array.isArray(filters)) {
    const result: Record<string, ExportFilter> = {};

    for (const filter of filters) {
      const metadata: ExportFilter = {};

      if (filter.description) {
        metadata.description = filter.description;
      }

      if (filter.examples) {
        metadata.examples = filter.examples;
      }

      if (filter.schema) {
        metadata.schema = convertToFilterSchema(
          convertZodFunctionToJsonSchema(
            filter.schema(z) as z.ZodFunction<any, any>,
          ),
        );
      }

      result[filter.id] = metadata;
    }

    return result;
  }

  // For non-array filters, return empty metadata
  const result: Record<string, ExportFilter> = {};
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      result[key] = {};
    }
  }
  return result;
}

/**
 * Checks if a global is a function
 */
function isGlobalFunction(
  global: CreatedTemplateGlobal,
): global is CreatedTemplateGlobalFunction<any, any> {
  return 'fn' in global;
}

/**
 * Extracts metadata from template global functions
 */
export function extractGlobalFunctionMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<
  string,
  Pick<CreatedTemplateGlobalFunction<any, any>, 'description' | 'examples'> & {
    schema?: ExportFunctionSchema;
  }
> {
  if (!globals) {
    return {};
  }

  if (Array.isArray(globals)) {
    const result: Record<string, any> = {};

    for (const global of globals) {
      if (isGlobalFunction(global)) {
        const metadata: any = {};

        if (global.description) {
          metadata.description = global.description;
        }

        if (global.examples) {
          metadata.examples = global.examples;
        }

        if (global.schema) {
          metadata.schema = convertZodFunctionToJsonSchema(global.schema(z));
        }

        result[global.id] = metadata;
      }
    }

    return result;
  }

  // For non-array globals, extract function metadata
  const result: Record<string, any> = {};
  for (const key in globals) {
    if (typeof globals[key] === 'function') {
      result[key] = {};
    }
  }
  return result;
}

/**
 * Extracts metadata from template global values
 */
export function extractGlobalValueMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<string, Omit<CreatedTemplateGlobalValue, 'id'>> {
  if (!globals) {
    return {};
  }

  if (Array.isArray(globals)) {
    const result: Record<string, Omit<CreatedTemplateGlobalValue, 'id'>> = {};

    for (const global of globals) {
      if (!isGlobalFunction(global)) {
        result[global.id] = {
          value: (global as CreatedTemplateGlobalValue).value,
          description: global.description,
        };
      }
    }

    return result;
  }

  // For non-array globals, extract value metadata
  const result: Record<string, Omit<CreatedTemplateGlobalValue, 'id'>> = {};
  for (const key in globals) {
    if (typeof globals[key] !== 'function') {
      result[key] = { value: globals[key] as JsonValue };
    }
  }
  return result;
}

/**
 * Converts template globals to a record of global values and functions
 */
export function convertGlobalsToRecord(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal[],
): Record<string, TemplateGlobal> {
  if (!globals) {
    return {};
  }

  if (!Array.isArray(globals)) {
    return globals;
  }

  const result: Record<string, TemplateGlobal> = {};
  for (const global of globals) {
    result[global.id] = isGlobalFunction(global)
      ? (global.fn as TemplateGlobal)
      : (global as CreatedTemplateGlobalValue).value;
  }
  return result;
}
