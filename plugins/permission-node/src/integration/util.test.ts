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
import { applyConditions, mapConditions } from './util';

describe('integration utils', () => {
  const testCases: {
    criteria: PermissionCriteria<PermissionCondition>;
    expectedResult: {
      applyConditions: boolean;
      mapConditions: PermissionCriteria<string>;
    };
  }[] = [
    {
      criteria: { rule: 'test-rule-1', params: [] },
      expectedResult: {
        applyConditions: true,
        mapConditions: 'test-rule-1',
      },
    },
    {
      criteria: { rule: 'test-rule-2', params: [] },
      expectedResult: {
        applyConditions: false,
        mapConditions: 'test-rule-2',
      },
    },
    {
      criteria: {
        anyOf: [
          { rule: 'test-rule-1', params: ['a', 'b'] },
          { rule: 'test-rule-2', params: ['c', 'd'] },
        ],
      },
      expectedResult: {
        applyConditions: true,
        mapConditions: {
          anyOf: ['test-rule-1:a,b', 'test-rule-2:c,d'],
        },
      },
    },
    {
      criteria: {
        allOf: [
          { rule: 'test-rule-1', params: ['e', 'f'] },
          { rule: 'test-rule-2', params: ['g', 'h'] },
        ],
      },
      expectedResult: {
        applyConditions: false,
        mapConditions: {
          allOf: ['test-rule-1:e,f', 'test-rule-2:g,h'],
        },
      },
    },
    {
      criteria: {
        not: { rule: 'test-rule-2', params: ['i'] },
      },
      expectedResult: {
        applyConditions: true,
        mapConditions: {
          not: 'test-rule-2:i',
        },
      },
    },
    {
      criteria: {
        allOf: [
          {
            anyOf: [
              { rule: 'test-rule-1', params: ['j'] },
              { rule: 'test-rule-2', params: ['k'] },
            ],
          },
          {
            not: {
              allOf: [
                { rule: 'test-rule-1', params: ['l'] },
                { rule: 'test-rule-2', params: ['m'] },
              ],
            },
          },
        ],
      },
      expectedResult: {
        applyConditions: true,
        mapConditions: {
          allOf: [
            {
              anyOf: ['test-rule-1:j', 'test-rule-2:k'],
            },
            {
              not: {
                allOf: ['test-rule-1:l', 'test-rule-2:m'],
              },
            },
          ],
        },
      },
    },
    {
      criteria: {
        allOf: [
          {
            anyOf: [
              { rule: 'test-rule-1', params: ['j'] },
              { rule: 'test-rule-2', params: ['k'] },
            ],
          },
          {
            not: {
              allOf: [
                { rule: 'test-rule-1', params: ['l'] },
                { not: { rule: 'test-rule-2', params: ['m'] } },
              ],
            },
          },
        ],
      },
      expectedResult: {
        applyConditions: false,
        mapConditions: {
          allOf: [
            {
              anyOf: ['test-rule-1:j', 'test-rule-2:k'],
            },
            {
              not: {
                allOf: ['test-rule-1:l', { not: 'test-rule-2:m' }],
              },
            },
          ],
        },
      },
    },
  ];

  describe('applyConditions', () => {
    const applyFn = jest.fn(condition => condition.rule === 'test-rule-1');

    it('invokes applyFn with rules to determine result', () => {
      applyConditions({ rule: 'test-rule-1', params: ['foo', 'bar'] }, applyFn);

      expect(applyFn).toHaveBeenCalledWith({
        rule: 'test-rule-1',
        params: ['foo', 'bar'],
      });
    });

    it.each(testCases)(
      'works with criteria %#',
      ({ criteria, expectedResult }) => {
        expect(applyConditions(criteria, applyFn)).toEqual(
          expectedResult.applyConditions,
        );
      },
    );
  });

  describe('mapConditions', () => {
    const mapFn = jest.fn(
      ({ rule, params }) =>
        `${rule}${params.length ? `:${params.join(',')}` : ''}`,
    );

    it('invokes mapFn to transform conditions', () => {
      mapConditions({ rule: 'test-rule-1', params: ['foo', 'bar'] }, mapFn);

      expect(mapFn).toHaveBeenCalledWith({
        rule: 'test-rule-1',
        params: ['foo', 'bar'],
      });
    });

    it.each(testCases)(
      'works with criteria %#',
      ({ criteria, expectedResult }) => {
        expect(mapConditions(criteria, mapFn)).toEqual(
          expectedResult.mapConditions,
        );
      },
    );
  });
});
