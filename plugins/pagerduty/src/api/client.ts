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
  PagerDutyApi,
  PagerDutyTriggerAlarmRequest,
  PagerDutyServicesResponse,
  PagerDutyServiceResponse,
  PagerDutyIncidentsResponse,
  PagerDutyOnCallsResponse,
  PagerDutyClientApiDependencies,
  PagerDutyClientApiConfig,
  RequestOptions,
  PagerDutyChangeEventsResponse,
} from './types';
import { createApiRef, ConfigApi } from '@backstage/core-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { Entity } from '@backstage/catalog-model';
import { getPagerDutyEntity } from '../components/pagerDutyEntity';

export class UnauthorizedError extends Error {}

export const pagerDutyApiRef = createApiRef<PagerDutyApi>({
  id: 'plugin.pagerduty.api',
});

const commonGetServiceParams =
  'time_zone=UTC&include[]=integrations&include[]=escalation_policies';

export class PagerDutyClient implements PagerDutyApi {
  static fromConfig(
    configApi: ConfigApi,
    { discoveryApi, fetchApi }: PagerDutyClientApiDependencies,
  ) {
    const eventsBaseUrl: string =
      configApi.getOptionalString('pagerDuty.eventsBaseUrl') ??
      'https://events.pagerduty.com/v2';

    return new PagerDutyClient({
      eventsBaseUrl,
      discoveryApi,
      fetchApi,
    });
  }
  constructor(private readonly config: PagerDutyClientApiConfig) {}

  async getServiceByEntity(entity: Entity): Promise<PagerDutyServiceResponse> {
    const { integrationKey, serviceId } = getPagerDutyEntity(entity);

    let response: PagerDutyServiceResponse;
    let url: string;

    if (integrationKey) {
      url = `${await this.config.discoveryApi.getBaseUrl(
        'proxy',
      )}/pagerduty/services?${commonGetServiceParams}&query=${integrationKey}`;
      const { services } = await this.getByUrl<PagerDutyServicesResponse>(url);
      const service = services[0];

      if (!service) throw new NotFoundError();

      response = { service };
    } else if (serviceId) {
      url = `${await this.config.discoveryApi.getBaseUrl(
        'proxy',
      )}/pagerduty/services/${serviceId}?${commonGetServiceParams}`;

      response = await this.getByUrl<PagerDutyServiceResponse>(url);
    } else {
      throw new NotFoundError();
    }

    return response;
  }

  async getIncidentsByServiceId(
    serviceId: string,
  ): Promise<PagerDutyIncidentsResponse> {
    const params = `time_zone=UTC&sort_by=created_at&statuses[]=triggered&statuses[]=acknowledged&service_ids[]=${serviceId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/incidents?${params}`;

    return await this.getByUrl<PagerDutyIncidentsResponse>(url);
  }

  async getChangeEventsByServiceId(
    serviceId: string,
  ): Promise<PagerDutyChangeEventsResponse> {
    const params = `limit=5&time_zone=UTC&sort_by=timestamp`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/services/${serviceId}/change_events?${params}`;

    return await this.getByUrl<PagerDutyChangeEventsResponse>(url);
  }

  async getOnCallByPolicyId(
    policyId: string,
  ): Promise<PagerDutyOnCallsResponse> {
    const params = `time_zone=UTC&include[]=users&escalation_policy_ids[]=${policyId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/oncalls?${params}`;

    return await this.getByUrl<PagerDutyOnCallsResponse>(url);
  }

  triggerAlarm(request: PagerDutyTriggerAlarmRequest): Promise<Response> {
    const { integrationKey, source, description, userName } = request;

    const body = JSON.stringify({
      event_action: 'trigger',
      routing_key: integrationKey,
      client: 'Backstage',
      client_url: source,
      payload: {
        summary: description,
        source: source,
        severity: 'error',
        class: 'manual trigger',
        custom_details: {
          user: userName,
        },
      },
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json, text/plain, */*',
      },
      body,
    };

    const url = this.config.eventsBaseUrl ?? 'https://events.pagerduty.com/v2';

    return this.request(`${url}/enqueue`, options);
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
    const response = await this.config.fetchApi.fetch(url, options);
    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (response.status === 404) {
      throw new NotFoundError();
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
