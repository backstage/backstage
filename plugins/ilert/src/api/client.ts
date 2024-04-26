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
  ConfigApi,
  createApiRef,
  DiscoveryApi,
} from '@backstage/core-plugin-api';
import { AuthenticationError, ResponseError } from '@backstage/errors';
import { DateTime as dt } from 'luxon';
import {
  Alert,
  AlertAction,
  AlertResponder,
  AlertSource,
  EscalationPolicy,
  OnCall,
  Schedule,
  Service,
  StatusPage,
  User,
} from '../types';
import {
  EventRequest,
  GetAlertsCountOpts,
  GetAlertsOpts,
  GetServicesOpts,
  GetStatusPagesOpts,
  ILertApi,
} from './types';

/** @public */
export const ilertApiRef = createApiRef<ILertApi>({
  id: 'plugin.ilert.service',
});

const DEFAULT_PROXY_PATH = '/ilert';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/** @public */
export class ILertClient implements ILertApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;
  private readonly baseUrl: string;

  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const baseUrl: string =
      configApi.getOptionalString('ilert.baseUrl') ?? 'https://app.ilert.com';

    return new ILertClient({
      discoveryApi: discoveryApi,
      baseUrl,
      proxyPath:
        configApi.getOptionalString('ilert.proxyPath') ?? DEFAULT_PROXY_PATH,
    });
  }

  constructor(opts: {
    discoveryApi: DiscoveryApi;

    /**
     * URL used by users to access iLert web UI.
     * Example: https://my-org.ilert.com/
     */
    baseUrl: string;

    /**
     * Path to use for requests via the proxy, defaults to /ilert/api
     */
    proxyPath: string;
  }) {
    this.discoveryApi = opts.discoveryApi;
    this.baseUrl = opts.baseUrl;
    this.proxyPath = opts.proxyPath;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const apiUrl = await this.apiUrl();

    const response = await fetch(`${apiUrl}${input}`, init);
    if (response.status === 401) {
      throw new AuthenticationError(
        'This request requires HTTP authentication.',
      );
    }
    if (!response.ok || response.status >= 400) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async fetchAlerts(opts?: GetAlertsOpts): Promise<Alert[]> {
    const init = {
      headers: JSON_HEADERS,
    };
    const query = new URLSearchParams();
    if (opts?.maxResults !== undefined) {
      query.append('max-results', String(opts.maxResults));
    }
    if (opts?.startIndex !== undefined) {
      query.append('start-index', String(opts.startIndex));
    }
    if (opts?.alertSources !== undefined && Array.isArray(opts.alertSources)) {
      opts.alertSources.forEach((a: number) => {
        if (a) {
          query.append('alert-source', String(a));
        }
      });
    }

    if (opts?.states !== undefined && Array.isArray(opts.states)) {
      opts.states.forEach(state => {
        query.append('state', state);
      });
    }
    const response = await this.fetch(`/api/alerts?${query.toString()}`, init);
    return response;
  }

  async fetchAlertsCount(opts?: GetAlertsCountOpts): Promise<number> {
    const init = {
      headers: JSON_HEADERS,
    };
    const query = new URLSearchParams();
    if (opts && opts.states && Array.isArray(opts.states)) {
      opts.states.forEach(state => {
        query.append('state', state);
      });
    }
    const response = await this.fetch(
      `/api/alerts/count?${query.toString()}`,
      init,
    );

    return response && response.count ? response.count : 0;
  }

  async fetchAlert(id: number): Promise<Alert> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/alerts/${encodeURIComponent(id)}`,
      init,
    );

    return response;
  }

  async fetchAlertResponders(alert: Alert): Promise<AlertResponder[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/alerts/${encodeURIComponent(alert.id)}/responders`,
      init,
    );

    return response;
  }

  async fetchAlertActions(alert: Alert): Promise<AlertAction[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/alerts/${encodeURIComponent(alert.id)}/actions`,
      init,
    );

    return response;
  }

  async acceptAlert(alert: Alert, userName: string): Promise<Alert> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: alert.alertSource?.integrationKey || '',
        alertKey: alert.alertKey,
        summary: `from ${userName} via Backstage plugin`,
        eventType: 'ACCEPT',
      }),
    };

    await this.fetch('/api/events', init);
    return this.fetchAlert(alert.id);
  }

  async resolveAlert(alert: Alert, userName: string): Promise<Alert> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: alert.alertSource?.integrationKey || '',
        alertKey: alert.alertKey,
        summary: `from ${userName} via Backstage plugin`,
        eventType: 'RESOLVE',
      }),
    };

    await this.fetch('/api/events', init);
    return this.fetchAlert(alert.id);
  }

  async assignAlert(alert: Alert, responder: AlertResponder): Promise<Alert> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
    };

    const query = new URLSearchParams();
    switch (responder.group) {
      case 'ESCALATION_POLICY':
        query.append('policy-id', String(responder.id));
        break;
      case 'ON_CALL_SCHEDULE':
        query.append('schedule-id', String(responder.id));
        break;
      default:
        query.append('user-id', String(responder.id));
        break;
    }

    const response = await this.fetch(
      `/api/alerts/${encodeURIComponent(alert.id)}/assign?${query.toString()}`,
      init,
    );

    return response;
  }

  async triggerAlertAction(alert: Alert, action: AlertAction): Promise<void> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        webhookId: action.webhookId,
        extensionId: action.extensionId,
        type: action.type,
        name: action.name,
      }),
    };

    await this.fetch(
      `/api/alerts/${encodeURIComponent(alert.id)}/actions`,
      init,
    );
  }

  async createAlert(eventRequest: EventRequest): Promise<boolean> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
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

    const response = await this.fetch('/api/events', init);
    return response;
  }

  async fetchAlertSources(): Promise<AlertSource[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch('/api/alert-sources', init);

    return response;
  }

  async fetchAlertSource(
    idOrIntegrationKey: number | string,
  ): Promise<AlertSource> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/alert-sources/${encodeURIComponent(idOrIntegrationKey)}`,
      init,
    );

    return response;
  }

  async fetchAlertSourceOnCalls(alertSource: AlertSource): Promise<OnCall[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/on-calls?policies=${encodeURIComponent(
        alertSource.escalationPolicy.id,
      )}&expand=user&expand=escalationPolicy&timezone=${dt.local().zoneName}`,
      init,
    );

    return response;
  }

  async enableAlertSource(alertSource: AlertSource): Promise<AlertSource> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...alertSource, active: true }),
    };

    const response = await this.fetch(
      `/api/alert-sources/${encodeURIComponent(alertSource.id)}`,
      init,
    );

    return response;
  }

  async disableAlertSource(alertSource: AlertSource): Promise<AlertSource> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...alertSource, active: false }),
    };

    const response = await this.fetch(
      `/api/alert-sources/${encodeURIComponent(alertSource.id)}`,
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
      headers: JSON_HEADERS,
      body: JSON.stringify({
        start: dt.utc().toISO(),
        end: dt.utc().plus({ minutes }).toISO(),
        description: `Immediate maintenance window for ${minutes} minutes. Backstage — iLert plugin.`,
        createdBy: 'Backstage',
        timezone: dt.local().zoneName,
        alertSources: [{ id: alertSourceId }],
      }),
    };

    const response = await this.fetch('/api/maintenance-windows', init);

    return response;
  }

  async fetchOnCallSchedules(): Promise<Schedule[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      '/api/schedules?include=currentShift&include=nextShift',
      init,
    );

    return response;
  }

  async fetchUsers(): Promise<User[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch('/api/users', init);

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
      headers: JSON_HEADERS,
      body: JSON.stringify({ user: { id: userId }, start, end }),
    };

    const response = await this.fetch(
      `/api/schedules/${encodeURIComponent(scheduleId)}/overrides`,
      init,
    );

    return response;
  }

  async fetchServices(opts?: GetServicesOpts): Promise<Service[]> {
    const init = {
      headers: JSON_HEADERS,
    };
    const query = new URLSearchParams();
    if (opts?.maxResults !== undefined) {
      query.append('max-results', String(opts.maxResults));
    }
    if (opts?.startIndex !== undefined) {
      query.append('start-index', String(opts.startIndex));
    }

    query.append('include', 'uptime');

    const response = await this.fetch(
      `/api/services?${query.toString()}`,
      init,
    );
    return response;
  }

  async fetchStatusPages(opts?: GetStatusPagesOpts): Promise<StatusPage[]> {
    const init = {
      headers: JSON_HEADERS,
    };
    const query = new URLSearchParams();
    if (opts?.maxResults !== undefined) {
      query.append('max-results', String(opts.maxResults));
    }
    if (opts?.startIndex !== undefined) {
      query.append('start-index', String(opts.startIndex));
    }

    query.append('include', 'subscribed');

    const response = await this.fetch(
      `/api/status-pages?${query.toString()}`,
      init,
    );
    return response;
  }

  getAlertDetailsURL(alert: Alert): string {
    return `${this.baseUrl}/alert/view.jsf?id=${encodeURIComponent(alert.id)}`;
  }

  getAlertSourceDetailsURL(alertSource: AlertSource | null): string {
    if (!alertSource) {
      return '';
    }
    return `${this.baseUrl}/source/view.jsf?id=${encodeURIComponent(
      alertSource.id,
    )}`;
  }

  getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string {
    return `${this.baseUrl}/policy/view.jsf?id=${encodeURIComponent(
      escalationPolicy.id,
    )}`;
  }

  getScheduleDetailsURL(schedule: Schedule): string {
    return `${this.baseUrl}/schedule/view.jsf?id=${encodeURIComponent(
      schedule.id,
    )}`;
  }

  getServiceDetailsURL(service: Service): string {
    return `${this.baseUrl}/service/view.jsf?id=${encodeURIComponent(
      service.id,
    )}`;
  }

  getStatusPageDetailsURL(statusPage: StatusPage): string {
    return `${this.baseUrl}/status-page/view.jsf?id=${encodeURIComponent(
      statusPage.id,
    )}`;
  }

  getStatusPageURL(statusPage: StatusPage): string {
    return statusPage.domain ? statusPage.domain : statusPage.subdomain;
  }

  getUserPhoneNumber(user: User | null) {
    return user?.mobile?.number || user?.landline?.number || '';
  }

  getUserInitials(user: User | null) {
    if (!user) {
      return '';
    }
    if (!user.firstName && !user.lastName) {
      return user.username;
    }
    return `${user.firstName} ${user.lastName}`;
  }

  private async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
