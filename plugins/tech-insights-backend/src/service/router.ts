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
  PersistenceContext,
  TechInsightCheck,
} from '@backstage/plugin-tech-insights-node';

import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Logger } from 'winston';
import { DateTime } from 'luxon';
import {
  CompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { errorHandler } from '@backstage/backend-common';
import { serializeError } from '@backstage/errors';

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
      return res.json(await factChecker.getChecks());
    });

    router.post('/checks/run/:namespace/:kind/:name', async (req, res) => {
      const { namespace, kind, name } = req.params;
      const { checks }: { checks: string[] } = req.body;
      const entityTriplet = stringifyEntityRef({ namespace, kind, name });
      const checkResult = await factChecker.runChecks(entityTriplet, checks);
      return res.json(checkResult);
    });

    router.post('/checks/run', async (req, res) => {
      const {
        checks,
        entities,
      }: { checks: string[]; entities: CompoundEntityRef[] } = req.body;
      const tasks = entities.map(async entity => {
        const entityTriplet =
          typeof entity === 'string' ? entity : stringifyEntityRef(entity);
        try {
          const results = await factChecker.runChecks(entityTriplet, checks);
          return {
            entity: entityTriplet,
            results,
          };
        } catch (e: any) {
          const error = serializeError(e);
          logger.error(`${error.name}: ${error.message}`);
          return {
            entity: entityTriplet,
            error: error,
            results: [],
          };
        }
      });
      const results = await Promise.all(tasks);
      return res.json(results);
    });
  } else {
    logger.info(
      'Starting tech insights module without fact checking endpoints.',
    );
  }

  router.get('/fact-schemas', async (req, res) => {
    const ids = req.query.ids as string[];
    return res.json(await techInsightsStore.getLatestSchemas(ids));
  });

  /**
   * /facts/latest?entity=component:default/mycomponent&ids[]=factRetrieverId1&ids[]=factRetrieverId2
   */
  router.get('/facts/latest', async (req, res) => {
    const { entity } = req.query;
    const { namespace, kind, name } = parseEntityRef(entity as string);

    if (!req.query.ids) {
      return res
        .status(422)
        .json({ error: 'Failed to parse ids from request' });
    }
    const ids = [req.query.ids].flat() as string[];
    return res.json(
      await techInsightsStore.getLatestFactsByIds(
        ids,
        stringifyEntityRef({ namespace, kind, name }),
      ),
    );
  });

  /**
   * /facts/range?entity=component:default/mycomponent&startDateTime=2021-12-24T01:23:45&endDateTime=2021-12-31T23:59:59&ids[]=factRetrieverId1&ids[]=factRetrieverId2
   */
  router.get('/facts/range', async (req, res) => {
    const { entity } = req.query;
    const { namespace, kind, name } = parseEntityRef(entity as string);

    if (!req.query.ids) {
      return res
        .status(422)
        .json({ error: 'Failed to parse ids from request' });
    }
    const ids = [req.query.ids].flat() as string[];
    const startDatetime = DateTime.fromISO(req.query.startDatetime as string);
    const endDatetime = DateTime.fromISO(req.query.endDatetime as string);
    if (!startDatetime.isValid || !endDatetime.isValid) {
      return res.status(422).json({
        message: 'Failed to parse datetime from request',
        field: !startDatetime.isValid ? 'startDateTime' : 'endDateTime',
        value: !startDatetime.isValid ? startDatetime : endDatetime,
      });
    }
    const entityTriplet = stringifyEntityRef({ namespace, kind, name });
    return res.json(
      await techInsightsStore.getFactsBetweenTimestampsByIds(
        ids,
        entityTriplet,
        startDatetime,
        endDatetime,
      ),
    );
  });

  router.use(errorHandler());
  return router;
}
