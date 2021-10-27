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
import { groupByPath, buildFileStructure } from './FileExplorer';

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
  {
    filename: 'dir3/dir2/dir1/file4',
    files: [],
    coverage: 1,
    missing: 1,
    tracked: 1,
    path: '',
  },
  {
    filename: 'dir3/dir2/dir3/file4',
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
  dir3: [
    {
      filename: 'dir3/dir2/dir1/file4',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: '',
    },
    {
      filename: 'dir3/dir2/dir3/file4',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: '',
    },
  ],
};

const coverageTableRow = {
  files: dummyFiles,
  coverage: 1,
  missing: 1,
  tracked: 1,
  path: '',
};

const coverageTableRowResults = {
  files: [
    {
      path: 'dir1',
      files: [
        {
          path: 'file1',
          files: [],
          coverage: 1,
          missing: 1,
          tracked: 1,
        },
        {
          path: 'file2',
          files: [],
          coverage: 1,
          missing: 1,
          tracked: 1,
        },
      ],
      coverage: 1,
      missing: 2,
      tracked: 2,
    },
    {
      path: 'dir2',
      files: [
        {
          path: 'file3',
          files: [],
          coverage: 1,
          missing: 1,
          tracked: 1,
        },
      ],
      coverage: 1,
      missing: 1,
      tracked: 1,
    },
    {
      path: 'dir3',
      files: [
        {
          path: 'dir2',
          files: [
            {
              path: 'dir1',
              files: [
                {
                  path: 'file4',
                  files: [],
                  coverage: 1,
                  missing: 1,
                  tracked: 1,
                },
              ],
              coverage: 1,
              missing: 1,
              tracked: 1,
            },
            {
              path: 'dir3',
              files: [
                {
                  path: 'file4',
                  files: [],
                  coverage: 1,
                  missing: 1,
                  tracked: 1,
                },
              ],
              coverage: 1,
              missing: 1,
              tracked: 1,
            },
          ],
          coverage: 1,
          missing: 2,
          tracked: 2,
        },
      ],
      coverage: 1,
      missing: 2,
      tracked: 2,
    },
  ],
  coverage: 1,
  missing: 1,
  tracked: 1,
  path: '',
};

describe('groupByPath function', () => {
  it('should group files by their root directory,as per their filename', () => {
    expect(groupByPath(dummyFiles)).toStrictEqual(dummyDataGroupedByPath);
  });
});

describe('buildFileStructure function', () => {
  it('should group files by their root directory,as per their filename', () => {
    expect(buildFileStructure(coverageTableRow)).toStrictEqual(
      coverageTableRowResults,
    );
  });
});
