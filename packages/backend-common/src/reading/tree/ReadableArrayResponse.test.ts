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
import mockFs from 'mock-fs';
import path, { resolve as resolvePath } from 'path';
import { FromReadableArrayOptions } from '../types';
import { ReadableArrayResponse } from './ReadableArrayResponse';

const path1 = '/file1.yaml';
const file1 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object.yaml'),
);

const path2 = '/file2.yaml';
const file2 = fs.readFileSync(
  path.resolve(__filename, '../../__fixtures__/awsS3/awsS3-mock-object2.yaml'),
);

describe('ReadableArrayResponse', () => {
  beforeEach(() => {
    mockFs({
      [path1]: file1,
      [path2]: file2,
      '/tmp': mockFs.directory(),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should read files', async () => {
    const arr: FromReadableArrayOptions = [
      { data: fs.createReadStream(path1), path: path1 },
      { data: fs.createReadStream(path2), path: path2 },
    ];

    const res = new ReadableArrayResponse(arr, '/tmp', 'etag');
    const files = await res.files();

    expect(files).toEqual([
      { path: path1, content: expect.any(Function) },
      { path: path2, content: expect.any(Function) },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      'site_name: Test2',
    ]);
  });

  it('should extract entire archive into directory', async () => {
    const arr: FromReadableArrayOptions = [
      { data: fs.createReadStream(path1), path: path1 },
      { data: fs.createReadStream(path2), path: path2 },
    ];

    const res = new ReadableArrayResponse(arr, '/tmp', 'etag');
    const dir = await res.dir();

    expect(fs.readFileSync(resolvePath(dir, 'file1.yaml'), 'utf8').trim()).toBe(
      'site_name: Test',
    );
    expect(fs.readFileSync(resolvePath(dir, 'file2.yaml'), 'utf8').trim()).toBe(
      'site_name: Test2',
    );
  });
});
