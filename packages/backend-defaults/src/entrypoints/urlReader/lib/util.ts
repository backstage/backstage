/*
 * Copyright 2022 The Backstage Authors
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

import { PassThrough, Readable } from 'stream';
import { ReadableStream as WebReadableStream } from 'stream/web';

export function parseLastModified(
  value: string | null | undefined,
): Date | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const result = new Date(value);
    result.toISOString(); // triggers exception if input was invalid
    return result;
  } catch {
    return undefined;
  }
}

export function responseToReadable(response: Response): Readable {
  return response.body
    ? Readable.from(toWeb(response.body))
    : new PassThrough().end();
}

// The NodeJS ReadableStream is that fetch returns is super basic and not even
// iterable. This function converts it to the smarter, iterable stream/web
// variant instead.
export function toWeb(
  responseBody: ReadableStream<Uint8Array>,
): WebReadableStream<Uint8Array> {
  const reader = responseBody.getReader();
  return new WebReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (value) {
        controller.enqueue(value);
      }
      if (done) {
        controller.close();
      }
    },
  });
}
