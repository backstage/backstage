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
import fetch from 'cross-fetch';
import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Logger } from 'winston';
import { Entity, EntityName } from '@backstage/catalog-model';
import {
  resolvePackagePath,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { PublisherBase, PublishRequest, PublishResponse } from './types';

// TODO: Use a more persistent storage than node_modules or /tmp directory.
// Make it configurable with techdocs.publisher.local.publishDirectory
let staticDocsDir = '';
try {
  staticDocsDir = resolvePackagePath(
    '@backstage/plugin-techdocs-backend',
    'static/docs',
  );
} catch (err) {
  // This will most probably never be used.
  // The try/catch is introduced so that techdocs-cli can import @backstage/techdocs-common
  // on CI/CD without installing techdocs backend plugin.
  staticDocsDir = os.tmpdir();
}

/**
 * Local publisher which uses the local filesystem to store the generated static files. It uses a directory
 * called "static" at the root of techdocs-backend plugin.
 */
export class LocalPublish implements PublisherBase {
  private readonly config: Config;
  private readonly logger: Logger;
  private readonly discovery: PluginEndpointDiscovery;

  // TODO: Use a static fromConfig method to create a LocalPublish instance, similar to aws/gcs publishers.
  // Move the logic of setting staticDocsDir based on config over to fromConfig,
  // and set the value as a class parameter.
  constructor(
    config: Config,
    logger: Logger,
    discovery: PluginEndpointDiscovery,
  ) {
    this.config = config;
    this.logger = logger;
    this.discovery = discovery;
  }

  publish({ entity, directory }: PublishRequest): Promise<PublishResponse> {
    const entityNamespace = entity.metadata.namespace ?? 'default';

    const publishDir = path.join(
      staticDocsDir,
      entityNamespace,
      entity.kind,
      entity.metadata.name,
    );

    if (!fs.existsSync(publishDir)) {
      this.logger.info(`Could not find ${publishDir}, creating the directory.`);
      fs.mkdirSync(publishDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      fs.copy(directory, publishDir, err => {
        if (err) {
          this.logger.debug(
            `Failed to copy docs from ${directory} to ${publishDir}`,
          );
          reject(err);
        }

        this.discovery
          .getBaseUrl('techdocs')
          .then(techdocsApiUrl => {
            resolve({
              remoteUrl: `${techdocsApiUrl}/static/docs/${entity.metadata.name}`,
            });
          })
          .catch(reason => {
            reject(reason);
          });
      });
    });
  }

  fetchTechDocsMetadata(entityName: EntityName): Promise<string> {
    return new Promise((resolve, reject) => {
      this.discovery.getBaseUrl('techdocs').then(techdocsApiUrl => {
        const storageUrl = new URL(
          new URL(this.config.getString('techdocs.storageUrl')).pathname,
          techdocsApiUrl,
        ).toString();

        const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;
        const metadataURL = `${storageUrl}/${entityRootDir}/techdocs_metadata.json`;
        fetch(metadataURL)
          .then(response =>
            response
              .json()
              .then(techdocsMetadataJson => resolve(techdocsMetadataJson))
              .catch(err => {
                reject(
                  `Unable to parse metadata JSON for ${entityRootDir}. Error: ${err}`,
                );
              }),
          )
          .catch(err => {
            reject(
              `Unable to fetch metadata for ${entityRootDir}. Error ${err}`,
            );
          });
      });
    });
  }

  docsRouter(): express.Handler {
    return express.static(staticDocsDir);
  }

  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    const namespace = entity.metadata.namespace ?? 'default';
    return new Promise(resolve => {
      this.discovery.getBaseUrl('techdocs').then(techdocsApiUrl => {
        const storageUrl = new URL(
          new URL(this.config.getString('techdocs.storageUrl')).pathname,
          techdocsApiUrl,
        ).toString();

        const entityRootDir = `${namespace}/${entity.kind}/${entity.metadata.name}`;
        const indexHtmlUrl = `${storageUrl}/${entityRootDir}/index.html`;
        // Check if the file exists
        fs.access(indexHtmlUrl, fs.constants.F_OK, err => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }
}
