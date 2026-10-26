/*
 * Copyright 2026 The Backstage Authors
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
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { ChangeNotificationCollection } from '@microsoft/microsoft-graph-types';
import type {
  RequestDetails,
  RequestValidationContext,
  RequestValidator,
} from '@backstage/plugin-events-node';
import type { MicrosoftGraphSubscriptionsDatabaseClient } from '../database/databaseClient';
import { hashValidationToken } from './validationToken';

/**
 * A simple in-memory cache for storing hashed clientState values for subscription IDs.
 * This is used to avoid repeated database lookups for the same subscriptionId within a single request.
 * Only matters when multiple notifications are sent in a single request, which is rare but possible.
 *
 * @internal
 */
export class TokenCache {
  private cache = new Map<string, { hash: string; salt: string }>();

  has(subscriptionId: string): boolean {
    return this.cache.has(subscriptionId);
  }

  isValid({
    clientState,
    subscriptionId,
  }: {
    subscriptionId: string;
    clientState: string;
  }): boolean {
    const entry = this.cache.get(subscriptionId);
    if (!entry) {
      return false;
    }
    const { hash, salt } = entry;
    const hashedClientState = hashValidationToken({ token: clientState, salt });
    return hashedClientState === hash;
  }

  set({
    subscriptionId,
    hash,
    salt,
  }: {
    subscriptionId: string;
    hash: string;
    salt: string;
  }): void {
    this.cache.set(subscriptionId, { hash, salt });
  }
}

/**
 * Creates a request validator for Microsoft Graph webhooks.
 * This validator handles both validation requests (responding with the decoded validation token)
 * and notification requests (validating the clientState against stored subscription records).
 *
 * @param l
 * @param databaseClient
 * @see https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks?tabs=http#create-a-subscription
 */
export function createWebhookRequestValidator(
  l: LoggerService,
  databaseClient: MicrosoftGraphSubscriptionsDatabaseClient,
): RequestValidator {
  const logger = l.child({
    function: 'microsoftGraphWebhookRequestValidator',
  });

  return async function microsoftGraphWebhookRequestValidator(
    request: RequestDetails,
    context: RequestValidationContext,
  ): Promise<void> {
    const validationToken = request.query.validationToken;
    if (validationToken) {
      logger.info('Received validation request from MS Graph.');

      if (typeof validationToken !== 'string') {
        logger.debug('Rejecting request due to invalid validation token.');
        context.reject();
        return;
      }

      logger.debug('Responding with URL-decoded token through context.reject.');
      // This is a validation request, the token needs to be decoded and sent back
      context.reject({
        status: 200,
        payload: validationToken,
        contentType: 'text/plain',
      });
      return;
    }

    if (
      typeof request.body !== 'object' ||
      request.body === null ||
      !('value' in request.body)
    ) {
      logger.warn(
        `Received invalid webhook request: ${JSON.stringify(request.body)}`,
      );

      context.reject();
      return;
    }

    const { value } = request.body as ChangeNotificationCollection;

    if (!Array.isArray(value)) {
      logger.warn(
        `Received invalid notification collection: ${JSON.stringify(
          request.body,
        )}`,
      );

      context.reject();
      return;
    }

    let validValues = 0;

    // local cache to avoid repeated database lookups
    const tokenCache = new TokenCache();

    for (const notification of value) {
      if (typeof notification !== 'object' || notification === null) {
        logger.warn(
          `Notification value item is not an object: ${JSON.stringify(
            notification,
          )}`,
        );
        context.reject();
        return;
      }

      const { clientState, subscriptionId } = notification;

      // Delete the clientState secret from the notification object to avoid sending it further or being logged
      delete notification.clientState;
      if (
        !clientState ||
        typeof clientState !== 'string' ||
        !subscriptionId ||
        typeof subscriptionId !== 'string'
      ) {
        logger.warn(
          `Notification value item is missing or contains invalid required properties (clientState, subscriptionId).`,
        );
        context.reject();
        continue;
      }

      if (tokenCache.has(subscriptionId)) {
        if (tokenCache.isValid({ clientState, subscriptionId })) {
          validValues++;
        }
        continue;
      }

      const subscriptionRecord = await databaseClient.getById(subscriptionId);
      if (!subscriptionRecord) {
        logger.warn(`No subscription record found for ID ${subscriptionId}`);
        context.reject();
        return;
      }

      const { token_hash, token_salt } = subscriptionRecord;

      // Store the hash and salt in the cache for future notifications in this request
      tokenCache.set({ subscriptionId, hash: token_hash, salt: token_salt });

      const hashedClientState = hashValidationToken({
        token: clientState,
        salt: token_salt,
      });

      if (hashedClientState !== token_hash) {
        logger.warn(`Invalid clientState for notification item.`);
      } else {
        validValues++;
      }
    }

    if (validValues === 0) {
      logger.warn(
        `No valid notification items found among ${value.length} items`,
      );
      context.reject();
      return;
    }

    if (validValues < value.length) {
      logger.warn(
        `Only ${validValues} valid notification items found among ${value.length} items`,
      );
      context.reject();
    } else {
      logger.debug(`All ${validValues} notification items are valid`);
    }
  };
}
