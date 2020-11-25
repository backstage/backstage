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
import fs from 'fs-extra';
import { Logger } from 'winston';
import { Entity } from '@backstage/catalog-model';
import {
  resolvePackagePath,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';

export type LocalPublishParams = {
  entity: Entity;
  directory: string;
};

export type LocalPublishReturn =
  | Promise<{ remoteUrl: string }>
  | { remoteUrl: string };

/**
 * Type for the local publisher which uses local filesystem to store the generated static files.
 *
 * It uses a directory called "static" at the root of techdocs-backend plugin.
 */
export interface LocalPublisher {
  /**
   * Store the generated files inside a static folder in local filesystem.
   *
   * @param {LocalPublishParams} opts Object containing the entity from the service
   * catalog, and the directory that contains the generated static files from TechDocs.
   * @returns {LocalPublishReturn} Either a promise or an object with `remoteUrl` which is the URL
   * which serves files from the local publisher's static directory.
   */
  publish(opts: LocalPublishParams): LocalPublishReturn;
}

export class LocalPublish {
  private readonly logger: Logger;
  private readonly discovery: PluginEndpointDiscovery;

  constructor(logger: Logger, discovery: PluginEndpointDiscovery) {
    this.logger = logger;
    this.discovery = discovery;
  }

  publish({ entity, directory }: LocalPublishParams): LocalPublishReturn {
    const entityNamespace = entity.metadata.namespace ?? 'default';

    const publishDir = resolvePackagePath(
      '@backstage/plugin-techdocs-backend',
      'static/docs',
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
}
