/*
 * Copyright 2020 The Backstage Authors
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

import fetch from 'cross-fetch';
import { FindingSummary, Metrics, SonarQubeApi } from './SonarQubeApi';
import { FindingsWrapper } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class SonarQubeClient implements SonarQubeApi {
  discoveryApi: DiscoveryApi;
  baseUrl: string;
  identityApi: IdentityApi;

  constructor({
    discoveryApi,
    identityApi,
    baseUrl = 'https://sonarcloud.io/',
  }: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    baseUrl?: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T | undefined> {
    const { token: idToken } = await this.identityApi.getCredentials();

    const apiUrl = `${await this.discoveryApi.getBaseUrl('sonarqube')}`;
    const response = await fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
      },
    );
    if (response.status === 200) {
      return (await response.json()) as T;
    }
    return undefined;
  }

  async getFindingSummary(
    componentKey?: string,
  ): Promise<FindingSummary | undefined> {
    if (!componentKey) {
      return undefined;
    }

    const metrics: Metrics = {
      alert_status: undefined,
      bugs: undefined,
      reliability_rating: undefined,
      vulnerabilities: undefined,
      security_rating: undefined,
      security_hotspots_reviewed: undefined,
      security_review_rating: undefined,
      code_smells: undefined,
      sqale_rating: undefined,
      coverage: undefined,
      duplicated_lines_density: undefined,
    };

    const findings = await this.callApi<FindingsWrapper>('findings', {
      componentKey: componentKey,
    });
    if (!findings) {
      return undefined;
    }

    findings.measures.forEach(m => {
      metrics[m.metric] = m.value;
    });

    return {
      lastAnalysis: findings.analysisDate,
      metrics,
      projectUrl: `${this.baseUrl}dashboard?id=${encodeURIComponent(
        componentKey,
      )}`,
      getIssuesUrl: identifier =>
        `${this.baseUrl}project/issues?id=${encodeURIComponent(
          componentKey,
        )}&types=${identifier.toLocaleUpperCase('en-US')}&resolved=false`,
      getComponentMeasuresUrl: identifier =>
        `${this.baseUrl}component_measures?id=${encodeURIComponent(
          componentKey,
        )}&metric=${identifier.toLocaleLowerCase(
          'en-US',
        )}&resolved=false&view=list`,
      getSecurityHotspotsUrl: () =>
        `${this.baseUrl}project/security_hotspots?id=${encodeURIComponent(
          componentKey,
        )}`,
    };
  }
}
