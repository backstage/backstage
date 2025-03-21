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
  NotificationRecipients,
  NotificationService,
} from '@backstage/plugin-notifications-node';
import {
  NotificationPayload,
  NotificationSeverity,
} from '@backstage/plugin-notifications-common';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { examples } from './sendNotification.examples';

/**
 * @public
 */
export function createSendNotificationAction(options: {
  notifications: NotificationService;
}) {
  const { notifications } = options;
  return createTemplateAction<{
    recipients: string;
    entityRefs?: string[];
    title: string;
    info?: string;
    link?: string;
    severity?: NotificationSeverity;
    scope?: string;
    optional?: boolean;
  }>({
    id: 'notification:send',
    description: 'Sends a notification using NotificationService',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['recipients', 'title'],
        properties: {
          recipients: {
            title: 'Recipient',
            enum: ['broadcast', 'entity'],
            description:
              'The recipient of the notification, either broadcast or entity. If using entity, also entityRef must be provided',
            type: 'string',
          },
          entityRefs: {
            title: 'Entity references',
            description:
              'The entity references to send the notification to, required if using recipient of entity',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          title: {
            title: 'Title',
            description: 'Notification title',
            type: 'string',
          },
          info: {
            title: 'Description',
            description: 'Notification description',
            type: 'string',
          },
          link: {
            title: 'Link',
            description: 'Notification link',
            type: 'string',
          },
          severity: {
            title: 'Severity',
            type: 'string',
            description: `Notification severity`,
            enum: ['low', 'normal', 'high', 'critical'],
          },
          scope: {
            title: 'Scope',
            description: 'Notification scope',
            type: 'string',
          },
          optional: {
            title: 'Optional',
            description:
              'Do not fail the action if the notification sending fails',
            type: 'boolean',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        recipients,
        entityRefs,
        title,
        info,
        link,
        severity,
        scope,
        optional,
      } = ctx.input;

      ctx.logger.info(`Sending notification to ${recipients}`);
      if (recipients === 'entity' && !entityRefs) {
        if (optional !== true) {
          throw new Error('Entity references must be provided');
        }
        return;
      }

      const notificationRecipients: NotificationRecipients =
        recipients === 'broadcast'
          ? { type: 'broadcast' }
          : { type: 'entity', entityRef: entityRefs! };
      const payload: NotificationPayload = {
        title,
        description: info,
        link,
        severity,
        scope,
      };

      try {
        await ctx.checkpoint({
          key: `send.notification.${payload.title}`,
          fn: async () => {
            await notifications.send({
              recipients: notificationRecipients,
              payload,
            });
          },
        });
      } catch (e) {
        ctx.logger.error(`Failed to send notification: ${e}`);
        if (optional !== true) {
          throw e;
        }
      }
    },
  });
}
