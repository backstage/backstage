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
import { MockDirectory } from '@backstage/backend-test-utils';

const name1 = 'file1.yaml';
const file1 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object.yaml'),
);

const name2 = 'file2.yaml';
const file2 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object2.yaml'),
);

describe('ReadableArrayResponse', () => {
  const sourceDir = MockDirectory.create();
  const targetDir = MockDirectory.create();

  beforeEach(async () => {
    await sourceDir.setContent({
      [name1]: file1,
      [name2]: file2,
    });
    await targetDir.clear();
  });

  const path1 = sourceDir.resolve(name1);
  const path2 = sourceDir.resolve(name2);

  it('should read files', async () => {
    const arr: FromReadableArrayOptions = [
      { data: fs.createReadStream(path1), path: path1 },
      { data: fs.createReadStream(path2), path: path2 },
    ];

    const res = new ReadableArrayResponse(arr, targetDir.path, 'etag');
    const files = await res.files();

    expect(files).toEqual([
      { path: path1, content: expect.any(Function) },
      { path: path2, content: expect.any(Function) },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents).toEqual([file1, file2]);
  });

  it('should extract entire archive into directory', async () => {
    const arr: FromReadableArrayOptions = [
      { data: fs.createReadStream(path1), path: path1 },
      { data: fs.createReadStream(path2), path: path2 },
    ];

    const res = new ReadableArrayResponse(arr, targetDir.path, 'etag');
    const dir = await res.dir();

    await expect(targetDir.content({ path: dir })).resolves.toEqual({
      [name1]: file1.toString('utf8'),
      [name2]: file2.toString('utf8'),
    });
  });
});
