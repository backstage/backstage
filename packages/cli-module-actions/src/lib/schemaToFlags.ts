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
  anyOf?: unknown[];
  oneOf?: unknown[];
  allOf?: unknown[];
};

type JsonSchemaObject = {
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
};

export type CleyeFlag = {
  type: StringConstructor | NumberConstructor | BooleanConstructor;
  description?: string;
  default?: unknown;
};

function isComplexType(prop: JsonSchemaProperty): boolean {
  if (prop.anyOf || prop.oneOf || prop.allOf) {
    return true;
  }
  const rawType = Array.isArray(prop.type) ? prop.type[0] : prop.type;
  return rawType === 'object' || rawType === 'array';
}

function resolveFlagType(
  rawType: string | undefined,
): StringConstructor | NumberConstructor | BooleanConstructor | undefined {
  if (rawType === 'string') return String;
  if (rawType === 'number' || rawType === 'integer') return Number;
  if (rawType === 'boolean') return Boolean;
  return undefined;
}

export function schemaToFlags(schema: JsonSchemaObject): {
  flags: Record<string, CleyeFlag>;
  complexKeys: Set<string>;
} {
  const flags: Record<string, CleyeFlag> = {};
  const complexKeys = new Set<string>();
  const required = new Set(schema.required ?? []);

  if (!schema.properties) {
    return { flags, complexKeys };
  }

  for (const [key, prop] of Object.entries(schema.properties)) {
    const rawType = Array.isArray(prop.type) ? prop.type[0] : prop.type;
    const complex = isComplexType(prop);
    let flagType = resolveFlagType(rawType);

    if (!flagType && complex) {
      flagType = String;
    }

    if (!flagType) {
      continue;
    }

    if (complex) {
      complexKeys.add(key);
    }

    let desc = prop.description ?? '';

    if (complex) {
      desc = desc ? `${desc} (JSON)` : '(JSON)';
    }

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

  return { flags, complexKeys };
}
