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

import tar from 'tar';
import concatStream from 'concat-stream';
import { promisify } from 'util';
import { pipeline as pipelineCb, Readable } from 'stream';

const pipeline = promisify(pipelineCb);
/**
 * Serializes provided path into tar archive
 *
 * @alpha
 */
export const serializeWorkspace = async (opts: {
  path: string;
}): Promise<{ contents: Buffer }> => {
  return new Promise<{ contents: Buffer }>(async resolve => {
    await pipeline(
      tar.create({ cwd: opts.path }, ['']),
      concatStream(buffer => {
        return resolve({ contents: buffer });
      }),
    );
  });
};

/**
 * Rehydrates the provided buffer of tar archive into the provide destination path
 *
 * @alpha
 */
export const restoreWorkspace = async (opts: {
  path: string;
  buffer?: Buffer;
}): Promise<void> => {
  const { buffer, path } = opts;
  if (buffer) {
    await pipeline(
      Readable.from(buffer),
      tar.extract({
        C: path,
      }),
    );
  }
};
