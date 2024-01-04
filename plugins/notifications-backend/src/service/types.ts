/*
 * Copyright 2023 The Backstage Authors
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
import { TokenManager } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';

import { Logger } from 'winston';

export interface RouterOptions {
  logger: Logger;
  dbConfig: Config;
  catalogClient: CatalogClient;
  identity: IdentityApi;
  permissions: PermissionEvaluator;
  tokenManager: TokenManager;

  // Workaround - see auth.ts
  externalCallerSecret?: string;
}

export type NotificationsFilterRequest = {
  /**
   * Filter notifications whose either title or message contains the provided string.
   */
  containsText?: string;

  /**
   * Only notifications created after this timestamp will be included.
   */
  createdAfter?: string;

  /**
   * See MessageScopes
   * Default: DefaultMessageScope
   */
  messageScope?: string;

  /**
   * 'false' for user's unread messages, 'true' for read ones.
   * If undefined, then both marks.
   */
  read?: boolean;
};

/**
 * How the result set is sorted.
 */
export type NotificationsSortingRequest = {
  orderBy?: string;
  OrderByDirec?: string;
};

export const NotificationsOrderByFields: string[] = [
  'title',
  'message',
  'created',
  'topic',
  'origin',
];

export const NotificationsOrderByDirections: string[] = ['asc', 'desc'];

/**
 * MessageScopes
 * When 'user' is requested, then messages whose targetUsers or targetGroups are matching the "user".
 * When "system" is requested, only system-wide messages will be filtered (read: those without targetUsers or targetGroups provided).
 * When 'all' is requests then fetch both system and user messages
 */
export const MessageScopes = ['all', 'user', 'system'];
