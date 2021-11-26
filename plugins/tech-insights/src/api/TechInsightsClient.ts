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

import { TechInsightsApi } from './TechInsightsApi';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Check } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { EntityName } from '@backstage/catalog-model';

import {
  CheckResultRenderer,
  defaultCheckResultRenderers,
} from '../components/CheckResultRenderer';

export type Options = {
  discoveryApi: DiscoveryApi;
};

export class TechInsightsClient implements TechInsightsApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
  }

  getScorecardsDefinition(
    type: string,
    value: CheckResult[],
  ): CheckResultRenderer | undefined {
    const resultRenderers = defaultCheckResultRenderers(value);
    return resultRenderers.find(d => d.type === type);
  }

  async getAllChecks(): Promise<Check[]> {
    const url = await this.discoveryApi.getBaseUrl('tech-insights');
    const response = await fetch(`${url}/checks`);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }

  async runChecks(
    entityParams: EntityName,
    checks: Check[],
  ): Promise<CheckResult[]> {
    const url = await this.discoveryApi.getBaseUrl('tech-insights');
    const { namespace, kind, name } = entityParams;
    const allChecks = checks ? checks : await this.getAllChecks();
    const checkIds = allChecks.map((check: Check) => check.id);
    const response = await fetch(
      `${url}/checks/run/${encodeURIComponent(namespace)}/${encodeURIComponent(
        kind,
      )}/${encodeURIComponent(name)}`,
      {
        method: 'POST',
        body: JSON.stringify({ checks: checkIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
}
