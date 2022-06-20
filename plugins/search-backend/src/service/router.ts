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
import { z } from 'zod';
import { errorHandler } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import { JsonObject, JsonValue } from '@backstage/types';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import {
  PermissionAuthorizer,
  PermissionEvaluator,
  toPermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  DocumentTypeInfo,
  IndexableResultSet,
  SearchResultSet,
} from '@backstage/plugin-search-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { AuthorizedSearchEngine } from './AuthorizedSearchEngine';

const jsonObjectSchema: z.ZodSchema<JsonObject> = z.lazy(() => {
  const jsonValueSchema: z.ZodSchema<JsonValue> = z.lazy(() =>
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.null(),
      z.array(jsonValueSchema),
      jsonObjectSchema,
    ]),
  );

  return z.record(jsonValueSchema);
});

/**
 * @public
 */
export type RouterOptions = {
  engine: SearchEngine;
  types: Record<string, DocumentTypeInfo>;
  permissions: PermissionEvaluator | PermissionAuthorizer;
  config: Config;
  logger: Logger;
};

const allowedLocationProtocols = ['http:', 'https:'];

/**
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { engine: inputEngine, types, permissions, config, logger } = options;

  const requestSchema = z.object({
    term: z.string().default(''),
    filters: jsonObjectSchema.optional(),
    types: z
      .array(z.string().refine(type => Object.keys(types).includes(type)))
      .optional(),
    pageCursor: z.string().optional(),
  });

  let permissionEvaluator: PermissionEvaluator;
  if ('authorizeConditional' in permissions) {
    permissionEvaluator = permissions as PermissionEvaluator;
  } else {
    logger.warn(
      'PermissionAuthorizer is deprecated. Please use an instance of PermissionEvaluator instead of PermissionAuthorizer in PluginEnvironment#permissions',
    );
    permissionEvaluator = toPermissionEvaluator(permissions);
  }

  const engine = config.getOptionalBoolean('permission.enabled')
    ? new AuthorizedSearchEngine(
        inputEngine,
        types,
        permissionEvaluator,
        config,
      )
    : inputEngine;

  const filterResultSet = ({ results, ...resultSet }: SearchResultSet) => ({
    ...resultSet,
    results: results.filter(result => {
      const protocol = new URL(result.document.location, 'https://example.com')
        .protocol;
      const isAllowed = allowedLocationProtocols.includes(protocol);
      if (!isAllowed) {
        logger.info(
          `Rejected search result for "${result.document.title}" as location protocol "${protocol}" is unsafe`,
        );
      }
      return isAllowed;
    }),
  });

  const toSearchResults = (resultSet: IndexableResultSet): SearchResultSet => ({
    ...resultSet,
    results: resultSet.results.map(result => ({
      ...result,
      document: {
        ...result.document,
        authorization: undefined,
      },
    })),
  });

  const router = Router();
  router.get(
    '/query',
    async (req: express.Request, res: express.Response<SearchResultSet>) => {
      const parseResult = requestSchema.safeParse(req.query);

      if (!parseResult.success) {
        throw new InputError(`Invalid query string: ${parseResult.error}`);
      }

      const query = parseResult.data;

      logger.info(
        `Search request received: term="${
          query.term
        }", filters=${JSON.stringify(query.filters)}, types=${
          query.types ? query.types.join(',') : ''
        }, pageCursor=${query.pageCursor ?? ''}`,
      );

      const token = getBearerTokenFromAuthorizationHeader(
        req.header('authorization'),
      );

      try {
        const resultSet = await engine?.query(query, { token });

        res.send(filterResultSet(toSearchResults(resultSet)));
      } catch (err) {
        throw new Error(
          `There was a problem performing the search query. ${err}`,
        );
      }
    },
  );

  router.use(errorHandler());

  return router;
}
