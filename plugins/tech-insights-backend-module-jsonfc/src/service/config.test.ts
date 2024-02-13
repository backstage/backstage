/*
 * Copyright 2024 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { JSON_RULE_ENGINE_CHECK_TYPE } from '../constants';
import { readChecksFromConfig } from './config';

describe('config', () => {
  describe('readChecksFromConfig', () => {
    it('no config return empty checks array', () => {
      const config = new ConfigReader({});
      const checks = readChecksFromConfig(config);

      expect(checks).toHaveLength(0);
    });

    it('empty checks config return empty checks array', () => {
      const config = new ConfigReader({
        techInsights: {
          factChecker: {},
        },
      });
      const checks = readChecksFromConfig(config);

      expect(checks).toHaveLength(0);
    });

    it('with checks return parsed checks', () => {
      const config = new ConfigReader({
        techInsights: {
          factChecker: {
            checks: {
              fooCheck: {
                type: JSON_RULE_ENGINE_CHECK_TYPE,
                name: 'Foo Check',
                description: 'Verifies foo',
                factIds: ['fooFactRetriever'],
                rule: {
                  conditions: {
                    all: [
                      {
                        fact: 'numFoo',
                        operator: 'greaterThanInclusive',
                        value: 1,
                      },
                      {
                        fact: 'hasFoo',
                        operator: 'equal',
                        value: true,
                      },
                    ],
                  },
                },
              },
              barCheck: {
                type: JSON_RULE_ENGINE_CHECK_TYPE,
                name: 'Bar Check',
                description: 'Verifies bar',
                factIds: ['barFactRetriever'],
                rule: {
                  conditions: {
                    any: [
                      {
                        fact: 'barEnabled',
                        operator: 'equal',
                        value: false,
                      },
                      {
                        fact: 'hasBar',
                        operator: 'equal',
                        value: true,
                      },
                    ],
                  },
                },
              },
              bazCheck: {
                type: JSON_RULE_ENGINE_CHECK_TYPE,
                name: 'Baz Check',
                description: 'Verifies baz',
                factIds: ['bazFactRetriever'],
                rule: {
                  conditions: {
                    not: {
                      fact: 'bazConfig',
                      operator: 'equal',
                      value: { invalid: true },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const checks = readChecksFromConfig(config);

      expect(checks).toHaveLength(3);
      expect(checks.map(check => check.id)).toEqual([
        'fooCheck',
        'barCheck',
        'bazCheck',
      ]);

      const fooCheck = checks.find(check => check.id === 'fooCheck')!;
      expect(fooCheck.name).toEqual('Foo Check');
      expect(fooCheck.rule.conditions).toEqual({
        all: [
          {
            fact: 'numFoo',
            operator: 'greaterThanInclusive',
            value: 1,
          },
          {
            fact: 'hasFoo',
            operator: 'equal',
            value: true,
          },
        ],
      });

      const barCheck = checks.find(check => check.id === 'barCheck')!;
      expect(barCheck.name).toEqual('Bar Check');
      expect(barCheck.rule.conditions).toEqual({
        any: [
          {
            fact: 'barEnabled',
            operator: 'equal',
            value: false,
          },
          {
            fact: 'hasBar',
            operator: 'equal',
            value: true,
          },
        ],
      });

      const bazCheck = checks.find(check => check.id === 'bazCheck')!;
      expect(bazCheck.name).toEqual('Baz Check');
      expect(bazCheck.rule.conditions).toEqual({
        not: {
          fact: 'bazConfig',
          operator: 'equal',
          value: { invalid: true },
        },
      });
    });
  });
});
