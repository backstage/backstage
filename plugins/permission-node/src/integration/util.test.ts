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
      mapConditions: PermissionCriteria<{ query: string; params: unknown[] }>;
    };
  }[] = [
    {
      criteria: { rule: 'test-rule-1', params: [] },
      expectedResult: {
        applyConditions: true,
        mapConditions: { query: 'test-rule-1', params: [] },
      },
    },
    {
      criteria: { rule: 'test-rule-2', params: [] },
      expectedResult: {
        applyConditions: false,
        mapConditions: { query: 'test-rule-2', params: [] },
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
          anyOf: [
            { query: 'test-rule-1', params: ['a', 'b'] },
            { query: 'test-rule-2', params: ['c', 'd'] },
          ],
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
          allOf: [
            { query: 'test-rule-1', params: ['e', 'f'] },
            { query: 'test-rule-2', params: ['g', 'h'] },
          ],
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
          not: { query: 'test-rule-2', params: ['i'] },
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
              anyOf: [
                { query: 'test-rule-1', params: ['j'] },
                { query: 'test-rule-2', params: ['k'] },
              ],
            },
            {
              not: {
                allOf: [
                  { query: 'test-rule-1', params: ['l'] },
                  { query: 'test-rule-2', params: ['m'] },
                ],
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
              anyOf: [
                { query: 'test-rule-1', params: ['j'] },
                { query: 'test-rule-2', params: ['k'] },
              ],
            },
            {
              not: {
                allOf: [
                  { query: 'test-rule-1', params: ['l'] },
                  { not: { query: 'test-rule-2', params: ['m'] } },
                ],
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
    const mapFn = jest.fn(({ rule, params }) => ({ query: rule, params }));

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
