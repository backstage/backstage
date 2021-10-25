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
  TechInsightCheckRegistry,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-common';
import {
  JSON_RULE_ENGINE_CHECK_TYPE,
  JsonRulesEngineFactCheckerFactory,
} from '../index';
import { getVoidLogger } from '@backstage/backend-common';
import { TechInsightJsonRuleCheck } from '../types';

const testChecks: Record<string, TechInsightJsonRuleCheck[]> = {
  broken: [
    {
      id: 'brokenTestCheck',
      name: 'brokenTestCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Broken Check For Testing',
      factIds: ['test-factretriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'testnumberfact',
              operator: 'largerThan',
              value: 1,
            },
          ],
        },
      },
    },
  ],
  broken2: [
    {
      id: 'brokenTestCheck2',
      name: 'brokenTestCheck2',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Second Broken Check For Testing',
      factIds: ['non-existing-factretriever'],
      rule: {
        conditions: {
          any: [
            {
              fact: 'somefact',
              operator: 'lessThan',
              value: 1,
            },
          ],
        },
      },
    },
  ],
  simple: [
    {
      id: 'simpleTestCheck',
      name: 'simpleTestCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Simple Check For Testing',
      factIds: ['test-factretriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'testnumberfact',
              operator: 'lessThan',
              value: 5,
            },
          ],
        },
      },
    },
  ],

  simple2: [
    {
      id: 'simpleTestCheck2',
      name: 'simpleTestCheck2',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Second Simple Check For Testing',
      factIds: ['test-factretriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'testnumberfact',
              operator: 'greaterThan',
              value: 2,
            },
          ],
        },
      },
    },
  ],
};

const latestSchemasMock = jest.fn().mockImplementation(() => [
  {
    version: '0.0.1',
    id: 2,
    ref: 'test-factretriever',
    entityTypes: ['component'],
    testnumberfact: {
      type: 'integer',
      description: '',
    },
  },
]);
const factsBetweenTimestampsByIdsMock = jest.fn();
const latestFactsByIdsMock = jest.fn().mockImplementation(() => ({}));
const mockCheckRegistry = {
  getAll(checks: string[]) {
    return checks.flatMap(check => testChecks[check]);
  },
} as unknown as TechInsightCheckRegistry<TechInsightJsonRuleCheck>;

const mockRepository: TechInsightsStore = {
  getLatestFactsByIds: latestFactsByIdsMock,
  getFactsBetweenTimestampsByIds: factsBetweenTimestampsByIdsMock,
  getLatestSchemas: latestSchemasMock,
} as unknown as TechInsightsStore;

describe('JsonRulesEngineFactChecker', () => {
  const factChecker = new JsonRulesEngineFactCheckerFactory({
    checkRegistry: mockCheckRegistry,
    checks: [],
    logger: getVoidLogger(),
  }).construct(mockRepository);

  describe('when running checks', () => {
    it('should throw on incorrectly configured checks conditions', async () => {
      const cur = async () => await factChecker.runChecks('a/a/a', ['broken']);
      await expect(cur()).rejects.toThrowError(
        'Failed to run rules engine, Unknown operator: largerThan',
      );
    });

    it('should handle cases where wrong facts are referenced', async () => {
      const cur = async () => await factChecker.runChecks('a/a/a', ['broken2']);
      await expect(cur()).rejects.toThrowError(
        'Failed to run rules engine, Undefined fact: somefact',
      );
    });
    it('should respond with result, facts, fact schemas and checks', async () => {
      latestFactsByIdsMock.mockImplementation(() =>
        Promise.resolve({
          ['test-factretriever']: {
            id: 'test-factretriever',
            facts: {
              testnumberfact: 3,
            },
          },
        }),
      );
      const results = await factChecker.runChecks('a/a/a', ['simple']);
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        facts: {
          testnumberfact: {
            value: 3,
            type: 'integer',
            description: '',
          },
        },
        result: true,
        check: {
          id: 'simpleTestCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'simpleTestCheck',
          description: 'Simple Check For Testing',
          factIds: ['test-factretriever'],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'testnumberfact',
                  factResult: 3,
                  operator: 'lessThan',
                  result: true,
                  value: 5,
                },
              ],
              priority: 1,
            },
          },
        },
      });
    });

    it('should gracefully handle multiple check at once', async () => {
      latestFactsByIdsMock.mockImplementation(() =>
        Promise.resolve({
          ['test-factretriever']: {
            id: 'test-factretriever',
            facts: {
              testnumberfact: 3,
            },
          },
        }),
      );
      const results = await factChecker.runChecks('a/a/a', [
        'simple',
        'simple2',
      ]);
      expect(results).toMatchObject([
        {
          facts: {
            testnumberfact: {
              value: 3,
              type: 'integer',
              description: '',
            },
          },
          result: true,
          check: {
            id: 'simpleTestCheck',
            type: JSON_RULE_ENGINE_CHECK_TYPE,
            name: 'simpleTestCheck',
            description: 'Simple Check For Testing',
            factIds: ['test-factretriever'],
            rule: {
              conditions: {
                priority: 1,
                all: [
                  {
                    operator: 'lessThan',
                    value: 5,
                    fact: 'testnumberfact',
                    factResult: 3,
                    result: true,
                  },
                ],
              },
            },
          },
        },
        {
          facts: {
            testnumberfact: {
              value: 3,
              type: 'integer',
              description: '',
            },
          },
          result: true,
          check: {
            id: 'simpleTestCheck2',
            type: JSON_RULE_ENGINE_CHECK_TYPE,
            name: 'simpleTestCheck2',
            description: 'Second Simple Check For Testing',
            factIds: ['test-factretriever'],
            rule: {
              conditions: {
                priority: 1,
                all: [
                  {
                    operator: 'greaterThan',
                    value: 2,
                    fact: 'testnumberfact',
                    factResult: 3,
                    result: true,
                  },
                ],
              },
            },
          },
        },
      ]);
    });
  });

  describe('when validating checks', () => {
    it('should succeed on valid rules', async () => {
      const validationResponse = await factChecker.validate(
        testChecks.simple[0],
      );
      expect(validationResponse.valid).toBeTruthy();
    });
    it('should fail on broken rules', async () => {
      const validationResponse = await factChecker.validate(
        testChecks.broken[0],
      );
      expect(validationResponse.valid).toBeFalsy();
    });
  });
});
