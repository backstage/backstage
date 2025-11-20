/*
 * Copyright 2025 The Backstage Authors
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
import {
  LoggerService,
  HttpAuthService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { CatalogService } from '@backstage/plugin-catalog-node';
import express from 'express';
import Router from 'express-promise-router';
import { getExporter } from '../exporters';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { DEFAULT_COLUMNS, ExportFormat } from '../index.ts';

export interface RouterOptions {
  logger: LoggerService;
  catalogApi: CatalogService;
  httpAuth: HttpAuthService;
  config: RootConfigService;
}

export const createRouter = (options: RouterOptions): express.Router => {
  const { logger, catalogApi, httpAuth, config } = options;

  const router = Router();
  router.use(express.json());

  router.post('/export', async (request, response) => {
    const exportFormat = (request.query.exportFormat ??
      ExportFormat.CSV) as ExportFormat;
    const backendFilters = { ...request.query };
    delete backendFilters.exportFormat;
    logger.info(
      `Exporting catalog format=${exportFormat} filter=${JSON.stringify(
        backendFilters,
      )}`,
    );

    const credentials = await httpAuth.credentials(request);
    const { items: entities } = await catalogApi.getEntities(
      { filter: backendFilters as Record<string, string> },
      { credentials },
    );

    const exporter = getExporter(exportFormat);

    // later make this customizable via a query param
    const columns = DEFAULT_COLUMNS;

    const body = await exporter.serialize(entities, columns);

    response.attachment(exporter.filename);
    response.type(exporter.contentType);
    response.send(body);
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
};
