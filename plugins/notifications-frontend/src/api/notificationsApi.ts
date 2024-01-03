import { createApiRef } from '@backstage/core-plugin-api';

import {
  CreateBody,
  GetNotificationsCountRequest,
  GetNotificationsRequest,
  Notification,
  SetReadRequest,
} from '../openapi';

export type NotificationsCreateRequest = CreateBody;

export type NotificationsQuery = Omit<GetNotificationsRequest, 'user'>;

export type NotificationsCountQuery = Omit<
  GetNotificationsCountRequest,
  'user'
>;

export type NotificationMarkAsRead = Omit<SetReadRequest, 'user'>;
export interface NotificationsApi {
  /** Create a notification. Returns its new ID. */
  createNotification(notification: NotificationsCreateRequest): Promise<string>;

  /** Read a list of notifications based on filter parameters. */
  getNotifications(query?: NotificationsQuery): Promise<Notification[]>;

  /** Returns the count of notifications for the user. */
  getNotificationsCount(query?: NotificationsCountQuery): Promise<number>;

  /** Marks the notification as read by the user. */
  markAsRead(params: NotificationMarkAsRead): Promise<void>;
}

export const notificationsApiRef = createApiRef<NotificationsApi>({
  id: 'plugin.notifications',
});
