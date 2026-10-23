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
import type { Config } from '@backstage/config';
import { ConflictError, NotFoundError } from '@backstage/errors';
import type { Client } from '@microsoft/microsoft-graph-client';
import {
  type ClientWrapper,
  MicrosoftGraphClient,
} from './MicrosoftGraphClient';

class ApiClientMock implements ClientWrapper {
  readonly get = jest.fn();
  readonly post = jest.fn();
  readonly patch = jest.fn();
  readonly delete = jest.fn();
  readonly api = jest.fn(() => this);

  async clientCall<T>(call: (client: Client) => Promise<T>): Promise<T> {
    return call(this as unknown as Client);
  }
}

jest.mock('@microsoft/microsoft-graph-client', () => ({
  Client: jest.fn(),
}));

describe('MicrosoftGraphClient', () => {
  let config: Config;
  let client: MicrosoftGraphClient;
  let apiClientMock: ApiClientMock;

  beforeEach(() => {
    config = mockServices.rootConfig({
      data: {
        events: {
          modules: {
            msgraph: {
              notificationUrl: 'http://localhost:7007/api/events/http/msgraph',
              subscriptionResources: ['users', 'groups'],
              tenantId: 'tenant',
              clientId: 'client',
              clientSecret: 'secret',
            },
          },
        },
      },
    });

    apiClientMock = new ApiClientMock();

    client = MicrosoftGraphClient.fromConfig(config, apiClientMock);
    jest.clearAllMocks();
  });

  describe('fromConfig', () => {
    it('throws if config is missing required fields', () => {
      const badConfig = mockServices.rootConfig({
        data: {},
      });
      expect(() => MicrosoftGraphClient.fromConfig(badConfig)).toThrow();
    });

    it('uses the provided client wrapper without requiring auth config', () => {
      const badConfig = mockServices.rootConfig({
        data: {},
      });
      expect(
        MicrosoftGraphClient.fromConfig(badConfig, apiClientMock),
      ).toBeInstanceOf(MicrosoftGraphClient);
    });

    it('returns a client if config is valid', () => {
      expect(MicrosoftGraphClient.fromConfig(config)).toBeInstanceOf(
        MicrosoftGraphClient,
      );
    });
  });

  describe('getSubscription', () => {
    it('calls MS Graph API with correct path', async () => {
      const fakeSub = { id: 'subid' };
      apiClientMock.get.mockResolvedValue(fakeSub);
      const result = await client.getSubscription('subid');
      expect(apiClientMock.api).toHaveBeenCalledWith('/subscriptions/subid');
      expect(apiClientMock.get).toHaveBeenCalled();
      expect(result).toBe(fakeSub);
    });

    it('throws a NotFoundError when the subscription does not exist', async () => {
      apiClientMock.get.mockRejectedValue({ statusCode: 404 });

      await expect(client.getSubscription('missing')).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it('throws a ConflictError when Microsoft Graph reports a conflict', async () => {
      apiClientMock.get.mockRejectedValue({ statusCode: 409 });

      await expect(client.getSubscription('subid')).rejects.toBeInstanceOf(
        ConflictError,
      );
    });
  });

  describe('listSubscriptions', () => {
    it('follows paging links and returns all subscriptions', async () => {
      apiClientMock.get
        .mockResolvedValueOnce({
          value: [{ id: 'a' }],
          '@odata.nextLink': 'https://graph.microsoft.com/v1.0/next',
        })
        .mockResolvedValueOnce({ value: [{ id: 'b' }] });

      await expect(client.listSubscriptions()).resolves.toEqual([
        { id: 'a' },
        { id: 'b' },
      ]);
      expect(apiClientMock.api.mock.calls).toEqual([
        ['/subscriptions'],
        ['https://graph.microsoft.com/v1.0/next'],
      ]);
    });
  });

  describe('createSubscription', () => {
    it('calls MS Graph API with correct params and returns subscription', async () => {
      const fakeSub = { id: 'subid', expirationDateTime: undefined };
      apiClientMock.post.mockResolvedValue(fakeSub);
      const result = await client.createSubscription({
        resource: 'users',
        validationToken: 'token',
        changeType: 'updated,deleted',
        notificationUrl: 'http://localhost:7007/api/events/http/msgraph',
        expirationDateTime: new Date('2025-01-01T00:00:00.000Z'),
      });
      expect(apiClientMock.api).toHaveBeenCalledWith('/subscriptions');
      expect(apiClientMock.post).toHaveBeenCalledWith({
        changeType: 'updated,deleted',
        notificationUrl: 'http://localhost:7007/api/events/http/msgraph',
        resource: 'users',
        expirationDateTime: '2025-01-01T00:00:00.000Z',
        clientState: 'token',
      });
      expect(result.id).toBe('subid');
      expect(result.expirationDateTime).toBeDefined();
    });
  });

  describe('renewSubscription', () => {
    it('calls MS Graph API with the subscription path and new expiration', async () => {
      const expirationDateTime = new Date('2025-02-01T00:00:00.000Z');
      apiClientMock.patch.mockResolvedValue({});

      const result = await client.renewSubscription({
        subscriptionId: 'subid',
        expirationDateTime,
      });

      expect(apiClientMock.api).toHaveBeenCalledWith('/subscriptions/subid');
      expect(apiClientMock.patch).toHaveBeenCalledWith({
        expirationDateTime: '2025-02-01T00:00:00.000Z',
      });
      expect(result).toEqual({
        id: 'subid',
        expirationDateTime: '2025-02-01T00:00:00.000Z',
      });
    });
  });

  describe('deleteSubscription', () => {
    it('calls clientCall with correct path', async () => {
      await client.deleteSubscription('subid');
      expect(apiClientMock.api).toHaveBeenCalledWith('/subscriptions/subid');
      expect(apiClientMock.delete).toHaveBeenCalled();
    });
  });
});
