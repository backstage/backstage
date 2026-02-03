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

import { JsonValue } from '@backstage/types';
import {
  PlaceholderResolverParams,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { bundleFileWithRefs } from './lib';

/** @public */
export async function jsonSchemaRefPlaceholderResolver(
  params: PlaceholderResolverParams,
): Promise<JsonValue> {
  const { content, url } = await readTextLocation(params);

  params.emit(processingResult.refresh(`url:${url}`));

  try {
    return await bundleFileWithRefs(
      content,
      url,
      params.read,
      params.resolveUrl,
    );
  } catch (error) {
    throw new Error(
      `Placeholder \$${params.key} unable to bundle the file at ${params.value}, ${error}`,
    );
  }
}

/*
 * Helpers, copied from PlaceholderProcessor
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
