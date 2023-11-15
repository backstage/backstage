/*
 * Copyright 2023 The Backstage Authors
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

import { scopeHelper } from './scopes';

describe('microsoftScopeHelper', () => {
  it('default scope only with undefined additional scopes', () => {
    const scopeResult = scopeHelper(['default']);
    expect(scopeResult.length).toBe(1);
    expect(scopeResult).toEqual(expect.arrayContaining(['default']));
  });

  it('default scope only with empty additional scopes', () => {
    const scopeResult = scopeHelper(['default'], []);
    expect(scopeResult.length).toBe(1);
    expect(scopeResult).toEqual(expect.arrayContaining(['default']));
  });

  it('default scope with mutually exclusive additional scopes', () => {
    const scopeResult = scopeHelper(['default'], ['secondScope', 'thirdScope']);
    expect(scopeResult.length).toBe(3);
    expect(scopeResult).toEqual(
      expect.arrayContaining(['default', 'secondScope', 'thirdScope']),
    );
  });

  it('default scope with overlapping additional scopes', () => {
    const scopeResult = scopeHelper(
      ['default', 'secondScope'],
      ['default', 'secondScope', 'thirdScope'],
    );
    expect(scopeResult.length).toBe(3);
    expect(scopeResult).toEqual(
      expect.arrayContaining(['default', 'secondScope', 'thirdScope']),
    );
  });
});
