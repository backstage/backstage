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
import { mockServices } from '@backstage/backend-test-utils';
import type { Config } from '@backstage/config';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { DateTime } from 'luxon';
import type {
  MicrosoftGraphSubscriptionsDatabaseClient,
  MicrosoftGraphSubscriptionsDatabaseOperations,
} from '../database/databaseClient';
import type { MicrosoftGraphClient } from './MicrosoftGraphClient';
import { MicrosoftGraphSubscriptionManager } from './MicrosoftGraphSubscriptionManager';

describe('MicrosoftGraphSubscriptionManager', () => {
  let logger: ReturnType<typeof mockServices.logger.mock>;
  let databaseClient: jest.Mocked<MicrosoftGraphSubscriptionsDatabaseClient>;
  let msGraphClient: jest.Mocked<MicrosoftGraphClient>;
  let config: Config;
  let target: MicrosoftGraphSubscriptionManager;

  beforeEach(async () => {
    logger = mockServices.logger.mock({
      child: jest.fn().mockImplementation(() => logger),
    });

    databaseClient = {
      insert: jest.fn(),
      getById: jest.fn(),
      findByResource: jest.fn(),
      deleteById: jest.fn(),
      transaction: jest.fn(
        async (
          transactionScope: (
            trx: MicrosoftGraphSubscriptionsDatabaseOperations,
          ) => Promise<void>,
        ) => transactionScope(databaseClient),
      ),
    } as unknown as jest.Mocked<MicrosoftGraphSubscriptionsDatabaseClient>;

    msGraphClient = {
      getSubscription: jest.fn(),
      createSubscription: jest.fn(),
      deleteSubscription: jest.fn(),
    } as unknown as jest.Mocked<MicrosoftGraphClient>;

    config = mockServices.rootConfig({
      data: {
        events: {
          modules: {
            msgraph: {
              subscriptionResources: ['users', 'groups'],
            },
          },
        },
      },
    });

    target = await MicrosoftGraphSubscriptionManager.fromConfig(config, {
      logger,
      databaseClient,
      msGraphClient,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws if unsupported resource is configured', async () => {
    config = mockServices.rootConfig({
      data: {
        events: {
          modules: {
            msgraph: {
              subscriptionResources: ['users', 'unsupported'],
            },
          },
        },
      },
    });
    await expect(
      MicrosoftGraphSubscriptionManager.fromConfig(config, {
        logger,
        databaseClient,
        msGraphClient,
      }),
    ).rejects.toThrow('Unsupported subscription resource unsupported');
  });

  it('fromConfig creates manager with supported resources', async () => {
    const manager = await MicrosoftGraphSubscriptionManager.fromConfig(config, {
      logger,
      databaseClient,
      msGraphClient,
    });
    expect(manager).toBeInstanceOf(MicrosoftGraphSubscriptionManager);
  });

  describe('schedule', () => {
    it('throws if neither schedule nor scheduler is provided', async () => {
      await expect(target.schedule({})).rejects.toThrow(
        'Either schedule or scheduler must be provided.',
      );
    });

    it('runs ensureActiveSubscriptions inside the scheduled task and logs failures', async () => {
      target.ensureActiveSubscriptions = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('boom'));
      const schedule = { run: jest.fn() };
      await target.schedule({ schedule });
      expect(schedule.run).toHaveBeenCalledWith({
        id: 'ms-graph-subscription-refresh',
        fn: expect.any(Function),
      });
      const { fn } = schedule.run.mock.calls[0][0];

      await fn();
      expect(target.ensureActiveSubscriptions).toHaveBeenCalledTimes(1);
      expect(logger.error).not.toHaveBeenCalled();

      await fn();
      expect(logger.error).toHaveBeenCalledWith(
        'MS Graph subscription refresh failed, Error: boom',
        expect.any(Error),
      );
    });

    it('creates a task runner from the scheduler and triggers it immediately', async () => {
      const runner = { run: jest.fn() };
      const scheduler = {
        createScheduledTaskRunner: jest.fn().mockReturnValue(runner),
        triggerTask: jest.fn().mockResolvedValue(undefined),
      };
      await target.schedule({ scheduler: scheduler as any });
      expect(scheduler.createScheduledTaskRunner).toHaveBeenCalledWith(
        expect.objectContaining({ scope: 'global' }),
      );
      expect(runner.run).toHaveBeenCalled();
      expect(scheduler.triggerTask).toHaveBeenCalledWith(
        'ms-graph-subscription-refresh',
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('prefers the provided schedule over the scheduler runner', async () => {
      const schedule = { run: jest.fn() };
      const scheduler = {
        createScheduledTaskRunner: jest.fn(),
        triggerTask: jest.fn().mockResolvedValue(undefined),
      };
      await target.schedule({ schedule, scheduler: scheduler as any });
      expect(schedule.run).toHaveBeenCalled();
      expect(scheduler.createScheduledTaskRunner).not.toHaveBeenCalled();
      expect(scheduler.triggerTask).toHaveBeenCalled();
    });

    it('handles trigger errors', async () => {
      const make = (error: Error) => ({
        createScheduledTaskRunner: jest
          .fn()
          .mockReturnValue({ run: jest.fn() }),
        triggerTask: jest.fn().mockRejectedValue(error),
      });

      await target.schedule({
        scheduler: make(new ConflictError('running')) as any,
      });
      expect(logger.error).not.toHaveBeenCalled();

      const notFound = new NotFoundError('missing');
      await target.schedule({ scheduler: make(notFound) as any });
      expect(logger.error).toHaveBeenCalledWith(
        'Task ms-graph-subscription-refresh not found when trying to trigger it',
        notFound,
      );

      const other = new Error('other');
      await target.schedule({ scheduler: make(other) as any });
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to trigger task ms-graph-subscription-refresh for immediate execution.',
        other,
      );
    });
  });

  describe('ensureActiveSubscriptions', () => {
    it('calls ensureActiveResourceSubscription for each resource', async () => {
      target.ensureActiveResourceSubscription = jest.fn();
      await target.ensureActiveSubscriptions();
      expect(target.ensureActiveResourceSubscription).toHaveBeenCalledTimes(2);
      expect(target.ensureActiveResourceSubscription).toHaveBeenCalledWith(
        'users',
      );
      expect(target.ensureActiveResourceSubscription).toHaveBeenCalledWith(
        'groups',
      );
    });
  });

  describe('ensureActiveResourceSubscription', () => {
    it('does nothing if subscription is valid', async () => {
      databaseClient.findByResource = jest.fn().mockResolvedValue({
        id: 'subid',
        expires_at: DateTime.now().plus({ minutes: 20 }).toJSDate(),
      });

      msGraphClient.validateActiveSubscription = jest.fn().mockResolvedValue({
        exists: true,
        isActive: true,
        notificationUrlMatches: true,
        isValid: true,
      });

      await target.ensureActiveResourceSubscription('users');
      expect(databaseClient.findByResource).toHaveBeenCalledWith('users');
      expect(msGraphClient.validateActiveSubscription).toHaveBeenCalledWith(
        'subid',
      );
      expect(databaseClient.deleteById).not.toHaveBeenCalled();
      expect(databaseClient.insert).not.toHaveBeenCalled();
      expect(msGraphClient.createSubscription).not.toHaveBeenCalled();
      expect(msGraphClient.deleteSubscription).not.toHaveBeenCalled();
    });

    it('creates and persists new subscription if existing not found in DB', async () => {
      databaseClient.findByResource = jest.fn().mockResolvedValue(undefined);

      const expirationDateTime = DateTime.now()
        .plus({ minutes: 45 })
        .toUTC()
        .toISO();
      msGraphClient.createSubscription.mockResolvedValue({
        id: 'subid',
        expirationDateTime,
      });
      await target.ensureActiveResourceSubscription('users');
      expect(msGraphClient.createSubscription).toHaveBeenCalledWith({
        resource: 'users',
        validationToken: expect.any(String),
      });

      expect(databaseClient.insert).toHaveBeenCalledWith({
        id: 'subid',
        resource: 'users',
        expires_at: new Date(expirationDateTime),
        token_hash: expect.any(String),
        token_salt: expect.any(String),
      });

      expect(logger.debug).toHaveBeenCalledWith(
        "No subscription record for resource 'users' exists.",
      );
      expect(logger.debug).toHaveBeenCalledWith(
        "Creating a new subscription for resource 'users'.",
      );

      expect(databaseClient.deleteById).not.toHaveBeenCalled();
      expect(msGraphClient.deleteSubscription).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Created new subscription subid for resource 'users'.",
      );
    });

    it('recreates expired subscription if found in DB', async () => {
      databaseClient.findByResource = jest.fn().mockResolvedValue({
        id: 'old_id',
        expires_at: DateTime.now().minus({ minutes: 20 }).toJSDate(),
      });
      msGraphClient.validateActiveSubscription = jest.fn().mockResolvedValue({
        isValid: false,
        exists: true,
        isActive: false,
        notificationUrlMatches: true,
      });

      msGraphClient.createSubscription = jest.fn().mockResolvedValue({
        id: 'new_id',
        expirationDateTime: DateTime.now().toISO(),
      });

      msGraphClient.deleteSubscription = jest.fn().mockResolvedValue(undefined);

      await target.ensureActiveResourceSubscription('users');

      expect(logger.debug).toHaveBeenCalledWith(
        "Subscription old_id for resource 'users' has expired.",
      );
      expect(logger.debug).toHaveBeenCalledWith(
        "Creating a new subscription for resource 'users'.",
      );
      expect(msGraphClient.createSubscription).toHaveBeenCalledWith({
        resource: 'users',
        validationToken: expect.any(String),
      });
      expect(databaseClient.deleteById).toHaveBeenCalledWith('old_id');
      expect(msGraphClient.deleteSubscription).toHaveBeenCalledWith('old_id');
      expect(databaseClient.insert).toHaveBeenCalledWith({
        id: 'new_id',
        resource: 'users',
        expires_at: expect.any(Date),
        token_hash: expect.any(String),
        token_salt: expect.any(String),
      });
    });

    it('recreates subscription that is about to expire', async () => {
      databaseClient.findByResource = jest.fn().mockResolvedValue({
        id: 'old_id',
        expires_at: DateTime.now().plus({ minutes: 5 }).toJSDate(),
      });
      msGraphClient.validateActiveSubscription = jest.fn().mockResolvedValue({
        exists: true,
        isActive: true,
        notificationUrlMatches: true,
        isValid: true,
      });
      msGraphClient.createSubscription.mockResolvedValue({
        id: 'new_id',
        expirationDateTime: DateTime.now().plus({ hours: 1 }).toISO(),
      });
      msGraphClient.deleteSubscription.mockResolvedValue(undefined);

      await target.ensureActiveResourceSubscription('users');

      expect(logger.debug).toHaveBeenCalledWith(
        "Subscription old_id for resource 'users' is about to expire.",
      );
      expect(databaseClient.deleteById).toHaveBeenCalledWith('old_id');
      expect(databaseClient.insert).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'new_id', resource: 'users' }),
      );
      expect(msGraphClient.deleteSubscription).toHaveBeenCalledWith('old_id');
    });

    it.each([
      [
        { exists: false, isActive: false, notificationUrlMatches: false },
        "Subscription old_id for resource 'users' does not exist.",
      ],
      [
        { exists: true, isActive: true, notificationUrlMatches: false },
        "Subscription old_id for resource 'users' has incorrect notification URL.",
      ],
    ])('recreates subscription when %j', async (validity, message) => {
      databaseClient.findByResource = jest.fn().mockResolvedValue({
        id: 'old_id',
        expires_at: DateTime.now().plus({ minutes: 30 }).toJSDate(),
      });
      msGraphClient.validateActiveSubscription = jest
        .fn()
        .mockResolvedValue({ ...validity, isValid: false });
      msGraphClient.createSubscription.mockResolvedValue({
        id: 'new_id',
        expirationDateTime: DateTime.now().plus({ hours: 1 }).toISO(),
      });
      msGraphClient.deleteSubscription.mockResolvedValue(undefined);

      await target.ensureActiveResourceSubscription('users');

      expect(logger.debug).toHaveBeenCalledWith(message);
      expect(databaseClient.deleteById).toHaveBeenCalledWith('old_id');
      expect(databaseClient.insert).toHaveBeenCalled();
    });

    it('deletes the record and creates a new subscription when validation throws', async () => {
      databaseClient.findByResource = jest.fn().mockResolvedValue({
        id: 'old_id',
        expires_at: DateTime.now().plus({ minutes: 30 }).toJSDate(),
      });
      msGraphClient.validateActiveSubscription = jest
        .fn()
        .mockRejectedValue(new Error('not found'));
      msGraphClient.createSubscription.mockResolvedValue({
        id: 'new_id',
        expirationDateTime: DateTime.now().plus({ hours: 1 }).toISO(),
      });

      await target.ensureActiveResourceSubscription('users');

      expect(databaseClient.deleteById).toHaveBeenCalledWith('old_id');
      expect(databaseClient.insert).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'new_id' }),
      );
      expect(msGraphClient.deleteSubscription).not.toHaveBeenCalled();
    });

    it('logs a warning if cleaning up the old subscription fails', async () => {
      databaseClient.findByResource = jest.fn().mockResolvedValue({
        id: 'old_id',
        expires_at: DateTime.now().minus({ minutes: 20 }).toJSDate(),
      });
      msGraphClient.validateActiveSubscription = jest.fn().mockResolvedValue({
        exists: true,
        isActive: false,
        notificationUrlMatches: true,
        isValid: false,
      });
      msGraphClient.createSubscription.mockResolvedValue({
        id: 'new_id',
        expirationDateTime: DateTime.now().plus({ hours: 1 }).toISO(),
      });
      const error = new Error('delete failed');
      msGraphClient.deleteSubscription.mockRejectedValue(error);

      await target.ensureActiveResourceSubscription('users');
      await new Promise(resolve => setImmediate(resolve));

      expect(logger.warn).toHaveBeenCalledWith(
        'Error cleaning up old subscription old_id: Error: delete failed',
        error,
      );
    });
  });
});
