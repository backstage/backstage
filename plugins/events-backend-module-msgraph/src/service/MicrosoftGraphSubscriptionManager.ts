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
import { ConflictError, isError, NotFoundError } from '@backstage/errors';
import { Duration } from 'luxon';
import type {
  MicrosoftGraphSubscriptionsDatabaseClient,
  MicrosoftGraphSubscriptionsDatabaseOperations,
} from '../database/databaseClient';
import type { MicrosoftGraphClient } from './MicrosoftGraphClient';
import { newValidationToken } from './validationToken';
import { Subscription } from '@microsoft/microsoft-graph-types';
import { difference } from 'lodash';

const SUPPORTED_RESOURCES = ['users', 'groups'];

/**
 * 29 days is the maximum subscription duration according to
 * https://learn.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0
 */
const SUBSCRIPTION_DURATION_MS = 41_760 * 60 * 1000; // 29 days

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

const TASK_ID = 'ms-graph-subscription-refresh';

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

const newExpirationDateTime = () =>
  new Date(Date.now() + SUBSCRIPTION_DURATION_MS);

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
    // Fail fast if the configuration is missing or incomplete
    config.getString('events.modules.msgraph.notificationUrl');

    const resources = config.getStringArray(
      'events.modules.msgraph.subscriptionResources',
    );
    validateResources(resources);

    return new MicrosoftGraphSubscriptionManager(
      logger.child({
        class: MicrosoftGraphSubscriptionManager.prototype.constructor.name,
      }),
      config,
      databaseClient,
      msGraphClient,
      Array.from(new Set(resources.map(r => r.trim().toLowerCase()))),
    );
  }

  constructor(
    private readonly logger: LoggerService,
    private readonly config: Config,
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

    await taskRunner.run({
      id: TASK_ID,
      fn: async () => {
        // Reconcile obsolete subscriptions on every refresh, including after rolling configuration changes.
        // Cleanup is best effort and must not block subscription refreshes.
        try {
          await this.cleanupObsoleteSubscriptions();
        } catch (error) {
          this.logger.warn(
            'MS Graph subscription cleanup failed, will retry on next run.',
            isError(error) ? error : undefined,
          );
        }

        // Ensuring active subscriptions must always happen under global scheduler lock,
        // to avoid multiple instances of the plugin creating subscriptions for the same resource at the same time.
        try {
          await this.ensureActiveSubscriptions();
        } catch (error) {
          this.logger.error(
            `MS Graph subscription refresh failed, ${error}`,
            isError(error) ? error : undefined,
          );
          throw error;
        }
      },
    });

    if (scheduler) {
      // When scheduler is available trigger the task immediately to ensure subscriptions are created on startup.
      try {
        await scheduler.triggerTask(TASK_ID);
      } catch (error) {
        if (error instanceof ConflictError) {
          // the task is already running - do nothing
        } else if (error instanceof NotFoundError) {
          // the task does not exist
          this.logger.error(
            `Task ${TASK_ID} not found when trying to trigger it`,
            error,
          );
        } else {
          this.logger.error(
            `Failed to trigger task ${TASK_ID} for immediate execution.`,
            error,
          );
        }
      }
    }
  }

  /**
   * Cleans up any subscriptions for resources that are no longer configured.
   */
  async cleanupObsoleteSubscriptions(): Promise<boolean> {
    // make a best-effort attempt to clean up any subscriptions for resources that are no longer configured
    const nonConfiguredResources = difference(
      SUPPORTED_RESOURCES,
      this.resources,
    );

    this.logger.info(
      `Cleaning up subscriptions for non-configured resources: ${nonConfiguredResources.join(
        ', ',
      )}`,
    );

    let noErrors = true;

    await this.database.transaction(async trx => {
      for (const resource of nonConfiguredResources) {
        // MySQL does not support RETURNING in DELETE queries, so we need to first find the subscription and then delete it
        const existingSubscription = await trx.findByResource(resource);
        if (!existingSubscription) {
          this.logger.debug(
            `No subscription record for resource ${resource} exists, nothing to clean up.`,
          );
          continue;
        }

        const id = existingSubscription.id;
        try {
          await this.msGraphClient.deleteSubscription(id);
          this.logger.info(
            `Successfully deleted subscription ${id} for resource ${resource} from MS Graph.`,
          );
        } catch (error) {
          if (!(error instanceof NotFoundError)) {
            noErrors = false;
            this.logger.warn(
              `Failed to delete subscription ${id} for resource ${resource} from MS Graph.`,
              isError(error) ? error : undefined,
            );

            // Indecisive - better to keep the DB record to be able to retry later
            continue;
          }
        }

        try {
          await trx.deleteById(id);
          this.logger.info(
            `Successfully deleted subscription record ${id} for resource ${resource} from DB.`,
          );
        } catch (error) {
          noErrors = false;
          this.logger.warn(
            `Failed to delete subscription record for resource ${resource} from DB.`,
            isError(error) ? error : undefined,
          );
        }

        this.logger.info(
          `Successfully cleaned up subscription ${id} for resource ${resource}.`,
        );
      }
    });

    return noErrors;
  }

  /**
   * Ensures that all configured resources have an active subscription in MS Graph and in the database.
   */
  async ensureActiveSubscriptions() {
    const results = await Promise.allSettled(
      this.resources.map(resource =>
        this.ensureActiveResourceSubscription(resource),
      ),
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        throw result.reason;
      }
    }
  }

  async ensureActiveResourceSubscription(resource: string) {
    const logger = this.logger.child({ resource });
    let createdSubscriptionId: string | undefined;

    try {
      await this.database.transaction(async trx => {
        const { existingSubscriptionId, isValid, expiresSoon } =
          await this.checkExistingSubscription(trx, resource);

        if (existingSubscriptionId && isValid && !expiresSoon) {
          logger.debug(
            `Subscription '${existingSubscriptionId}' for resource '${resource}' is valid.`,
          );

          return;
        } else if (!existingSubscriptionId || !isValid) {
          logger.debug(
            `No valid subscription for resource '${resource}' exists, creating a new one.`,
          );

          if (existingSubscriptionId) {
            // Clean up old subscription in MS Graph asynchronously if available
            try {
              await this.msGraphClient.deleteSubscription(
                existingSubscriptionId,
              );
            } catch (err) {
              logger.warn(
                `Error deleting old subscription ${existingSubscriptionId}.`,
                isError(err) ? err : undefined,
              );
            }

            await trx.deleteById(existingSubscriptionId);
          }

          const { validationToken, hash, salt } = newValidationToken();
          const { id, expirationDateTime } =
            await this.msGraphClient.createSubscription({
              resource,
              validationToken,
              expirationDateTime: newExpirationDateTime(),
              notificationUrl: this.getNotificationUrl(),
            });
          createdSubscriptionId = id;

          await trx.insert({
            id,
            resource,
            expires_at: new Date(expirationDateTime),
            token_hash: hash,
            token_salt: salt,
          });
        } else if (expiresSoon) {
          logger.debug(
            `Renewing expiring subscription for resource '${resource}'.`,
          );

          const { id, expirationDateTime } =
            await this.msGraphClient.renewSubscription({
              subscriptionId: existingSubscriptionId,
              expirationDateTime: newExpirationDateTime(),
            });

          await trx.update({
            id,
            expires_at: new Date(expirationDateTime),
          });

          logger.info(`Subscription ${id} for resource '${resource}' renewed.`);
        }
      });
    } catch (error) {
      if (createdSubscriptionId) {
        try {
          this.logger.warn(
            `Failed to persist subscription ${createdSubscriptionId} for resource '${resource}' in DB. Cleaning up MS Graph subscription.`,
            isError(error) ? error : undefined,
          );
          await this.msGraphClient.deleteSubscription(createdSubscriptionId);
        } catch (cleanupError) {
          if (!(cleanupError instanceof NotFoundError)) {
            logger.error(
              `Failed to delete unpersisted subscription ${createdSubscriptionId} for resource '${resource}' from MS Graph. Manual cleanup may be required.`,
              isError(cleanupError) ? cleanupError : undefined,
            );
          }
        }
      }
      throw error;
    }

    if (createdSubscriptionId) {
      logger.info(
        `Created new subscription ${createdSubscriptionId} for resource '${resource}'.`,
      );
    }
  }

  private async checkExistingSubscription(
    trx: MicrosoftGraphSubscriptionsDatabaseOperations,
    resource: string,
  ): Promise<{
    existingSubscriptionId?: string;
    isValid?: boolean;
    expiresSoon?: boolean;
  }> {
    let logger = this.logger.child({ resource });

    logger.debug(`Checking active subscription for resource '${resource}'.`);
    const existingSubscriptionRecord = await trx.findByResource(resource);
    const existingSubscriptionId = existingSubscriptionRecord?.id;
    if (!existingSubscriptionId) {
      logger.debug(`No subscription record for resource '${resource}' exists.`);
      return {};
    }

    let msgraphSubscription: Subscription | undefined;

    try {
      msgraphSubscription = await this.msGraphClient.getSubscription(
        existingSubscriptionId,
      );
    } catch (err) {
      this.logger.warn(
        `Error fetching subscription ${existingSubscriptionId} from MS Graph.`,
        isError(err) ? err : undefined,
      );

      if (err instanceof NotFoundError) {
        // if the subscription does not exist in MS Graph, we consider it invalid and will create a new one
        return { existingSubscriptionId, isValid: false };
      }

      throw err;
    }

    const exists = Boolean(msgraphSubscription);
    const expirationDateTime =
      msgraphSubscription &&
      new Date(
        msgraphSubscription.expirationDateTime ??
          existingSubscriptionRecord.expires_at,
      );
    const remainingTime = !expirationDateTime
      ? 0
      : expirationDateTime.valueOf() - new Date().valueOf();
    const isActive = remainingTime > 0;
    const expiresSoon = remainingTime <= subscriptionExpirationBuffer.valueOf();
    const notificationUrlMatches = Boolean(
      msgraphSubscription &&
        msgraphSubscription.notificationUrl === this.getNotificationUrl(),
    );

    logger = logger.child({ subscriptionId: existingSubscriptionId });

    if (!exists) {
      logger.debug(
        `Subscription for resource '${resource}' does not exist in MSGraph.`,
      );
    }

    const isValid = isActive && notificationUrlMatches;

    if (!isActive) {
      logger.debug(
        `Subscription ${existingSubscriptionId} for resource '${resource}' has expired.`,
      );
    } else if (!notificationUrlMatches) {
      logger.debug(
        `Subscription ${existingSubscriptionId} for resource '${resource}' has incorrect notification URL.`,
      );
    } else if (expiresSoon) {
      logger.debug(
        `Subscription ${existingSubscriptionId} for resource '${resource}' will soon expire.`,
      );
    }

    return {
      existingSubscriptionId,
      isValid,
      expiresSoon,
    };
  }

  private getNotificationUrl() {
    return this.config.getString('events.modules.msgraph.notificationUrl');
  }
}
