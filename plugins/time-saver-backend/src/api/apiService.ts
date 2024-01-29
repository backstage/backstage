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
import { ScaffolderClient } from './scaffolderClient';
import { Config } from '@backstage/config';

export class TsApi {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config,
    knex: Knex,
  ) {
    this.db = new DatabaseOperations(knex, logger);
  }
  private readonly db: DatabaseOperations;
  private readonly tsTableName = 'ts_template_time_savings';

  public async getStatsByTemplateTaskId(templateTaskId: string) {
    const templateName = await this.db.getTemplateNameByTsId(templateTaskId);
    const queryResult = await this.db.getStatsByTemplateTaskId(templateTaskId);
    const outputBody = {
      templateTaskId: templateTaskId,
      templateName: templateName,
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getStatsByTeam(team: string) {
    const queryResult = await this.db.getStatsByTeam(team);
    const outputBody = {
      team: team,
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getStatsByTemplate(template: string) {
    const queryResult = await this.db.getStatsByTemplate(template);
    const outputBody = {
      template_name: template,
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getAllStats() {
    const queryResult = await this.db.getAllStats();
    const outputBody = {
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getGroupDivisionStats() {
    const queryResult = await this.db.getGroupSavingsDivision();
    const outputBody = {
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getDailyTimeSummariesTeamWise() {
    const queryResult = await this.db.getDailyTimeSummariesTeamWise();
    const outputBody = {
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }
  public async getDailyTimeSummariesTemplateWise() {
    const queryResult = await this.db.getDailyTimeSummariesTemplateWise();
    const outputBody = {
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getTimeSummarySavedTeamWise() {
    const queryResult = await this.db.getTimeSummarySavedTeamWise();
    const outputBody = {
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }
  public async getTimeSummarySavedTemplateWise() {
    const queryResult = await this.db.getTimeSummarySavedTemplateWise();
    const outputBody = {
      stats: queryResult,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async updateTemplatesWithSubstituteData(): Promise<{
    status: string;
    error?: Error;
  }> {
    const tsConfigObj =
      this.config.getOptionalString('ts.backward.config') || undefined;
    if (!tsConfigObj) {
      this.logger.warn(`Backward processing not configured, escaping...`);
      return { status: 'FAIL' };
    }
    try {
      const tsConfig = JSON.parse(String(tsConfigObj));
      const taskTemplateList = await new ScaffolderClient(
        this.logger,
      ).fetchTemplatesFromScaffolder();
      for (let i = 0; i < taskTemplateList.length; i++) {
        const singleTemplate = taskTemplateList[i];
        this.logger.debug(singleTemplate);
        const templateReference = singleTemplate.spec.templateInfo.entityRef;
        const substituteConfig = tsConfig.find(
          (con: { entityRef: any }) => con.entityRef === templateReference,
        );
        if (substituteConfig) {
          await this.updateExistsingTemplateWithSubstituteById(
            singleTemplate.id,
            substituteConfig,
          );
        }
      }
    } catch (error) {
      this.logger.error(`problem with template backward migration`, error);
      return {
        status: 'error',
        error: error,
      };
    }
    return {
      status: 'SUCCESS',
    };
  }

  public async updateExistsingTemplateWithSubstituteById(
    templateTaskId: string,
    engData: object,
  ) {
    const queryResult = JSON.parse(
      (await this.db.collectSpecByTemplateId(templateTaskId)).spec,
    );
    const metadata = queryResult.templateInfo.entity.metadata;
    metadata.substitute = engData;

    await this.db.updateTemplateTaskById(
      templateTaskId,
      JSON.stringify(queryResult),
    );
    const outputBody = {
      stats: queryResult,
    };
    this.logger.debug(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getAllGroups() {
    const queryResult = await this.db.getDistinctColumn(
      this.tsTableName,
      'team',
    );
    const groupList: string[] = queryResult.map(row => row.team);
    const outputBody = {
      groups: groupList,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getAllTemplateNames() {
    const queryResult = await this.db.getDistinctColumn(
      this.tsTableName,
      'template_name',
    );
    const groupList: string[] = queryResult.map(row => row.template_name);
    const outputBody = {
      templates: groupList,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getAllTemplateTasks() {
    const queryResult = await this.db.getDistinctColumn(
      this.tsTableName,
      'template_task_id',
    );
    const groupList: string[] = queryResult.map(row => row.template_task_id);
    const outputBody = {
      templateTasks: groupList,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getTemplateCount() {
    const queryResult = (
      await this.db.getTemplateCount(this.tsTableName, 'template_task_id')
    )[0];
    const outputBody = {
      templateTasks: queryResult.count,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }

  public async getTimeSavedSum(divider?: number) {
    const dividerInt = divider ?? 1;
    const queryResult = (
      await this.db.getTimeSavedSum(this.tsTableName, 'time_saved')
    )[0];
    const outputBody = {
      timeSaved: queryResult.sum / dividerInt,
    };
    this.logger.info(JSON.stringify(outputBody));
    return outputBody;
  }
}
