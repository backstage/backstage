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
import {
  BulkCheckResponse,
  CheckResult,
} from '@backstage/plugin-tech-insights-common';
import { Check } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { CompoundEntityRef } from '@backstage/catalog-model';

import {
  CheckResultRenderer,
  defaultCheckResultRenderers,
} from '../components/CheckResultRenderer';

/** @public */
export class TechInsightsClient implements TechInsightsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  getScorecardsDefinition(
    type: string,
    value: CheckResult[],
    title?: string,
    description?: string,
  ): CheckResultRenderer | undefined {
    const resultRenderers = defaultCheckResultRenderers(
      value,
      title,
      description,
    );
    return resultRenderers.find(d => d.type === type);
  }

  async getAllChecks(): Promise<Check[]> {
    const url = await this.discoveryApi.getBaseUrl('tech-insights');
    const { token } = await this.identityApi.getCredentials();
    const response = await fetch(`${url}/checks`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }

  async runChecks(
    entityParams: CompoundEntityRef,
    checks?: string[],
  ): Promise<CheckResult[]> {
    const url = await this.discoveryApi.getBaseUrl('tech-insights');
    const { token } = await this.identityApi.getCredentials();
    const { namespace, kind, name } = entityParams;
    const requestBody = { checks };
    const response = await fetch(
      `${url}/checks/run/${encodeURIComponent(namespace)}/${encodeURIComponent(
        kind,
      )}/${encodeURIComponent(name)}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }

  async runBulkChecks(
    entities: CompoundEntityRef[],
    checks?: Check[],
  ): Promise<BulkCheckResponse> {
    const url = await this.discoveryApi.getBaseUrl('tech-insights');
    const { token } = await this.identityApi.getCredentials();
    const checkIds = checks ? checks.map(check => check.id) : [];
    const requestBody = {
      entities,
      checks: checkIds.length > 0 ? checkIds : undefined,
    };
    const response = await fetch(`${url}/checks/run`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
}
