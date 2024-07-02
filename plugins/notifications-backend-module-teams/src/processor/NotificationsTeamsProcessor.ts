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
  getAbsoluteNotificationLink,
  NotificationProcessor,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { Config, readDurationFromConfig } from '@backstage/config';
import {
  AuthService,
  CacheService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  CATALOG_FILTER_EXISTS,
  CatalogClient,
} from '@backstage/catalog-client';
import { durationToMilliseconds } from '@backstage/types';
import pThrottle from 'p-throttle';
import { ANNOTATION_TEAMS_WEBHOOK } from '../constants';

interface TeamsWebhookSection {
  activityTitle?: string;
  activitySubtitle?: string;
  activityImage?: string;
  facts?: {
    name: string;
    value: string;
  }[];
  text?: string;
}

interface TeamsWebhookPotentialAction {
  '@type': string;
  name: string;
  target?: string;
  targets?: {
    os: string;
    uri: string;
  }[];
}

interface TeamsWebhookCard {
  '@type': 'MessageCard';
  '@context': 'http://schema.org/extensions';
  title: string;
  summary?: string;
  text?: string;
  themeColor?: string;
  sections?: TeamsWebhookSection[];
  potentialAction?: TeamsWebhookPotentialAction[];
}

/**
 * @public
 */
export class NotificationsTeamsProcessor implements NotificationProcessor {
  private readonly logger: LoggerService;
  private readonly catalogClient: CatalogClient;
  private readonly auth: AuthService;
  private readonly cache: CacheService;
  private readonly config: Config;
  private readonly cacheTtl: number;
  private readonly broadcastWebhooks: string[];
  private readonly concurrencyLimit: number;
  private readonly throttleInterval: number;

  getName(): string {
    return 'Teams';
  }

  static fromConfig(
    config: Config,
    options: {
      auth: AuthService;
      discovery: DiscoveryService;
      logger: LoggerService;
      catalogClient: CatalogClient;
      cache: CacheService;
    },
  ): NotificationsTeamsProcessor {
    const teamsConfig = config.getOptionalConfig(
      'notifications.processors.teams',
    );
    const concurrencyLimit =
      teamsConfig?.getOptionalNumber('concurrencyLimit') ?? 2;
    const throttleConfig = teamsConfig?.getOptionalConfig('throttleInterval');
    const throttleInterval = throttleConfig
      ? durationToMilliseconds(readDurationFromConfig(throttleConfig))
      : 100;
    const cacheConfig = teamsConfig?.getOptionalConfig('cache.ttl');
    const cacheTtl = cacheConfig
      ? durationToMilliseconds(readDurationFromConfig(cacheConfig))
      : 3_600_000;
    return new NotificationsTeamsProcessor({
      broadcastWebhooks:
        teamsConfig?.getOptionalStringArray('broadcastConfig.webhooks') ?? [],
      concurrencyLimit,
      throttleInterval,
      cacheTtl,
      config,
      ...options,
    });
  }

  private constructor(options: {
    auth: AuthService;
    discovery: DiscoveryService;
    logger: LoggerService;
    catalogClient: CatalogClient;
    cache: CacheService;
    config: Config;
    cacheTtl: number;
    broadcastWebhooks: string[];
    concurrencyLimit: number;
    throttleInterval: number;
  }) {
    const {
      config,
      auth,
      catalogClient,
      logger,
      cache,
      cacheTtl,
      broadcastWebhooks,
      throttleInterval,
      concurrencyLimit,
    } = options;
    this.logger = logger;
    this.config = config;
    this.catalogClient = catalogClient;
    this.auth = auth;
    this.cache = cache;
    this.cacheTtl = cacheTtl;
    this.broadcastWebhooks = broadcastWebhooks;
    this.concurrencyLimit = concurrencyLimit;
    this.throttleInterval = throttleInterval;
  }

  async processOptions(
    options: NotificationSendOptions,
  ): Promise<NotificationSendOptions> {
    const webhookOptions = this.createTeamsCard(options);
    try {
      if (options.recipients.type === 'broadcast') {
        await this.sendWebhookMessages(this.broadcastWebhooks, webhookOptions);
      } else {
        const entityRefs = Array.isArray(options.recipients.entityRef)
          ? options.recipients.entityRef
          : [options.recipients.entityRef];
        const webhooks = await this.getEntitiesWebhooks(entityRefs);
        await this.sendWebhookMessages(webhooks, webhookOptions);
      }
    } catch (e) {
      this.logger.error(`Failed to send teams notification: ${e}`);
    }

    return options;
  }

  private createTeamsCard(options: NotificationSendOptions): TeamsWebhookCard {
    return {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      title: options.payload.title,
      summary: options.payload.description,
      potentialAction: [
        {
          '@type': 'OpenUri',
          name: 'See more',
          targets: [
            {
              os: 'default',
              uri: getAbsoluteNotificationLink(this.config, options),
            },
          ],
        },
      ],
    };
  }

  async getEntitiesWebhooks(entityRefs: string[]): Promise<string[]> {
    const toFetch: string[] = [];
    const webhooks: string[] = [];
    for (const entityRef of entityRefs) {
      const webhook = await this.cache.get<string>(entityRef);
      if (webhook) {
        webhooks.push(webhook);
      } else {
        toFetch.push(entityRef);
      }
    }

    const entities = await this.getEntities(toFetch);

    for (const entity of entities) {
      const webhook = entity?.metadata.annotations?.[ANNOTATION_TEAMS_WEBHOOK];
      if (entity && webhook) {
        webhooks.push(webhook);
        await this.cache.set(stringifyEntityRef(entity), webhook, {
          ttl: this.cacheTtl,
        });
      }
    }
    return webhooks;
  }

  async getEntities(entityRefs: string[]): Promise<(Entity | undefined)[]> {
    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });

    const response = await this.catalogClient.getEntitiesByRefs(
      {
        entityRefs,
        filter: {
          [`metadata.annotations.${ANNOTATION_TEAMS_WEBHOOK}`]:
            CATALOG_FILTER_EXISTS,
        },
        fields: [
          'kind',
          'metadata.name',
          'metadata.namespace',
          `metadata.annotations.${ANNOTATION_TEAMS_WEBHOOK}`,
        ],
      },
      {
        token,
      },
    );

    return response.items;
  }

  private async sendWebhookMessages(
    webhooks: string[],
    options: TeamsWebhookCard,
  ): Promise<void> {
    if (webhooks.length === 0) {
      return;
    }

    const throttle = pThrottle({
      limit: this.concurrencyLimit,
      interval: this.throttleInterval,
    });
    const throttled = throttle((hook: string, card: TeamsWebhookCard) =>
      this.sendWebhookMessage(hook, card),
    );
    await Promise.all(webhooks.map(webhook => throttled(webhook, options)));
  }

  private async sendWebhookMessage(
    webhook: string,
    card: TeamsWebhookCard,
  ): Promise<void> {
    const response = await fetch(webhook, {
      method: 'POST',
      body: JSON.stringify(card),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Request for webhook ${webhook} failed with status ${response.status}`,
      );
    }
  }
}
