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
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  GeneratorBuilder,
  getLocationForEntity,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import fetch from 'cross-fetch';
import Docker from 'dockerode';
import express from 'express';
import Router from 'express-promise-router';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { DocsBuilder } from '../DocsBuilder';
import { shouldCheckForUpdate } from '../DocsBuilder/BuildMetadataStorage';
import { getEntityNameFromUrlPath } from './helpers';

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

    try {
      const techdocsMetadata = await publisher.fetchTechDocsMetadata(
        entityName,
      );

      res.json(techdocsMetadata);
    } catch (err) {
      logger.error(
        `Unable to get metadata for ${entityName.namespace}/${entityName.name} with error ${err}`,
      );
      res
        .status(500)
        .send(
          `Unable to get metadata for $${entityName.namespace}/${entityName.name}, reason: ${err}`,
        );
    }
  });

  router.get('/metadata/entity/:namespace/:kind/:name', async (req, res) => {
    const catalogUrl = await discovery.getBaseUrl('catalog');

    const { kind, namespace, name } = req.params;

    try {
      const token = getBearerToken(req.headers.authorization);
      const entity = (await (
        await fetch(
          `${catalogUrl}/entities/by-name/${kind}/${namespace}/${name}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        )
      ).json()) as Entity;

      const locationMetadata = getLocationForEntity(entity);
      res.json({ ...entity, locationMetadata });
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
    const storageUrl =
      config.getOptionalString('techdocs.storageUrl') ??
      `${await discovery.getExternalBaseUrl('techdocs')}/static/docs`;

    const catalogUrl = await discovery.getBaseUrl('catalog');
    const triple = [kind, namespace, name].map(encodeURIComponent).join('/');

    const token = getBearerToken(req.headers.authorization);
    const catalogRes = await fetch(`${catalogUrl}/entities/by-name/${triple}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
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
          "'local', 'googleGcs' or other support storage providers. Read more here " +
          'https://backstage.io/docs/features/techdocs/architecture',
      );
    }

    // techdocs-backend will only try to build documentation for an entity if techdocs.builder is set to 'local'
    // If set to 'external', it will only try to fetch and assume that an external process (e.g. CI/CD pipeline
    // of the repository) is responsible for building and publishing documentation to the storage provider.
    if (
      config.getString('techdocs.builder') === 'local' &&
      entity.metadata.uid &&
      shouldCheckForUpdate(entity.metadata.uid)
    ) {
      const docsBuilder = new DocsBuilder({
        preparers,
        generators,
        publisher,
        dockerClient,
        logger,
        entity,
      });
      let foundDocs = false;
      switch (publisherType) {
        case 'local':
        case 'awsS3':
        case 'azureBlobStorage':
        case 'openStackSwift':
        case 'googleGcs':
          // This block should be valid for all storage implementations. So no need to duplicate in future,
          // add the publisher type in the list here.
          await docsBuilder.build();
          // With a maximum of ~5 seconds wait, check if the files got published and if docs will be fetched
          // on the user's page. If not, respond with a message asking them to check back later.
          // The delay here is to make sure GCS/AWS/etc. registers newly uploaded files which is usually <1 second
          for (let attempt = 0; attempt < 5; attempt++) {
            if (await publisher.hasDocsBeenGenerated(entity)) {
              foundDocs = true;
              break;
            }
            await new Promise(r => setTimeout(r, 1000));
          }
          if (!foundDocs) {
            logger.error(
              'Published files are taking longer to show up in storage. Something went wrong.',
            );
            res.status(408).json({
              error:
                'Sorry! It is taking longer for the generated docs to show up in storage. Check back later.',
            });
            return;
          }
          break;
        default:
      }
    }

    res.redirect(`${storageUrl}${req.path.replace('/docs', '')}`);
  });

  // Route middleware which serves files from the storage set in the publisher.
  router.use('/static/docs', publisher.docsRouter());

  return router;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/(?:Bearer)\s+(\S+)/i)?.[1];
}
