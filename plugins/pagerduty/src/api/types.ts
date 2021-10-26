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

import { Incident, ChangeEvent, OnCall, Service } from '../components/types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export type TriggerAlarmRequest = {
  serviceId: string;
  from: string;
  title: string;
  description: string;
};

export interface PagerDutyApi {
  /**
   * Fetches a service via serviceId.
   *
   */
  getServiceByServiceId(serviceId: string): Promise<Service>;

  /**
   * Fetches a list of incidents a provided service has.
   *
   */
  getIncidentsByServiceId(serviceId: string): Promise<Incident[]>;

  /**
   * Fetches a list of change events a provided service has.
   *
   */
  getChangeEventsByServiceId(serviceId: string): Promise<ChangeEvent[]>;

  /**
   * Fetches the list of users in an escalation policy.
   *
   */
  getOnCallByPolicyId(policyId: string): Promise<OnCall[]>;

  /**
   * Triggers an incident to whoever is on-call.
   */
  triggerAlarm(request: TriggerAlarmRequest): Promise<Response>;
}

export type ServiceResponse = {
  service: Service;
};

export type IncidentsResponse = {
  incidents: Incident[];
};

export type ChangeEventsResponse = {
  change_events: ChangeEvent[];
};

export type OnCallsResponse = {
  oncalls: OnCall[];
};

export type ClientApiConfig = {
  apiBaseUrl?: string;
  discoveryApi: DiscoveryApi;
};

export type RequestOptions = {
  method: string;
  headers: HeadersInit;
  body?: BodyInit;
};
