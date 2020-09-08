/*
 * Copyright 2020 Spotify AB
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
import Router from 'express-promise-router';
import express from 'express';
import Knex from 'knex';
import fetch from 'node-fetch';
import { Config } from '@backstage/config';
import Docker from 'dockerode';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
  LocalPublish,
} from '../techdocs';
import { resolvePackagePath } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';

type RouterOptions = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  logger: Logger;
  database?: Knex; // TODO: Make database required when we're implementing database stuff.
  config: Config;
  dockerClient: Docker;
};

const staticDocsDir = resolvePackagePath(
  '@backstage/plugin-techdocs-backend',
  'static/docs',
);

export async function createRouter({
  preparers,
  generators,
  publisher,
  config,
  dockerClient,
  logger,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

  const getEntityId = (entity: Entity) => {
    return `${entity.kind}:${entity.metadata.namespace ?? ''}:${
      entity.metadata.name
    }`;
  };

  const buildDocsForEntity = async (entity: Entity) => {
    const preparer = preparers.get(entity);
    const generator = generators.get(entity);

    logger.info(`[TechDocs] Running preparer on entity ${getEntityId(entity)}`);
    const preparedDir = await preparer.prepare(entity);

    logger.info(
      `[TechDocs] Running generator on entity ${getEntityId(entity)}`,
    );
    const { resultDir } = await generator.run({
      directory: preparedDir,
      dockerClient,
    });

    logger.info(
      `[TechDocs] Running publisher on entity ${getEntityId(entity)}`,
    );
    await publisher.publish({
      entity,
      directory: resultDir,
    });
  };

  router.get('/', async (_, res) => {
    res.status(200).send('Hello TechDocs Backend');
  });

  // TODO: This route should not exist in the future
  router.get('/buildall', async (_, res) => {
    const baseUrl = config.getString('backend.baseUrl');
    const entitiesResponse = (await (
      await fetch(`${baseUrl}/catalog/entities`)
    ).json()) as Entity[];

    const entitiesWithDocs = entitiesResponse.filter(
      entity => entity.metadata.annotations?.['backstage.io/techdocs-ref'],
    );

    entitiesWithDocs.forEach(async entity => {
      await buildDocsForEntity(entity);
    });

    res.send('Successfully generated documentation');
  });

  if (publisher instanceof LocalPublish) {
    router.use('/static/docs/', express.static(staticDocsDir));
    router.use(
      '/static/docs/:kind/:namespace/:name',
      async (req, res, next) => {
        const baseUrl = config.getString('backend.baseUrl');
        const { kind, namespace, name } = req.params;

        const entityResponse = await fetch(
          `${baseUrl}/catalog/entities/by-name/${kind}/${namespace}/${name}`,
        );
        if (!entityResponse.ok) next();
        const entity = (await entityResponse.json()) as Entity;

        await buildDocsForEntity(entity);

        res.redirect(req.originalUrl);
      },
    );
  }

  return router;
}
