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
import type {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import { isError } from '@backstage/errors';
import { Duration } from 'luxon';
import type {
  MicrosoftGraphSubscriptionsDatabaseClient,
  MicrosoftGraphSubscriptionsDatabaseOperations,
} from '../database/databaseClient';
import type {
  MicrosoftGraphClient,
  SubscriptionValidationResult,
} from './MicrosoftGraphClient';
import { newValidationToken } from './validationToken';

const SUPPORTED_RESOURCES = ['users', 'groups'];

/**
 * Buffer time before subscription expiration to consider it expired and renew.
 */
const subscriptionExpirationBuffer = Duration.fromObject({ minutes: 10 });

/**
 * Interval to refresh subscriptions. Must be less than the expiration buffer.
 */
const subscriptionRefresh = Duration.fromObject({ minutes: 5 });

const subscriptionRefreshSchedule: SchedulerServiceTaskScheduleDefinition = {
  frequency: subscriptionRefresh,
  timeout: {
    minutes: 1,
  },
  initialDelay: {
    seconds: 10,
  },
  scope: 'global',
};

const expiresSoon = (expiresAt: Date) =>
  expiresAt.valueOf() - new Date().valueOf() <=
  subscriptionExpirationBuffer.valueOf();

const validateResources = (resources: string[]) => {
  resources.forEach(resource => {
    if (!SUPPORTED_RESOURCES.includes(resource.trim())) {
      throw new Error(
        `Unsupported subscription resource ${resource}. ` +
          `Supported resources are: ${SUPPORTED_RESOURCES.join(', ')}`,
      );
    }
  });
};

export interface MicrosoftGraphSubscriptionManagerOptions {
  logger: LoggerService;
  databaseClient: MicrosoftGraphSubscriptionsDatabaseClient;
  msGraphClient: MicrosoftGraphClient;
}

export interface ScheduleOptions {
  /**
   * The refresh schedule to use.
   */
  schedule?: SchedulerServiceTaskRunner;

  /**
   * Scheduler used to schedule refreshes based on
   * the schedule config.
   */
  scheduler?: SchedulerService;
}

export class MicrosoftGraphSubscriptionManager {
  static async fromConfig(
    config: Config,
    {
      logger,
      databaseClient,
      msGraphClient,
    }: MicrosoftGraphSubscriptionManagerOptions,
  ): Promise<MicrosoftGraphSubscriptionManager> {
    const resources = config.getStringArray('events.modules.msgraph.resources');
    validateResources(resources);

    return new MicrosoftGraphSubscriptionManager(
      logger.child({
        class: MicrosoftGraphSubscriptionManager.prototype.constructor.name,
      }),
      databaseClient,
      msGraphClient,
      Array.from(new Set(resources.map(r => r.trim().toLowerCase()))),
    );
  }

  constructor(
    private readonly logger: LoggerService,
    private readonly database: MicrosoftGraphSubscriptionsDatabaseClient,
    private readonly msGraphClient: MicrosoftGraphClient,
    private readonly resources: string[],
  ) {}

  public async schedule({ scheduler, schedule }: ScheduleOptions) {
    if (!schedule && !scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const taskRunner =
      schedule ??
      scheduler!.createScheduledTaskRunner(subscriptionRefreshSchedule);

    // Ensure we have active subscriptions right away
    await this.ensureActiveSubscriptions();

    await taskRunner.run({
      id: 'ms-graph-subscription-refresh',
      fn: async () => {
        try {
          await this.ensureActiveSubscriptions();
        } catch (error) {
          this.logger.error(
            `MS Graph subscription refresh failed, ${error}`,
            isError(error) ? error : undefined,
          );
        }
      },
    });
  }

  async ensureActiveSubscriptions() {
    await Promise.all(
      this.resources.map(resource =>
        this.ensureActiveResourceSubscription(resource),
      ),
    );
  }

  async ensureActiveResourceSubscription(resource: string) {
    const logger = this.logger.child({ resource });

    // Use a transaction to ensure synchronized between MS Graph and our DB
    await this.database.transaction(async trx => {
      const { existingSubscriptionId, isValid } =
        await this.checkExistingSubscription(trx, resource);

      if (isValid) {
        return;
      }

      logger.debug(`Creating a new subscription for resource '${resource}'.`);
      const { validationToken, hash, salt } = newValidationToken();
      const { id, expirationDateTime } =
        await this.msGraphClient.createSubscription({
          resource,
          validationToken,
        });

      await trx.insert({
        id,
        resource,
        expires_at: new Date(expirationDateTime),
        token_hash: hash,
        token_salt: salt,
      });
      logger.info(`Created new subscription ${id} for resource '${resource}'.`);

      if (existingSubscriptionId) {
        // Clean up old subscription in MS Graph asynchronously
        this.msGraphClient
          .deleteSubscription(existingSubscriptionId)
          .catch(err =>
            logger.warn(
              `Error cleaning up old subscription ${existingSubscriptionId}: ${err}`,
              isError(err) ? err : undefined,
            ),
          );
      }
    });
  }

  private async checkExistingSubscription(
    trx: MicrosoftGraphSubscriptionsDatabaseOperations,
    resource: string,
  ): Promise<{ existingSubscriptionId?: string; isValid?: boolean }> {
    let logger = this.logger.child({ resource });

    logger.debug(`Checking active subscription for resource '${resource}'.`);
    const existingSubscriptionRecord = await trx.findByResource(resource);
    const existingSubscriptionId = existingSubscriptionRecord?.id;
    if (!existingSubscriptionId) {
      logger.debug(`No subscription record for resource '${resource}' exists.`);
      return {};
    }

    logger = logger.child({ subscriptionId: existingSubscriptionId });

    logger.debug(
      `Found existing subscription record ${existingSubscriptionId} for resource '${resource}', checking if still valid.`,
    );

    let subscriptionValidity: SubscriptionValidationResult;
    try {
      subscriptionValidity =
        await this.msGraphClient.validateActiveSubscription(
          existingSubscriptionId,
        );
    } catch (e) {
      logger.debug(
        `Subscription ${existingSubscriptionId} for resource '${resource}' not found.`,
      );

      logger.debug(
        `Deleting subscription record ${existingSubscriptionId} for resource '${resource}'`,
      );

      await trx.deleteById(existingSubscriptionId);

      return {
        isValid: false,
      };
    }

    if (!subscriptionValidity.exists) {
      logger.debug(
        `Subscription for ${existingSubscriptionId} resource '${resource}' does not exist.`,
      );
    } else if (!subscriptionValidity.isActive) {
      logger.debug(
        `Subscription for ${existingSubscriptionId} resource '${resource}' has expired.`,
      );
    } else if (!subscriptionValidity.notificationUrlMatches) {
      logger.debug(
        `Subscription for ${existingSubscriptionId} resource '${resource}' has incorrect notification URL.`,
      );
    } else if (expiresSoon(existingSubscriptionRecord.expires_at)) {
      logger.debug(
        `Subscription ${existingSubscriptionId} for resource '${resource}' is about to expire.`,
      );
      subscriptionValidity.isValid = false;
    }

    if (subscriptionValidity.isValid) {
      logger.debug(
        `Subscription '${existingSubscriptionId}' for resource '${resource}' is valid.`,
      );
    } else {
      logger.debug(
        `Deleting subscription record ${existingSubscriptionId} for resource '${resource}'`,
      );
      await trx.deleteById(existingSubscriptionId);
    }

    return {
      existingSubscriptionId,
      isValid: subscriptionValidity.isValid,
    };
  }
}
