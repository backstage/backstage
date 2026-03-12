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

import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

type FlagDef = {
  type: StringConstructor | NumberConstructor | BooleanConstructor;
  description: string;
};

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function resolveFlag(
  propSchema: JSONSchema7Definition,
  propName: string,
  required: string[],
): [string, FlagDef] | null {
  if (typeof propSchema !== 'object' || propSchema === null) {
    return null;
  }

  const { type, description, enum: enumValues } = propSchema as JSONSchema7;

  if ('anyOf' in propSchema || 'oneOf' in propSchema || 'allOf' in propSchema) {
    return null;
  }

  let flagType: StringConstructor | NumberConstructor | BooleanConstructor;
  if (type === 'string') {
    flagType = String;
  } else if (type === 'number' || type === 'integer') {
    flagType = Number;
  } else if (type === 'boolean') {
    flagType = Boolean;
  } else {
    return null;
  }

  let desc = description ?? '';
  if (enumValues && enumValues.length > 0) {
    const values = enumValues.map(v => String(v)).join(', ');
    desc = desc ? `${desc}, one of: ${values}` : `one of: ${values}`;
  }
  if (required.includes(propName)) {
    desc = desc ? `${desc} (required)` : '(required)';
  }

  return [camelToKebab(propName), { type: flagType, description: desc }];
}

export function schemaToFlags(schema: JSONSchema7): {
  flags: Record<string, FlagDef>;
  parseInput: (flagValues: Record<string, unknown>) => Record<string, unknown>;
} {
  const properties = schema.properties ?? {};
  const required = schema.required ?? [];
  const flags: Record<string, FlagDef> = {};

  for (const [propName, propSchema] of Object.entries(properties)) {
    const result = resolveFlag(propSchema, propName, required);
    if (result) {
      const [key, def] = result;
      flags[key] = def;
    }
  }

  function parseInput(
    flagValues: Record<string, unknown>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(flagValues)) {
      if (value === undefined) continue;
      result[kebabToCamel(key)] = value;
    }
    return result;
  }

  return { flags, parseInput };
}
