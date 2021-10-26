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

import { Service, Incident, ChangeEvent, OnCall } from '../components/types';
import {
  PagerDutyApi,
  TriggerAlarmRequest,
  ServiceResponse,
  IncidentsResponse,
  OnCallsResponse,
  ClientApiConfig,
  RequestOptions,
  ChangeEventsResponse,
} from './types';
import {
  createApiRef,
  DiscoveryApi,
  ConfigApi,
} from '@backstage/core-plugin-api';

export class UnauthorizedError extends Error {}

export const pagerDutyApiRef = createApiRef<PagerDutyApi>({
  id: 'plugin.pagerduty.api',
  description: 'Used to fetch data from PagerDuty API',
});

export class PagerDutyClient implements PagerDutyApi {
  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const apiBaseUrl: string =
      configApi.getOptionalString('pagerDuty.apiBaseUrl') ??
      'https://api.pagerduty.com';
    return new PagerDutyClient({
      apiBaseUrl,
      discoveryApi,
    });
  }
  constructor(private readonly config: ClientApiConfig) {}

  async getServiceByServiceId(serviceId: string): Promise<Service> {
    const params = `time_zone=UTC&include[]=integrations&include[]=escalation_policies`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/services/${serviceId}?${params}`;
    const { service } = await this.getByUrl<ServiceResponse>(url);

    return service;
  }

  async getIncidentsByServiceId(serviceId: string): Promise<Incident[]> {
    const params = `time_zone=UTC&sort_by=created_at&statuses[]=triggered&statuses[]=acknowledged&service_ids[]=${serviceId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/incidents?${params}`;
    const { incidents } = await this.getByUrl<IncidentsResponse>(url);

    return incidents;
  }

  async getChangeEventsByServiceId(serviceId: string): Promise<ChangeEvent[]> {
    const params = `limit=5&time_zone=UTC&sort_by=timestamp`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/services/${serviceId}/change_events?${params}`;

    const { change_events } = await this.getByUrl<ChangeEventsResponse>(url);

    return change_events;
  }

  async getOnCallByPolicyId(policyId: string): Promise<OnCall[]> {
    const params = `time_zone=UTC&include[]=users&escalation_policy_ids[]=${policyId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/oncalls?${params}`;
    const { oncalls } = await this.getByUrl<OnCallsResponse>(url);

    return oncalls;
  }

  triggerAlarm({
    serviceId,
    title,
    from,
    description,
  }: TriggerAlarmRequest): Promise<Response> {
    const body = JSON.stringify({
      incident: {
        incident: 'incident',
        title: title,
        service: {
          id: serviceId,
          type: 'service_reference',
        },
      },
      urgency: 'high',
      body: {
        type: 'incident_body',
        details: description,
      },
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        From: from,
        Accept: 'application/json, text/plain, */*',
      },
      body,
    };

    const url = this.config.apiBaseUrl ?? 'https://api.pagerduty.com';

    return this.request(`${url}/incidents`, options);
  }

  private async getByUrl<T>(url: string): Promise<T> {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        'Content-Type': 'application/json',
      },
    };
    const response = await this.request(url, options);
    return response.json();
  }

  private async request(
    url: string,
    options: RequestOptions,
  ): Promise<Response> {
    const response = await fetch(url, options);
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    if (!response.ok) {
      const payload = await response.json();
      const errors = payload.errors.map((error: string) => error).join(' ');
      const message = `Request failed with ${response.status}, ${errors}`;
      throw new Error(message);
    }
    return response;
  }
}
