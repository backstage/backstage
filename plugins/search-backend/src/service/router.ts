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
import { Logger } from 'winston';
import { IdentityClient } from '@backstage/plugin-auth-backend';
import { PermissionClient } from '@backstage/plugin-permission-common';
import { SearchQuery, SearchResultSet } from '@backstage/search-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { PermissionFilteringEngine } from '../PermissionFilteringEngine';

export type RouterOptions = {
  engine: SearchEngine;
  permissions: PermissionClient;
  logger: Logger;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { engine: inputEngine, permissions, logger } = options;
  const router = Router();
  const engine = new PermissionFilteringEngine(inputEngine, permissions);

  router.get(
    '/query',
    async (
      req: express.Request<any, unknown, unknown, SearchQuery>,
      res: express.Response<SearchResultSet>,
    ) => {
      const { term, filters = {}, types, pageCursor } = req.query;
      logger.info(
        `Search request received: term="${term}", filters=${JSON.stringify(
          filters,
        )}, types=${types ? types.join(',') : ''}, pageCursor=${
          pageCursor ?? ''
        }`,
      );

      const token = IdentityClient.getBearerToken(req.header('authorization'));

      try {
        const results = await engine?.query(req.query, { token });
        res.send(results);
      } catch (err) {
        throw new Error(
          `There was a problem performing the search query. ${err}`,
        );
      }
    },
  );

  return router;
}
