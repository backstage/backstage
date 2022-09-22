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

import { Readable, Writable } from 'stream';
import { pipeStream, streamToBuffer } from './util';

describe('pipeStream', () => {
  it('should pipe a stream', async () => {
    const from = Readable.from(['hello']);

    let written = '';
    const to = new Writable({
      write(chunk, encoding, callback) {
        written = `${encoding}:${chunk}`;
        callback();
      },
    });

    await pipeStream(from, to);
    expect(written).toBe('buffer:hello');
  });

  it('should forward errors', async () => {
    const from = new Readable({
      read() {
        throw new Error('oh no');
      },
    });
    const to = new Writable();

    await expect(pipeStream(from, to)).rejects.toThrow('oh no');
  });
});

describe('streamToBuffer', () => {
  it('should read a stream', async () => {
    await expect(streamToBuffer(Readable.from(['hello']))).resolves.toBe(
      'hello',
    );
  });

  it('should fail on errors', async () => {
    const stream = new Readable({
      read() {
        throw new Error('oh no');
      },
    });
    await expect(streamToBuffer(stream)).rejects.toThrow('oh no');
  });
});
