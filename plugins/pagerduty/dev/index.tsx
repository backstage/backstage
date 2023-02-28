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

import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { pagerDutyPlugin, EntityPagerDutyCard } from '../src/plugin';
import { pagerDutyApiRef } from '../src/api';
import { PagerDutyApi, PagerDutyTriggerAlarmRequest } from '../src/api/types';
import {
  PagerDutyIncident,
  PagerDutyChangeEvent,
} from '../src/components/types';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'github.com/project-slug': 'backstage/backstage',
      'pagerduty.com/service-id': 'foo',
      'pagerduty.com/integration-key': 'foo',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'website',
    owner: 'user:guest',
  },
};

const mockPagerDutyApi: PagerDutyApi = {
  async getServiceByEntity(entity: Entity) {
    return {
      service: {
        name: entity.metadata.name,
        integrationKey: 'key',
        id: '123',
        html_url: 'http://service',
        escalation_policy: {
          id: '123',
          html_url: 'http://escalationpolicy',
          user: {
            id: '123',
            summary: 'summary',
            email: 'email@email.com',
            html_url: 'http://user',
            name: 'some-user',
          },
        },
      },
    };
  },

  async getIncidentsByServiceId(serviceId: string) {
    const incident = (title: string) => {
      return {
        id: '123',
        title: title,
        status: 'acknowledged',
        html_url: 'http://incident',
        assignments: [
          {
            assignee: {
              id: '123',
              summary: 'Jane Doe',
              html_url: 'http://assignee',
            },
          },
        ],
        serviceId: serviceId,
        created_at: '2015-10-06T21:30:42Z',
      } as PagerDutyIncident;
    };

    return {
      incidents: [
        incident('Some Alerting Incident'),
        incident('Another Alerting Incident'),
      ],
    };
  },

  async getChangeEventsByServiceId(serviceId: string) {
    const changeEvent = (description: string) => {
      return {
        id: serviceId,
        source: 'some-source',
        html_url: 'http://changeevent',
        links: [
          {
            href: 'http://link',
            text: 'link text',
          },
        ],
        summary: description,
        timestamp: '2018-10-06T21:30:42Z',
      } as PagerDutyChangeEvent;
    };

    return {
      change_events: [
        changeEvent('us-east-1 deployment'),
        changeEvent('us-west-2 deployment'),
      ],
    };
  },

  async getOnCallByPolicyId() {
    const oncall = (name: string, escalation: number) => {
      return {
        user: {
          id: '123',
          name: name,
          html_url: 'http://assignee',
          summary: 'summary',
          email: 'email@email.com',
        },
        escalation_level: escalation,
      };
    };

    return {
      oncalls: [oncall('Jane Doe', 1), oncall('John Doe', 2)],
    };
  },

  async triggerAlarm(request: PagerDutyTriggerAlarmRequest) {
    return new Response(request.description);
  },
};

createDevApp()
  .registerApi({
    api: pagerDutyApiRef,
    deps: {},
    factory: () => mockPagerDutyApi,
  })
  .registerPlugin(pagerDutyPlugin)
  .addPage({
    path: '/pagerduty',
    title: 'PagerDuty',
    element: (
      <EntityProvider entity={mockEntity}>
        <EntityPagerDutyCard />
      </EntityProvider>
    ),
  })
  .render();
