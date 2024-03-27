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

export interface Config {
  /**
   * Configuration options for notifications-backend-module-email-notification-processor */
  notifications?: {
    emailNotificationProcessor?: {
      /**
       * Whether the processor is enabled or not
       *
       * @default true
       */
      enabled?: boolean;
      /**
       * Allowed range is 1-4. If the processed notification has greater than or equal severity then email is sent.
       */
      severityThreshold: number;
      /**
       * What email address to use as the sender
       */
      sender: string;
      /**
       * The recipients for broadcast notifications
       */
      broadcastRecipients: string[];
      hostname: string;
      port: number;
      /**
       * Should the connection be secured
       *
       * * @default false
       */
      secure?: boolean;
      /**
       * When 'secure' is false and this is true the client will use STARTTLS
       */
      requireTLS?: boolean;
      username?: string;
      /**
       * @visibility secret
       */
      password?: string;
    };
  };
}
