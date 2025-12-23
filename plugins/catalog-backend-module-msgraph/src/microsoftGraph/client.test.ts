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

import { TokenCredential } from '@azure/identity';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MicrosoftGraphClient } from './client';

describe('MicrosoftGraphClient', () => {
  const tokenCredential: jest.Mocked<TokenCredential> = {
    getToken: jest.fn(),
  } as any;
  let client: MicrosoftGraphClient;
  const worker = setupServer();

  registerMswTestHooks(worker);

  beforeEach(() => {
    tokenCredential.getToken.mockResolvedValue({
      token: 'ACCESS_TOKEN',
    } as any);
    client = new MicrosoftGraphClient('https://example.com', tokenCredential);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should perform raw request', async () => {
    worker.use(
      http.get('https://other.example.com/', () =>
        HttpResponse.json({ value: 'example' }, { status: 200 }),
      ),
    );

    const response = await client.requestRaw('https://other.example.com/');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ value: 'example' });
    expect(tokenCredential.getToken).toHaveBeenCalledTimes(1);
    expect(tokenCredential.getToken).toHaveBeenCalledWith(
      'https://other.example.com/.default',
    );
  });

  it('should perform simple api request', async () => {
    worker.use(
      http.get('https://example.com/users', () =>
        HttpResponse.json({ value: 'example' }, { status: 200 }),
      ),
    );

    const response = await client.requestApi('users');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ value: 'example' });
  });

  it('should perform api request with filter, select, expand and top', async () => {
    worker.use(
      http.get('https://example.com/users', ({ request }) =>
        HttpResponse.json(
          { queryString: new URL(request.url).search },
          { status: 200 },
        ),
      ),
    );

    const response = await client.requestApi('users', {
      filter: 'test eq true',
      expand: 'children',
      select: ['id', 'children'],
      top: 471,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      queryString:
        '?%24filter=test%20eq%20true&%24select=id%2Cchildren&%24expand=children&%24top=471',
    });
  });

  it('should correctly encode filter with special characters like "&"', async () => {
    worker.use(
      http.get('https://example.com/users', ({ request }) =>
        HttpResponse.json(
          { queryString: new URL(request.url).search },
          { status: 200 },
        ),
      ),
    );

    const response = await client.requestApi('users', {
      filter: "department eq 'research & development'",
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      queryString:
        '?%24filter=department%20eq%20%27research%20%26%20development%27',
    });
  });

  it('should perform collection request for a single page', async () => {
    worker.use(
      http.get('https://example.com/users', () =>
        HttpResponse.json(
          {
            value: ['first'],
          },
          { status: 200 },
        ),
      ),
    );

    const values = await collectAsyncIterable(
      client.requestCollection<string>('users'),
    );

    expect(values).toEqual(['first']);
  });

  it('should perform collection request for multiple pages', async () => {
    worker.use(
      http.get('https://example.com/users', () =>
        HttpResponse.json(
          {
            value: ['first'],
            '@odata.nextLink': 'https://example.com/users2',
          },
          { status: 200 },
        ),
      ),
    );
    worker.use(
      http.get('https://example.com/users2', () =>
        HttpResponse.json({ value: ['second'] }, { status: 200 }),
      ),
    );

    const values = await collectAsyncIterable(
      client.requestCollection<string>('users'),
    );

    expect(values).toEqual(['first', 'second']);
  });

  it('should load user profile photo with max size of 120', async () => {
    worker.use(
      http.get('https://example.com/users/user-id/photos', () =>
        HttpResponse.json(
          {
            value: [
              {
                height: 120,
                id: 120,
              },
              {
                height: 500,
                id: 500,
              },
            ],
          },
          { status: 200 },
        ),
      ),
    );
    worker.use(
      http.get('https://example.com/users/user-id/photos/120/*', () =>
        HttpResponse.text('911', { status: 200 }),
      ),
    );

    const photo = await client.getUserPhotoWithSizeLimit('user-id', 120);

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should not fail if user has no profile photo', async () => {
    worker.use(
      http.get(
        'https://example.com/users/user-id/photos',
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const photo = await client.getUserPhotoWithSizeLimit('user-id', 120);

    expect(photo).toBeFalsy();
  });

  it('should load user profile photo', async () => {
    worker.use(
      http.get('https://example.com/users/user-id/photo/*', () =>
        HttpResponse.text('911', { status: 200 }),
      ),
    );

    const photo = await client.getUserPhoto('user-id');

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load user profile photo for size 120', async () => {
    worker.use(
      http.get('https://example.com/users/user-id/photos/120/*', () =>
        HttpResponse.text('911', { status: 200 }),
      ),
    );

    const photo = await client.getUserPhoto('user-id', '120');

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load users', async () => {
    worker.use(
      http.get('https://example.com/users', () =>
        HttpResponse.json(
          {
            value: [{ surname: 'Example' }],
          },
          { status: 200 },
        ),
      ),
    );

    const values = await collectAsyncIterable(client.getUsers());

    expect(values).toEqual([{ surname: 'Example' }]);
  });

  it('should load group profile photo with max size of 120', async () => {
    worker.use(
      http.get('https://example.com/groups/group-id/photos', () =>
        HttpResponse.json(
          {
            value: [
              {
                height: 120,
                id: 120,
              },
            ],
          },
          { status: 200 },
        ),
      ),
    );
    worker.use(
      http.get('https://example.com/groups/group-id/photos/120/*', () =>
        HttpResponse.text('911', { status: 200 }),
      ),
    );

    const photo = await client.getGroupPhotoWithSizeLimit('group-id', 120);

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load group profile photo', async () => {
    worker.use(
      http.get('https://example.com/groups/group-id/photo/*', () =>
        HttpResponse.text('911', { status: 200 }),
      ),
    );

    const photo = await client.getGroupPhoto('group-id');

    expect(photo).toEqual('data:image/jpeg;base64,OTEx');
  });

  it('should load groups', async () => {
    worker.use(
      http.get('https://example.com/groups', () =>
        HttpResponse.json(
          {
            value: [{ displayName: 'Example' }],
          },
          { status: 200 },
        ),
      ),
    );

    const values = await collectAsyncIterable(client.getGroups());

    expect(values).toEqual([{ displayName: 'Example' }]);
  });

  it('should load group members', async () => {
    worker.use(
      http.get('https://example.com/groups/group-id/members', () =>
        HttpResponse.json(
          {
            value: [
              { '@odata.type': '#microsoft.graph.user' },
              { '@odata.type': '#microsoft.graph.group' },
            ],
          },
          { status: 200 },
        ),
      ),
    );

    const values = await collectAsyncIterable(
      client.getGroupMembers('group-id'),
    );

    expect(values).toEqual([
      { '@odata.type': '#microsoft.graph.user' },
      { '@odata.type': '#microsoft.graph.group' },
    ]);
  });

  it('should load user group members', async () => {
    worker.use(
      http.get(
        'https://example.com/groups/group-id/members/microsoft.graph.user',
        () =>
          HttpResponse.json(
            {
              value: [{ id: '12345' }, { id: '67890' }],
            },
            { status: 200 },
          ),
      ),
    );

    const values = await collectAsyncIterable(
      client.getGroupUserMembers('group-id'),
    );

    expect(values).toEqual([{ id: '12345' }, { id: '67890' }]);
  });

  it('should load organization', async () => {
    worker.use(
      http.get('https://example.com/organization/tenant-id', () =>
        HttpResponse.json(
          {
            displayName: 'Example',
          },
          { status: 200 },
        ),
      ),
    );

    const organization = await client.getOrganization('tenant-id');

    expect(organization).toEqual({ displayName: 'Example' });
  });
});

async function collectAsyncIterable<T>(
  iterable: AsyncIterable<T>,
): Promise<T[]> {
  const values = [];
  for await (const value of iterable) {
    values.push(value);
  }
  return values;
}
