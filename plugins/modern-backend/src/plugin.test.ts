/*
 * Copyright 2024 The Backstage Authors
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
  mockCredentials,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { modernPlugin } from './plugin';
import request from 'supertest';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

// TEMPLATE NOTE:
// Plugin tests are integration tests for your plugin, ensuring that all pieces
// work together end-to-end. You can still mock injected backend services
// however, just like anyway that installs your plugin might replace the
// services with their own implementations.
describe('plugin', () => {
  it('should create and read TODO items', async () => {
    const { server } = await startTestBackend({
      features: [modernPlugin],
    });

    await request(server).get('/api/modern/todos').expect(200, {
      items: [],
    });

    const createRes = await request(server)
      .post('/api/modern/todos')
      .send({ title: 'My Todo' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toEqual({
      id: expect.any(String),
      title: 'My Todo',
      createdBy: mockCredentials.user().principal.userEntityRef,
      createdAt: expect.any(String),
    });

    const createdTodoItem = createRes.body;

    await request(server)
      .get('/api/modern/todos')
      .expect(200, {
        items: [createdTodoItem],
      });

    await request(server)
      .get(`/api/modern/todos/${createdTodoItem.id}`)
      .expect(200, createdTodoItem);
  });

  it('should create TODO item with catalog information', async () => {
    const { server } = await startTestBackend({
      features: [
        modernPlugin,
        catalogServiceMock.factory({
          entities: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'my-component',
                namespace: 'default',
                title: 'My Component',
              },
              spec: {
                type: 'service',
                owner: 'me',
              },
            },
          ],
        }),
      ],
    });

    const createRes = await request(server)
      .post('/api/modern/todos')
      .send({ title: 'My Todo', entityRef: 'component:default/my-component' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toEqual({
      id: expect.any(String),
      title: '[My Component] My Todo',
      createdBy: mockCredentials.user().principal.userEntityRef,
      createdAt: expect.any(String),
    });
  });
});
