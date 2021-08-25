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
import { ReadableArrayResponse } from './ReadableArrayResponse';
import path, { resolve as resolvePath } from 'path';

import { Readable } from 'stream';
import fs from 'fs-extra';

const arr: Readable[] = [];
const arr2: Readable[] = [];
const file1 = path.resolve(
  'src',
  'reading',
  '__fixtures__',
  'awsS3',
  'awsS3-mock-object.yaml',
);
const file2 = path.resolve(
  'src',
  'reading',
  '__fixtures__',
  'awsS3',
  'awsS3-mock-object2.yaml',
);

describe('ReadableArrayResponse', () => {
  it('should read files', async () => {
    const stream1 = fs.createReadStream(file1);
    const stream2 = fs.createReadStream(file2);
    arr.push(stream1);
    arr.push(stream2);

    const res = new ReadableArrayResponse(arr, '/tmp', 'etag');
    const files = await res.files();

    expect(files).toEqual([
      {
        path: file1,
        content: expect.any(Function),
      },
      {
        path: file2,
        content: expect.any(Function),
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      'site_name: Test2',
    ]);
  });

  it('should extract entire archive into directory', async () => {
    const stream1 = fs.createReadStream(file1);
    const stream2 = fs.createReadStream(file2);

    arr2.push(stream1);
    arr2.push(stream2);

    const res = new ReadableArrayResponse(arr2, '/tmp', 'etag');
    const dir = await res.dir();
    await expect(
      fs.readFile(resolvePath(dir, 'awsS3-mock-object.yaml'), 'utf8'),
    ).resolves.toBe('site_name: Test\n');
    await expect(
      fs.readFile(resolvePath(dir, 'awsS3-mock-object2.yaml'), 'utf8'),
    ).resolves.toBe('site_name: Test2\n');
  });
});
