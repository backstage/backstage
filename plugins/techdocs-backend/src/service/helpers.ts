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
} from '../techdocs';
import { BuildMetadataStorage } from '../storage';
import { getLocationForEntity, getLastCommitTimestamp } from '../helpers';

const getEntityId = (entity: Entity) => {
  return `${entity.kind}:${entity.metadata.namespace ?? ''}:${
    entity.metadata.name
  }`;
};

type DocsBuilderArguments = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  logger: Logger;
  dockerClient: Docker;
};

export class DocsBuilder {
  private preparers: PreparerBuilder;
  private generators: GeneratorBuilder;
  private publisher: PublisherBase;
  private logger: Logger;
  private dockerClient: Docker;

  constructor({
    preparers,
    generators,
    publisher,
    logger,
    dockerClient,
  }: DocsBuilderArguments) {
    this.preparers = preparers;
    this.generators = generators;
    this.publisher = publisher;
    this.logger = logger;
    this.dockerClient = dockerClient;
  }

  public async build(entity: Entity) {
    const preparer = this.preparers.get(entity);
    const generator = this.generators.get(entity);

    this.logger.info(`Running preparer on entity ${getEntityId(entity)}`);
    const preparedDir = await preparer.prepare(entity);

    const parsedLocationAnnotation = getLocationForEntity(entity);

    this.logger.info(`Running generator on entity ${getEntityId(entity)}`);
    const { resultDir } = await generator.run({
      directory: preparedDir,
      dockerClient: this.dockerClient,
      parsedLocationAnnotation,
    });

    this.logger.info(`Running publisher on entity ${getEntityId(entity)}`);
    await this.publisher.publish({
      entity: entity,
      directory: resultDir,
    });

    if (!entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in service catalog',
      );
    }

    new BuildMetadataStorage(entity.metadata.uid).storeBuildTimestamp();
  }

  public async docsUpToDate(entity: Entity) {
    if (!entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in service catalog',
      );
    }

    const buildMetadataStorage = new BuildMetadataStorage(
      entity.metadata.uid,
    );
    const { type, target } = getLocationForEntity(entity);

    // Unless docs are stored locally
    const nonAgeCheckTypes = ['dir', 'file', 'url'];
    if (!nonAgeCheckTypes.includes(type)) {
      const lastCommit = await getLastCommitTimestamp(target, this.logger);
      const storageTimeStamp = buildMetadataStorage.getTimestamp();

      // Check if documentation source is newer than what we have
      if (storageTimeStamp && storageTimeStamp >= lastCommit) {
        this.logger.debug(
          `Docs for entity ${getEntityId(entity)} is up to date.`,
        );
        return true;
      }
    }

    // TODO: Better caching for URL.
    if (type === 'url') {
      const builtAt = buildMetadataStorage.getTimestamp();
      const now = Date.now();

      if (builtAt > now - 1800000) {
        return true;
      }
    }

    this.logger.debug(
      `Docs for entity ${getEntityId(entity)} was outdated.`,
    );
    return false;
  }
}
