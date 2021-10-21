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
import { getRepoSourceDirectory } from './util';

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
