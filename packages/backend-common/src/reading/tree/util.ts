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

import { Readable, finished } from 'stream';
import concatStream from 'concat-stream';

// Matches a directory name + one `/` at the start of any string,
// containing any character except `/` one or more times, and ending with a `/`
// e.g. Will match `dirA/` in `dirA/dirB/file.ext`
const directoryNameRegex = /^[^\/]+\//;
// Removes the first segment of a forward-slash-separated path
export function stripFirstDirectoryFromPath(path: string): string {
  return path.replace(directoryNameRegex, '');
}

// Custom pipeline implementation, since pipeline doesn't work well with tar on node 18
// See https://github.com/npm/node-tar/issues/321
export function pipeStream(
  from: NodeJS.ReadableStream,
  to: NodeJS.WritableStream,
): Promise<void> {
  return new Promise((resolve, reject) => {
    from.pipe(to);
    finished(from, fromErr => {
      if (fromErr) {
        reject(fromErr);
      } else {
        finished(to, toErr => {
          if (toErr) {
            reject(toErr);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

// Collect the stream into a buffer and return
export function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      await pipeStream(stream, concatStream(resolve));
    } catch (ex) {
      reject(ex);
    }
  });
}
