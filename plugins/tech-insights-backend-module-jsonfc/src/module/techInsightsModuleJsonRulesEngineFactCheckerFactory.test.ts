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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { techInsightsFactCheckerFactoryExtensionPoint } from '@backstage/plugin-tech-insights-node';
import { JSON_RULE_ENGINE_CHECK_TYPE } from '../constants';
import { techInsightsModuleJsonRulesEngineFactCheckerFactory } from './techInsightsModuleJsonRulesEngineFactCheckerFactory';

describe('techInsightsModuleJsonRulesEngineFactCheckerFactory', () => {
  it('should register the factory', async () => {
    const extensionPoint = {
      setFactCheckerFactory: jest.fn(),
    } satisfies Partial<typeof techInsightsFactCheckerFactoryExtensionPoint.T>;

    await startTestBackend({
      extensionPoints: [
        [techInsightsFactCheckerFactoryExtensionPoint, extensionPoint],
      ],
      features: [
        techInsightsModuleJsonRulesEngineFactCheckerFactory(),
        mockServices.logger.factory(),
        mockServices.rootConfig.factory({
          data: {
            techInsights: {
              factChecker: {
                checks: {
                  groupOwnerCheck: {
                    type: JSON_RULE_ENGINE_CHECK_TYPE,
                    name: 'Group Owner Check',
                    description:
                      'Verifies that a group has been set as the spec.owner for this entity',
                    factIds: ['entityOwnershipFactRetriever'],
                    rule: {
                      conditions: {
                        all: [
                          {
                            fact: 'hasGroupOwner',
                            operator: 'equal',
                            value: true,
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ],
    });

    expect(extensionPoint.setFactCheckerFactory).toHaveBeenCalled();
  });
});
