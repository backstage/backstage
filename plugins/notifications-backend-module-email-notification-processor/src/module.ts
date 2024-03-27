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
  coreServices,
  createBackendModule,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import {
  Notification,
  notificationSeverities,
} from '@backstage/plugin-notifications-common';
import {
  notificationsProcessingExtensionPoint,
  NotificationProcessor,
  NotificationSendOptions,
} from '@backstage/plugin-notifications-node';
import { JsonObject } from '@backstage/types';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class EmailNotificationProcessor implements NotificationProcessor {
  threshold: number;
  sender: string;
  broadcastRecipients: string[];
  transport: any;
  catalogApi: CatalogApi;
  logger: LoggerService;
  auth: AuthService;

  constructor(
    catalogApi: CatalogApi,
    logger: LoggerService,
    auth: AuthService,
    threshold: number,
    sender: string,
    broadcastRecipients: string[],
    hostname: string,
    port: number,
    secure?: boolean,
    requireTLS?: boolean,
    username?: string,
    password?: string,
  ) {
    this.threshold = threshold;
    this.sender = sender;
    this.broadcastRecipients = broadcastRecipients;
    let authOptions;
    if (username && password) {
      authOptions = {
        username: username,
        password: password,
      };
    }
    this.transport = createTransport({
      host: hostname,
      port: port,
      secure: secure,
      requireTLS: requireTLS,
      auth: authOptions,
      logger: true,
    } as SMTPTransport.Options);
    this.catalogApi = catalogApi;
    this.logger = logger;
    this.auth = auth;
  }
  getName(): string {
    return 'Email';
  }

  async postProcess(
    notification: Notification,
    _: NotificationSendOptions,
  ): Promise<void> {
    if (!notification.payload.severity) {
      return;
    }

    const numericSeverity =
      notificationSeverities.indexOf(notification.payload.severity) + 1;

    if (numericSeverity < this.threshold) {
      return;
    }

    let recipient;

    if (notification.user) {
      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });

      await this.catalogApi
        .getEntityByRef(notification.user, { token })
        .then(entity => {
          recipient = (entity?.spec?.profile as JsonObject)?.email;
        });

      if (!recipient) {
        this.logger.warn(`notification ${notification.id} has no recipient`);
        return;
      }
    } else {
      recipient = this.broadcastRecipients;
    }

    await this.transport.sendMail({
      from: this.sender,
      to: recipient,
      subject: notification.payload.title,
      text: JSON.stringify(notification),
    });
  }
}

/**
 * @public
 */
export const notificationsModuleEmailNotificationProcessor =
  createBackendModule({
    pluginId: 'notifications',
    moduleId: 'email-notification-processor',
    register(reg) {
      reg.registerInit({
        deps: {
          config: coreServices.rootConfig,
          notifications: notificationsProcessingExtensionPoint,
          discovery: coreServices.discovery,
          logger: coreServices.logger,
          auth: coreServices.auth,
        },
        async init({ config, notifications, discovery, logger, auth }) {
          const emailConfig = config.getOptionalConfig(
            'notifications.emailNotificationProcessor',
          );

          if (!emailConfig) {
            return;
          }

          const enabled = emailConfig.getOptionalBoolean('enabled');

          if (enabled === false) {
            return;
          }

          const catalogClient = new CatalogClient({
            discoveryApi: discovery,
          });

          notifications.addProcessor(
            new EmailNotificationProcessor(
              catalogClient,
              logger,
              auth,
              emailConfig.getNumber('threshold'),
              emailConfig.getString('sender'),
              emailConfig.getStringArray('broadcastRecipients'),
              emailConfig.getString('hostname'),
              emailConfig.getNumber('port'),
              emailConfig.getOptionalBoolean('secure'),
              emailConfig.getOptionalBoolean('requireTLS'),
              emailConfig.getOptionalString('username'),
              emailConfig.getOptionalString('password'),
            ),
          );
        },
      });
    },
  });
