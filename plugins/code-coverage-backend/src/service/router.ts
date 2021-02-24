/*
 * Copyright 2021 Spotify AB
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
import xmlparser from 'express-xml-bodyparser';
import { CatalogClient } from '@backstage/catalog-client';
import {
  errorHandler,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  UrlReader,
} from '@backstage/backend-common';
import { InputError, NotFoundError } from '@backstage/errors';
import { Config } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { CodeCoverageDatabase } from './CodeCoverageDatabase';
import { aggregateCoverage, CoverageUtils } from './CoverageUtils';
import { Cobertura } from './converter/cobertura';
import { Jacoco } from './converter/jacoco';
import { Converter } from './converter';

export interface RouterOptions {
  config: Config;
  discovery: PluginEndpointDiscovery;
  database: PluginDatabaseManager;
  urlReader: UrlReader;
  logger: Logger;
}

export interface CodeCoverageApi {
  name: string;
}

export const makeRouter = async (
  options: RouterOptions,
): Promise<express.Router> => {
  const { config, logger, discovery, database, urlReader } = options;

  const codeCoverageDatabase = await CodeCoverageDatabase.create(
    await database.getClient(),
    logger,
  );
  const codecovUrl = await discovery.getExternalBaseUrl('code-coverage');
  const catalogApi = new CatalogClient({ discoveryApi: discovery });
  const scm = ScmIntegrations.fromConfig(config);

  const router = Router();
  router.use(xmlparser());
  router.use(express.json());

  const utils = new CoverageUtils(scm, urlReader);

  router.get('/health', async (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/:kind/:namespace/:name', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }
    const stored = await codeCoverageDatabase.getCodeCoverage({
      kind,
      namespace,
      name,
    });

    const aggregate = aggregateCoverage(stored);

    res.status(200).json({
      ...stored,
      aggregate: {
        line: aggregate.line,
        branch: aggregate.branch,
      },
    });
  });

  router.get('/:kind/:namespace/:name/history', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }
    const { limit } = req.query;
    const history = await codeCoverageDatabase.getHistory(
      {
        kind,
        namespace,
        name,
      },
      parseInt(limit?.toString() || '10', 10),
    );

    res.status(200).json(history);
  });

  router.get('/:kind/:namespace/:name/file-content', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }
    const { path } = req.query;
    if (!path) {
      throw new InputError('Need path query parameter');
    }

    const sourceLocation =
      entity.metadata.annotations?.['backstage.io/source-location'];
    if (!sourceLocation) {
      throw new InputError(
        `No "backstage.io/source-location" annotation on entity ${entity.kind}/${entity.metadata.namespace}/${entity.metadata.name}`,
      );
    }

    const vcs = scm.byUrl(sourceLocation);
    if (!vcs) {
      throw new InputError(`Unable to determine SCM from ${sourceLocation}`);
    }

    const scmTree = await urlReader.readTree(sourceLocation);
    const scmFile = (await scmTree.files()).find(f => f.path === path);
    if (!scmFile) {
      res.status(400).json({
        message: "couldn't find file in SCM",
        file: path,
        scm: vcs.title,
      });
      return;
    }
    const content = await scmFile?.content();
    if (!content) {
      res.status(400).json({
        message: "couldn't process content of file in SCM",
        file: path,
        scm: vcs.title,
      });
      return;
    }

    const data = content.toString();
    res.status(200).contentType('text/plain').send(data);
  });

  router.post('/:kind/:namespace/:name/', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const { coverageType } = req.query;
    let converter: Converter;
    if (!coverageType) {
      throw new InputError('Need coverageType query parameter');
    } else if (coverageType === 'jacoco') {
      converter = new Jacoco(logger);
    } else if (coverageType === 'cobertura') {
      converter = new Cobertura(logger);
    } else {
      throw new NotFoundError(`unsupported coverage type '${coverageType}`);
    }
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }
    const {
      sourceLocation,
      vcs,
      scmFiles,
      body,
    } = await utils.processCoveragePayload(entity, req);

    const files = converter.convert(body, scmFiles);
    if (!files || files.length === 0) {
      throw new InputError(`Unable to parse body as ${coverageType}`);
    }

    const coverage = await utils.buildCoverage(
      entity,
      sourceLocation,
      vcs,
      files,
    );
    await codeCoverageDatabase.insertCodeCoverage(coverage);

    res.status(201).json({
      links: [
        {
          rel: 'coverage',
          href: `${codecovUrl}/${kind}/${namespace}/${name}`,
        },
      ],
    });
  });

  router.use(errorHandler());
  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Code Coverage backend');

  return makeRouter(options);
}
