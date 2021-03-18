/*
 * Copyright 2020 Spotify AB
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

import { createApiRef, DiscoveryApi } from '@backstage/core';
import { Config } from '@backstage/config';

export const chromeuxReportApiRef = createApiRef<ChromeUXReportApi>({
  id: 'plugin.chromeuxreport.service',
  description: 'Used to make requests towards ChromeUXReport API',
});

export type ChromeUXReport = {
  getChromeUXMetrics(origin: string): Promise<string>;
};

/**
 * API to talk to chrome-ux-report-backend.
 *
 * @property {string} apiOrigin Set to chromeuxreport.requestUrl as the URL for chrome-ux-report-backend API
 */
export class ChromeUXReportApi implements ChromeUXReport {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('chromeuxreport.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('chromeuxreport'))
    );
  }

  async getChromeUXMetrics(origin: string): Promise<any> {
    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metrics`;

    const request = await fetch(`${requestUrl}`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        origin,
        month: '202009',
      }),
    });
    return await request.json();
  }
}
