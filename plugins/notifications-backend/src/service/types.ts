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
   * The user the query is executed for. Default: DefaultUser
   * Its entity must be present in the catalog.
   * Conforms IdentityApi.getBackstageIdentity()
   */
  user?: string;
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

export const DefaultUser = 'default/guest';
export const DefaultMessageScope = 'user';
export const DefaultPageNumber = 1;
export const DefaultPageSize = 20;
export const DefaultOrderBy = 'created';
export const DefaultOrderDirection = 'desc';
