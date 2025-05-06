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
import { NotificationPayload } from '@backstage/plugin-notifications-common';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { examples } from './sendNotification.examples';

/**
 * @public
 */
export function createSendNotificationAction(options: {
  notifications: NotificationService;
}) {
  const { notifications } = options;
  return createTemplateAction({
    id: 'notification:send',
    description: 'Sends a notification using NotificationService',
    examples,
    schema: {
      input: {
        recipients: z =>
          z
            .enum(['broadcast', 'entity'])
            .describe(
              'The recipient of the notification, either broadcast or entity. If using entity, also entityRef must be provided',
            ),
        entityRefs: z =>
          z
            .array(z.string())
            .optional()
            .describe(
              'The entity references to send the notification to, required if using recipient of entity',
            ),
        title: z => z.string().describe('Notification title'),
        info: z => z.string().optional().describe('Notification description'),
        link: z => z.string().optional().describe('Notification link'),
        severity: z =>
          z
            .enum(['low', 'normal', 'high', 'critical'])
            .optional()
            .describe('Notification severity'),
        scope: z => z.string().optional().describe('Notification scope'),
        topic: z => z.string().optional().describe('Notification topic'),
        optional: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Do not fail the action if the notification sending fails',
            ),
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
        topic,
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
        topic,
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
