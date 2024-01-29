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
import { TaskRunner } from '@backstage/backend-tasks';
import { Logger } from 'winston';
import * as uuid from 'uuid';
import { TimeSaverHandler } from './handler';
import { Knex } from 'knex';

export class TsScheduler {
  constructor(private readonly logger: Logger, private readonly knex: Knex) {}

  async schedule(taskRunner: TaskRunner) {
    const tsHandler = new TimeSaverHandler(this.logger, this.knex);
    await taskRunner.run({
      id: uuid.v4(),
      fn: async () => {
        this.logger.info(
          'START - Scheduler executed - fetching templates for TS plugin',
        );
        await tsHandler.fetchTemplates();
        this.logger.info(
          'STOP - Scheduler executed - fetching templates for TS plugin',
        );
      },
    });
  }
}
