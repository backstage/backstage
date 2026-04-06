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

type JsonSchemaProperty = {
  type?: string | string[];
  description?: string;
  enum?: unknown[];
  default?: unknown;
};

type JsonSchemaObject = {
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
};

type CleyeFlag = {
  type: StringConstructor | NumberConstructor | BooleanConstructor;
  description?: string;
  default?: unknown;
};

export function schemaToFlags(
  schema: JsonSchemaObject,
): Record<string, CleyeFlag> {
  const flags: Record<string, CleyeFlag> = {};
  const required = new Set(schema.required ?? []);

  if (!schema.properties) {
    return flags;
  }

  for (const [key, prop] of Object.entries(schema.properties)) {
    const rawType = Array.isArray(prop.type) ? prop.type[0] : prop.type;

    let flagType: StringConstructor | NumberConstructor | BooleanConstructor;
    if (rawType === 'string') {
      flagType = String;
    } else if (rawType === 'number' || rawType === 'integer') {
      flagType = Number;
    } else if (rawType === 'boolean') {
      flagType = Boolean;
    } else {
      continue;
    }

    let desc = prop.description ?? '';
    if (prop.enum?.length) {
      const values = prop.enum.map(v => String(v)).join(', ');
      desc = desc ? `${desc} [${values}]` : `[${values}]`;
    }
    if (required.has(key)) {
      desc = desc ? `${desc} (required)` : '(required)';
    }

    const flag: CleyeFlag = { type: flagType, description: desc || undefined };
    if (prop.default !== undefined) {
      flag.default = prop.default;
    }

    flags[key] = flag;
  }

  return flags;
}
