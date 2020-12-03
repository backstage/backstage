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
import fetch from 'cross-fetch';
import { Config } from '@backstage/config';
import Docker from 'dockerode';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
  getLocationForEntity,
} from '@backstage/techdocs-common';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { getEntityNameFromUrlPath } from './helpers';
import { DocsBuilder } from '../DocsBuilder';

type RouterOptions = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  logger: Logger;
  discovery: PluginEndpointDiscovery;
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
  logger,
  discovery,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

  router.get('/metadata/techdocs/*', async (req, res) => {
    // path is `:namespace/:kind:/:name`
    const { '0': path } = req.params;
    const entityName = getEntityNameFromUrlPath(path);

    publisher
      .fetchTechDocsMetadata(entityName)
      .then(techdocsMetadataJson => {
        res.send(techdocsMetadataJson);
      })
      .catch(reason => {
        res.status(500).send(`Unable to get Metadata. Reason: ${reason}`);
      });
  });

  router.get('/metadata/entity/:namespace/:kind/:name', async (req, res) => {
    const catalogUrl = await discovery.getBaseUrl('catalog');

    const { kind, namespace, name } = req.params;

    try {
      const entity = (await (
        await fetch(
          `${catalogUrl}/entities/by-name/${kind}/${namespace}/${name}`,
        )
      ).json()) as Entity;

      const locationMetadata = getLocationForEntity(entity);
      res.send({ ...entity, locationMetadata });
    } catch (err) {
      logger.info(
        `Unable to get metadata for ${kind}/${namespace}/${name} with error ${err}`,
      );
      throw new Error(
        `Unable to get metadata for ${kind}/${namespace}/${name} with error ${err}`,
      );
    }
  });

  router.get('/docs/:namespace/:kind/:name/*', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const storageUrl = config.getString('techdocs.storageUrl');

    const catalogUrl = await discovery.getBaseUrl('catalog');
    const triple = [kind, namespace, name].map(encodeURIComponent).join('/');

    const catalogRes = await fetch(`${catalogUrl}/entities/by-name/${triple}`);
    if (!catalogRes.ok) {
      const catalogResText = await catalogRes.text();
      res.status(catalogRes.status);
      res.send(catalogResText);
      return;
    }

    const entity: Entity = await catalogRes.json();

    let publisherType = '';
    try {
      publisherType = config.getString('techdocs.publisher.type');
    } catch (err) {
      throw new Error(
        'Unable to get techdocs.publisher.type in your app config. Set it to either ' +
          "'local', 'google_gcs' or other support storage providers. Read more here " +
          'https://backstage.io/docs/features/techdocs/architecture',
      );
    }

    // techdocs-backend will only try to build documentation for an entity if techdocs.docsBuilder is set to 'local'
    // If set to 'ci', it will only try to fetch and assume that that CI/CD pipeline of the repository hosting the
    // entity's documentation is responsible for building and publishing documentation to the storage provider.
    const shouldBuildDocs =
      config.getString('techdocs.docsBuilder') === 'local';

    if (shouldBuildDocs) {
      const docsBuilder = new DocsBuilder({
        preparers,
        generators,
        publisher,
        dockerClient,
        logger,
        entity,
      });
      if (publisherType === 'local') {
        if (!(await docsBuilder.docsUpToDate())) {
          await docsBuilder.build();
        }
      } else if (publisherType === 'google_gcs') {
        if (!(await publisher.hasDocsBeenGenerated(entity))) {
          logger.info(
            'Did not find generated docs files for the entity. Building docs.',
          );
          await docsBuilder.build();
        } else {
          logger.info(
            'Found pre-generated docs for this entity. Serving them.',
          );
          // TODO: When to re-trigger build for cache invalidation?
        }
      }
    }

    res.redirect(`${storageUrl}${req.path.replace('/docs', '')}`);
  });

  // Route middleware which serves files from the storage set in the publisher.
  router.use('/static/docs', publisher.docsRouter());

  return router;
}
