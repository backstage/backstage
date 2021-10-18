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
    path: ''
  }
];

const dummyDataGroupedByPath = {
  dir1: [
    {
      filename: 'dir1/file1',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: ''
    },
    {
      filename: 'dir1/file2',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: ''
    }
  ],
  dir2: [
    {
      filename: 'dir2/file3',
      files: [],
      coverage: 1,
      missing: 1,
      tracked: 1,
      path: ''
    }
  ]
};

describe('groupByPath function', () => {
  it('should group files by their root directory,as per their filename', () => {
    expect(groupByPath(dummyFiles)).toBe(dummyDataGroupedByPath);
  });
});