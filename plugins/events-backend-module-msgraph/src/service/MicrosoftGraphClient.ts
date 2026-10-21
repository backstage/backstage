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
import { ClientSecretCredential } from '@azure/identity';
import type { Config } from '@backstage/config';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { Client } from '@microsoft/microsoft-graph-client';
import type { Subscription } from '@microsoft/microsoft-graph-types';

/**
 * Abstracts the Microsoft Graph client calls.
 * Simplifies mocking for tests.
 *
 * @internal
 */
export interface ClientWrapper {
  clientCall: <T>(call: (client: Client) => Promise<T>) => Promise<T>;
}

class ClientWrapperImpl implements ClientWrapper {
  static fromConfig(config: Config): ClientWrapper {
    // Fail fast if the configuration is missing or incomplete
    config.getString('events.modules.msgraph.tenantId');
    config.getString('events.modules.msgraph.clientId');
    config.getString('events.modules.msgraph.clientSecret');

    return new ClientWrapperImpl(config);
  }

  private constructor(private readonly config: Config) {}

  async clientCall<T>(call: (client: Client) => Promise<T>): Promise<T> {
    const { token } = await this.getToken();
    const client = Client.init({
      authProvider: done => done(null, token),
    });
    return call(client);
  }

  private async getToken() {
    const credential = new ClientSecretCredential(
      this.config.getString('events.modules.msgraph.tenantId'),
      this.config.getString('events.modules.msgraph.clientId'),
      this.config.getString('events.modules.msgraph.clientSecret'),
    );

    const token = await credential.getToken(
      'https://graph.microsoft.com/.default',
    );

    if (!token) {
      throw new Error('Failed to acquire access token for Microsoft Graph');
    }

    return token;
  }
}

/**
 * Client for interacting with Microsoft Graph Subscriptions API.
 * @internal
 */
export class MicrosoftGraphClient {
  static fromConfig(
    config: Config,
    clientWrapper?: ClientWrapper,
  ): MicrosoftGraphClient {
    return new MicrosoftGraphClient(
      clientWrapper ?? ClientWrapperImpl.fromConfig(config),
    );
  }

  private constructor(private readonly clientWrapper: ClientWrapper) {}

  async getSubscription(subscriptionId: string) {
    const subscription: Subscription = await this.clientCall(ms =>
      ms.api(`/subscriptions/${subscriptionId}`).get(),
    );
    return subscription;
  }

  async createSubscription({
    resource,
    validationToken,
    notificationUrl,
    expirationDateTime,
  }: {
    resource: string;
    validationToken: string;
    notificationUrl: string;
    expirationDateTime: Date;
  }) {
    const subscription: Subscription = await this.clientCall(ms =>
      ms.api('/subscriptions').post({
        changeType: 'updated,deleted',
        notificationUrl,
        resource,
        expirationDateTime: expirationDateTime.toISOString(),
        clientState: validationToken,
      }),
    );

    if (!subscription.expirationDateTime) {
      subscription.expirationDateTime = expirationDateTime.toISOString();
    }

    return subscription as Subscription & {
      id: string;
      expirationDateTime: string;
    };
  }

  async deleteSubscription(subscriptionId: string) {
    await this.clientCall(ms =>
      ms.api(`/subscriptions/${subscriptionId}`).delete(),
    );
  }

  async renewSubscription({
    subscriptionId,
    expirationDateTime,
  }: {
    subscriptionId: string;
    expirationDateTime: Date;
  }) {
    const subscription: Subscription = await this.clientCall(ms =>
      ms.api(`/subscriptions/${subscriptionId}`).patch({
        expirationDateTime: expirationDateTime.toISOString(),
      }),
    );

    if (!subscription.expirationDateTime) {
      subscription.expirationDateTime = expirationDateTime.toISOString();
    }

    if (!subscription.id) {
      subscription.id = subscriptionId;
    }

    return subscription as Subscription & {
      id: string;
      expirationDateTime: string;
    };
  }

  private async clientCall<T>(
    call: (client: Client) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.clientWrapper.clientCall(call);
    } catch (err) {
      if (typeof err !== 'object' || err === null || !('statusCode' in err)) {
        throw err;
      }

      if (err.statusCode === 404) {
        throw new NotFoundError('Microsoft Graph subscription not found', err);
      }

      if (err.statusCode === 409) {
        throw new ConflictError('Microsoft Graph subscription conflict', err);
      }

      throw err;
    }
  }
}
