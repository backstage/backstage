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
import {
  mockCredentials,
  startTestBackend,
} from '@backstage/backend-test-utils';
import request from 'supertest';
import { usageAnalyticsPlugin } from './plugin';

describe('usageAnalyticsPlugin', () => {
  it('accepts a heartbeat and exposes presence through the API', async () => {
    const { server } = await startTestBackend({
      features: [usageAnalyticsPlugin],
    });
    const sessionId = '35a52f7d-5583-42bb-951a-49f45e914c00';

    await request(server)
      .post('/api/usage-analytics/v1/presence/heartbeat')
      .send({ sessionId, currentPath: '/' })
      .expect(204);

    const online = await request(server)
      .get('/api/usage-analytics/v1/presence/online')
      .expect(200);
    expect(online.body).toMatchObject({
      total: 1,
      items: [
        {
          userEntityRef: mockCredentials.user().principal.userEntityRef,
          currentPath: '/',
          activeSessionCount: 1,
        },
      ],
    });
  });
});
