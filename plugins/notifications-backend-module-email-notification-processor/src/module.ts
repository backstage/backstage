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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  NotificationSeverity,
  Notification,
} from '@backstage/plugin-notifications-common';
import {
  notificationsProcessingExtensionPoint,
  NotificationProcessor,
} from '@backstage/plugin-notifications-node';
import { createTransport } from 'nodemailer';

function severityToNumber(severity: NotificationSeverity | undefined): number {
  switch (severity) {
    case undefined:
      return Number.MIN_VALUE;
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'normal':
      return 2;
    case 'low':
      return 1;
    default:
      throw new Error(`notification severity has an unknown value ${severity}`);
  }
}

class EmailNotificationProcessor implements NotificationProcessor {
  threshold: number;
  sender: string;
  recipient: string;
  transport: any;

  constructor(
    threshold: number,
    sender: string,
    recipient: string,
    hostname: string,
    port: number,
    secure: boolean,
    requireTLS: boolean,
    username: string,
    password: string,
  ) {
    this.threshold = threshold;
    this.sender = sender;
    this.recipient = recipient;
    this.transport = createTransport({
      host: hostname,
      port: port,
      secure: secure,
      requireTLS: requireTLS,
      auth: {
        user: username,
        pass: password,
      },
      logger: true,
    });
  }

  async send(notification: Notification): Promise<void> {
    const numericSeverity = severityToNumber(notification.payload.severity);

    if (numericSeverity < this.threshold) {
      return;
    }

    await this.transport.sendMail({
      from: this.sender,
      to: this.recipient,
      subject: notification.payload.title,
      text: JSON.stringify(notification),
    });
  }
}

export const notificationsModuleEmailNotificationProcessor =
  createBackendModule({
    pluginId: 'notifications',
    moduleId: 'email-notification-processor',
    register(reg) {
      reg.registerInit({
        deps: {
          config: coreServices.rootConfig,
          notifications: notificationsProcessingExtensionPoint,
        },
        async init({ config, notifications }) {
          const emailConfig = config.getOptionalConfig(
            'backend.email-notification-processor',
          );

          if (emailConfig && emailConfig.getBoolean('enabled')) {
            notifications.addProcessor(
              new EmailNotificationProcessor(
                emailConfig.getNumber('threshold'),
                emailConfig.getString('sender'),
                emailConfig.getString('recipient'),
                emailConfig.getString('hostname'),
                emailConfig.getNumber('port'),
                emailConfig.getBoolean('secure'),
                emailConfig.getBoolean('requireTLS'),
                emailConfig.getString('username'),
                emailConfig.getString('password'),
              ),
            );
          }
        },
      });
    },
  });
