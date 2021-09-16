/*
 * Copyright 2021 The Backstage Authors
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

import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { TechInsightsStore } from './TechInsightsDatabase';
import { FactRetrieverEngine } from './FactRetrieverEngine';
import { FactChecker } from './JsonRulesEngineFactChecker';
import { Logger } from 'winston';
import { TechInsightCheck } from '../types';

export interface RouterOptions<CheckType extends TechInsightCheck> {
  factRetrieverEngine: FactRetrieverEngine;
  factChecker: FactChecker<CheckType>;
  repository: TechInsightsStore;
  config: Config;
  logger: Logger;
}

export async function createRouter<CheckType extends TechInsightCheck>(
  options: RouterOptions<CheckType>,
): Promise<express.Router> {
  const router = Router();

  // @ts-ignore
  const { repository, factRetrieverEngine, factChecker } = options;

  router.get('/check/:check/:namespace/:kind/:name', async (req, res) => {
    const { namespace, kind, name, check } = req.params;
    const entityTriplet = `${namespace.toLowerCase()}/${kind.toLowerCase()}/${name.toLowerCase()}`;
    const checkResult = await factChecker.check(entityTriplet, check);
    return res.send(checkResult);
  });

  router.get('/checks', (_req, res) => {
    return res.send(factChecker.getChecks());
  });

  // get facts
  // get facts between dates
  // get scorecards (aggregation of checks)

  return router;
}
