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
  NotificationProcessor,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import {
  AuthService,
  CacheService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { CATALOG_FILTER_EXISTS, CatalogApi } from '@backstage/catalog-client';
import {
  getProcessorFiltersFromConfig,
  Notification,
  NotificationProcessorFilters,
} from '@backstage/plugin-notifications-common';
import {
  createAzureTransport,
  createSendmailTransport,
  createSesTransport,
  createSmtpTransport,
  createStreamTransport,
} from './transports';
import { UserEntity } from '@backstage/catalog-model';
import { compact } from 'lodash';
import { DefaultAwsCredentialsManager } from '@backstage/integration-aws-node';
import { NotificationTemplateRenderer } from '../extensions';
import Mail from 'nodemailer/lib/mailer';
import pThrottle from 'p-throttle';

export class NotificationsEmailProcessor implements NotificationProcessor {
  private transporter: any;
  private readonly broadcastConfig?: Config;
  private readonly transportConfig: Config;
  private readonly sender: string;
  private readonly replyTo?: string;
  private readonly cacheTtl: number;
  private readonly concurrencyLimit: number;
  private readonly throttleInterval: number;
  private readonly frontendBaseUrl: string;
  private readonly filter: NotificationProcessorFilters;
  private readonly allowlistEmailAddresses?: string[];
  private readonly denylistEmailAddresses?: string[];

  constructor(
    private readonly logger: LoggerService,
    private readonly config: Config,
    private readonly catalog: CatalogApi,
    private readonly auth: AuthService,
    private readonly cache?: CacheService,
    private readonly templateRenderer?: NotificationTemplateRenderer,
  ) {
    const emailProcessorConfig = config.getConfig(
      'notifications.processors.email',
    );
    this.transportConfig = emailProcessorConfig.getConfig('transportConfig');
    this.broadcastConfig =
      emailProcessorConfig.getOptionalConfig('broadcastConfig');
    this.sender = emailProcessorConfig.getString('sender');
    this.replyTo = emailProcessorConfig.getOptionalString('replyTo');
    this.concurrencyLimit =
      emailProcessorConfig.getOptionalNumber('concurrencyLimit') ?? 2;
    this.throttleInterval = emailProcessorConfig.has('throttleInterval')
      ? durationToMilliseconds(
          readDurationFromConfig(emailProcessorConfig, {
            key: 'throttleInterval',
          }),
        )
      : 100;
    this.cacheTtl = emailProcessorConfig.has('cache.ttl')
      ? durationToMilliseconds(
          readDurationFromConfig(emailProcessorConfig, { key: 'cache.ttl' }),
        )
      : 3_600_000;
    this.frontendBaseUrl = config.getString('app.baseUrl');
    this.allowlistEmailAddresses = emailProcessorConfig.getOptionalStringArray(
      'allowlistEmailAddresses',
    );
    this.denylistEmailAddresses = emailProcessorConfig.getOptionalStringArray(
      'denylistEmailAddresses',
    );
    this.filter = getProcessorFiltersFromConfig(emailProcessorConfig);
  }

  private async getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }
    const transport = this.transportConfig.getString('transport');
    if (transport === 'smtp') {
      this.transporter = createSmtpTransport(this.transportConfig);
    } else if (transport === 'ses') {
      const awsCredentialsManager = DefaultAwsCredentialsManager.fromConfig(
        this.config,
      );
      this.transporter = await createSesTransport(
        this.transportConfig,
        awsCredentialsManager,
      );
    } else if (transport === 'sendmail') {
      this.transporter = createSendmailTransport(this.transportConfig);
    } else if (transport === 'stream') {
      this.transporter = createStreamTransport();
    } else if (transport === 'azure') {
      this.transporter = createAzureTransport(this.transportConfig);
    } else {
      throw new Error(`Unsupported transport: ${transport}`);
    }
    return this.transporter;
  }

  getName(): string {
    return 'Email';
  }

  private async getBroadcastEmails(): Promise<string[]> {
    if (!this.broadcastConfig) {
      return [];
    }

    const receiver = this.broadcastConfig.getString('receiver');
    if (receiver === 'none') {
      return [];
    }

    if (receiver === 'config') {
      return (
        this.broadcastConfig.getOptionalStringArray('receiverEmails') ?? []
      );
    }

    if (receiver === 'users') {
      const cached = await this.cache?.get<string[]>('user-emails:all');
      if (cached) {
        return cached;
      }

      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });
      const entities = await this.catalog.getEntities(
        {
          filter: [
            { kind: 'user', 'spec.profile.email': CATALOG_FILTER_EXISTS },
          ],
          fields: ['spec.profile.email'],
        },
        { token },
      );
      const ret = compact([
        ...new Set(
          entities.items.map(entity => {
            return (entity as UserEntity)?.spec.profile?.email;
          }),
        ),
      ]);

      await this.cache?.set('user-emails:all', ret, {
        ttl: this.cacheTtl,
      });
      return ret;
    }

    throw new Error(`Unsupported broadcast receiver: ${receiver}`);
  }

  private async getUserEmail(entityRef: string): Promise<string[]> {
    const cached = await this.cache?.get<string[]>(`user-emails:${entityRef}`);
    if (cached) {
      return cached;
    }

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'catalog',
    });
    const entity = await this.catalog.getEntityByRef(entityRef, { token });
    const ret: string[] = [];
    if (entity) {
      const userEntity = entity as UserEntity;
      if (userEntity.spec.profile?.email) {
        ret.push(userEntity.spec.profile.email);
      }
    }

    await this.cache?.set(`user-emails:${entityRef}`, ret, {
      ttl: this.cacheTtl,
    });

    return ret;
  }

  private async getRecipientEmails(
    notification: Notification,
    options: NotificationSendOptions,
  ): Promise<string[]> {
    let emails: string[];
    if (options.recipients.type === 'broadcast') {
      emails = await this.getBroadcastEmails();
    } else if (options.recipients.type === 'entity' && !!notification.user) {
      emails = await this.getUserEmail(notification.user);
    } else {
      this.logger.info(
        `Unknown notification type ${options.recipients.type} or missing user.`,
      );
      return [];
    }

    if (this.allowlistEmailAddresses) {
      emails = emails.filter(email =>
        this.allowlistEmailAddresses?.includes(email),
      );
    }

    if (this.denylistEmailAddresses) {
      emails = emails.filter(
        email => !this.denylistEmailAddresses?.includes(email),
      );
    }
    return emails;
  }

  private async sendMail(options: Mail.Options) {
    try {
      this.logger.debug(`Sending notification email to ${options.to}`);
      await this.transporter.sendMail(options);
    } catch (e) {
      this.logger.error(`Failed to send email to ${options.to}: ${e}`);
    }
  }

  private async sendMails(options: Mail.Options, emails: string[]) {
    const throttle = pThrottle({
      limit: this.concurrencyLimit,
      interval: this.throttleInterval,
    });

    const throttled = throttle((opts: Mail.Options) => this.sendMail(opts));
    await Promise.all(
      emails.map(email => throttled({ ...options, to: email })),
    );
  }

  private getNotificationLink(notification: Notification) {
    if (notification.payload.link) {
      const stripLeadingSlash = (s: string) => s.replace(/^\//, '');
      const ensureTrailingSlash = (s: string) => s.replace(/\/?$/, '/');

      try {
        const url = new URL(
          stripLeadingSlash(notification.payload.link),
          ensureTrailingSlash(this.frontendBaseUrl),
        );
        return url.toString();
      } catch (_e) {
        // noop: fallback to relative URL
      }
      return notification.payload.link;
    }
    return `${this.frontendBaseUrl}/notifications`;
  }

  private getHtmlContent(notification: Notification) {
    const contentParts: string[] = [];
    if (notification.payload.description) {
      contentParts.push(`${notification.payload.description}`);
    }
    const link = this.getNotificationLink(notification);
    contentParts.push(`<a href="${link}">${link}</a>`);
    return `<p>${contentParts.join('<br/>')}</p>`;
  }

  private getTextContent(notification: Notification) {
    const contentParts: string[] = [];
    if (notification.payload.description) {
      contentParts.push(notification.payload.description);
    }
    contentParts.push(this.getNotificationLink(notification));
    return contentParts.join('\n\n');
  }

  private async sendPlainEmail(notification: Notification, emails: string[]) {
    const mailOptions = {
      from: this.sender,
      subject: notification.payload.title,
      html: this.getHtmlContent(notification),
      text: this.getTextContent(notification),
      replyTo: this.replyTo,
    };

    await this.sendMails(mailOptions, emails);
  }

  private async sendTemplateEmail(
    notification: Notification,
    emails: string[],
  ) {
    const mailOptions = {
      from: this.sender,
      subject:
        (await this.templateRenderer?.getSubject?.(notification)) ??
        notification.payload.title,
      html: await this.templateRenderer?.getHtml?.(notification),
      text: await this.templateRenderer?.getText?.(notification),
      replyTo: this.replyTo,
    };

    await this.sendMails(mailOptions, emails);
  }

  async postProcess(
    notification: Notification,
    options: NotificationSendOptions,
  ): Promise<void> {
    this.transporter = await this.getTransporter();

    let emails: string[] = [];
    try {
      emails = await this.getRecipientEmails(notification, options);
    } catch (e) {
      this.logger.error(`Failed to resolve recipient emails: ${e}`);
      return;
    }

    if (emails.length === 0) {
      this.logger.info(
        `No email recipients found for notification: ${notification.id}, skipping`,
      );
      return;
    }

    this.logger.debug(`Sending notification emails to: ${emails.join(',')}`);

    if (!this.templateRenderer) {
      await this.sendPlainEmail(notification, emails);
      return;
    }

    await this.sendTemplateEmail(notification, emails);
  }

  getNotificationFilters(): NotificationProcessorFilters {
    return this.filter;
  }
}
