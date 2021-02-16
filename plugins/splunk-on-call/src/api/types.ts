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

import {
  EscalationPolicyInfo,
  Incident,
  OnCall,
  Team,
  User,
} from '../components/types';
import { DiscoveryApi } from '@backstage/core';

export enum TargetType {
  UserValue = 'User',
  EscalationPolicyValue = 'EscalationPolicy',
}

export type IncidentTarget = {
  type: TargetType;
  slug: string;
};

export type TriggerAlarmRequest = {
  targets: IncidentTarget[];
  details: string;
  summary: string;
  userName: string;
  isMultiResponder?: boolean;
};

export interface SplunkOnCallApi {
  /**
   * Fetches a list of incidents
   */
  getIncidents(): Promise<Incident[]>;

  /**
   * Fetches the list of users in an escalation policy.
   */
  getOnCallUsers(): Promise<OnCall[]>;

  /**
   * Triggers an incident to specific users and/or specific teams.
   */
  triggerAlarm(request: TriggerAlarmRequest): Promise<Response>;

  /**
   * Resolves an incident.
   */
  resolveIncident(request: PatchIncidentRequest): Promise<Response>;

  /**
   * Acknowledge an incident.
   */
  acknowledgeIncident(request: PatchIncidentRequest): Promise<Response>;

  /**
   * Get a list of users for your organization.
   */
  getUsers(): Promise<User[]>;

  /**
   * Get a list of teams for your organization.
   */
  getTeams(): Promise<Team[]>;

  /**
   * Get a list of escalation policies for your organization.
   */
  getEscalationPolicies(): Promise<EscalationPolicyInfo[]>;
}

export type PatchIncidentRequest = {
  incidentNames: string[];
  message?: string;
};

export type EscalationPolicyResponse = {
  policies: EscalationPolicyInfo[];
};

export type ListUserResponse = {
  users: User[];
  _selfUrl?: string;
};

export type IncidentsResponse = {
  incidents: Incident[];
};

export type OnCallsResponse = {
  teamsOnCall: OnCall[];
};

export type ClientApiConfig = {
  username: string | null;
  discoveryApi: DiscoveryApi;
};

export type RequestOptions = {
  method: string;
  headers: HeadersInit;
  body?: BodyInit;
};
