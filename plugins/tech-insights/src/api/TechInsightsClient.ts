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
import { Check, InsightFact } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { CompoundEntityRef } from '@backstage/catalog-model';

import {
  CheckResultRenderer,
  jsonRulesEngineCheckResultRenderer,
} from '../components/CheckResultRenderer';

/** @public */
export class TechInsightsClient implements TechInsightsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly renderers?: CheckResultRenderer[];

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    renderers?: CheckResultRenderer[];
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.renderers = options.renderers;
  }

  async getLatestFacts(
    entity: CompoundEntityRef,
    facts: string[],
  ): Promise<InsightFact> {
    const { namespace, kind, name } = entity;
    const entityQuery = `entity=${encodeURIComponent(
      kind.toLocaleLowerCase('en-US'),
    )}:${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`;
    const idsQuery = facts.map(id => `ids[]=${id}`).join('&');
    return await this.api<InsightFact>(
      `/facts/latest?${entityQuery}&${idsQuery}`,
    );
  }

  getCheckResultRenderers(types: string[]): CheckResultRenderer[] {
    const renderers = this.renderers ?? [jsonRulesEngineCheckResultRenderer];
    return renderers.filter(d => types.includes(d.type));
  }

  async getAllChecks(): Promise<Check[]> {
    return this.api('/checks');
  }

  async runChecks(
    entityParams: CompoundEntityRef,
    checks?: string[],
  ): Promise<CheckResult[]> {
    const { namespace, kind, name } = entityParams;
    const requestBody = { checks };
    return this.api(
      `/checks/run/${encodeURIComponent(namespace)}/${encodeURIComponent(
        kind,
      )}/${encodeURIComponent(name)}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      },
    );
  }

  async runBulkChecks(
    entities: CompoundEntityRef[],
    checks?: Check[],
  ): Promise<BulkCheckResponse> {
    const checkIds = checks ? checks.map(check => check.id) : [];
    const requestBody = {
      entities,
      checks: checkIds.length > 0 ? checkIds : undefined,
    };
    return this.api('/checks/run', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  private async api<T>(path: string, init?: RequestInit): Promise<T> {
    const url = await this.discoveryApi.getBaseUrl('tech-insights');
    const { token } = await this.identityApi.getCredentials();

    return fetch(`${url}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(async response => {
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }
      return response.json() as Promise<T>;
    });
  }
}
