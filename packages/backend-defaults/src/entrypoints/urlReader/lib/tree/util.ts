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

import { Readable, pipeline as pipelineCb } from 'stream';
import { promisify } from 'util';
import concatStream from 'concat-stream';

const pipeline = promisify(pipelineCb);

// Matches a directory name + one `/` at the start of any string,
// containing any character except `/` one or more times, and ending with a `/`
// e.g. Will match `dirA/` in `dirA/dirB/file.ext`
const directoryNameRegex = /^[^\/]+\//;
// Removes the first segment of a forward-slash-separated path
export function stripFirstDirectoryFromPath(path: string): string {
  return path.replace(directoryNameRegex, '');
}

// Collect the stream into a buffer and return
export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      await pipeline(stream, concatStream(resolve));
    } catch (ex) {
      reject(ex);
    }
  });
};
