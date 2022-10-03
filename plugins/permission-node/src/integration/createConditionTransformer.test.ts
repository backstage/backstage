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
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { z } from 'zod';
import { createConditionTransformer } from './createConditionTransformer';
import { createPermissionRule } from './createPermissionRule';

const transformConditions = createConditionTransformer([
  createPermissionRule({
    name: 'test-rule-1',
    description: 'Test rule 1',
    resourceType: 'test-resource',
    schema: z.object({
      foo: z.string(),
      bar: z.number(),
    }),
    apply: jest.fn(),
    toQuery: jest.fn(({ foo, bar }) => `test-rule-1:${foo}/${bar}`),
  }),
  createPermissionRule({
    name: 'test-rule-2',
    description: 'Test rule 2',
    resourceType: 'test-resource',
    schema: z.object({
      foo: z.object({}),
    }),
    apply: jest.fn(),
    toQuery: jest.fn(({ foo }) => `test-rule-2:${JSON.stringify(foo)}`),
  }),
]);

describe('createConditionTransformer', () => {
  const testCases: {
    conditions: PermissionCriteria<PermissionCondition>;
    expectedResult: PermissionCriteria<string>;
  }[] = [
    {
      conditions: {
        rule: 'test-rule-1',
        resourceType: 'test-resource',
        params: {
          foo: 'abc',
          bar: 123,
        },
      },
      expectedResult: 'test-rule-1:abc/123',
    },
    {
      conditions: {
        rule: 'test-rule-2',
        resourceType: 'test-resource',
        params: {
          foo: { foo: 0 },
        },
      },
      expectedResult: 'test-rule-2:{"foo":0}',
    },
    {
      conditions: {
        anyOf: [
          {
            rule: 'test-rule-1',
            resourceType: 'test-resource',
            params: {
              foo: 'a',
              bar: 1,
            },
          },
          {
            rule: 'test-rule-2',
            resourceType: 'test-resource',
            params: {
              foo: {},
            },
          },
        ],
      },
      expectedResult: {
        anyOf: ['test-rule-1:a/1', 'test-rule-2:{}'],
      },
    },
    {
      conditions: {
        allOf: [
          {
            rule: 'test-rule-1',
            resourceType: 'test-resource',
            params: {
              foo: 'a',
              bar: 1,
            },
          },
          {
            rule: 'test-rule-2',
            resourceType: 'test-resource',
            params: {
              foo: {},
            },
          },
        ],
      },
      expectedResult: {
        allOf: ['test-rule-1:a/1', 'test-rule-2:{}'],
      },
    },
    {
      conditions: {
        not: {
          rule: 'test-rule-2',
          resourceType: 'test-resource',
          params: {
            foo: {},
          },
        },
      },
      expectedResult: {
        not: 'test-rule-2:{}',
      },
    },
    {
      conditions: {
        allOf: [
          {
            anyOf: [
              {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: {
                  foo: 'a',
                  bar: 1,
                },
              },
              {
                rule: 'test-rule-2',
                resourceType: 'test-resource',
                params: {
                  foo: {},
                },
              },
            ],
          },
          {
            not: {
              allOf: [
                {
                  rule: 'test-rule-1',
                  resourceType: 'test-resource',
                  params: {
                    foo: 'b',
                    bar: 2,
                  },
                },
                {
                  rule: 'test-rule-2',
                  resourceType: 'test-resource',
                  params: {
                    foo: {
                      c: 3,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      expectedResult: {
        allOf: [
          {
            anyOf: ['test-rule-1:a/1', 'test-rule-2:{}'],
          },
          {
            not: {
              allOf: ['test-rule-1:b/2', 'test-rule-2:{"c":3}'],
            },
          },
        ],
      },
    },
    {
      conditions: {
        allOf: [
          {
            anyOf: [
              {
                rule: 'test-rule-1',
                resourceType: 'test-resource',
                params: {
                  foo: 'a',
                  bar: 1,
                },
              },
              {
                rule: 'test-rule-2',
                resourceType: 'test-resource',
                params: {
                  foo: {
                    b: 2,
                  },
                },
              },
            ],
          },
          {
            not: {
              allOf: [
                {
                  rule: 'test-rule-1',
                  resourceType: 'test-resource',
                  params: {
                    foo: 'c',
                    bar: 3,
                  },
                },
                {
                  not: {
                    rule: 'test-rule-2',
                    resourceType: 'test-resource',
                    params: {
                      foo: {
                        d: 4,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      expectedResult: {
        allOf: [
          {
            anyOf: ['test-rule-1:a/1', 'test-rule-2:{"b":2}'],
          },
          {
            not: {
              allOf: ['test-rule-1:c/3', { not: 'test-rule-2:{"d":4}' }],
            },
          },
        ],
      },
    },
  ];

  it.each(testCases)(
    'works with criteria %#',
    ({ conditions, expectedResult }) => {
      expect(transformConditions(conditions)).toEqual(expectedResult);
    },
  );
});
