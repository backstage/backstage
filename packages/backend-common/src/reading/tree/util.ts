/*
 * Copyright 2021 The Backstage Authors
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

// Matches a directory name + one `/` at the start of any string,
// containing any character except `/` one or more times, and ending with a `/`
// e.g. Will match `dirA/` in `dirA/dirB/file.ext`
const directoryNameRegex = /^[^\/]+\//;

// Removes the first segment of a forward-slash-separated path
export function stripFirstDirectoryFromPath(path: string): string {
  return path.replace(directoryNameRegex, '');
}

// Some corrupted ZIP files cause the zlib inflater to hang indefinitely.
// This is a workaround to bail on stuck streams after 3 seconds.
// Related: https://github.com/ZJONSSON/node-unzipper/issues/213
export async function streamToTimeoutPromise<T>(
  stream: NodeJS.ReadableStream,
  options: {
    timeoutMs: number;
    eventName: string;
    getError: (data: T) => Error;
  },
) {
  let lastEntryTimeout: NodeJS.Timeout | undefined;
  stream.on(options.eventName, (data: T) => {
    clearTimeout(lastEntryTimeout);

    lastEntryTimeout = setTimeout(() => {
      stream.emit('error', options.getError(data));
    }, options.timeoutMs);
  });

  await new Promise(function (resolve, reject) {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  clearTimeout(lastEntryTimeout);
}
