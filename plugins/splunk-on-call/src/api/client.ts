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

import { createApiRef, DiscoveryApi, ConfigApi } from '@backstage/core';
import {
  Incident,
  OnCall,
  User,
  EscalationPolicyInfo,
  Team,
} from '../components/types';
import {
  SplunkOnCallApi,
  TriggerAlarmRequest,
  IncidentsResponse,
  OnCallsResponse,
  ClientApiConfig,
  RequestOptions,
  ListUserResponse,
  EscalationPolicyResponse,
  PatchIncidentRequest,
} from './types';

export class UnauthorizedError extends Error {}

export const splunkOnCallApiRef = createApiRef<SplunkOnCallApi>({
  id: 'plugin.splunk-on-call.api',
  description: 'Used to fetch data from Splunk On-Call API',
});

export class SplunkOnCallClient implements SplunkOnCallApi {
  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const usernameFromConfig: string | null =
      configApi.getOptionalString('splunkOnCall.username') || null;
    return new SplunkOnCallClient({
      username: usernameFromConfig,
      discoveryApi,
    });
  }
  constructor(private readonly config: ClientApiConfig) {}

  async getIncidents(): Promise<Incident[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/incidents`;

    const { incidents } = await this.getByUrl<IncidentsResponse>(url);

    return incidents;
  }

  async getOnCallUsers(): Promise<OnCall[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/oncall/current`;
    const { teamsOnCall } = await this.getByUrl<OnCallsResponse>(url);

    return teamsOnCall;
  }

  async getTeams(): Promise<Team[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/team`;
    const teams = await this.getByUrl<Team[]>(url);

    return teams;
  }

  async acknowledgeIncident({
    incidentNames,
  }: PatchIncidentRequest): Promise<Response> {
    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: this.config.username,
        incidentNames,
      }),
    };

    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/incidents/ack`;

    return this.request(url, options);
  }

  async resolveIncident({
    incidentNames,
  }: PatchIncidentRequest): Promise<Response> {
    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: this.config.username,
        incidentNames,
      }),
    };

    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/incidents/resolve`;

    return this.request(url, options);
  }

  async getUsers(): Promise<User[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v2/user`;
    const { users } = await this.getByUrl<ListUserResponse>(url);

    return users;
  }

  async getEscalationPolicies(): Promise<EscalationPolicyInfo[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/policies`;
    const { policies } = await this.getByUrl<EscalationPolicyResponse>(url);

    return policies;
  }

  async triggerAlarm({
    summary,
    details,
    userName,
    targets,
    isMultiResponder,
  }: TriggerAlarmRequest): Promise<Response> {
    const body = JSON.stringify({
      summary,
      details,
      userName: this.config.username || userName,
      targets,
      isMultiResponder,
    });

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    };

    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/splunk-on-call/v1/incidents`;

    return this.request(url, options);
  }

  private async getByUrl<T>(url: string): Promise<T> {
    const options = {
      method: 'GET',
      headers: {
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
    if (response.status === 403) {
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
