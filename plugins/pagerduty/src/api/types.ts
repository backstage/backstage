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
  PagerDutyIncident,
  PagerDutyChangeEvent,
  PagerDutyOnCall,
  PagerDutyService,
} from '../components/types';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

export type PagerDutyServicesResponse = {
  services: PagerDutyService[];
};

export type PagerDutyServiceResponse = {
  service: PagerDutyService;
};

export type PagerDutyIncidentsResponse = {
  incidents: PagerDutyIncident[];
};

export type PagerDutyChangeEventsResponse = {
  change_events: PagerDutyChangeEvent[];
};

export type PagerDutyOnCallsResponse = {
  oncalls: PagerDutyOnCall[];
};

export type PagerDutyTriggerAlarmRequest = {
  integrationKey: string;
  source: string;
  description: string;
  userName: string;
};

export interface PagerDutyApi {
  /**
   * Fetches the service for the provided Entity.
   *
   */
  getServiceByEntity(entity: Entity): Promise<PagerDutyServiceResponse>;

  /**
   * Fetches a list of incidents a provided service has.
   *
   */
  getIncidentsByServiceId(
    serviceId: string,
  ): Promise<PagerDutyIncidentsResponse>;

  /**
   * Fetches a list of change events a provided service has.
   *
   */
  getChangeEventsByServiceId(
    serviceId: string,
  ): Promise<PagerDutyChangeEventsResponse>;

  /**
   * Fetches the list of users in an escalation policy.
   *
   */
  getOnCallByPolicyId(policyId: string): Promise<PagerDutyOnCallsResponse>;

  /**
   * Triggers an incident to whoever is on-call.
   */
  triggerAlarm(request: PagerDutyTriggerAlarmRequest): Promise<Response>;
}

export type PagerDutyClientApiDependencies = {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
};

export type PagerDutyClientApiConfig = PagerDutyClientApiDependencies & {
  eventsBaseUrl?: string;
};

export type RequestOptions = {
  method: string;
  headers: HeadersInit;
  body?: BodyInit;
};
