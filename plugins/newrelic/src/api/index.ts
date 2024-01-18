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

import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';

import parseLinkHeader from 'parse-link-header';

export type NewRelicApplication = {
  id: number;
  application_summary: NewRelicApplicationSummary;
  name: string;
  language: string;
  health_status: string;
  reporting: boolean;
  settings: NewRelicApplicationSettings;
  links?: NewRelicApplicationLinks;
};

export type NewRelicApplicationSummary = {
  apdex_score: number;
  error_rate: number;
  host_count: number;
  instance_count: number;
  response_time: number;
  throughput: number;
};

export type NewRelicApplicationSettings = {
  app_apdex_threshold: number;
  end_user_apdex_threshold: number;
  enable_real_user_monitoring: boolean;
  use_server_side_config: boolean;
};

export type NewRelicApplicationLinks = {
  application_instances: Array<any>;
  servers: Array<any>;
  application_hosts: Array<any>;
};

export type NewRelicApplications = {
  applications: NewRelicApplication[];
};

export const newRelicApiRef = createApiRef<NewRelicApi>({
  id: 'plugin.newrelic.service',
});

const DEFAULT_PROXY_PATH_BASE = '/newrelic';

type Options = {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
  /**
   * Path to use for requests via the proxy, defaults to /newrelic
   */
  proxyPathBase?: string;
};

export interface NewRelicApi {
  getApplications(): Promise<NewRelicApplications>;
}

interface NewRelicPageReadResult {
  nextPageUrl: string | undefined;
  applicationsFromReadPage: NewRelicApplication[];
}

export class NewRelicClient implements NewRelicApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly proxyPathBase: string;
  private baseUrl: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.proxyPathBase = options.proxyPathBase ?? DEFAULT_PROXY_PATH_BASE;
    this.baseUrl = '';
  }

  async getApplications(): Promise<NewRelicApplications> {
    if (!this.baseUrl) {
      const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
      this.baseUrl = `${proxyUrl}${this.proxyPathBase}/apm/api/applications.json`;
    }

    const applications: NewRelicApplication[] = [];
    let targetUrl = this.baseUrl;

    do {
      const { nextPageUrl, applicationsFromReadPage } =
        await this.fetchNewRelic(targetUrl);

      targetUrl = nextPageUrl ?? '';
      applications.push(...applicationsFromReadPage);
    } while (!!targetUrl);

    return { applications };
  }

  private async fetchNewRelic(
    targetUrl: string,
  ): Promise<NewRelicPageReadResult> {
    const response = await this.fetchApi.fetch(targetUrl);

    if (!response.ok) {
      let specificErrorTitle = undefined;
      try {
        specificErrorTitle = (await response.json())?.error?.title;
      } catch (e) {
        /* empty */
      }

      throw new Error(
        `Error communicating with New Relic: ${
          specificErrorTitle || response.statusText
        }`,
      );
    }

    const readResponse = (await response.json()) as NewRelicApplications;
    const linkHeader = response.headers.get('link');
    const parseResult = parseLinkHeader(linkHeader);
    const nextPageNumber = parseResult?.next?.page;

    return {
      nextPageUrl: nextPageNumber && `${this.baseUrl}?page=${nextPageNumber}`,
      applicationsFromReadPage: readResponse.applications,
    };
  }
}
