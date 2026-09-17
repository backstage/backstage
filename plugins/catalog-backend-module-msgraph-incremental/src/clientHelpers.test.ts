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

import { MicrosoftGraphClient } from '@backstage/plugin-catalog-backend-module-msgraph';
import { getUserPhotoGated, requestOnePage } from './clientHelpers';

function makeResponse(status: number, body: unknown): Response {
  return {
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe('requestOnePage', () => {
  const client = {
    requestApi: jest.fn(),
    requestRaw: jest.fn(),
  } as unknown as jest.Mocked<MicrosoftGraphClient>;

  afterEach(() => jest.resetAllMocks());

  it('fetches a basic page using requestApi', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, {
        value: [{ id: '1', displayName: 'Alice' }],
      }),
    );

    const result = await requestOnePage<{ id: string }>(client, 'users', {
      query: { top: 999 },
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('1');
    expect(result.nextLink).toBeUndefined();
    expect(client.requestApi).toHaveBeenCalledWith(
      'users',
      { top: 999 },
      {},
      undefined,
    );
  });

  it('adds ConsistencyLevel and $count for advanced mode with filter', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );

    await requestOnePage(client, 'users', {
      query: {
        filter: 'accountEnabled eq true and jobTitle ne null',
        top: 999,
      },
      queryMode: 'advanced',
    });

    expect(client.requestApi).toHaveBeenCalledWith(
      'users',
      expect.objectContaining({ count: true }),
      { ConsistencyLevel: 'eventual' },
      undefined,
    );
  });

  it('adds ConsistencyLevel and $count for advanced mode without filter', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );

    await requestOnePage(client, 'groups', {
      query: { top: 999 },
      queryMode: 'advanced',
    });

    expect(client.requestApi).toHaveBeenCalledWith(
      'groups',
      expect.objectContaining({ count: true }),
      { ConsistencyLevel: 'eventual' },
      undefined,
    );
  });

  it('auto-promotes to advanced mode when $search is present', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );

    await requestOnePage(client, 'groups', {
      query: { search: '"displayName:Sales"', top: 10 },
    });

    expect(client.requestApi).toHaveBeenCalledWith(
      'groups',
      expect.objectContaining({ count: true }),
      { ConsistencyLevel: 'eventual' },
      undefined,
    );
  });

  it('sends $count=true in advanced mode even when no query is provided', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );

    await requestOnePage(client, 'users', { queryMode: 'advanced' });

    expect(client.requestApi).toHaveBeenCalledWith(
      'users',
      expect.objectContaining({ count: true }),
      { ConsistencyLevel: 'eventual' },
      undefined,
    );
  });

  it('does not set $count for basic mode', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );

    await requestOnePage(client, 'users', {
      query: { filter: 'accountEnabled eq true', top: 999 },
      queryMode: 'basic',
    });

    expect(client.requestApi).toHaveBeenCalledWith(
      'users',
      expect.not.objectContaining({ count: true }),
      {},
      undefined,
    );
  });

  it('follows nextLink using requestRaw', async () => {
    const nextLink =
      'https://graph.microsoft.com/v1.0/users?$skiptoken=abc123&$count=true';
    (client.requestRaw as jest.Mock).mockResolvedValue(
      makeResponse(200, {
        value: [{ id: '2' }],
        '@odata.nextLink':
          'https://graph.microsoft.com/v1.0/users?$skiptoken=def456',
      }),
    );

    const result = await requestOnePage(client, 'users', { nextLink });

    expect(client.requestRaw).toHaveBeenCalledWith(nextLink, {}, 2, undefined);
    expect(client.requestApi).not.toHaveBeenCalled();
    expect(result.items).toHaveLength(1);
    expect(result.nextLink).toBe(
      'https://graph.microsoft.com/v1.0/users?$skiptoken=def456',
    );
  });

  it('passes ConsistencyLevel header when following nextLink in advanced mode', async () => {
    const nextLink = 'https://graph.microsoft.com/v1.0/groups?$skiptoken=xyz';
    (client.requestRaw as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );

    await requestOnePage(client, 'groups', {
      query: { filter: 'securityEnabled eq true', top: 999 },
      queryMode: 'advanced',
      nextLink,
    });

    expect(client.requestRaw).toHaveBeenCalledWith(
      nextLink,
      { ConsistencyLevel: 'eventual' },
      2,
      undefined,
    );
  });

  it('returns nextLink from response when present', async () => {
    const expectedNextLink =
      'https://graph.microsoft.com/v1.0/users?$skiptoken=page2';
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, {
        value: Array(999).fill({ id: 'x' }),
        '@odata.nextLink': expectedNextLink,
      }),
    );

    const result = await requestOnePage(client, 'users', {});

    expect(result.nextLink).toBe(expectedNextLink);
    expect(result.items).toHaveLength(999);
  });

  it('throws a descriptive error on non-200 response', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(403, {
        error: {
          code: 'Authorization_RequestDenied',
          message: 'Access denied',
        },
      }),
    );

    await expect(requestOnePage(client, 'users', {})).rejects.toThrow(
      'Authorization_RequestDenied - Access denied',
    );
  });

  it('passes AbortSignal through to the client', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue(
      makeResponse(200, { value: [] }),
    );
    const signal = new AbortController().signal;

    await requestOnePage(client, 'users', { signal });

    expect(client.requestApi).toHaveBeenCalledWith(
      'users',
      undefined,
      {},
      signal,
    );
  });
});

describe('getUserPhotoGated', () => {
  const client = {
    requestApi: jest.fn(),
    getUserPhotoWithSizeLimit: jest.fn(),
  } as unknown as jest.Mocked<MicrosoftGraphClient>;

  afterEach(() => jest.resetAllMocks());

  it('returns undefined when the photo check returns 404', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue({
      status: 404,
    } as Response);

    const result = await getUserPhotoGated(client, 'user-id', 120);

    expect(result).toBeUndefined();
    expect(client.getUserPhotoWithSizeLimit).not.toHaveBeenCalled();
  });

  it('throws for non-404 error responses so callers can distinguish real errors', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue({
      status: 403,
    } as Response);

    await expect(getUserPhotoGated(client, 'user-id', 120)).rejects.toThrow(
      'Unexpected status 403 when checking photo for user user-id',
    );
    expect(client.getUserPhotoWithSizeLimit).not.toHaveBeenCalled();
  });

  it('returns the photo data URI when the check passes', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue({
      status: 200,
    } as Response);
    (client.getUserPhotoWithSizeLimit as jest.Mock).mockResolvedValue(
      'data:image/jpeg;base64,/9j/abc123',
    );

    const result = await getUserPhotoGated(client, 'user-id', 120);

    expect(result).toBe('data:image/jpeg;base64,/9j/abc123');
    expect(client.requestApi).toHaveBeenCalledWith('users/user-id/photo');
    expect(client.getUserPhotoWithSizeLimit).toHaveBeenCalledWith(
      'user-id',
      120,
    );
  });

  it('passes the maxSize limit to getUserPhotoWithSizeLimit', async () => {
    (client.requestApi as jest.Mock).mockResolvedValue({
      status: 200,
    } as Response);
    (client.getUserPhotoWithSizeLimit as jest.Mock).mockResolvedValue(
      undefined,
    );

    await getUserPhotoGated(client, 'user-abc', 48);

    expect(client.getUserPhotoWithSizeLimit).toHaveBeenCalledWith(
      'user-abc',
      48,
    );
  });
});
