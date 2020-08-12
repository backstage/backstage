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
import path from 'path';
import Docker from 'dockerode';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
  LocalPublish,
} from '../techdocs';
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

export async function createRouter({
  preparers,
  generators,
  publisher,
  config,
  dockerClient,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

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
      const preparer = preparers.get(entity);
      const generator = generators.get(entity);

      const { resultDir } = await generator.run({
        directory: await preparer.prepare(entity),
        dockerClient,
      });

      publisher.publish({
        entity,
        directory: resultDir,
      });
    });

    res.send('Successfully generated documentation');
  });

  if (publisher instanceof LocalPublish) {
    router.use(
      '/static/docs/',
      express.static(path.resolve(__dirname, `../../static/docs`)),
    );
  }

  return router;
}
