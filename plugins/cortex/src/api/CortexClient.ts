/*
 * Copyright 2022 The Backstage Authors
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
  CortexApi,
  Endpoints,
  Endpoint,
  SecurityIncidents,
  Incident,
  Alerts,
  Alert,
} from './types';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export class CortexApiClient implements CortexApi {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;

  constructor({
    discoveryApi,
    fetchApi,
  }: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  private async callApi<T>(
    path: string,
    query: { [key in string]: any },
  ): Promise<T | undefined> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/cortex`;
    const response = await this.fetchApi.fetch(
      `${apiUrl}${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
        method: 'POST'
      },
    );
    if (response.ok) {
      return (await response.json()) as T;
    }
    throw await ResponseError.fromResponse(response);
  }

  async getCortexEntityEndpoint(
    entityName: string,
  ): Promise<Endpoint[] | undefined> {

    const events = (await this.callApi(
      `/endpoints/get_endpoint`,
      {
        "request_data": {
          "filters": [
            {
              "field": "hostname",
              "operator": "in",
              "value": [
                entityName
              ]
            }
          ]
        }
      },
    )) as Endpoints;
    if (!events || events.reply.result_count === 0) {
      return undefined;
    }

    return events.reply.endpoints;
  }

  async getCortexSecurityIncidents(
    host: string
  ): Promise<Incident[] | undefined> {
    let totalCount = 0;
    let currentOffset = 0;
    const data = await this.getCortexEntityEndpoint(host);
    if (!data || data.length === 0) {
      return undefined;
    }
    let incidents: Incident[] = [];
    do {
      console.log(currentOffset)
      const events = (await this.callApi(
        `/incidents/get_incidents`,
        {
          "request_data": {
            "search_from": currentOffset,
            "search_to": currentOffset + 100
          }
        },
      )) as SecurityIncidents;
      incidents.push(...events.reply.incidents.filter(incident => !incident.hosts !== null || incident.hosts.length !== 0));
      totalCount = events.reply.total_count;
      currentOffset += 100;
    } while (currentOffset < totalCount);

    return incidents.filter(incident => incident.hosts !== null).filter(incident => this.CheckIfIncludes(incident.hosts, data[0].endpoint_name, data[0].ip))
  }

  async getCortexAlerts(host: string): Promise<Alert[] | undefined> {
    let totalCount = 0;
    let currentOffset = 0;
    const data = await this.getCortexEntityEndpoint(host);
    if (!data || data.length === 0) {
      return undefined;
    }
    let alerts: Alert[] = [];
    do {
      console.log(currentOffset)
      const events = (await this.callApi(
        `/alerts/get_alerts`,
        {
          "request_data": {
            "search_from": currentOffset,
            "search_to": currentOffset + 100,
            "filters": [
              {
                "field": "severity",
                "operator": "in",
                "value": [
                  "medium",
                  "high"
                ]
              }
            ]
          }
        },
      )) as Alerts;
      alerts.push(...events.reply.alerts);
      totalCount = events.reply.total_count;
      currentOffset += 100;
    } while (currentOffset < totalCount);
    console.log(alerts.length)
    return alerts.filter(x => x.host_name === host);
  }

  CheckIfIncludes(hosts: string[], hostname: string, ips: string[]): boolean {
    let exist = false;
    hosts.forEach(element => {
      if (element.split(':')[0] === hostname) exist = true;
    });
    if (hosts.some(host => ips.some(ip => ip === host.split(':')[0]))) exist = true;
    return exist;
  }
}
