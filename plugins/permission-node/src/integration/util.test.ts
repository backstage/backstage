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

import { createPermissionRule } from './createPermissionRule';
import {
  createGetRule,
  isAndCriteria,
  isNotCriteria,
  isOrCriteria,
} from './util';

describe('permission integration utils', () => {
  describe('createGetRule', () => {
    let getRule: ReturnType<typeof createGetRule>;

    const testRule1 = createPermissionRule({
      name: 'test-rule-1',
      description: 'Test rule 1',
      resourceType: 'test-resource',
      apply: jest.fn(),
      toQuery: jest.fn(),
    });

    const testRule2 = createPermissionRule({
      name: 'test-rule-2',
      description: 'Test rule 2',
      resourceType: 'test-resource',
      apply: jest.fn(),
      toQuery: jest.fn(),
    });

    beforeEach(() => {
      getRule = createGetRule([testRule1, testRule2]);
    });

    it('returns the rule matching the supplied name', () => {
      expect(getRule('test-rule-1')).toBe(testRule1);
    });

    it('throws if there is no rule for the supplied name', () => {
      expect(() => getRule('test-rule-3')).toThrow(
        /unexpected permission rule/i,
      );
    });
  });

  describe('isOrCriteria', () => {
    it('returns true if input has a top-level "anyOf" property', () => {
      expect(isOrCriteria({ anyOf: { not: { allOf: [] } } })).toEqual(true);
    });

    it('returns false if input does not have a top-level "anyOf" property', () => {
      expect(isOrCriteria({ allOf: { not: { anyOf: [] } } })).toEqual(false);
    });
  });

  describe('isAndCriteria', () => {
    it('returns true if input has a top-level "allOf" property', () => {
      expect(isAndCriteria({ allOf: { not: { anyOf: [] } } })).toEqual(true);
    });

    it('returns false if input does not have a top-level "allOf" property', () => {
      expect(isAndCriteria({ anyOf: { not: { allOf: [] } } })).toEqual(false);
    });
  });

  describe('isNotCriteria', () => {
    it('returns true if input has a top-level "not" property', () => {
      expect(isNotCriteria({ not: { allOf: [{ anyOf: [] }] } })).toEqual(true);
    });

    it('returns false if input does not have a top-level "not" property', () => {
      expect(isNotCriteria({ anyOf: { not: { allOf: [] } } })).toEqual(false);
    });
  });
});
