/*
 * Copyright 2026 The Backstage Authors
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

import { createServiceFactory } from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import eventsPlugin from '@backstage/plugin-events-backend';
import eventsModuleAzureDevOpsWebhook from '../service/eventsModuleAzureDevOpsWebhook';
import request from 'supertest';

describe('Azure DevOps webhook HTTP integration', () => {
  const secret = 'my-webhook-secret';

  it('should accept a valid ADO webhook payload and publish it as an event', async () => {
    const eventsService = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return eventsService;
      },
    });

    const { server } = await startTestBackend({
      features: [
        eventsServiceFactory,
        eventsPlugin,
        eventsModuleAzureDevOpsWebhook,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                azureDevOps: {
                  webhookSecret: secret,
                },
              },
            },
          },
        }),
      ],
    });

    const payload = {
      eventType: 'workitem.updated',
      resource: { id: 42 },
    };

    const response = await request(server)
      .post('/api/events/http/azureDevOps')
      .set('x-ado-webhook-secret', secret)
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify(payload));

    expect(response.status).toBe(202);
    expect(eventsService.published).toHaveLength(1);
    expect(eventsService.published[0].topic).toEqual('azureDevOps');
    expect(eventsService.published[0].eventPayload).toEqual(payload);
  });

  it('should reject a request with an invalid secret', async () => {
    const eventsService = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return eventsService;
      },
    });

    const { server } = await startTestBackend({
      features: [
        eventsServiceFactory,
        eventsPlugin,
        eventsModuleAzureDevOpsWebhook,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                azureDevOps: {
                  webhookSecret: secret,
                },
              },
            },
          },
        }),
      ],
    });

    const response = await request(server)
      .post('/api/events/http/azureDevOps')
      .set('x-ado-webhook-secret', 'wrong-secret')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ eventType: 'workitem.updated' }));

    expect(response.status).toBe(403);
    expect(eventsService.published).toHaveLength(0);
  });

  it('should not register the ingress when no secret is configured', async () => {
    const eventsService = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return eventsService;
      },
    });

    const { server } = await startTestBackend({
      features: [
        eventsServiceFactory,
        eventsPlugin,
        eventsModuleAzureDevOpsWebhook,
        mockServices.rootConfig.factory({
          data: {},
        }),
      ],
    });

    const response = await request(server)
      .post('/api/events/http/azureDevOps')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ eventType: 'git.push' }));

    expect(response.status).toBe(404);
    expect(eventsService.published).toHaveLength(0);
  });
});
