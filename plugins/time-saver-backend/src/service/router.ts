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
import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { TsDatabase } from '../database/tsDatabase';
import { TimeSaverHandler } from '../timeSaver/handler';
import { TsApi } from '../api/apiService';
import { Config } from '@backstage/config';
import { TsScheduler } from '../timeSaver/scheduler';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  scheduler: PluginTaskScheduler;
}

const TS_PLUGIN_DEFAULT_SCHEDULE = {
  frequency: {
    minutes: 5,
  },
  timeout: {
    minutes: 30,
  },
  initialDelay: {
    seconds: 60,
  },
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, database, scheduler } = options;

  const tsDatabaseInstance = TsDatabase.create(database);
  const kx = await tsDatabaseInstance.get();
  await TsDatabase.runMigrations(kx);

  const tsHandler = new TimeSaverHandler(logger, kx);
  const apiHandler = new TsApi(logger, config, kx);
  const tsScheduler = new TsScheduler(logger, kx);

  const taskRunner = scheduler.createScheduledTaskRunner(
    TS_PLUGIN_DEFAULT_SCHEDULE,
  );
  tsScheduler.schedule(taskRunner);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/generateSavings', async (_, response) => {
    const status = await tsHandler.fetchTemplates();
    response.json({ status: status });
  });

  router.get('/getStats/', async (request, response) => {
    const templateId = request.query.templateTaskId;
    const team = request.query.team;
    const templateName = request.query.templateName;
    let result;
    if (templateId) {
      result = await apiHandler.getStatsByTemplateTaskId(String(templateId));
    } else if (team) {
      result = await apiHandler.getStatsByTeam(String(team));
    } else if (templateName) {
      result = await apiHandler.getStatsByTemplate(String(templateName));
    } else {
      result = await apiHandler.getAllStats();
    }
    response.json(result);
  });

  router.get('/getStats/group', async (_request, response) => {
    const result = await apiHandler.getGroupDivisionStats();
    response.json(result);
  });

  router.get('/getDailyTimeSummary/team', async (_request, response) => {
    const result = await apiHandler.getDailyTimeSummariesTeamWise();
    response.json(result);
  });

  router.get('/getDailyTimeSummary/template', async (_request, response) => {
    const result = await apiHandler.getDailyTimeSummariesTemplateWise();
    response.json(result);
  });

  router.get('/getTimeSummary/team', async (_request, response) => {
    const result = await apiHandler.getTimeSummarySavedTeamWise();
    response.json(result);
  });

  router.get('/getTimeSummary/template', async (_request, response) => {
    const result = await apiHandler.getTimeSummarySavedTemplateWise();
    response.json(result);
  });

  router.get('/migrate', async (_request, response) => {
    const result = await apiHandler.updateTemplatesWithSubstituteData();
    response.json(result);
  });

  router.get('/groups', async (_request, response) => {
    const result = await apiHandler.getAllGroups();
    response.json(result);
  });

  router.get('/templates', async (_request, response) => {
    const result = await apiHandler.getAllTemplateNames();
    response.json(result);
  });

  router.get('/templateTasks', async (_request, response) => {
    const result = await apiHandler.getAllTemplateTasks();
    response.json(result);
  });

  router.get('/getTemplateCount', async (_request, response) => {
    const result = await apiHandler.getTemplateCount();
    response.json(result);
  });

  router.get('/getTimeSavedSum', async (request, response) => {
    const divider = request.query.divider;
    const result = divider
      ? await apiHandler.getTimeSavedSum(Number(divider))
      : await apiHandler.getTimeSavedSum();
    response.json(result);
  });

  router.use(errorHandler());
  return router;
}
