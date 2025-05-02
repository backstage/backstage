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
import { z } from 'zod';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import { JsonObject, JsonValue } from '@backstage/types';
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
import { createOpenApiRouter } from '../schema/openapi';
import {
  AuthService,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';

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
 * @internal
 */
export type RouterOptions = {
  engine: SearchEngine;
  types: Record<string, DocumentTypeInfo>;
  discovery?: DiscoveryService;
  permissions: PermissionEvaluator | PermissionAuthorizer;
  config: Config;
  logger: LoggerService;
  auth: AuthService;
  httpAuth: HttpAuthService;
};

const defaultMaxPageLimit = 100;
const defaultMaxTermLength = 100;
const allowedLocationProtocols = ['http:', 'https:'];

/**
 * @internal
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = await createOpenApiRouter();
  const {
    engine: inputEngine,
    types,
    permissions,
    config,
    logger,
    auth,
    httpAuth,
  } = options;

  const maxPageLimit =
    config.getOptionalNumber('search.maxPageLimit') ?? defaultMaxPageLimit;

  const maxTermLength =
    config.getOptionalNumber('search.maxTermLength') ?? defaultMaxTermLength;

  const requestSchema = z.object({
    term: z
      .string()
      .refine(
        term => term.length <= maxTermLength,
        term => ({
          message: `The term length "${term.length}" is greater than "${maxTermLength}"`,
        }),
      )
      .default(''),
    filters: jsonObjectSchema.optional(),
    types: z
      .array(z.string().refine(type => Object.keys(types).includes(type)))
      .optional(),
    pageCursor: z.string().optional(),
    pageLimit: z
      .number()
      .refine(
        pageLimit => pageLimit <= maxPageLimit,
        pageLimit => ({
          message: `The page limit "${pageLimit}" is greater than "${maxPageLimit}"`,
        }),
      )
      .optional(),
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
        auth,
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

  router.get('/query', async (req, res) => {
    const parseResult = requestSchema.passthrough().safeParse(req.query);

    if (!parseResult.success) {
      throw new InputError(`Invalid query string: ${parseResult.error}`);
    }

    const query = parseResult.data;

    logger.info(
      `Search request received: term="${query.term}", filters=${JSON.stringify(
        query.filters,
      )}, types=${query.types ? query.types.join(',') : ''}, pageCursor=${
        query.pageCursor ?? ''
      }`,
    );

    try {
      const credentials = await httpAuth.credentials(req);
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'search',
      });
      const resultSet = await engine?.query(query, {
        token,
        credentials,
      });

      res.json(filterResultSet(toSearchResults(resultSet)));
    } catch (error) {
      if (error.name === 'MissingIndexError') {
        // re-throw and let the default error handler middleware captures it and serializes it with the right response code on the standard form
        throw error;
      }

      throw new Error(
        `There was a problem performing the search query: ${error.message}`,
      );
    }
  });

  return router;
}
