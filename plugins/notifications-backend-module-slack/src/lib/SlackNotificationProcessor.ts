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
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity, UserEntity, parseEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { Notification } from '@backstage/plugin-notifications-common';
import {
  NotificationProcessor,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { durationToMilliseconds } from '@backstage/types';
import DataLoader from 'dataloader';
import pThrottle from 'p-throttle';
import { ANNOTATION_SLACK_NOTIFICATIONS } from './constants';
import { SlackNotificationOptions } from './types';

export class SlackNotificationProcessor implements NotificationProcessor {
  private readonly logger: LoggerService;
  private readonly directWebhookUrl?: string;
  private readonly channelWebhookUrl?: string;
  private readonly catalogClient: CatalogClient;
  private readonly auth: AuthService;
  private readonly sendSlackNotifications;

  static fromConfig(
    config: Config,
    options: {
      auth: AuthService;
      discovery: DiscoveryService;
      logger: LoggerService;
      catalogClient: CatalogClient;
    },
  ): SlackNotificationProcessor[] {
    const slackConfig =
      config.getOptionalConfigArray('notifications.processors.slack') ?? [];
    return slackConfig.map(c => {
      const directWebhookUrl = c.getOptionalString('directWebhookUrl');
      const channelWebhookUrl = c.getOptionalString('channelWebhookUrl');
      return new SlackNotificationProcessor({
        directWebhookUrl,
        channelWebhookUrl,
        ...options,
      });
    });
  }

  private constructor(options: {
    auth: AuthService;
    discovery: DiscoveryService;
    logger: LoggerService;
    directWebhookUrl?: string;
    channelWebhookUrl?: string;
    catalogClient: CatalogClient;
  }) {
    const { auth, catalogClient, directWebhookUrl, channelWebhookUrl, logger } =
      options;
    this.logger = logger;
    this.directWebhookUrl = directWebhookUrl;
    this.channelWebhookUrl = channelWebhookUrl;
    this.catalogClient = catalogClient;
    this.auth = auth;

    // https://api.slack.com/apis/rate-limits
    const throttle = pThrottle({
      limit: 10,
      interval: durationToMilliseconds({ minutes: 1 }),
    });
    const throttled = throttle(opts => sendSlackNotification(opts));
    this.sendSlackNotifications = async (opts: SlackNotificationOptions[]) =>
      await Promise.all(opts.map(message => throttled(message)));
  }

  getName(): string {
    return 'Slack';
  }

  async processOptions(
    options: NotificationSendOptions,
  ): Promise<NotificationSendOptions> {
    if (!this.channelWebhookUrl || options.recipients.type !== 'entity') {
      return options;
    }

    const entityRefs = [options.recipients.entityRef].flat();

    const outbound: SlackNotificationOptions[] = [];
    await Promise.all(
      entityRefs.map(async entityRef => {
        const compoundEntityRef = parseEntityRef(entityRef);
        // skip users as they are sent direct messages, but allow all other entity kinds
        // to have a channel id annotation.
        if (compoundEntityRef.kind === 'user') {
          return;
        }

        let destination;
        try {
          destination = await this.getChannelFromEntity(entityRef);
        } catch (error) {
          this.logger.error(
            `Failed to get Slack channel for entity: ${error.message}`,
          );
          return;
        }

        if (!destination) {
          this.logger.debug(`No Slack channel found for entity: ${entityRef}`);
          return;
        }

        const payload = JSON.stringify({
          ...options.payload,
          destination,
        });

        this.logger.debug(`Sending Slack channel notification: ${payload}`);
        outbound.push({ url: this.channelWebhookUrl!, payload });
      }),
    );

    await this.sendSlackNotifications(outbound).catch(error => {
      this.logger.error(
        `Failed to send Slack channel notification: ${error.message}`,
      );
    });

    if (outbound.length > 0) {
      // If we sent team notifications, we don't want to send individual ones after resolving the group
      // This is how we prevent the other methods from sending individual notifications.
      // Given the current logic, if a Group has no slack channel id annotation, we'll let it get expanded to individuals.
      options.recipients.entityRef = [];
    }
    return options;
  }

  async postProcess(
    notification: Notification,
    options: NotificationSendOptions,
  ): Promise<void> {
    if (
      !this.directWebhookUrl ||
      options.recipients.type === 'broadcast' ||
      !notification.user
    ) {
      return;
    }

    const destination = await this.getEmailFromUser(notification.user);
    if (!destination) {
      this.logger.debug(`No email found for user entity: ${notification.user}`);
      return;
    }

    const payload = JSON.stringify({
      ...notification.payload,
      destination,
    });

    this.logger.debug(`Sending Slack DM notification: ${payload}`);

    // batch it up
    await this.sendSlackNotifications([
      { url: this.directWebhookUrl!, payload },
    ]);
  }

  async getEntities(
    entityRefs: readonly string[],
  ): Promise<(Entity | undefined)[]> {
    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    const response = await this.catalogClient.getEntitiesByRefs(
      {
        entityRefs: entityRefs.slice(),
        fields: [
          `metadata.annotations.${ANNOTATION_SLACK_NOTIFICATIONS}`,
          'spec.profile.email',
        ],
      },
      {
        token,
      },
    );

    return response.items;
  }

  async getEmailFromUser(entityRef: string): Promise<string> {
    const entityLoader = new DataLoader<string, Entity | undefined>(
      entityRefs => this.getEntities(entityRefs),
    );
    const entity = await entityLoader.load(entityRef);

    const email = (entity as UserEntity)?.spec?.profile?.email;
    if (!email) {
      throw new Error(`Email not found for entity: ${entityRef}`);
    }

    return email;
  }

  async getChannelFromEntity(entityRef: string): Promise<string | undefined> {
    const entityLoader = new DataLoader<string, Entity | undefined>(
      entityRefs => this.getEntities(entityRefs),
    );
    const entity = await entityLoader.load(entityRef);

    return entity?.metadata.annotations?.[ANNOTATION_SLACK_NOTIFICATIONS];
  }
}

async function sendSlackNotification(
  options: SlackNotificationOptions,
): Promise<void> {
  const { url, payload } = options;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to send Slack notification: ${response.status} ${response.statusText}`,
    );
  }
}
