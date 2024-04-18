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
import { Config } from '@backstage/config';
import { JsonArray } from '@backstage/types';
import {
  CATALOG_FILTER_EXISTS,
  CatalogClient,
} from '@backstage/catalog-client';
import { Notification } from '@backstage/plugin-notifications-common';
import { createSendmailTransport, createSmtpTransport } from './transports';
import { createSesTransport } from './transports/ses';
import { UserEntity } from '@backstage/catalog-model';
import { compact } from 'lodash';
import { DefaultAwsCredentialsManager } from '@backstage/integration-aws-node';
import { NotificationTemplateRenderer } from '../extensions';

export class NotificationsEmailProcessor implements NotificationProcessor {
  private transporter: any;
  private readonly broadcastConfig?: Config;
  private readonly sender: string;
  private readonly replyTo?: string;
  private readonly cacheTtl: number;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: Config,
    private readonly catalog: CatalogClient,
    private readonly auth: AuthService,
    private readonly cache?: CacheService,
    private readonly templateRenderer?: NotificationTemplateRenderer,
  ) {
    this.broadcastConfig = config.getOptionalConfig(
      'notifications.email.broadcastConfig',
    );
    this.sender = config.getString('notifications.email.sender');
    this.replyTo = config.getOptionalString('notifications.email.replyTo');
    this.cacheTtl =
      config.getOptionalNumber('notifications.email.cache.ttl') ?? 3_600_000;
  }

  private async getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }
    const transportConfig = this.config.getConfig(
      'notifications.email.transport',
    );
    const transport = transportConfig.getString('transport');
    if (transport === 'smtp') {
      this.transporter = createSmtpTransport({
        transport: 'smtp',
        hostname: transportConfig.getString('hostname'),
        port: transportConfig.getNumber('port'),
        secure: transportConfig.getOptionalBoolean('secure'),
        requireTls: transportConfig.getOptionalBoolean('requireTls'),
        username: transportConfig.getOptionalString('username'),
        password: transportConfig.getOptionalString('password'),
      });
    } else if (transport === 'ses') {
      const awsCredentialsManager = DefaultAwsCredentialsManager.fromConfig(
        this.config,
      );
      this.transporter = await createSesTransport({
        transport: 'ses',
        credentialsManager: awsCredentialsManager,
        apiVersion: transportConfig.getOptionalString('apiVersion'),
        accountId: transportConfig.getOptionalString('accountId'),
        region: transportConfig.getOptionalString('region'),
      });
    } else if (transport === 'sendmail') {
      this.transporter = createSendmailTransport({
        transport: 'sendmail',
        path: transportConfig.getOptionalString('path'),
        newline: transportConfig.getOptionalString('newline'),
      });
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
      const cached = await this.cache?.get<JsonArray>('user-emails:all');
      if (cached) {
        return cached as string[];
      }

      const credentials = await this.auth.getOwnServiceCredentials();
      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: credentials,
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
      await this.cache?.set('user-emails:all', ret as JsonArray, {
        ttl: this.cacheTtl,
      });
      return ret;
    }

    throw new Error(`Unsupported broadcast receiver: ${receiver}`);
  }

  private async getUserEmail(entityRef: string): Promise<string[]> {
    const cached = await this.cache?.get<string>(`user-emails:${entityRef}`);
    if (cached) {
      return [cached];
    }

    const credentials = await this.auth.getOwnServiceCredentials();
    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: 'catalog',
    });
    const entity = await this.catalog.getEntityByRef(entityRef, { token });
    if (!entity) {
      return [];
    }

    const userEntity = entity as UserEntity;
    if (!userEntity.spec.profile?.email) {
      return [];
    }

    await this.cache?.set(
      `user-emails:${entityRef}`,
      userEntity.spec.profile.email,
      { ttl: this.cacheTtl },
    );

    return [userEntity.spec.profile.email];
  }

  private async getRecipientEmails(
    notification: Notification,
    options: NotificationSendOptions,
  ) {
    if (options.recipients.type === 'broadcast' || notification.user === null) {
      return await this.getBroadcastEmails();
    }
    return await this.getUserEmail(notification.user);
  }

  private async sendPlainEmail(notification: Notification, emails: string[]) {
    const contentParts: string[] = [];
    if (notification.payload.description) {
      contentParts.push(`${notification.payload.description}`);
    }
    if (notification.payload.link) {
      contentParts.push(`${notification.payload.link}`);
    }

    const mailOptions = {
      from: this.sender,
      subject: notification.payload.title,
      html: `<p>${contentParts.join('<br/>')}</p>`,
      text: contentParts.join('\n\n'),
      replyTo: this.replyTo,
    };

    for (const email of emails) {
      try {
        await this.transporter.sendMail({ ...mailOptions, to: email });
      } catch (e) {
        this.logger.error(`Failed to send email to ${email}: ${e}`);
      }
    }
  }

  private async sendTemplateEmail(
    notification: Notification,
    emails: string[],
  ) {
    const mailOptions = {
      from: this.sender,
      subject:
        this.templateRenderer?.getSubject?.(notification) ??
        notification.payload.title,
      html: this.templateRenderer?.getHtml?.(notification),
      text: this.templateRenderer?.getText?.(notification),
      replyTo: this.replyTo,
    };

    for (const email of emails) {
      try {
        await this.transporter.sendMail({ ...mailOptions, to: email });
      } catch (e) {
        this.logger.error(`Failed to send email to ${email}: ${e}`);
      }
    }
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

    if (!this.templateRenderer) {
      await this.sendPlainEmail(notification, emails);
      return;
    }

    await this.sendTemplateEmail(notification, emails);
  }
}
