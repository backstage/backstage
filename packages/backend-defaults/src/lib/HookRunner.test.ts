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
import { HookRunner } from './HookRunner';
import { LoggerService } from '@backstage/backend-plugin-api';

describe('HookRunner', () => {
  it('should run all registered hooks once and log results', async () => {
    const logger = mockServices.logger.mock();
    const runner = new HookRunner('startup', logger);

    const order: string[] = [];
    runner.add(() => {
      order.push('a');
    });
    runner.add(() => {
      order.push('b');
    });

    await runner.run();
    expect(order).toEqual(['a', 'b']);
    expect(logger.debug).toHaveBeenCalledWith('Running 2 startup tasks...');
    expect(logger.debug).toHaveBeenCalledWith('Startup hook succeeded');

    // Second run is a no-op
    order.length = 0;
    await runner.run();
    expect(order).toEqual([]);
  });

  it('should catch errors from individual hooks without aborting others', async () => {
    const logger = mockServices.logger.mock();
    const runner = new HookRunner('shutdown', logger);

    const ok = jest.fn();
    runner.add(() => {
      throw new Error('boom');
    });
    runner.add(ok);

    await expect(runner.run()).resolves.toBeUndefined();
    expect(ok).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      'Shutdown hook failed',
      expect.any(Error),
    );
  });

  it('should catch async errors', async () => {
    const logger = mockServices.logger.mock();
    const runner = new HookRunner('shutdown', logger);

    runner.add(async () => {
      throw new Error('async boom');
    });

    await expect(runner.run()).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith(
      'Shutdown hook failed',
      expect.any(Error),
    );
  });

  it('should reject adding hooks after run', async () => {
    const logger = mockServices.logger.mock();
    const runner = new HookRunner('startup', logger, {
      lateAddMessage: 'Attempted to add startup hook after startup completed',
    });
    await runner.run();
    expect(() => runner.add(() => {})).toThrow(
      'Attempted to add startup hook after startup completed',
    );
  });

  it('should use per-hook logger from options when provided', async () => {
    const defaultLogger = mockServices.logger.mock();
    const hookLogger = mockServices.logger.mock();
    const runner = new HookRunner<{ logger?: LoggerService }>(
      'startup',
      defaultLogger,
    );

    runner.add(() => {}, { logger: hookLogger });
    await runner.run();

    expect(hookLogger.debug).toHaveBeenCalledWith('Startup hook succeeded');
    expect(defaultLogger.debug).not.toHaveBeenCalledWith(
      'Startup hook succeeded',
    );
  });
});
