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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { assertError, NotFoundError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/plugin-techdocs-node';
import fetch from 'node-fetch';
import pLimit, { Limit } from 'p-limit';
import { PassThrough } from 'stream';
import * as winston from 'winston';
import { TechDocsCache } from '../cache';
import {
  BuildMetadataStorage,
  DocsBuilder,
  shouldCheckForUpdate,
} from '../DocsBuilder';

export type DocsSynchronizerSyncOpts = {
  log: (message: string) => void;
  error: (e: Error) => void;
  finish: (result: { updated: boolean }) => void;
};

export class DocsSynchronizer {
  private readonly publisher: PublisherBase;
  private readonly logger: winston.Logger;
  private readonly buildLogTransport: winston.transport;
  private readonly config: Config;
  private readonly scmIntegrations: ScmIntegrationRegistry;
  private readonly cache: TechDocsCache | undefined;
  private readonly buildLimiter: Limit;

  constructor({
    publisher,
    logger,
    buildLogTransport,
    config,
    scmIntegrations,
    cache,
  }: {
    publisher: PublisherBase;
    logger: winston.Logger;
    buildLogTransport: winston.transport;
    config: Config;
    scmIntegrations: ScmIntegrationRegistry;
    cache: TechDocsCache | undefined;
  }) {
    this.config = config;
    this.logger = logger;
    this.buildLogTransport = buildLogTransport;
    this.publisher = publisher;
    this.scmIntegrations = scmIntegrations;
    this.cache = cache;

    // Single host/process: limit concurrent builds up to 10 at a time.
    this.buildLimiter = pLimit(10);
  }

  async doSync({
    responseHandler: { log, error, finish },
    entity,
    preparers,
    generators,
  }: {
    responseHandler: DocsSynchronizerSyncOpts;
    entity: Entity;
    preparers: PreparerBuilder;
    generators: GeneratorBuilder;
  }) {
    // create a new logger to log data to the caller
    const taskLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
      defaultMeta: {},
    });

    // create an in-memory stream to forward logs to the event-stream
    const logStream = new PassThrough();
    logStream.on('data', async data => {
      log(data.toString().trim());
    });

    taskLogger.add(new winston.transports.Stream({ stream: logStream }));
    taskLogger.add(this.buildLogTransport);

    // check if the last update check was too recent
    if (!shouldCheckForUpdate(entity.metadata.uid!)) {
      finish({ updated: false });
      return;
    }

    let foundDocs = false;

    try {
      const docsBuilder = new DocsBuilder({
        preparers,
        generators,
        publisher: this.publisher,
        logger: taskLogger,
        entity,
        config: this.config,
        scmIntegrations: this.scmIntegrations,
        logStream,
        cache: this.cache,
      });

      const updated = await this.buildLimiter(() => docsBuilder.build());

      if (!updated) {
        finish({ updated: false });
        return;
      }
    } catch (e) {
      assertError(e);
      const msg = `Failed to build the docs page: ${e.message}`;
      taskLogger.error(msg);
      this.logger.error(msg, e);
      error(e);
      return;
    }

    // With a maximum of ~5 seconds wait, check if the files got published and if docs will be fetched
    // on the user's page. If not, respond with a message asking them to check back later.
    // The delay here is to make sure GCS/AWS/etc. registers newly uploaded files which is usually <1 second
    for (let attempt = 0; attempt < 5; attempt++) {
      if (await this.publisher.hasDocsBeenGenerated(entity)) {
        foundDocs = true;
        break;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    if (!foundDocs) {
      this.logger.error(
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
  }

  async doCacheSync({
    responseHandler: { finish },
    discovery,
    token,
    entity,
  }: {
    responseHandler: DocsSynchronizerSyncOpts;
    discovery: PluginEndpointDiscovery;
    token: string | undefined;
    entity: Entity;
  }) {
    // Check if the last update check was too recent.
    if (!shouldCheckForUpdate(entity.metadata.uid!) || !this.cache) {
      finish({ updated: false });
      return;
    }

    // Fetch techdocs_metadata.json from the publisher and from cache.
    const baseUrl = await discovery.getBaseUrl('techdocs');
    const namespace = entity.metadata?.namespace || DEFAULT_NAMESPACE;
    const kind = entity.kind;
    const name = entity.metadata.name;
    const legacyPathCasing =
      this.config.getOptionalBoolean(
        'techdocs.legacyUseCaseSensitiveTripletPaths',
      ) || false;
    const tripletPath = `${namespace}/${kind}/${name}`;
    const entityTripletPath = `${
      legacyPathCasing ? tripletPath : tripletPath.toLocaleLowerCase('en-US')
    }`;
    try {
      const [sourceMetadata, cachedMetadata] = await Promise.all([
        this.publisher.fetchTechDocsMetadata({ namespace, kind, name }),
        fetch(
          `${baseUrl}/static/docs/${entityTripletPath}/techdocs_metadata.json`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        ).then(
          f =>
            f.json().catch(() => undefined) as ReturnType<
              PublisherBase['fetchTechDocsMetadata']
            >,
        ),
      ]);

      // If build timestamps differ, merge their files[] lists and invalidate all objects.
      if (sourceMetadata.build_timestamp !== cachedMetadata.build_timestamp) {
        const files = [
          ...new Set([
            ...(sourceMetadata.files || []),
            ...(cachedMetadata.files || []),
          ]),
        ].map(f => `${entityTripletPath}/${f}`);
        await this.cache.invalidateMultiple(files);
        finish({ updated: true });
      } else {
        finish({ updated: false });
      }
    } catch (e) {
      assertError(e);
      // In case of error, log and allow the user to go about their business.
      this.logger.error(
        `Error syncing cache for ${entityTripletPath}: ${e.message}`,
      );
      finish({ updated: false });
    } finally {
      // Update the last check time for the entity
      new BuildMetadataStorage(entity.metadata.uid!).setLastUpdated();
    }
  }
}
