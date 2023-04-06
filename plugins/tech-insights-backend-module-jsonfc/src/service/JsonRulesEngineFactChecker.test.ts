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
} from '@backstage/plugin-tech-insights-node';
import {
  JSON_RULE_ENGINE_CHECK_TYPE,
  JsonRulesEngineFactCheckerFactory,
} from '../index';
import { getVoidLogger } from '@backstage/backend-common';
import { TechInsightJsonRuleCheck } from '../types';
import { Operator } from 'json-rules-engine';

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
      factIds: ['test-factretriever'],
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
  brokennotfound: [
    {
      id: 'brokenTestCheckNotFound',
      name: 'brokenTestCheckNotFound',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Third Broken Check For Testing',
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

  twoRetrieversSame: [
    {
      id: 'twoRetrieversSameCheck',
      name: 'twoRetrieversSameCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Two Retriever Check For Testing',
      factIds: [
        'test-factretriever',
        'test-factretriever-same-fact',
        'non-existing-factretriever',
      ],
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

  twoRetrieversDifferent: [
    {
      id: 'twoRetrieversDifferentCheck',
      name: 'twoRetrieversDifferentCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Two Retriever Check For Testing',
      factIds: ['test-factretriever-different-fact', 'test-factretriever'],
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

  twoRetrieversDifferentOrder: [
    {
      id: 'twoRetrieversDifferentOrderCheck',
      name: 'twoRetrieversDifferentOrderCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Two Retriever Check For Testing',
      factIds: ['test-factretriever', 'test-factretriever-different-fact'],
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

  twoRetrieversOnlyOneData: [
    {
      id: 'twoRetrieversOnlyOneDataCheck',
      name: 'twoRetrieversOnlyOneDataCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Two Retriever Check For Testing',
      factIds: [
        'test-factretriever',
        'test-factretriever-no-fact',
        'non-existing-factretriever',
      ],
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

  customOperator: [
    {
      id: 'customOperatorTestCheck',
      name: 'customOperatorTestCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description: 'Check For Testing using Custom Operator',
      factIds: ['test-factretriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'testnumberfact',
              operator: 'isDivisibleBy',
              value: 2,
            },
          ],
        },
      },
    },
  ],

  invalidCustomOperator: [
    {
      id: 'invalidCustomOperatorTestCheck',
      name: 'invalidCustomOperatorTestCheck',
      type: JSON_RULE_ENGINE_CHECK_TYPE,
      description:
        'Check For Testing using a Custom Operator that is not registered',
      factIds: ['test-factretriever'],
      rule: {
        conditions: {
          all: [
            {
              fact: 'testnumberfact',
              operator: 'isOdd',
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
  {
    version: '0.0.1',
    id: 3,
    ref: 'test-factretriever-no-fact',
    entityTypes: ['component'],
    testnumberfact: {
      type: 'integer',
      description: '',
    },
  },
  {
    version: '0.0.1',
    id: 4,
    ref: 'test-factretriever-same-fact',
    entityTypes: ['component'],
    testnumberfact: {
      type: 'integer',
      description: '',
    },
  },
  {
    version: '0.0.1',
    id: 5,
    ref: 'test-factretriever-different-fact',
    entityTypes: ['users'],
    testnumberfact: {
      type: 'integer',
      description: '',
    },
  },
]);
const factsBetweenTimestampsByIdsMock = jest.fn();
const latestFactsByIdsMock = jest
  .fn()
  .mockImplementation((factIds: string[]) => {
    const facts = [
      {
        id: 'test-factretriever-different-fact',
        facts: {
          testnumberfact: 1,
        },
      },
      {
        id: 'test-factretriever-same-fact',
        facts: {
          testnumberfact: 3,
        },
      },
      {
        id: 'test-factretriever',
        facts: {
          testnumberfact: 3,
        },
      },
      {
        id: 'test-factretriever-no-fact',
        facts: {},
      },
    ];

    const factResults = Object.fromEntries(
      factIds
        .map(factId => facts.filter(fact => fact.id === factId))
        .flat()
        .map(fact => [fact.id, fact]),
    );

    return factResults;
  });
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
    operators: [
      new Operator<number, number>('isDivisibleBy', (a, b) => a % b === 0),
    ],
    logger: getVoidLogger(),
  }).construct(mockRepository);

  describe('when running checks', () => {
    it('should throw on incorrectly configured checks conditions', async () => {
      const cur = async () => await factChecker.runChecks('a/a/a', ['broken']);
      await expect(cur()).rejects.toThrow(
        'Failed to run rules engine, Unknown operator: largerThan',
      );
    });

    it('should handle cases where wrong facts are referenced', async () => {
      const cur = async () => await factChecker.runChecks('a/a/a', ['broken2']);
      await expect(cur()).rejects.toThrow(
        'Failed to run rules engine, Undefined fact: somefact',
      );
    });

    it('should skip checks where fact data is missing', async () => {
      const skipped = async () =>
        await factChecker.runChecks('a/a/a', ['brokennotfound']);
      await expect(skipped()).resolves.toEqual([]);

      const partial = async () =>
        await factChecker.runChecks('a/a/a', ['brokennotfound', 'simple']);
      await expect(partial()).resolves.toEqual([
        expect.objectContaining({
          check: expect.objectContaining({ id: 'simpleTestCheck' }),
        }),
      ]);
    });

    it('should respond with result, facts, fact schemas and checks', async () => {
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

    it('should respond with result, facts, fact schemas and checks for multiple retrievers', async () => {
      const results = await factChecker.runChecks('a/a/a', [
        'twoRetrieversSame',
      ]);
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
          id: 'twoRetrieversSameCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'twoRetrieversSameCheck',
          description: 'Two Retriever Check For Testing',
          factIds: [
            'test-factretriever',
            'test-factretriever-same-fact',
            'non-existing-factretriever',
          ],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'testnumberfact',
                  factResult: 3,
                  operator: 'greaterThan',
                  result: true,
                  value: 2,
                },
              ],
              priority: 1,
            },
          },
        },
      });
    });

    it('should respond with result, facts, fact schemas and checks for multiple retrievers with the last fact winning', async () => {
      const results = await factChecker.runChecks('a/a/a', [
        'twoRetrieversDifferent',
        'twoRetrieversDifferentOrder',
      ]);

      expect(results).toHaveLength(2);
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
          id: 'twoRetrieversDifferentCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'twoRetrieversDifferentCheck',
          description: 'Two Retriever Check For Testing',
          factIds: ['test-factretriever-different-fact', 'test-factretriever'],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'testnumberfact',
                  factResult: 3,
                  operator: 'greaterThan',
                  result: true,
                  value: 2,
                },
              ],
              priority: 1,
            },
          },
        },
      });
      expect(results[1]).toMatchObject({
        facts: {
          testnumberfact: {
            value: 3,
            type: 'integer',
            description: '',
          },
        },
        result: true,
        check: {
          id: 'twoRetrieversDifferentOrderCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'twoRetrieversDifferentOrderCheck',
          description: 'Two Retriever Check For Testing',
          factIds: ['test-factretriever', 'test-factretriever-different-fact'],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'testnumberfact',
                  factResult: 3,
                  operator: 'greaterThan',
                  result: true,
                  value: 2,
                },
              ],
              priority: 1,
            },
          },
        },
      });
    });

    it('the ordering of the factIds do not effect the result, its just which fact is last.', async () => {
      const resultsDIfferentFirst = await factChecker.runChecks('a/a/a', [
        'twoRetrieversDifferent',
      ]);
      const resultsDIfferentSecond = await factChecker.runChecks('a/a/a', [
        'twoRetrieversDifferentOrder',
      ]);

      expect(resultsDIfferentFirst[0].result).not.toEqual(
        resultsDIfferentSecond[0].result,
      );
    });

    it('should respond with result, facts, fact schemas and checks for multiple retrievers one without data', async () => {
      const results = await factChecker.runChecks('a/a/a', [
        'twoRetrieversOnlyOneData',
      ]);
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
          id: 'twoRetrieversOnlyOneDataCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'twoRetrieversOnlyOneDataCheck',
          description: 'Two Retriever Check For Testing',
          factIds: [
            'test-factretriever',
            'test-factretriever-no-fact',
            'non-existing-factretriever',
          ],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'testnumberfact',
                  factResult: 3,
                  operator: 'greaterThan',
                  result: true,
                  value: 2,
                },
              ],
              priority: 1,
            },
          },
        },
      });
    });

    it('should use custom operators when defined', async () => {
      const results = await factChecker.runChecks('a/a/a', ['customOperator']);
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        facts: {
          testnumberfact: {
            value: 3,
            type: 'integer',
            description: '',
          },
        },
        result: false,
        check: {
          id: 'customOperatorTestCheck',
          type: JSON_RULE_ENGINE_CHECK_TYPE,
          name: 'customOperatorTestCheck',
          description: 'Check For Testing using Custom Operator',
          factIds: ['test-factretriever'],
          rule: {
            conditions: {
              all: [
                {
                  fact: 'testnumberfact',
                  factResult: 3,
                  operator: 'isDivisibleBy',
                  result: false,
                  value: 2,
                },
              ],
              priority: 1,
            },
          },
        },
      });
    });

    it('should gracefully handle multiple check at once', async () => {
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
    [testChecks.simple[0], testChecks.customOperator[0]].forEach(check => {
      it(`should succeed on valid rule: ${check.name}`, async () => {
        const validationResponse = await factChecker.validate(check);
        expect(validationResponse.valid).toBeTruthy();
      });
    });

    [testChecks.broken[0], testChecks.invalidCustomOperator[0]].forEach(
      check => {
        it(`should fail on broken rules: ${check.name}`, async () => {
          const validationResponse = await factChecker.validate(
            testChecks.broken[0],
          );
          expect(validationResponse.valid).toBeFalsy();
        });
      },
    );
  });
});
