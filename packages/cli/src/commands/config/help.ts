/*
 * Copyright 2021 Spotify AB
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

import { Command } from 'commander';
import { JsonObject } from '@backstage/config';
import { loadCliConfig } from '../../lib/config';

export default async (options: string[], cmd: Command) => {
  const { schema } = await loadCliConfig({
    args: [],
    fromPackage: cmd.package,
    mockEnv: true,
  });

  const data = schema.serialize();
  const schemas = (data.schemas as JsonObject[]) || [];
  const opts_specs =
    options.length > 0
      ? options.map((option: string): [string, JsonObject[]] => [
          option,
          Array.from(lookupOption(schemas, option)),
        ])
      : schemas.map((plugin_schema): [string, JsonObject[]] => [
          '<root>',
          [
            {
              _source: plugin_schema?.path,
              _required: true,
              ...(plugin_schema?.value as JsonObject),
            },
          ],
        ]);

  for (const [option, specs] of opts_specs) {
    if (specs.length === 0) {
      process.stdout.write(`Unknown configuration option: ${option}\n---\n`);
    } else {
      for (const spec of specs) {
        printConfigHelp(option, spec);
      }
    }
  }
};

function* lookupOption(schemas: JsonObject[], option: string) {
  const key_path = option ? option.split('.') : [];

  for (const schema of schemas) {
    const spec = resolveKey((schema?.value as JsonObject) || {}, key_path);
    if (spec !== undefined) {
      spec._source = schema?.path;
      yield spec;
    }
  }
}

function resolveKey(obj: JsonObject, path: string[]): JsonObject | undefined {
  if (obj?.type !== 'object') {
    return undefined;
  }

  if (path.length === 0) {
    return {
      _required: true,
      ...obj,
    };
  }

  const key = path[0];
  const value = ((obj?.properties as JsonObject) || {})[key] as JsonObject;

  if (!value) {
    return undefined;
  }

  if (path.length > 1) {
    return resolveKey(value, path.slice(1));
  }
  return {
    _required: ((obj.required as string[]) || []).includes(key),
    ...value,
  };
}

function printConfigHelp(option: string, spec: JsonObject) {
  const lines = [
    `Source: ${spec._source}`,
    `Configuration: ${option}`,
    `Type: ${spec.type}`,
    `Required: ${spec._required}`,
  ];

  if (spec.visibility) {
    lines.push(`Visibility: ${spec.visibility}`);
  }

  if (spec.type === 'object') {
    const props = Object.keys(spec.properties || {}).join(', ');
    lines.push(`Properties: ${props}`);
  }

  lines.push(`\n${spec.description || 'No description'}`);
  lines.push('---\n');
  process.stdout.write(lines.join('\n'));
}
