/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';
import { ScmIntegrationRegistry } from '@backstage/integration';
import yaml from 'yaml';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  PlaceholderResolver,
  PlaceholderResolverParams,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { UrlReaderService } from '@backstage/backend-plugin-api';

/** @public */
export type PlaceholderProcessorOptions = {
  resolvers: Record<string, PlaceholderResolver>;
  reader: UrlReaderService;
  integrations: ScmIntegrationRegistry;
};

/**
 * Traverses raw entity JSON looking for occurrences of $-prefixed placeholders
 * that it then fills in with actual data.
 * @public
 */
export class PlaceholderProcessor implements CatalogProcessor {
  constructor(private readonly options: PlaceholderProcessorOptions) {}

  getProcessorName(): string {
    return 'PlaceholderProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
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
        // This was an object that had more than one key, some of which were
        // dollar prefixed. We only handle the case where there is exactly one
        // such key; anything else is left alone.
        return [data, false];
      }

      const resolverKey = keys[0].substring(1);
      const resolverValue = data[keys[0]];

      const resolver = this.options.resolvers[resolverKey];
      if (!resolver) {
        // If there was no such placeholder resolver, we err on the side of safety
        // and assume that this is something that's best left alone. For example, if
        // the input contains JSONSchema, there may be "$ref": "#/definitions/node"
        // nodes in the document.
        return [data, false];
      }

      const read = async (url: string): Promise<Buffer> => {
        const response = await this.options.reader.readUrl(url);
        const buffer = await response.buffer();
        return buffer;
      };

      const resolveUrl = (url: string, base: string): string =>
        this.options.integrations.resolveUrl({
          url,
          base,
        });

      return [
        await resolver({
          key: resolverKey,
          value: resolverValue,
          baseUrl: location.target,
          read,
          resolveUrl,
          emit,
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
  params: PlaceholderResolverParams,
): Promise<JsonValue> {
  const { content, url } = await readTextLocation(params);

  params.emit(processingResult.refresh(`url:${url}`));

  let documents: yaml.Document.Parsed[];
  try {
    documents = yaml.parseAllDocuments(content).filter(d => d);
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
  params: PlaceholderResolverParams,
): Promise<JsonValue> {
  const { content, url } = await readTextLocation(params);

  params.emit(processingResult.refresh(`url:${url}`));

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} failed to parse JSON data at ${params.value}, ${e}`,
    );
  }
}

export async function textPlaceholderResolver(
  params: PlaceholderResolverParams,
): Promise<JsonValue> {
  const { content, url } = await readTextLocation(params);

  params.emit(processingResult.refresh(`url:${url}`));

  return content;
}

/*
 * Helpers
 */

async function readTextLocation(
  params: PlaceholderResolverParams,
): Promise<{ content: string; url: string }> {
  const newUrl = relativeUrl(params);

  try {
    const data = await params.read(newUrl);
    return { content: data.toString('utf-8'), url: newUrl };
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} could not read location ${params.value}, ${e}`,
    );
  }
}

function relativeUrl({
  key,
  value,
  baseUrl,
  resolveUrl,
}: PlaceholderResolverParams): string {
  if (typeof value !== 'string') {
    throw new Error(
      `Placeholder \$${key} expected a string value parameter, in the form of an absolute URL or a relative path`,
    );
  }

  try {
    return resolveUrl(value, baseUrl);
  } catch (e) {
    // The only remaining case that isn't support is a relative file path that should be
    // resolved using a relative file location. Accessing local file paths can lead to
    // path traversal attacks and access to any file on the host system. Implementing this
    // would require additional security measures.
    throw new Error(
      `Placeholder \$${key} could not form a URL out of ${baseUrl} and ${value}, ${e}`,
    );
  }
}
