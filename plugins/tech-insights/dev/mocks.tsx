/*
 * Copyright 2023 The Backstage Authors
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
import React from 'react';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { BooleanCheck, CheckResultRenderer } from '../src';

export const runChecksResponse = [
  {
    facts: {
      'fact-id': {
        id: '1',
        type: 'boolean',
        description: 'fact description',
        value: true,
      },
    },
    check: {
      id: 'fact-id',
      type: 'boolean',
      name: 'The check name',
      description: `The check description  \nusing markdown **bold** and a [link](https://backstage.io)`,
      factIds: ['1'],
    },
    result: true,
  } as CheckResult,
];

export const checkResultRenderers = [
  {
    type: 'boolean',
    component: (check: CheckResult) => <BooleanCheck checkResult={check} />,
  } as CheckResultRenderer,
];
