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
import { z } from 'zod';
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
        paramsSchema: z.object({
          foo: z.string(),
          bar: z.number(),
        }),
        apply: (_resource: any, _params) => true,
        toQuery: params => ({
          query: 'testRule1',
          params,
        }),
      }),
      testRule2: createPermissionRule({
        name: 'testRule2',
        description: 'Test rule 2',
        resourceType: 'test-resource',
        paramsSchema: z.object({
          foo: z.string().optional(),
        }),
        apply: (_resource: any) => false,
        toQuery: params => ({
          query: 'testRule2',
          params,
        }),
      }),
    },
  });

describe('createConditionExports', () => {
  describe('conditions', () => {
    it('creates condition factories for the supplied rules', () => {
      const { conditions } = testIntegration();

      expect(
        conditions.testRule1({
          foo: 'a',
          bar: 1,
        }),
      ).toEqual({
        rule: 'testRule1',
        resourceType: 'test-resource',
        params: {
          foo: 'a',
          bar: 1,
        },
      });

      expect(conditions.testRule2({})).toEqual({
        rule: 'testRule2',
        resourceType: 'test-resource',
        params: {},
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
              params: {
                foo: 'a',
                bar: 1,
              },
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
              params: {
                foo: 'a',
                bar: 1,
              },
            },
          ],
        },
      });
    });
  });
});
