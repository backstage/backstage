/*
 * Copyright 2020 The Backstage Authors
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

import { errorString, createOptions } from './util';

describe('errorString', () => {
  it('formats', () => {
    const e = { code: 1, name: 'n', message: 'm' };
    expect(errorString(e)).toEqual('1 n: m');
  });
});

describe('createOptions', () => {
  it('should add pagePause', () => {
    const options = {
      filter: 'f',
      paged: true,
      timeLimit: 42,
      sizeLimit: 100,
      derefAliases: 0,
      typesOnly: false,
    };
    expect(createOptions(options)).toEqual({
      filter: 'f',
      paged: { pagePause: true },
      timeLimit: 42,
      sizeLimit: 100,
      derefAliases: 0,
      typesOnly: false,
    });
    const options2 = {
      filter: 'f',
      paged: {},
      timeLimit: 42,
      sizeLimit: 100,
      derefAliases: 0,
      typesOnly: false,
    };
    expect(createOptions(options2)).toEqual({
      filter: 'f',
      paged: { pagePause: true },
      timeLimit: 42,
      sizeLimit: 100,
      derefAliases: 0,
      typesOnly: false,
    });
  });

  it('should not add pagePause', () => {
    const options = {
      filter: 'f',
      paged: false,
      timeLimit: 42,
      sizeLimit: 100,
      derefAliases: 0,
      typesOnly: false,
    };
    expect(createOptions(options)).toEqual(options);
  });
});
