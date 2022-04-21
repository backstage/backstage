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

import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import { createConditionExports } from './createConditionExports';
import { createPermissionRule } from './createPermissionRule';

const testIntegration = () =>
  createConditionExports({
    pluginId: 'test-plugin',
    resourceType: 'test-resource',
    rules: {
      testRule1: createPermissionRule({
        name: 'testRule1',
        description: 'Test rule 1',
        resourceType: 'test-resource',
        apply: jest.fn(
          (_resource: any, _firstParam: string, _secondParam: number) => true,
        ),
        toQuery: jest.fn((firstParam: string, secondParam: number) => ({
          query: 'testRule1',
          params: [firstParam, secondParam],
        })),
      }),
      testRule2: createPermissionRule({
        name: 'testRule2',
        description: 'Test rule 2',
        resourceType: 'test-resource',
        apply: jest.fn((_resource: any, _firstParam: object) => false),
        toQuery: jest.fn((firstParam: object) => ({
          query: 'testRule2',
          params: [firstParam],
        })),
      }),
    },
  });

describe('createConditionExports', () => {
  describe('conditions', () => {
    it('creates condition factories for the supplied rules', () => {
      const { conditions } = testIntegration();

      expect(conditions.testRule1('a', 1)).toEqual({
        rule: 'testRule1',
        resourceType: 'test-resource',
        params: ['a', 1],
      });

      expect(conditions.testRule2({ baz: 'quux' })).toEqual({
        rule: 'testRule2',
        resourceType: 'test-resource',
        params: [{ baz: 'quux' }],
      });
    });
  });

  describe('createPolicyDecisions', () => {
    it('wraps conditions in an object with resourceType and pluginId', () => {
      const { createConditionalDecision } = testIntegration();
      const testPermission = createPermission({
        name: 'test.permission',
        attributes: {},
        resourceType: 'test-resource',
      });

      expect(
        createConditionalDecision(testPermission, {
          allOf: [
            {
              rule: 'testRule1',
              resourceType: 'test-resource',
              params: ['a', 1],
            },
          ],
        }),
      ).toEqual({
        result: AuthorizeResult.CONDITIONAL,
        pluginId: 'test-plugin',
        resourceType: 'test-resource',
        conditions: {
          allOf: [
            {
              rule: 'testRule1',
              resourceType: 'test-resource',
              params: ['a', 1],
            },
          ],
        },
      });
    });
  });
});
