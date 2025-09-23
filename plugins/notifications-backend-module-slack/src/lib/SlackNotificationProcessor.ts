/*
 * Copyright 2025 The Backstage Authors
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

import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import {
  Entity,
  isUserEntity,
  parseEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import { Notification } from '@backstage/plugin-notifications-common';
import {
  NotificationProcessor,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { durationToMilliseconds } from '@backstage/types';
import { Counter, metrics } from '@opentelemetry/api';
import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import DataLoader from 'dataloader';
import pThrottle from 'p-throttle';
import { ANNOTATION_SLACK_BOT_NOTIFY } from './constants';
import { ExpiryMap, toChatPostMessageArgs } from './util';
import { CatalogService } from '@backstage/plugin-catalog-node';

export class SlackNotificationProcessor implements NotificationProcessor {
  private readonly logger: LoggerService;
  private readonly catalog: CatalogService;
  private readonly auth: AuthService;
  private readonly slack: WebClient;
  private readonly sendNotifications: (
    opts: ChatPostMessageArguments[],
  ) => Promise<void>;
  private readonly messagesSent: Counter;
  private readonly messagesFailed: Counter;
  private readonly broadcastChannels?: string[];
  private readonly entityLoader: DataLoader<string, Entity | undefined>;

  static fromConfig(
    config: Config,
    options: {
      auth: AuthService;
      logger: LoggerService;
      catalog: CatalogService;
      slack?: WebClient;
      broadcastChannels?: string[];
    },
  ): SlackNotificationProcessor[] {
    const slackConfig =
      config.getOptionalConfigArray('notifications.processors.slack') ?? [];
    return slackConfig.map(c => {
      const token = c.getString('token');
      const slack = options.slack ?? new WebClient(token);
      const broadcastChannels = c.getOptionalStringArray('broadcastChannels');
      return new SlackNotificationProcessor({
        slack,
        broadcastChannels,
        ...options,
      });
    });
  }

  private constructor(options: {
    slack: WebClient;
    auth: AuthService;
    logger: LoggerService;
    catalog: CatalogService;
    broadcastChannels?: string[];
  }) {
    const { auth, catalog, logger, slack, broadcastChannels } = options;
    this.logger = logger;
    this.catalog = catalog;
    this.auth = auth;
    this.slack = slack;
    this.broadcastChannels = broadcastChannels;

    this.entityLoader = new DataLoader<string, Entity | undefined>(
      async entityRefs => {
        return await this.catalog
          .getEntitiesByRefs(
            {
              entityRefs: entityRefs.slice(),
              fields: [
                `kind`,
                `spec.profile.email`,
                `metadata.annotations.${ANNOTATION_SLACK_BOT_NOTIFY}`,
              ],
            },
            { credentials: await this.auth.getOwnServiceCredentials() },
          )
          .then(r => r.items);
      },
      {
        name: 'SlackNotificationProcessor.entityLoader',
        cacheMap: new ExpiryMap(durationToMilliseconds({ minutes: 10 })),
        maxBatchSize: 100,
        batchScheduleFn: cb =>
          setTimeout(cb, durationToMilliseconds({ milliseconds: 10 })),
      },
    );

    const meter = metrics.getMeter('default');
    this.messagesSent = meter.createCounter(
      'notifications.processors.slack.sent.count',
      {
        description: 'Number of messages sent to Slack successfully',
      },
    );
    this.messagesFailed = meter.createCounter(
      'notifications.processors.slack.error.count',
      {
        description: 'Number of messages that failed to send to Slack',
      },
    );

    const throttle = pThrottle({
      limit: 10,
      interval: durationToMilliseconds({ minutes: 1 }),
    });
    const throttled = throttle((opts: ChatPostMessageArguments) =>
      this.sendNotification(opts),
    );
    this.sendNotifications = async (opts: ChatPostMessageArguments[]) => {
      const results = await Promise.allSettled(
        opts.map(message => throttled(message)),
      );

      let successCount = 0;
      let failureCount = 0;

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          this.logger.error(
            `Failed to send Slack channel notification: ${result.reason.message}`,
          );
          failureCount++;
        }
      });

      this.messagesSent.add(successCount);
      this.messagesFailed.add(failureCount);
    };
  }

  getName(): string {
    return 'SlackNotificationProcessor';
  }

  async processOptions(
    options: NotificationSendOptions,
  ): Promise<NotificationSendOptions> {
    if (
      options.recipients.type !== 'entity' &&
      options.recipients.type !== 'entities'
    ) {
      return options;
    }

    const entityRefs =
      options.recipients.type === 'entity'
        ? [options.recipients.entityRef].flat()
        : options.recipients.entityRefs;

    const outbound: ChatPostMessageArguments[] = [];
    await Promise.all(
      entityRefs.map(async entityRef => {
        const compoundEntityRef = parseEntityRef(entityRef);
        // skip users as they are sent direct messages
        if (compoundEntityRef.kind === 'user') {
          return;
        }

        let channel;
        try {
          channel = await this.getSlackNotificationTarget(entityRef);
        } catch (error) {
          this.logger.error(
            `Failed to get Slack channel for entity: ${
              (error as Error).message
            }`,
          );
          return;
        }

        if (!channel) {
          this.logger.debug(`No Slack channel found for entity: ${entityRef}`);
          return;
        }

        this.logger.debug(
          `Sending notification with payload: ${JSON.stringify(
            options.payload,
          )}`,
        );

        const payload = toChatPostMessageArgs({
          channel,
          payload: options.payload,
        });

        this.logger.debug(
          `Sending Slack channel notification: ${JSON.stringify(payload)}`,
        );
        outbound.push(payload);
      }),
    );

    await this.sendNotifications(outbound);

    return options;
  }

  async postProcess(
    notification: Notification,
    options: NotificationSendOptions,
  ): Promise<void> {
    const destinations: string[] = [];

    // Handle broadcast case
    if (notification.user === null) {
      destinations.push(...(this.broadcastChannels ?? []));
    } else if (
      options.recipients.type === 'entity' ||
      options.recipients.type === 'entities'
    ) {
      // Handle user-specific notification
      const entityRefs =
        options.recipients.type === 'entity'
          ? [options.recipients.entityRef].flat()
          : options.recipients.entityRefs;
      if (entityRefs.some(e => parseEntityRef(e).kind === 'group')) {
        // We've already dispatched a slack channel message, so let's not send a DM.
        return;
      }

      const destination = await this.getSlackNotificationTarget(
        notification.user,
      );

      if (!destination) {
        this.logger.error(
          `No slack.com/bot-notify annotation found for user: ${notification.user}`,
        );
        return;
      }

      destinations.push(destination);
    }

    // If no destinations, nothing to do
    if (destinations.length === 0) {
      return;
    }

    // Prepare outbound messages
    const formattedPayload = await this.formatPayloadDescriptionForSlack(
      options.payload,
    );
    const outbound = destinations.map(channel =>
      toChatPostMessageArgs({ channel, payload: formattedPayload }),
    );

    // Log debug info
    outbound.forEach(payload => {
      this.logger.debug(`Sending notification: ${JSON.stringify(payload)}`);
    });

    // Send notifications
    await this.sendNotifications(outbound);
  }

  private async formatPayloadDescriptionForSlack(
    payload: Notification['payload'],
  ) {
    return {
      ...payload,
      description: await this.replaceUserRefsWithSlackIds(payload.description),
    };
  }

  async replaceUserRefsWithSlackIds(
    text?: string,
  ): Promise<string | undefined> {
    if (!text) return undefined;

    // Match user entity refs like "<@user:default/billy>"
    const userRefRegex = /<@(user:[^>]+)>/gi;
    const matches = [...text.matchAll(userRefRegex)];

    if (matches.length === 0) return text;

    const uniqueUserRefs = new Set(
      matches.map(match => match[1].toLowerCase()),
    );

    const slackIdMap = new Map<string, string>();

    await Promise.all(
      [...uniqueUserRefs].map(async userRef => {
        try {
          const slackId = await this.getSlackNotificationTarget(userRef);
          if (slackId) {
            slackIdMap.set(userRef, `<@${slackId}>`);
          }
        } catch (error) {
          this.logger.warn(
            `Failed to resolve Slack ID for user ref "${userRef}": ${error}`,
          );
        }
      }),
    );

    return text.replace(userRefRegex, (match, userRef) => {
      const slackId = slackIdMap.get(userRef.toLowerCase());
      return slackId ?? match;
    });
  }

  async getSlackNotificationTarget(
    entityRef: string,
  ): Promise<string | undefined> {
    const entity = await this.entityLoader.load(entityRef);
    if (!entity) {
      throw new NotFoundError(`Entity not found: ${entityRef}`);
    }

    const slackId = await this.resolveSlackId(entity);
    return slackId;
  }

  private async resolveSlackId(entity: Entity): Promise<string | undefined> {
    // First try to get Slack ID from annotations
    const slackId = entity.metadata?.annotations?.[ANNOTATION_SLACK_BOT_NOTIFY];
    if (slackId) {
      return slackId;
    }

    // If no Slack ID in annotations and entity is a User, try to find by email
    if (isUserEntity(entity)) {
      return this.findSlackIdByEmail(entity);
    }

    return undefined;
  }

  private async findSlackIdByEmail(
    entity: UserEntity,
  ): Promise<string | undefined> {
    const email = entity.spec?.profile?.email;
    if (!email) {
      return undefined;
    }

    try {
      const user = await this.slack.users.lookupByEmail({ email });
      return user.user?.id;
    } catch (error) {
      this.logger.warn(
        `Failed to lookup Slack user by email ${email}: ${error}`,
      );
      return undefined;
    }
  }

  async sendNotification(args: ChatPostMessageArguments): Promise<void> {
    const response = await this.slack.chat.postMessage(args);

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.error}`);
    }
  }
}
