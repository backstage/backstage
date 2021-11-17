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

import { createApiRef } from '@backstage/core-plugin-api';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Check } from './types';
import { CheckResultRenderer } from '../components/CheckResultRenderer';

export const scorecardsApiRef = createApiRef<ScorecardsApi>({
  id: 'plugin.scorecards.service',
  description: 'Used by the scorecards plugin to make requests',
});

export interface ScorecardsApi {
  getScorecardsDefinition: (
    type: string,
    value: CheckResult[],
  ) => CheckResultRenderer | undefined;
  getAllChecks(): Promise<Check[]>;
  runChecks({
    namespace,
    kind,
    name,
    checks,
  }: {
    namespace: string;
    kind: string;
    name: string;
    checks?: Check[];
  }): Promise<CheckResult[]>;
}
