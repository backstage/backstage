/*
 * Copyright 2025 The Backstage Authors
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
import { Expand, ExpandRecursive } from './expand';

describe('expand', () => {
  it('should expand type aliases into their equivalent type', () => {
    type Test = { a: string } & { b: number };
    // expanded type
    type Result = Expand<Test>;

    const result: Result = { a: 'string', b: 1 };
    expect(result).toEqual({ a: 'string', b: 1 });
  });

  it('should expand types recursively', () => {
    type Test = { a: string } & { b: { c: { e: string } } } & {
      b: { c: { d: boolean } };
    };
    // expanded type
    type Result = ExpandRecursive<Test>;

    const result: Result = { a: 'string', b: { c: { e: 'string', d: true } } };
    expect(result).toEqual({ a: 'string', b: { c: { e: 'string', d: true } } });
  });
});
