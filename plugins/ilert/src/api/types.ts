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
  Alert,
  AlertAction,
  AlertResponder,
  AlertSource,
  AlertStatus,
  EscalationPolicy,
  OnCall,
  Schedule,
  UptimeMonitor,
  User,
} from '../types';

/** @public */
export type TableState = {
  page: number;
  pageSize: number;
};

/** @public */
export type GetAlertsOpts = {
  maxResults?: number;
  startIndex?: number;
  states?: AlertStatus[];
  alertSources?: number[];
};

/** @public */
export type GetAlertsCountOpts = {
  states?: AlertStatus[];
};

/** @public */
export type EventRequest = {
  integrationKey: string;
  summary: string;
  details: string;
  userName: string;
  source: string;
};

/** @public */
export interface ILertApi {
  fetchAlerts(opts?: GetAlertsOpts): Promise<Alert[]>;
  fetchAlertsCount(opts?: GetAlertsCountOpts): Promise<number>;
  fetchAlert(id: number): Promise<Alert>;
  fetchAlertResponders(alert: Alert): Promise<AlertResponder[]>;
  fetchAlertActions(alert: Alert): Promise<AlertAction[]>;
  acceptAlert(alert: Alert, userName: string): Promise<Alert>;
  resolveAlert(alert: Alert, userName: string): Promise<Alert>;
  assignAlert(alert: Alert, responder: AlertResponder): Promise<Alert>;
  createAlert(eventRequest: EventRequest): Promise<boolean>;
  triggerAlertAction(alert: Alert, action: AlertAction): Promise<void>;

  fetchUptimeMonitors(): Promise<UptimeMonitor[]>;
  pauseUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
  resumeUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
  fetchUptimeMonitor(id: number): Promise<UptimeMonitor>;

  fetchAlertSources(): Promise<AlertSource[]>;
  fetchAlertSource(idOrIntegrationKey: number | string): Promise<AlertSource>;
  fetchAlertSourceOnCalls(alertSource: AlertSource): Promise<OnCall[]>;
  enableAlertSource(alertSource: AlertSource): Promise<AlertSource>;
  disableAlertSource(alertSource: AlertSource): Promise<AlertSource>;

  addImmediateMaintenance(
    alertSourceId: number,
    minutes: number,
  ): Promise<void>;

  fetchOnCallSchedules(): Promise<Schedule[]>;
  fetchUsers(): Promise<User[]>;

  overrideShift(
    scheduleId: number,
    userId: number,
    start: string,
    end: string,
  ): Promise<Schedule>;

  getAlertDetailsURL(alert: Alert): string;
  getAlertSourceDetailsURL(alertSource: AlertSource | null): string;
  getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string;
  getUptimeMonitorDetailsURL(uptimeMonitor: UptimeMonitor): string;
  getScheduleDetailsURL(schedule: Schedule): string;
  getUserPhoneNumber(user: User | null): string;
  getUserInitials(user: User | null): string;
}
