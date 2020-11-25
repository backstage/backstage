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
import Docker from 'dockerode';
import { Logger } from 'winston';
import { Entity } from '@backstage/catalog-model';
import {
  PreparerBuilder,
  PublisherBase,
  GeneratorBuilder,
  PreparerBase,
  GeneratorBase,
  getLocationForEntity,
  getLastCommitTimestamp,
} from '@backstage/techdocs-common';
import { BuildMetadataStorage } from '../storage';

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

  public async build() {
    this.logger.info(`Running preparer on entity ${getEntityId(this.entity)}`);
    const preparedDir = await this.preparer.prepare(this.entity);

    const parsedLocationAnnotation = getLocationForEntity(this.entity);

    this.logger.info(`Running generator on entity ${getEntityId(this.entity)}`);
    const { resultDir } = await this.generator.run({
      directory: preparedDir,
      dockerClient: this.dockerClient,
      parsedLocationAnnotation,
    });

    this.logger.info(`Running publisher on entity ${getEntityId(this.entity)}`);
    await this.publisher.publish({
      entity: this.entity,
      directory: resultDir,
    });

    if (!this.entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in service catalog',
      );
    }

    new BuildMetadataStorage(this.entity.metadata.uid).storeBuildTimestamp();
  }

  public async docsUpToDate() {
    if (!this.entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in service catalog',
      );
    }

    const buildMetadataStorage = new BuildMetadataStorage(
      this.entity.metadata.uid,
    );
    const { type, target } = getLocationForEntity(this.entity);

    // Unless docs are stored locally
    const nonAgeCheckTypes = ['dir', 'file', 'url'];
    if (!nonAgeCheckTypes.includes(type)) {
      const lastCommit = await getLastCommitTimestamp(target, this.logger);
      const storageTimeStamp = buildMetadataStorage.getTimestamp();

      // Check if documentation source is newer than what we have
      if (storageTimeStamp && storageTimeStamp >= lastCommit) {
        this.logger.debug(
          `Docs for entity ${getEntityId(this.entity)} is up to date.`,
        );
        return true;
      }
    }

    this.logger.debug(
      `Docs for entity ${getEntityId(this.entity)} was outdated.`,
    );
    return false;
  }
}
