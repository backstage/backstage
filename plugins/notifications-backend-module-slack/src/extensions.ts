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
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { NotificationPayload } from '@backstage/plugin-notifications-common';
import { KnownBlock } from '@slack/web-api';

/**
 * @public
 */
export type SlackBlockKitRenderer = (
  payload: NotificationPayload,
) => KnownBlock[];

/**
 * @public
 *
 * Extension point for customizing how notification payloads are rendered into
 * Slack Block Kit messages before they're sent.
 */
export interface NotificationsSlackBlockKitExtensionPoint {
  setBlockKitRenderer(renderer: SlackBlockKitRenderer): void;
}

/**
 * @public
 */
export const notificationsSlackBlockKitExtensionPoint =
  createExtensionPoint<NotificationsSlackBlockKitExtensionPoint>({
    id: 'notifications.slack.blockkit',
  });

/**
 * @public
 *
 * Context passed to a {@link SlackNotificationTargetResolver}, describing the
 * notification whose target is being resolved.
 */
export interface SlackNotificationTargetContext {
  payload: NotificationPayload;
}

/**
 * @public
 *
 * Resolves the Slack channel for an entity-addressed notification. Return a
 * Slack channel ID to override where the notification is sent; return
 * `undefined` to fall back to the entity's `slack.com/bot-notify` annotation
 * (the default behaviour).
 */
export type SlackNotificationTargetResolver = (
  entityRef: string,
  context: SlackNotificationTargetContext,
) => Promise<string | undefined>;

/**
 * @public
 *
 * Extension point for overriding how entity-addressed notifications are mapped
 * to a Slack channel, for example to route by notification topic.
 */
export interface NotificationsSlackTargetResolverExtensionPoint {
  setTargetResolver(resolver: SlackNotificationTargetResolver): void;
}

/**
 * @public
 */
export const notificationsSlackTargetResolverExtensionPoint =
  createExtensionPoint<NotificationsSlackTargetResolverExtensionPoint>({
    id: 'notifications.slack.target',
  });
