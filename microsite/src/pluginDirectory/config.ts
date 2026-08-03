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
import { dump } from 'js-yaml';
import type { ConfigSchema } from './manifest';

export type ConfigValue =
  | string
  | number
  | boolean
  | ConfigValue[]
  | { [key: string]: ConfigValue | undefined }
  | undefined;

export interface ConfigError {
  path: string[];
  message: string;
}

function isConfigObject(
  value: ConfigValue,
): value is { [key: string]: ConfigValue | undefined } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

interface InitializedConfig {
  value: ConfigValue;
  populated: boolean;
}

function initializeConfig(schema: ConfigSchema): InitializedConfig {
  const secretEnv = schema['x-ui']?.secretEnv;
  if (secretEnv) {
    return { value: `\${${secretEnv}}`, populated: true };
  }

  switch (schema.type) {
    case 'string':
    case 'number':
    case 'integer':
    case 'boolean':
      return schema.default === undefined
        ? { value: undefined, populated: false }
        : { value: schema.default, populated: true };
    case 'array':
      return { value: undefined, populated: false };
    case 'object': {
      const initialValue: Record<string, ConfigValue> = {};
      const required = new Set(schema.required);
      let populated = false;

      for (const [key, childSchema] of Object.entries(schema.properties)) {
        const child = initializeConfig(childSchema);
        if (child.populated) {
          initialValue[key] = child.value;
          populated = true;
        } else if (childSchema.type === 'object' && required.has(key)) {
          initialValue[key] = child.value;
        }
      }

      return { value: initialValue, populated };
    }
  }
}

function isEmptyConfigBranch(value: ConfigValue): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (!isConfigObject(value)) {
    return false;
  }
  const children = Object.values(value);
  return (
    children.length === 0 ||
    children.every(
      child =>
        child === undefined || child === '' || isEmptyConfigBranch(child),
    )
  );
}

export function createInitialConfig(schema: ConfigSchema): ConfigValue {
  return initializeConfig(schema).value;
}

function validateNode(
  schema: ConfigSchema,
  value: ConfigValue,
  path: string[],
  errors: ConfigError[],
): void {
  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') {
        errors.push({ path, message: 'Expected a string' });
      } else if (schema.enum && !schema.enum.includes(value)) {
        errors.push({
          path,
          message: `Must be one of: ${schema.enum.join(', ')}`,
        });
      }
      return;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors.push({ path, message: 'Expected a number' });
      } else if (schema.enum && !schema.enum.includes(value)) {
        errors.push({
          path,
          message: `Must be one of: ${schema.enum.join(', ')}`,
        });
      }
      return;
    case 'integer':
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        errors.push({ path, message: 'Expected an integer' });
      } else if (schema.enum && !schema.enum.includes(value)) {
        errors.push({
          path,
          message: `Must be one of: ${schema.enum.join(', ')}`,
        });
      }
      return;
    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push({ path, message: 'Expected a boolean' });
      } else if (schema.enum && !schema.enum.includes(value)) {
        errors.push({
          path,
          message: `Must be one of: ${schema.enum.join(', ')}`,
        });
      }
      return;
    case 'array':
      if (!Array.isArray(value)) {
        errors.push({ path, message: 'Expected an array' });
        return;
      }
      value.forEach((item, index) =>
        validateNode(schema.items, item, [...path, String(index)], errors),
      );
      return;
    case 'object': {
      if (!isConfigObject(value)) {
        errors.push({ path, message: 'Expected an object' });
        return;
      }

      const required = new Set(schema.required);
      for (const [key, childSchema] of Object.entries(schema.properties)) {
        const childValue = value[key];
        const childPath = [...path, key];
        if (childValue === undefined || childValue === '') {
          if (required.has(key)) {
            errors.push({ path: childPath, message: 'Required' });
          }
          continue;
        }
        validateNode(childSchema, childValue, childPath, errors);
      }
    }
  }
}

export function validateConfig(
  schema: ConfigSchema,
  value: ConfigValue,
): ConfigError[] {
  const errors: ConfigError[] = [];
  validateNode(schema, value, [], errors);
  return errors;
}

function serializeConfig(
  schema: ConfigSchema,
  value: ConfigValue,
  omitEmptyString: boolean,
): ConfigValue {
  const secretEnv = schema['x-ui']?.secretEnv;
  if (secretEnv) {
    return `\${${secretEnv}}`;
  }

  if (schema.type === 'object') {
    if (!isConfigObject(value)) {
      return undefined;
    }

    const serialized: Record<string, ConfigValue> = {};
    const required = new Set(schema.required);
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      const childValue = serializeConfig(childSchema, value[key], true);
      const isEmptyCollection = isEmptyConfigBranch(childValue);
      if (
        childValue !== undefined &&
        (!isEmptyCollection || required.has(key))
      ) {
        serialized[key] = childValue;
      }
    }
    return serialized;
  }

  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      return undefined;
    }
    return value.map(item => serializeConfig(schema.items, item, false));
  }

  if (omitEmptyString && value === '') {
    return undefined;
  }
  return value;
}

export function generateConfigYaml(
  schema: ConfigSchema,
  value: ConfigValue,
): string {
  const errors = validateConfig(schema, value);
  if (errors.length > 0) {
    throw new Error(
      `Invalid configuration:\n${errors
        .map(
          error =>
            `- ${error.path.length > 0 ? error.path.join('.') : '(root)'}: ${
              error.message
            }`,
        )
        .join('\n')}`,
    );
  }

  return dump(serializeConfig(schema, value, false), {
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  });
}
