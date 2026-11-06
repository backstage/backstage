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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  mockServices,
  registerMswTestHooks,
  startTestBackend,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { http, HttpResponse, passthrough } from 'msw';
import { setupServer } from 'msw/node';
import request from 'supertest';
import eventsPlugin from '@backstage/plugin-events-backend';
import eventsModuleMicrosoftGraph from '.';

jest.setTimeout(60_000);

const TENANT_ID = '11111111-1111-1111-1111-111111111111';
const NOTIFICATION_URL =
  'https://backstage-events.example.com/api/events/http/msgraph';

const msgraphConfig = {
  notificationUrl: NOTIFICATION_URL,
  subscriptionResources: ['users', 'groups'],
  tenantId: TENANT_ID,
  clientId: 'client-id',
  clientSecret: 'client-secret',
};

describe('Microsoft Graph events module integration', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  const databases = TestDatabases.create();

  // Only the external Microsoft endpoints are faked, at the HTTP level
  const created = new Map<string, { id: string; clientState: string }>();
  function mockMicrosoft() {
    worker.use(
      http.all(/^http:\/\/127\.0\.0\.1:/, () => passthrough()),
      http.post(
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
        () =>
          HttpResponse.json({
            token_type: 'Bearer',
            access_token: 'access-token',
            expires_in: 3600,
          }),
      ),
      http.get('https://graph.microsoft.com/v1.0/subscriptions', () =>
        HttpResponse.json({ value: [] }),
      ),
      http.post(
        'https://graph.microsoft.com/v1.0/subscriptions',
        async ({ request: req }) => {
          const body = (await req.json()) as {
            resource: string;
            clientState: string;
            notificationUrl: string;
          };
          const id = `sub-${created.size + 1}`;
          created.set(body.resource, { id, clientState: body.clientState });
          return HttpResponse.json({ id, ...body }, { status: 201 });
        },
      ),
    );
  }

  async function waitFor(check: () => boolean) {
    for (let i = 0; i < 100 && !check(); i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    expect(check()).toBe(true);
  }

  it.each(databases.eachSupportedId())(
    'starts, subscribes, and routes notifications for DB %p',
    async databaseId => {
      created.clear();
      mockMicrosoft();

      const upserts = new Array<unknown>();
      const deletes = new Array<unknown>();
      const consumer = createBackendModule({
        pluginId: 'events',
        moduleId: 'test-consumer',
        register(reg) {
          reg.registerInit({
            deps: { events: eventsServiceRef },
            async init({ events }) {
              await events.subscribe({
                id: 'test-consumer1',
                topics: ['msgraph/upsert'],
                onEvent: async event => {
                  upserts.push(event.eventPayload);
                },
              });
              await events.subscribe({
                id: 'test-consumer2',
                topics: ['msgraph/delete'],
                onEvent: async event => {
                  deletes.push(event.eventPayload);
                },
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          eventsPlugin,
          eventsModuleMicrosoftGraph,
          consumer,
          mockServices.rootConfig.factory({
            data: { events: { modules: { msgraph: msgraphConfig } } },
          }),
          mockServices.database.factory({
            knex: await databases.init(databaseId),
          }),
        ],
      });

      // Startup creates a subscription per configured resource through the Graph API
      await waitFor(() => created.size === 2);
      expect([...created.keys()].sort()).toEqual(['groups', 'users']);
      const users = created.get('users')!;

      // Graph's endpoint validation handshake echoes the token as plain text
      const validation = await request(server)
        .post('/api/events/http/msgraph')
        .type('text/plain')
        .query({ validationToken: 'Validation: token with spaces' });
      expect(validation.status).toBe(200);
      expect(validation.text).toBe('Validation: token with spaces');
      expect(validation.type).toBe('text/plain');

      // Notifications with a wrong clientState are rejected
      const rejected = await request(server)
        .post('/api/events/http/msgraph')
        .send({
          value: [
            {
              subscriptionId: users.id,
              clientState: 'wrong',
              changeType: 'updated',
              resource: 'users/1',
            },
          ],
        });
      expect(rejected.status).toBeGreaterThanOrEqual(400);

      // Notifications with the stored clientState are accepted and routed
      const accepted = await request(server)
        .post('/api/events/http/msgraph')
        .send({
          value: [
            {
              subscriptionId: users.id,
              clientState: users.clientState,
              changeType: 'updated',
              resource: 'users/1',
            },
            {
              subscriptionId: users.id,
              clientState: users.clientState,
              changeType: 'deleted',
              resource: 'users/2',
            },
          ],
        });
      expect(accepted.status).toBe(202);

      await waitFor(() => upserts.length === 1);
      expect(upserts).toEqual([
        [
          {
            subscriptionId: users.id,
            changeType: 'updated',
            resource: 'users/1',
          },
        ],
      ]);

      await waitFor(() => deletes.length === 1);
      expect(deletes).toEqual([
        [
          {
            subscriptionId: users.id,
            changeType: 'deleted',
            resource: 'users/2',
          },
        ],
      ]);
    },
  );
});
