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

import fs from 'fs-extra';
import path from 'path';
import { FromReadableArrayOptions } from '../types';
import { ReadableArrayResponse } from './ReadableArrayResponse';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { relative } from 'path/posix';

const name1 = 'file1.yaml';
const file1 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object.yaml'),
);

const name2 = 'file2.yaml';
const file2 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object2.yaml'),
);

const dir1 = 'dir1';
const name3 = `file3.yaml`;
const file3 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object3.yaml'),
);

describe('ReadableArrayResponse', () => {
  const sourceDir = createMockDirectory();
  const targetDir = createMockDirectory();

  beforeEach(() => {
    sourceDir.setContent({
      [name1]: file1,
      [name2]: file2,
      [dir1]: {
        [name3]: file3,
      },
    });
    targetDir.clear();
  });

  const openStreams = new Array<fs.ReadStream>();
  function createReadStream(filePath: string) {
    const stream = fs.createReadStream(filePath);
    openStreams.push(stream);
    return stream;
  }
  afterEach(() => {
    openStreams.forEach(stream => stream.destroy());
    openStreams.length = 0;
  });

  const path1 = sourceDir.resolve(name1);
  const path2 = sourceDir.resolve(name2);
  const path3 = sourceDir.resolve(`${dir1}/${name3}`);

  it('should read files', async () => {
    const arr: FromReadableArrayOptions = [
      { data: createReadStream(path1), path: path1 },
      { data: createReadStream(path2), path: path2 },
      { data: createReadStream(path3), path: path3 },
    ];

    const res = new ReadableArrayResponse(arr, targetDir.path, 'etag');
    const files = await res.files();

    expect(files).toEqual([
      { path: path1, content: expect.any(Function) },
      { path: path2, content: expect.any(Function) },
      { path: path3, content: expect.any(Function) },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents).toEqual([file1, file2, file3]);
  });

  it('should extract entire archive into directory', async () => {
    const relativePath1 = relative(sourceDir.path, path1);
    const relativePath2 = relative(sourceDir.path, path2);
    const relativePath3 = relative(sourceDir.path, path3);

    const arr: FromReadableArrayOptions = [
      { data: createReadStream(path1), path: relativePath1 },
      { data: createReadStream(path2), path: relativePath2 },
      { data: createReadStream(path3), path: relativePath3 },
    ];

    const res = new ReadableArrayResponse(arr, targetDir.path, 'etag');
    const dir = await res.dir();

    expect(targetDir.content({ path: dir })).toEqual({
      [name1]: file1.toString('utf8'),
      [name2]: file2.toString('utf8'),
      [dir1]: {
        [name3]: file3.toString('utf8'),
      },
    });
  });
});
