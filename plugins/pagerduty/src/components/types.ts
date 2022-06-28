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

export type PagerDutyChangeEvent = {
  id: string;
  integration: [
    {
      service: PagerDutyService;
    },
  ];
  source: string;
  html_url: string;
  links: [
    {
      href: string;
      text: string;
    },
  ];
  summary: string;
  timestamp: string;
};

export type PagerDutyIncident = {
  id: string;
  title: string;
  status: string;
  html_url: string;
  assignments: [
    {
      assignee: PagerDutyAssignee;
    },
  ];
  serviceId: string;
  created_at: string;
};

export type PagerDutyService = {
  id: string;
  name: string;
  html_url: string;
  integrationKey: string;
  escalation_policy: {
    id: string;
    user: PagerDutyUser;
    html_url: string;
  };
};

export type PagerDutyOnCall = {
  user: PagerDutyUser;
  escalation_level: number;
};

export type PagerDutyAssignee = {
  id: string;
  summary: string;
  html_url: string;
};

export type PagerDutyUser = {
  id: string;
  summary: string;
  email: string;
  html_url: string;
  name: string;
};

export type SubHeaderLink = {
  title: string;
  href?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
};
