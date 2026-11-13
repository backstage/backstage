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

import { mockServices } from '@backstage/backend-test-utils';
import { DefaultApiBackendClient } from './generated';

describe('DefaultApiBackendClient', () => {
  const request = { body: { event: { topic: 'topic', payload: {} } } };

  it('resolves the base url with discovery and authenticates with a plugin request token', async () => {
    const fetch = jest.fn(async () => new Response(null, { status: 201 }));
    const auth = mockServices.auth();
    const getPluginRequestToken = jest.spyOn(auth, 'getPluginRequestToken');
    const client = new DefaultApiBackendClient({
      discovery: mockServices.discovery(),
      auth,
      fetchApi: { fetch },
    });

    await client.postEvent(request);

    expect(getPluginRequestToken).toHaveBeenCalledWith({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'events',
    });
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: 'events',
    });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:0/api/events/bus/v1/events',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  });

  it('uses an explicit token instead of requesting one', async () => {
    const fetch = jest.fn(async () => new Response(null, { status: 201 }));
    const auth = mockServices.auth();
    const getPluginRequestToken = jest.spyOn(auth, 'getPluginRequestToken');
    const client = new DefaultApiBackendClient({
      discovery: mockServices.discovery(),
      auth,
      fetchApi: { fetch },
    });

    await client.postEvent(request, { token: 'my-token' });

    expect(getPluginRequestToken).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer my-token',
        },
      }),
    );
  });
});
