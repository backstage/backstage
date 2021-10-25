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
import {
  FactChecker,
  TechInsightCheck,
  CheckResult,
} from '@backstage/plugin-tech-insights-common';
import { Logger } from 'winston';
import { DateTime } from 'luxon';
import { PersistenceContext } from './persistence/DatabaseManager';
import {
  EntityRef,
  parseEntityName,
  stringifyEntityRef,
} from '@backstage/catalog-model';

/**
 * @public
 *
 * RouterOptions to construct TechInsights endpoints
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 */
export interface RouterOptions<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> {
  /**
   * Optional FactChecker implementation. If omitted, endpoints are not constructed
   */
  factChecker?: FactChecker<CheckType, CheckResultType>;

  /**
   * TechInsights PersistenceContext. Should contain an implementation of TechInsightsStore
   */
  persistenceContext: PersistenceContext;

  /**
   * Backstage config object
   */
  config: Config;

  /**
   * Implementation of Winston logger
   */
  logger: Logger;
}

/**
 * @public
 *
 * Constructs a tech-insights router.
 *
 * Exposes endpoints to handle facts
 * Exposes optional endpoints to handle checks if a FactChecker implementation is passed in
 *
 * @param options - RouterOptions object
 */
export async function createRouter<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
>(options: RouterOptions<CheckType, CheckResultType>): Promise<express.Router> {
  const router = Router();
  router.use(express.json());
  const { persistenceContext, factChecker, logger } = options;
  const { techInsightsStore } = persistenceContext;

  if (factChecker) {
    logger.info('Fact checker configured. Enabling fact checking endpoints.');
    router.get('/checks', async (_req, res) => {
      return res.send(await factChecker.getChecks());
    });

    router.post('/checks/run/:namespace/:kind/:name', async (req, res) => {
      const { namespace, kind, name } = req.params;
      try {
        if (!('checks' in req.body)) {
          return res.status(422).send({
            message: 'Failed to get checks from request.',
          });
        }
        const { checks }: { checks: string[] } = req.body;
        const entityTriplet = stringifyEntityRef({ namespace, kind, name });
        const checkResult = await factChecker.runChecks(entityTriplet, checks);
        return res.send(checkResult);
      } catch (e) {
        return res.status(500).json({ message: e.message }).send();
      }
    });
  } else {
    logger.info(
      'Starting tech insights module without fact checking endpoints.',
    );
  }

  router.get('/fact-schemas', async (req, res) => {
    const ids = req.query.ids as string[];
    return res.send(await techInsightsStore.getLatestSchemas(ids));
  });

  /**
   * /facts/latest?entity=component:default/mycomponent&ids[]=factRetrieverId1&ids[]=factRetrieverId2
   */
  router.get('/facts/latest', async (req, res) => {
    const { entity } = req.query;
    const { namespace, kind, name } = parseEntityName(entity as EntityRef);
    const ids = req.query.ids as string[];
    return res.send(
      await techInsightsStore.getLatestFactsByIds(
        ids,
        stringifyEntityRef({ namespace, kind, name }),
      ),
    );
  });

  /**
   * /facts/latest?entity=component:default/mycomponent&startDateTime=2021-12-24T01:23:45&endDateTime=2021-12-31T23:59:59&ids[]=factRetrieverId1&ids[]=factRetrieverId2
   */
  router.get('/facts/range', async (req, res) => {
    const { entity } = req.query;
    const { namespace, kind, name } = parseEntityName(entity as EntityRef);

    const ids = req.query.ids as string[];
    const startDatetime = DateTime.fromISO(req.query.startDatetime as string);
    const endDatetime = DateTime.fromISO(req.query.endDatetime as string);
    if (!startDatetime.isValid || !endDatetime.isValid) {
      return res.status(422).send({
        message: 'Failed to parse datetime from request',
        field: !startDatetime.isValid ? 'startDateTime' : 'endDateTime',
        value: !startDatetime.isValid ? startDatetime : endDatetime,
      });
    }
    const entityTriplet = stringifyEntityRef({ namespace, kind, name });
    return res.send(
      await techInsightsStore.getFactsBetweenTimestampsByIds(
        ids,
        entityTriplet,
        startDatetime,
        endDatetime,
      ),
    );
  });
  return router;
}
