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
import type { Client } from '@microsoft/microsoft-graph-client';
import type { Subscription } from '@microsoft/microsoft-graph-types';
import {
  type ClientWrapper,
  MicrosoftGraphClient,
} from './MicrosoftGraphClient';

class ApiClientMock implements ClientWrapper {
  readonly get = jest.fn();
  readonly post = jest.fn();
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
  });

  describe('validateActiveSubscription', () => {
    it('returns isValid=true if all checks pass', async () => {
      const now = new Date();
      const subscriptionObject = {
        expirationDateTime: new Date(now.getTime() + 100000).toISOString(),
        notificationUrl: 'http://localhost:7007/api/events/http/msgraph',
      } as Subscription;
      apiClientMock.get.mockResolvedValue(subscriptionObject);

      const result = await client.validateActiveSubscription('subid');
      expect(apiClientMock.api).toHaveBeenCalledWith('/subscriptions/subid');
      expect(result).toEqual({
        exists: true,
        isActive: true,
        notificationUrlMatches: true,
        isValid: true,
      });
    });

    it('returns isValid=false if subscription does not exist', async () => {
      apiClientMock.get.mockResolvedValue(undefined);
      const result = await client.validateActiveSubscription('subid');
      expect(result).toEqual({
        exists: false,
        isActive: false,
        notificationUrlMatches: false,
        isValid: false,
      });
    });

    it('returns isValid=false if subscription is expired', async () => {
      apiClientMock.get.mockResolvedValue({
        expirationDateTime: new Date(Date.now() - 100000).toISOString(),
        notificationUrl: 'http://localhost:7007/api/events/http/msgraph',
      } as Subscription);
      const result = await client.validateActiveSubscription('subid');
      expect(result.isActive).toBe(false);
      expect(result.isValid).toBe(false);
    });

    it('returns isValid=false if notificationUrl does not match', async () => {
      apiClientMock.get.mockResolvedValue({
        expirationDateTime: new Date(Date.now() + 100000).toISOString(),
        notificationUrl: 'http://wrong-url',
      } as Subscription);
      const result = await client.validateActiveSubscription('subid');
      expect(result.notificationUrlMatches).toBe(false);
      expect(result.isValid).toBe(false);
    });
  });

  describe('createSubscription', () => {
    it('calls MS Graph API with correct params and returns subscription', async () => {
      const fakeSub = { id: 'subid', expirationDateTime: undefined };
      apiClientMock.post.mockResolvedValue(fakeSub);
      const result = await client.createSubscription({
        resource: 'users',
        validationToken: 'token',
      });
      expect(apiClientMock.api).toHaveBeenCalledWith('/subscriptions');
      expect(apiClientMock.post).toHaveBeenCalledWith({
        changeType: 'updated,deleted',
        notificationUrl: 'http://localhost:7007/api/events/http/msgraph',
        resource: 'users',
        expirationDateTime: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, // ISO date format
        ),
        clientState: 'token',
      });
      expect(result.id).toBe('subid');
      expect(result.expirationDateTime).toBeDefined();
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
