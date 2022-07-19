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

import path from 'path';
import { getRepoSourceDirectory, isExecutable } from './util';

describe('getRepoSourceDirectory', () => {
  it('should return workspace root if no sub folder is given', () => {
    expect(
      getRepoSourceDirectory(path.join('/', 'var', 'workspace'), undefined),
    ).toEqual(path.join('/', 'var', 'workspace'));
  });

  it('should return path in workspace if sub folder is given', () => {
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        path.join('path', 'of', 'subfolder'),
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'path', 'of', 'subfolder'));
  });

  it('should not allow traversal outside the workspace root', () => {
    // We have to construct the path manually here, as path.join would mitigate the path traversal
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        `..${path.sep}secret`,
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'secret'));
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        `.${path.sep}path${path.sep}..${path.sep}..${path.sep}secret`,
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'secret'));
    expect(
      getRepoSourceDirectory(
        path.join('/', 'var', 'workspace'),
        path.join('/', 'absolute', 'secret'),
      ),
    ).toEqual(path.join('/', 'var', 'workspace', 'absolute', 'secret'));
  });
});

describe('isExecutable', () => {
  it('should return true for file mode 777', () => {
    expect(isExecutable(0o100777)).toBe(true);
  });
  it('should return true for file mode 775', () => {
    expect(isExecutable(0o100775)).toBe(true);
  });
  it('should return true for file mode 755', () => {
    expect(isExecutable(0o100755)).toBe(true);
  });
  it('should return true for file mode 700', () => {
    expect(isExecutable(0o100700)).toBe(true);
  });
  it('should return true for file mode 770', () => {
    expect(isExecutable(0o100770)).toBe(true);
  });
  it('should return true for file mode 670', () => {
    expect(isExecutable(0o100670)).toBe(true);
  });
  it('should return false for file mode 644', () => {
    expect(isExecutable(0o100644)).toBe(false);
  });
  it('should return false for file mode 600', () => {
    expect(isExecutable(0o100600)).toBe(false);
  });
  it('should return false for file mode 640', () => {
    expect(isExecutable(0o100640)).toBe(false);
  });
});
