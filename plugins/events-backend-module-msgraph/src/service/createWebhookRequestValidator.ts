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
    if (request.query.validationToken) {
      logger.info('Received validation request from MS Graph.');
      logger.debug('Responding with URL-decoded token through context.reject.');

      // This is a validation request, the token needs to be decoded and sent back
      context.reject({
        status: 200,
        payload: decodeURIComponent(request.query.validationToken as string),
        contentType: 'text/plain',
      });

      return;
    }

    if (!('value' in (request.body as object))) {
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

    for (const { clientState, subscriptionId } of value) {
      if (!clientState || !subscriptionId) {
        logger.warn(
          `Notification value item is missing required properties (clientState, subscriptionId): ${JSON.stringify(
            value,
          )}`,
        );
        continue;
      }

      const subscriptionRecord = await databaseClient.getById(subscriptionId);
      if (!subscriptionRecord) {
        logger.warn(`No subscription record found for ID ${subscriptionId}`);
        continue;
      }

      const { token_hash, token_salt } = subscriptionRecord;
      const hashedClientState = hashValidationToken(clientState, token_salt);
      if (hashedClientState !== token_hash) {
        logger.warn(
          `Invalid clientState for notification item: ${JSON.stringify(value)}`,
        );
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
    } else {
      logger.debug(`All ${validValues} notification items are valid`);
    }
  };
}
