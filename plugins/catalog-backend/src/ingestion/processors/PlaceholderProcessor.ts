/*
 * Copyright 2020 Spotify AB
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

import { Entity, LocationSpec } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/config';
import yaml from 'yaml';
import {
  LocationProcessor,
  LocationProcessorEmit,
  LocationProcessorRead,
} from './types';

export type ResolverParams = {
  key: string;
  value: JsonValue;
  location: LocationSpec;
  read: LocationProcessorRead;
};

export type PlaceholderResolver = (
  params: ResolverParams,
) => Promise<JsonValue>;

/**
 * Traverses raw entity JSON looking for occurrences of $-prefixed placeholders
 * that it then fills in with actual data.
 */
export class PlaceholderProcessor implements LocationProcessor {
  static default() {
    return new PlaceholderProcessor({
      json: jsonPlaceholderResolver,
      yaml: yamlPlaceholderResolver,
      text: textPlaceholderResolver,
    });
  }

  constructor(
    private readonly resolvers: Record<string, PlaceholderResolver>,
  ) {}

  async processEntity(
    entity: Entity,
    location: LocationSpec,
    _emit: LocationProcessorEmit,
    read: LocationProcessorRead,
  ): Promise<Entity> {
    const process = async (data: any): Promise<[any, boolean]> => {
      if (!data || !(data instanceof Object)) {
        // Scalars can't have placeholders
        return [data, false];
      }

      if (Array.isArray(data)) {
        // We're an array - process all entries recursively
        const items = await Promise.all(data.map(item => process(item)));
        return items.every(([, changed]) => !changed)
          ? [data, false]
          : [items.map(([item]) => item), true];
      }

      const keys = Object.keys(data);
      if (!keys.some(k => k.startsWith('$'))) {
        // We're an object but no placeholders at this level - process all
        // entries recursively
        const entries = await Promise.all(
          Object.entries(data).map(([k, v]) =>
            process(v).then(vp => [k, vp] as const),
          ),
        );
        return entries.every(([, [, changed]]) => !changed)
          ? [data, false]
          : [Object.fromEntries(entries.map(([k, [v]]) => [k, v])), true];
      } else if (keys.length !== 1) {
        throw new Error(
          'Placeholders have to be on the form of a single $-prefixed key in an object',
        );
      }

      const resolverKey = keys[0].substr(1);
      const resolver = this.resolvers[resolverKey];
      if (!resolver) {
        throw new Error(`Encountered unknown placeholder \$${resolverKey}`);
      }

      return [
        await resolver({
          key: resolverKey,
          value: data[keys[0]],
          location,
          read,
        }),
        true,
      ];
    };

    const [result] = await process(entity);
    return result;
  }
}

/*
 * Resolvers
 */

export async function yamlPlaceholderResolver(
  params: ResolverParams,
): Promise<JsonValue> {
  const text = await readTextLocation(params);

  let documents: yaml.Document.Parsed[];
  try {
    documents = yaml.parseAllDocuments(text).filter(d => d);
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} failed to parse YAML data at ${params.value}, ${e}`,
    );
  }

  if (documents.length !== 1) {
    throw new Error(
      `Placeholder \$${params.key} expected to find exactly one document of data at ${params.value}, found ${documents.length}`,
    );
  }

  const document = documents[0];

  if (document.errors?.length) {
    throw new Error(
      `Placeholder \$${params.key} found an error in the data at ${params.value}, ${document.errors[0]}`,
    );
  }

  return document.toJSON();
}

export async function jsonPlaceholderResolver(
  params: ResolverParams,
): Promise<JsonValue> {
  const text = await readTextLocation(params);

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} failed to parse JSON data at ${params.value}, ${e}`,
    );
  }
}

export async function textPlaceholderResolver(
  params: ResolverParams,
): Promise<JsonValue> {
  return await readTextLocation(params);
}

/*
 * Helpers
 */

async function readTextLocation(params: ResolverParams): Promise<string> {
  const newLocation = relativeLocation(params);

  try {
    const data = await params.read(newLocation);
    return data.toString('utf-8');
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} could not read location ${params.value}, ${e}`,
    );
  }
}

function relativeLocation({
  key,
  value,
  location,
}: ResolverParams): LocationSpec {
  if (typeof value !== 'string') {
    throw new Error(
      `Placeholder \$${key} expected a string value parameter, in the form of an absolute URL or a relative path`,
    );
  }

  let url: URL;
  try {
    // The two-value form of the URL constructor handles relative paths for us
    url = new URL(value, location.target);
  } catch {
    try {
      // Check whether value is a valid absolute URL on it's own, if not fail.
      url = new URL(value);
    } catch {
      // The only remaining case that isn't support is a relative file path that should be
      // resolved using a relative file location. Accessing local file paths can lead to
      // path traversal attacks and access to any file on the host system. Implementing this
      // would require additional security measures.
      throw new Error(
        `Placeholder \$${key} could not form an URL out of ${location.target} and ${value}`,
      );
    }
  }

  return {
    type: location.type,
    target: url.toString(),
  };
}
