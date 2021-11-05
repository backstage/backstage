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

import { ScorecardsApi } from './ScorecardsApi';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Check } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
import {
  CheckResultRenderer,
  defaultCheckResultRenderers,
} from '../components/CheckResultRenderer';

export type Options = {
  discoveryApi: DiscoveryApi;
  proxyPath?: string;
};

export class ScorecardsClient implements ScorecardsApi {
  private readonly discoveryApi: DiscoveryApi;
  private baseUrl: string = '';

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

  getBaseUrl: () => Promise<string> = async () => {
    if (!this.baseUrl) {
      this.baseUrl = await this.discoveryApi.getBaseUrl('tech-insights');
    }
    return this.baseUrl;
  };

  async getAllChecks(): Promise<Check[]> {
    const url = await this.getBaseUrl();
    const allChecks = await fetch(`${url}/checks`);
    const payload = await allChecks.json();
    if (!allChecks.ok) {
      throw new Error(payload.errors[0]);
    }
    return payload;
  }

  async runChecks({
    namespace,
    kind,
    name,
    checks,
  }: {
    namespace: string;
    kind: string;
    name: string;
    checks: Check[];
  }): Promise<CheckResult[]> {
    const url = await this.getBaseUrl();
    const allChecks = checks ? checks : await this.getAllChecks();
    const checkIds = allChecks.map((check: Check) => check.id);
    const response = await fetch(
      `${url}/checks/run/${namespace}/${kind}/${name}`,
      {
        method: 'POST',
        body: JSON.stringify({ checks: checkIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const result = await response.json();
    return result;
  }
}
