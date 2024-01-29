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
import { Logger } from 'winston';
import { Knex } from 'knex';
import { DatabaseOperations } from '../database/databaseOperations';
import { ScaffolderClient } from '../api/scaffolderClient';

export class TimeSaverHandler {
  constructor(private readonly logger: Logger, knex: Knex) {
    this.db = new DatabaseOperations(knex, logger);
  }
  private readonly db: DatabaseOperations;
  private readonly tsTableName = 'ts_template_time_savings';

  async fetchTemplates() {
    const scaffolderClient = new ScaffolderClient(this.logger);
    this.logger.info(`START - Collecting Time Savings data from templates...}`);

    let templateTaskList = [];
    try {
      templateTaskList = await scaffolderClient.fetchTemplatesFromScaffolder();
    } catch (error) {
      return 'FAIL';
    }

    await this.db.truncate(this.tsTableName); // cleaning table
    templateTaskList = templateTaskList.filter(
      (single: { status: string }) => single.status === 'completed',
    ); // filtering only completed
    for (let i = 0; i < templateTaskList.length; i++) {
      const singleTemplate = templateTaskList[i];
      const createdAtForPostgres = new Date(singleTemplate.createdAt)
        .toISOString()
        .replace('T', ' ')
        .replace('Z', ' UTC');
      this.logger.debug(`Parsing template task ${singleTemplate.id}`);
      const templateSubstituteData =
        singleTemplate.spec.templateInfo.entity.metadata.substitute ||
        undefined;
      if (templateSubstituteData) {
        for (const key in templateSubstituteData.engineering) {
          if (templateSubstituteData.engineering.hasOwnProperty(key)) {
            const value = templateSubstituteData.engineering[key];
            await this.db.insert(this.tsTableName, {
              template_task_id: singleTemplate.id,
              created_at: createdAtForPostgres,
              template_name: singleTemplate.spec.templateInfo.entityRef,
              team: key,
              time_saved: value,
              template_task_status: singleTemplate.status,
              created_by: singleTemplate.createdBy,
            });
          }
        }
      } else {
        this.logger.debug(
          `Template ${singleTemplate.id} does not have substitute fields on its body`,
        );
      }
    }
    this.logger.info(`STOP - Collecting Time Savings data from templates...}`);
    return 'SUCCESS';
  }
}
