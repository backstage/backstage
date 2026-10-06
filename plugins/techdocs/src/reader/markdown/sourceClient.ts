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

import { FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export async function readSourceJson(
  fetchApi: FetchApi,
  url: string,
  limit: number,
  optional = false,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetchApi.fetch(url, { signal, cache: 'no-cache' });
  if (optional && response.status === 404) return undefined;
  if (!response.ok) throw await ResponseError.fromResponse(response);
  if (Number(response.headers.get('content-length')) > limit)
    throw new Error('Source artifact exceeds size limit');
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    if (text.length > limit)
      throw new Error('Source artifact exceeds size limit');
    return JSON.parse(text);
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) throw new Error('Source artifact exceeds size limit');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
