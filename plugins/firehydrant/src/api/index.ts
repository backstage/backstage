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
import {
  ServiceAnalyticsResponse,
  ServiceDetailsResponse,
  ServiceIncidentsResponse,
} from './types';
import { Incident, Service } from '../components/types';
import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export interface FireHydrantAPI {
  getServiceAnalytics(options: {
    serviceId: string;
    startDate: string;
    endDate: string;
  }): Promise<ServiceAnalyticsResponse>;

  getServiceDetails(options: {
    serviceName: string;
  }): Promise<ServiceDetailsResponse>;

  getServiceIncidents(options: {
    serviceId: string;
  }): Promise<ServiceIncidentsResponse>;
}

export const fireHydrantApiRef = createApiRef<FireHydrantAPI>({
  id: 'plugin.firehydrant.service',
  description: 'Used by FireHydrant plugin for requests',
});

export type Options = {
  discoveryApi: DiscoveryApi;
  proxyPath?: string;
};

const DEFAULT_PROXY_PATH = '/firehydrant/api';

export class FireHydrantAPIClient implements FireHydrantAPI {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.proxyPath = options.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  async getServiceAnalytics(options: {
    serviceId: string;
    startDate: string;
    endDate: string;
  }): Promise<ServiceAnalyticsResponse> {
    const proxyUrl = await this.getApiUrl();
    const response = await fetch(
      `${proxyUrl}/metrics/services/${options.serviceId}?start_date=${options.startDate}&end_date=${options.endDate}`,
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching FireHydrant analytics data: ${response.statusText}`,
      );
    }
    const json = await response.json();
    return json;
  }

  async getServiceDetails(options: {
    serviceName: string;
  }): Promise<ServiceDetailsResponse> {
    const proxyUrl = await this.getApiUrl();
    const response = await fetch(
      `${proxyUrl}/services?query=${options.serviceName}`,
    );

    if (!response.ok) {
      throw new Error(
        `There was a problem fetching FireHydrant data: ${response.statusText}`,
      );
    }

    const json = await response.json();

    const servicesData: ServiceDetailsResponse = {
      service: {} as Service,
      incidents: [] as Incident[],
    };

    if (json.data?.length === 0) {
      return servicesData;
    }

    servicesData.service = json.data[0];

    const incidentsJson = await this.getServiceIncidents({
      serviceId: json.data[0].id,
    });

    servicesData.incidents = incidentsJson;

    return servicesData;
  }

  async getServiceIncidents(options: {
    serviceId: string;
  }): Promise<ServiceIncidentsResponse> {
    const proxyUrl = await this.getApiUrl();
    const response = await fetch(
      `${proxyUrl}/incidents?services=${options.serviceId}&active=true`,
    );
    if (!response.ok) {
      throw new Error(
        `There was a problem fetching FireHydrant incidents data: ${response.statusText}`,
      );
    }

    const json = await response.json();
    return json.data;
  }

  private async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
