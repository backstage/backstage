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

import { createConditionFactory } from './createConditionFactory';
import { createPermissionRule } from './createPermissionRule';

describe('createConditionFactory', () => {
  const testRule = createPermissionRule({
    name: 'test-rule',
    description: 'test-description',
    resourceType: 'test-resource',
    apply: jest.fn(),
    toQuery: jest.fn(),
  });

  it('returns a function', () => {
    expect(createConditionFactory(testRule)).toEqual(expect.any(Function));
  });

  describe('return value', () => {
    it('constructs a condition with the rule name and supplied params', () => {
      const conditionFactory = createConditionFactory(testRule);
      expect(conditionFactory('a', 'b', 1, 2)).toEqual({
        rule: 'test-rule',
        resourceType: 'test-resource',
        params: ['a', 'b', 1, 2],
      });
    });
  });
});
