/*
 * Copyright 2020 Spotify AB
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
import mockFs from 'mock-fs';
import { getFileTreeRecursively, getHeadersForFileExtension } from './helpers';

describe('getHeadersForFileExtension', () => {
  it('returns correct header for default extensions', () => {
    const headers = getHeadersForFileExtension('xyz');
    const expectedHeaders = {
      'Content-Type': 'text/plain',
    };
    expect(headers).toEqual(expectedHeaders);
  });

  it('returns correct header for html', () => {
    const headers = getHeadersForFileExtension('html');
    const expectedHeaders = {
      'Content-Type': 'text/html; charset=UTF-8',
    };
    expect(headers).toEqual(expectedHeaders);
  });

  it('returns correct header for css', () => {
    const headers = getHeadersForFileExtension('css');
    const expectedHeaders = {
      'Content-Type': 'text/css; charset=UTF-8',
    };
    expect(headers).toEqual(expectedHeaders);
  });
});

describe('getFileTreeRecursively', () => {
  beforeEach(() => {
    mockFs({
      '/rootDir': {
        file1: '',
        subDirA: {
          file2: '',
          emptyDir1: mockFs.directory(),
        },
        emptyDir2: mockFs.directory(),
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('returns complete file tree of a path', async () => {
    const fileList = await getFileTreeRecursively('/rootDir');
    expect(fileList.length).toBe(2);
    expect(fileList).toContain('/rootDir/file1');
    expect(fileList).toContain('/rootDir/subDirA/file2');
  });
});
