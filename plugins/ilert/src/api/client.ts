/*
 * Copyright 2021 Spotify AB
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
import { ConfigApi, createApiRef, DiscoveryApi } from '@backstage/core';
import {
  AlertSource,
  EscalationPolicy,
  Incident,
  IncidentResponder,
  Schedule,
  UptimeMonitor,
  User,
} from '../types';
import {
  ILertApi,
  GetIncidentsOpts,
  GetIncidentsCountOpts,
  Options,
  EventRequest,
} from './types';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

export const ilertApiRef = createApiRef<ILertApi>({
  id: 'plugin.ilert.service',
  description: 'Used to make requests towards iLert API',
});

const DEFAULT_PROXY_PATH = '/ilert';
export class UnauthorizedError extends Error {}

export class ILertClient implements ILertApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;
  private readonly domain: string;

  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const domainUrl: string =
      configApi.getOptionalString('domainUrl') ?? 'https://api.ilert.com';

    return new ILertClient({
      discoveryApi: discoveryApi,
      domain: domainUrl,
      proxyPath: configApi.getOptionalString('ilert.proxyPath'),
    });
  }

  constructor(opts: Options) {
    this.discoveryApi = opts.discoveryApi;
    this.domain = opts.domain;
    this.proxyPath = opts.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const apiUrl = await this.apiUrl();

    const response = await fetch(`${apiUrl}${input}`, init);
    if (response.status === 401) {
      throw new UnauthorizedError('');
    }
    if (!response.ok) {
      throw new Error(
        `Request failed with ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async fetchIncidents(opts?: GetIncidentsOpts): Promise<Incident[]> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    const query = new URLSearchParams();
    if (opts && opts.maxResults) {
      query.append('max-results', `${opts.maxResults}`);
    }
    if (opts && opts.startIndex) {
      query.append('start-index', `${opts.startIndex}`);
    }
    if (opts && opts.alertSources) {
      opts.alertSources.forEach((a: string | number) => {
        if (a) {
          query.append('alert-source', `${a}`);
        }
      });
    }

    if (opts && opts.states && Array.isArray(opts.states)) {
      opts.states.forEach(state => {
        query.append('state', state);
      });
    }
    const response = await this.fetch(
      `/api/v1/incidents?${query.toString()}`,
      init,
    );

    return response;
  }

  async fetchIncidentsCount(opts?: GetIncidentsCountOpts): Promise<number> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    const query = new URLSearchParams();
    if (opts && opts.states && Array.isArray(opts.states)) {
      opts.states.forEach(state => {
        query.append('state', state);
      });
    }
    const response = await this.fetch(
      `/api/v1/incidents/count?${query.toString()}`,
      init,
    );

    return response && response.count ? response.count : 0;
  }

  async fetchIncidentResponders(
    incident: Incident,
  ): Promise<IncidentResponder[]> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await this.fetch(
      `/api/v1/incidents/${incident.id}/responders`,
      init,
    );

    return response;
  }

  async acceptIncident(incident: Incident): Promise<Incident> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ summary: 'Backstage — iLert plugin' }),
    };

    const response = await this.fetch(
      `/api/v1/incidents/${incident.id}/accept`,
      init,
    );

    return response;
  }

  async resolveIncident(incident: Incident): Promise<Incident> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ summary: 'Backstage — iLert plugin' }),
    };

    const response = await this.fetch(
      `/api/v1/incidents/${incident.id}/resolve`,
      init,
    );

    return response;
  }

  async assignIncident(
    incident: Incident,
    responder: IncidentResponder,
  ): Promise<Incident> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const query = new URLSearchParams();
    switch (responder.group) {
      case 'ESCALATION_POLICY':
        query.append('policy-id', `${responder.id}`);
        break;
      case 'ON_CALL_SCHEDULE':
        query.append('schedule-id', `${responder.id}`);
        break;
      default:
        query.append('user-id', `${responder.id}`);
        break;
    }

    const response = await this.fetch(
      `/api/v1/incidents/${incident.id}/assign?${query.toString()}`,
      init,
    );

    return response;
  }

  async createIncident(eventRequest: EventRequest): Promise<boolean> {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        apiKey: eventRequest.integrationKey,
        summary: eventRequest.summary,
        details: eventRequest.details,
        eventType: 'ALERT',
        links: [
          {
            href: eventRequest.source,
            text: 'Backstage Url',
          },
        ],
        customDetails: {
          userName: eventRequest.userName,
        },
      }),
    };

    const response = await this.fetch('/api/v1/events', init);
    return response.responseCode === 'NEW_INCIDENT_CREATED';
  }

  async fetchUptimeMonitors(): Promise<UptimeMonitor[]> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await this.fetch('/api/v1/uptime-monitors', init);

    return response;
  }

  async fetchUptimeMonitor(id: number): Promise<UptimeMonitor> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response: UptimeMonitor = await this.fetch(
      `/api/v1/uptime-monitors/${id}`,
      init,
    );

    return response;
  }

  async pauseUptimeMonitor(
    uptimeMonitor: UptimeMonitor,
  ): Promise<UptimeMonitor> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ ...uptimeMonitor, paused: true }),
    };

    const response = await this.fetch(
      `/api/v1/uptime-monitors/${uptimeMonitor.id}`,
      init,
    );

    return response;
  }

  async resumeUptimeMonitor(
    uptimeMonitor: UptimeMonitor,
  ): Promise<UptimeMonitor> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ ...uptimeMonitor, paused: false }),
    };

    const response = await this.fetch(
      `/api/v1/uptime-monitors/${uptimeMonitor.id}`,
      init,
    );

    return response;
  }

  async fetchAlertSources(): Promise<AlertSource[]> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await this.fetch('/api/v1/alert-sources', init);

    return response;
  }

  async fetchAlertSource(
    idOrIntegrationKey: number | string,
  ): Promise<AlertSource> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await this.fetch(
      `/api/v1/alert-sources/${idOrIntegrationKey}`,
      init,
    );

    return response;
  }

  async enableAlertSource(alertSource: AlertSource): Promise<AlertSource> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ ...alertSource, active: true }),
    };

    const response = await this.fetch(
      `/api/v1/alert-sources/${alertSource.id}`,
      init,
    );

    return response;
  }

  async disableAlertSource(alertSource: AlertSource): Promise<AlertSource> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ ...alertSource, active: false }),
    };

    const response = await this.fetch(
      `/api/v1/alert-sources/${alertSource.id}`,
      init,
    );

    return response;
  }

  async addImmediateMaintenance(
    alertSourceId: number,
    minutes: number,
  ): Promise<void> {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        start: moment().utc().toISOString(),
        end: moment().add(minutes, 'minutes').utc().toISOString(),
        description: `Immediate maintenance window for ${minutes} minutes. Backstage — iLert plugin.`,
        createdBy: 'Backstage',
        timezone: momentTimezone.tz.guess(),
        alertSources: [{ id: alertSourceId }],
      }),
    };

    const response = await this.fetch('/api/v1/maintenance-windows', init);

    return response;
  }

  async fetchOnCallSchedules(): Promise<Schedule[]> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await this.fetch('/api/v1/schedules', init);

    return response;
  }

  async fetchUsers(): Promise<User[]> {
    const init = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response = await this.fetch('/api/v1/users', init);

    return response;
  }

  async overrideShift(
    scheduleId: number,
    userId: number,
    start: string,
    end: string,
  ): Promise<Schedule> {
    const init = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ user: { id: userId }, start, end }),
    };

    const response = await this.fetch(
      `/api/v1/schedules/${scheduleId}/overrides`,
      init,
    );

    return response;
  }

  getIncidentDetailsURL(incident: Incident): string {
    return `${this.domain}/incident/view.jsf?id=${incident.id}`;
  }

  getAlertSourceDetailsURL(alertSource: AlertSource | null): string {
    if (!alertSource) {
      return '';
    }
    return `${this.domain}/source/view.jsf?id=${alertSource.id}`;
  }

  getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string {
    return `${this.domain}/policy/view.jsf?id=${escalationPolicy.id}`;
  }

  getUptimeMonitorDetailsURL(uptimeMonitor: UptimeMonitor): string {
    return `${this.domain}/uptime/view.jsf?id=${uptimeMonitor.id}`;
  }

  getScheduleDetailsURL(schedule: Schedule): string {
    return `${this.domain}/schedule/view.jsf?id=${schedule.id}`;
  }

  getUserInitials(assignedTo: User | null) {
    if (!assignedTo) {
      return '';
    }
    if (!assignedTo.firstName && !assignedTo.lastName) {
      return assignedTo.username;
    }
    return `${assignedTo.firstName} ${assignedTo.lastName} (${assignedTo.username})`;
  }

  private async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
