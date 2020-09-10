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
import { DocsBuilder } from './helpers';

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

  router.get('/docs/:kind/:namespace/:name/*', async (req, res) => {
    const baseUrl = config.getString('backend.baseUrl');
    const storageUrl = config.getString('techdocs.storageUrl');

    const { kind, namespace, name } = req.params;

    const entity = (await (
      await fetch(
        `${baseUrl}/catalog/entities/by-name/${kind}/${namespace}/${name}`,
      )
    ).json()) as Entity;

    const docsBuilder = new DocsBuilder({
      preparers,
      generators,
      publisher,
      dockerClient,
      logger,
      entity,
    });

    if (!(await docsBuilder.docsUpToDate())) {
      await docsBuilder.build();
    }

    return res.redirect(`${storageUrl}${req.path.replace('/docs', '')}`);
  });

  if (publisher instanceof LocalPublish) {
    router.use('/static/docs', express.static(staticDocsDir));
  }

  return router;
}
