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
import { Client } from '@microsoft/microsoft-graph-client';
import type { Subscription } from '@microsoft/microsoft-graph-types';

/**
 * 45 is the minimal subscription duration according to
 * https://learn.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0
 */
const SUBSCRIPTION_DURATION_MS = 45 * 60 * 1000; // 45 minutes

/**
 * @internal
 */
export type SubscriptionValidationResult = {
  isValid: boolean;
  exists: boolean;
  isActive: boolean;
  notificationUrlMatches: boolean;
};

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
    // Fail fast if the configuration is missing or incomplete
    config.getConfig('events.modules.msgraph.notificationUrl');

    return new MicrosoftGraphClient(
      config,
      clientWrapper ?? ClientWrapperImpl.fromConfig(config),
    );
  }

  private constructor(
    private readonly config: Config,
    private readonly clientWrapper: ClientWrapper,
  ) {}

  async validateActiveSubscription(
    subscriptionId: string,
  ): Promise<SubscriptionValidationResult> {
    const subscription = await this.getSubscription(subscriptionId);
    const exists = Boolean(subscription);
    const isActive = Boolean(
      subscription &&
        subscription.expirationDateTime &&
        new Date(subscription.expirationDateTime) >= new Date(),
    );
    const notificationUrlMatches = Boolean(
      subscription &&
        subscription.notificationUrl === this.getNotificationUrl(),
    );

    return {
      exists,
      isActive,
      notificationUrlMatches,
      isValid: exists && isActive && notificationUrlMatches,
    };
  }

  async getSubscription(subscriptionId: string) {
    const subscription: Subscription | undefined = await this.clientCall(ms =>
      ms.api(`/subscriptions/${subscriptionId}`).get(),
    );
    return subscription;
  }

  async createSubscription({
    resource,
    validationToken,
  }: {
    resource: string;
    validationToken: string;
  }) {
    const expirationDateTime = new Date(
      Date.now() + SUBSCRIPTION_DURATION_MS,
    ).toISOString();

    const subscription: Subscription = await this.clientCall(ms =>
      ms.api('/subscriptions').post({
        changeType: 'updated,deleted',
        notificationUrl: this.getNotificationUrl(),
        resource,
        expirationDateTime,
        clientState: validationToken,
      }),
    );

    if (!subscription.expirationDateTime) {
      subscription.expirationDateTime = expirationDateTime;
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

  private async clientCall<T>(
    call: (client: Client) => Promise<T>,
  ): Promise<T> {
    return this.clientWrapper.clientCall(call);
  }

  private getNotificationUrl() {
    return this.config.getString('events.modules.msgraph.notificationUrl');
  }
}
