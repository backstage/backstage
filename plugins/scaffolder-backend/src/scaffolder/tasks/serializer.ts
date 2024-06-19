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

export const serializeWorkspace = async (path: string): Promise<Buffer> => {
  return await new Promise<Buffer>(async resolve => {
    await pipeline(tar.create({ cwd: path }, ['']), concatStream(resolve));
  });
};

export const restoreWorkspace = async (path: string, buffer?: Buffer) => {
  if (buffer) {
    await pipeline(
      Readable.from(buffer),
      tar.extract({
        C: path,
      }),
    );
  }
};
