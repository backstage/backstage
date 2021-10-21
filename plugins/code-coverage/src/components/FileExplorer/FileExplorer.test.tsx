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
import { groupByPath } from './FileExplorer';

const dummyFiles = [
  {
    filename: 'dir1/file1',
    files: [],
    coverage: 1,
    missing: 1,
    tracked: 1,
    path: '',
  },
  {
    filename: 'dir1/file2',
    files: [],
    coverage: 1,
    missing: 1,
    tracked: 1,
    path: '',
  },
  {
    filename: 'dir2/file3',
    files: [],
    coverage: 1,
    missing: 1,
    tracked: 1,
    path: '',
  },
];

const dummyDataGroupedByPath = {
  dir1: [
    {
      filename: 'dir1/file1',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: '',
    },
    {
      filename: 'dir1/file2',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: '',
    },
  ],
  dir2: [
    {
      filename: 'dir2/file3',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: '',
    },
  ],
};

describe('groupByPath function', () => {
  it('should group files by their root directory,as per their filename', () => {
    expect(groupByPath(dummyFiles)).toBe(dummyDataGroupedByPath);
  });
});
