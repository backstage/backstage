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

interface PaginationInformation {
  nextPageLink: string;
  relation: string;
}

interface NewRelicPageReadResult {
  hasMoreApplications: boolean;
  pagination: PaginationInformation | undefined;
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

    let targetUrl = this.baseUrl;
    let hasNextPage = true;

    try {
      let applications: NewRelicApplication[] = [];

      do {
        const { hasMoreApplications, pagination, applicationsFromReadPage } =
          await this.fetchNewRelic(targetUrl);

        hasNextPage = hasMoreApplications;
        targetUrl = hasNextPage ? pagination!.nextPageLink : '';
        applications = applications.concat(applicationsFromReadPage);
      } while (hasNextPage);

      return { applications };
    } catch (e) {
      return { applications: [] };
    }
  }

  private async fetchNewRelic(
    targetUrl: string,
  ): Promise<NewRelicPageReadResult> {
    const response = await this.fetchApi.fetch(targetUrl);
    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error communicating with New Relic: ${
          responseJson?.error?.title || response.statusText
        }`,
      );
    }

    const readResponse = responseJson as NewRelicApplications;
    const linkHeader = response.headers.get('link');
    const pagination = this.parseLinkHeader(linkHeader);

    return {
      hasMoreApplications: !!(pagination && pagination.relation === 'next'),
      pagination,
      applicationsFromReadPage: readResponse.applications,
    };
  }

  private parseLinkHeader(
    linkHeader: string | null,
  ): PaginationInformation | undefined {
    if (!linkHeader) {
      return undefined;
    }

    const nextRelevantLink = linkHeader.replaceAll(' ', '').split(',')[0];
    const linkParts = nextRelevantLink.match(/^<.+(\?page=.+)>;rel="(.+)"$/);
    const nextPageNumber = linkParts?.[1];
    const relation = linkParts?.[2];

    const nextPageLink = `${this.baseUrl}${nextPageNumber}`;
    const isValidLink = !!(linkParts && nextPageNumber && relation);

    if (!nextRelevantLink || !isValidLink) {
      return undefined;
    }

    return {
      nextPageLink,
      relation,
    };
  }
}
