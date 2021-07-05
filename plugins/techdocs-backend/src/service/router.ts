/*
 * Copyright 2020 The Backstage Authors
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
import { CatalogClient } from '@backstage/catalog-client';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import {
  GeneratorBuilder,
  getLocationForEntity,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import fetch from 'cross-fetch';
import express, { Response } from 'express';
import Router from 'express-promise-router';
import { Knex } from 'knex';
import { PassThrough } from 'stream';
import { Logger } from 'winston';
import { DocsBuilder, shouldCheckForUpdate } from '../DocsBuilder';

type RouterOptions = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  logger: Logger;
  discovery: PluginEndpointDiscovery;
  database?: Knex; // TODO: Make database required when we're implementing database stuff.
  config: Config;
};

export async function createRouter({
  preparers,
  generators,
  publisher,
  config,
  logger,
  discovery,
}: RouterOptions): Promise<express.Router> {
  const router = Router();
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  router.get('/metadata/techdocs/:namespace/:kind/:name', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entityName = { kind, namespace, name };

    try {
      const techdocsMetadata = await publisher.fetchTechDocsMetadata(
        entityName,
      );

      res.json(techdocsMetadata);
    } catch (err) {
      logger.info(
        `Unable to get metadata for '${stringifyEntityRef(
          entityName,
        )}' with error ${err}`,
      );
      throw new NotFoundError(
        `Unable to get metadata for '${stringifyEntityRef(entityName)}'`,
        err,
      );
    }
  });

  router.get('/metadata/entity/:namespace/:kind/:name', async (req, res) => {
    const catalogUrl = await discovery.getBaseUrl('catalog');

    const { kind, namespace, name } = req.params;
    const entityName = { kind, namespace, name };

    try {
      const token = getBearerToken(req.headers.authorization);
      // TODO: Consider using the catalog client here
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
        `Unable to get metadata for '${stringifyEntityRef(
          entityName,
        )}' with error ${err}`,
      );
      throw new NotFoundError(
        `Unable to get metadata for '${stringifyEntityRef(entityName)}'`,
        err,
      );
    }
  });

  // Check if docs are the latest version and trigger rebuilds if not
  // Responds with an event-stream that closes after the build finished
  // Responds with an immediate success if rebuild not needed
  // If a build is required, responds with a success when finished
  router.get('/sync/:namespace/:kind/:name', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const token = getBearerToken(req.headers.authorization);

    const entity = await catalogClient.getEntityByName(
      { kind, namespace, name },
      { token },
    );

    if (!entity?.metadata?.uid) {
      throw new NotFoundError('Entity metadata UID missing');
    }

    // open the event-stream
    const { log, error, finish } = createEventStream(res);

    // create an in-memory stream to forward logs to the event-stream
    const logStream = new PassThrough();
    logStream.on('data', async data => {
      log(data.toString().trim());
    });

    // check if the last update check was too recent
    if (!shouldCheckForUpdate(entity.metadata.uid)) {
      finish({ updated: false });
      return;
    }

    // techdocs-backend will only try to build documentation for an entity if techdocs.builder is set to 'local'
    // If set to 'external', it will assume that an external process (e.g. CI/CD pipeline
    // of the repository) is responsible for building and publishing documentation to the storage provider
    if (config.getString('techdocs.builder') !== 'local') {
      finish({ updated: false });
      return;
    }

    const docsBuilder = new DocsBuilder({
      preparers,
      generators,
      publisher,
      logger,
      entity,
      config,
      logStream,
    });

    let foundDocs = false;

    const updated = await docsBuilder.build();

    if (!updated) {
      finish({ updated: false });
      return;
    }

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
      error(
        new NotFoundError(
          'Sorry! It took too long for the generated docs to show up in storage. Check back later.',
        ),
      );
      return;
    }

    finish({ updated: true });
  });

  // Route middleware which serves files from the storage set in the publisher.
  router.use('/static/docs', publisher.docsRouter());

  return router;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/(?:Bearer)\s+(\S+)/i)?.[1];
}

/**
 * Create an event-stream response that emits the events 'log', 'error', and 'finish'.
 *
 * @param res the response to write the event-stream to
 * @returns A tuple of <log, error, finish> callbacks to emit messages. A call to 'error' or 'finish'
 *          will close the event-stream.
 */
function createEventStream(
  res: Response<any, any>,
): {
  log: (message: string) => void;
  error: (e: Error) => void;
  finish: (result: { updated: boolean }) => void;
} {
  // Mandatory headers and http status to keep connection open
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
  });

  // client closes connection
  res.socket?.on('close', () => {
    res.end();
  });

  // write the event to the stream
  const send = (type: 'error' | 'finish' | 'log', data: any) => {
    res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);

    // res.flush() is only available with the compression middleware
    if (res.flush) {
      res.flush();
    }
  };

  return {
    log: data => {
      send('log', data);
    },

    error: e => {
      send('error', e.message);
      res.end();
    },

    finish: result => {
      send('finish', result);
      res.end();
    },
  };
}
