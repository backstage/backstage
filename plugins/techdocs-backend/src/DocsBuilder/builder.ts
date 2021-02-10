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
import { NotModifiedError } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  GeneratorBase,
  GeneratorBuilder,
  getLocationForEntity,
  PreparerBase,
  PreparerBuilder,
  PublisherBase,
  UrlPreparer,
} from '@backstage/techdocs-common';
import Docker from 'dockerode';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { Logger } from 'winston';
import { BuildMetadataStorage } from '.';

const getEntityId = (entity: Entity) => {
  return `${entity.kind}:${entity.metadata.namespace ?? ''}:${
    entity.metadata.name
  }`;
};

type DocsBuilderArguments = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  entity: Entity;
  logger: Logger;
  dockerClient: Docker;
};

export class DocsBuilder {
  private preparer: PreparerBase;
  private generator: GeneratorBase;
  private publisher: PublisherBase;
  private entity: Entity;
  private logger: Logger;
  private dockerClient: Docker;

  constructor({
    preparers,
    generators,
    publisher,
    entity,
    logger,
    dockerClient,
  }: DocsBuilderArguments) {
    this.preparer = preparers.get(entity);
    this.generator = generators.get(entity);
    this.publisher = publisher;
    this.entity = entity;
    this.logger = logger;
    this.dockerClient = dockerClient;
  }

  public async build(): Promise<void> {
    if (!this.entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in service catalog',
      );
    }

    /**
     * Prepare and cache check
     */

    // Use the in-memory storage for setting and getting etag for this entity.
    const buildMetadataStorage = new BuildMetadataStorage(
      this.entity.metadata.uid,
    );

    // TODO: As of now, this happens on each and every request to TechDocs.
    // In a high traffic environment, this will cause a lot of requests to the source code provider.
    // After Async build is implemented https://github.com/backstage/backstage/issues/3717,
    // make sure to limit checking for cache invalidation to once per minute or so.
    let preparedDir: string;
    let etag: string;
    try {
      const preparerResponse = await this.preparer.prepare(this.entity, {
        etag: buildMetadataStorage.getEtag(),
      });

      preparedDir = preparerResponse.preparedDir;
      etag = preparerResponse.etag;
    } catch (err) {
      if (err instanceof NotModifiedError) {
        // No need to prepare anymore since cache is valid.
        return;
      }
      throw new Error(err.message);
    }

    this.logger.info(
      `TechDocs prepare step completed for entity ${getEntityId(this.entity)}.`,
    );
    this.logger.debug(`Prepared files temporarily stored at ${preparedDir}`);

    /**
     * Generate
     */

    this.logger.info(`Running generator on entity ${getEntityId(this.entity)}`);
    // Create a temporary directory to store the generated files in.
    const tmpdirPath = os.tmpdir();
    // Fixes a problem with macOS returning a path that is a symlink
    const tmpdirResolvedPath = fs.realpathSync(tmpdirPath);
    const outputDir = await fs.mkdtemp(
      path.join(tmpdirResolvedPath, 'techdocs-tmp-'),
    );
    const parsedLocationAnnotation = getLocationForEntity(this.entity);
    await this.generator.run({
      inputDir: preparedDir,
      outputDir,
      dockerClient: this.dockerClient,
      parsedLocationAnnotation,
    });

    this.logger.debug(`Generated files temporarily stored at ${outputDir}`);
    // Remove Prepared directory since it is no longer needed.
    // Caveat: Can not remove prepared directory in case of git preparer since the
    // local git repository is used to get etag on subsequent requests.
    if (this.preparer instanceof UrlPreparer) {
      this.logger.debug(
        `Removing prepared directory ${preparedDir} since the site has been generated.`,
      );
      try {
        // Not a blocker hence no need to await this.
        fs.remove(preparedDir);
      } catch (error) {
        this.logger.debug(`Error removing prepared directory ${error.message}`);
      }
    }

    /**
     * Publish
     */

    this.logger.info(`Running publisher on entity ${getEntityId(this.entity)}`);
    await this.publisher.publish({
      entity: this.entity,
      directory: outputDir,
    });
    this.logger.debug(
      `Removing generated directory ${outputDir} since the site has been published`,
    );
    try {
      // Not a blocker hence no need to await this.
      fs.remove(outputDir);
    } catch (error) {
      this.logger.debug(`Error removing generated directory ${error.message}`);
    }

    // Store the latest build etag for the entity
    new BuildMetadataStorage(this.entity.metadata.uid).setEtag(etag);
  }
}
