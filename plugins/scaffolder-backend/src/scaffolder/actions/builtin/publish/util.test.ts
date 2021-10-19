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

import { getRepoSourceDirectory } from './util';

describe('getRepoSourceDirectory', () => {
  test('should return workspace root if no sub folder is given', () => {
    expect(getRepoSourceDirectory('/var/workspace', undefined)).toEqual(
      '/var/workspace',
    );
  });

  test('should return path in workspace if sub folder is given', () => {
    expect(
      getRepoSourceDirectory('/var/workspace', 'path/of/subfolder'),
    ).toEqual('/var/workspace/path/of/subfolder');
  });

  test('should not allow traversal outside the workspace root', () => {
    expect(getRepoSourceDirectory('/var/workspace', '../secret')).toEqual(
      '/var/workspace/secret',
    );
    expect(
      getRepoSourceDirectory('/var/workspace', './path/../../secret'),
    ).toEqual('/var/workspace/secret');
    expect(
      getRepoSourceDirectory('/var/workspace', '/absolute/secret'),
    ).toEqual('/var/workspace/absolute/secret');
  });
});
