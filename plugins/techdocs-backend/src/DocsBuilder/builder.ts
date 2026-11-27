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
import {
  DEFAULT_NAMESPACE,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { isError, toError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  GeneratorBase,
  GeneratorBuilder,
  getLocationForEntity,
  PreparerBase,
  PreparerBuilder,
  preserveTechDocsSources,
  PublisherBase,
} from '@backstage/plugin-techdocs-node';
import { createHash } from 'node:crypto';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { Writable } from 'node:stream';
import { Logger } from 'winston';
import { BuildMetadataStorage } from './BuildMetadataStorage';
import { TechDocsCache } from '../cache';

const SOURCE_STORAGE_ANNOTATION = 'backstage.io/techdocs-source-storage';

type DocsBuilderArguments = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  entity: Entity;
  logger: Logger;
  config: Config;
  scmIntegrations: ScmIntegrationRegistry;
  logStream?: Writable;
  cache?: TechDocsCache;
};

export class DocsBuilder {
  private preparer: PreparerBase;
  private generator: GeneratorBase;
  private publisher: PublisherBase;
  private entity: Entity;
  private logger: Logger;
  private config: Config;
  private scmIntegrations: ScmIntegrationRegistry;
  private logStream: Writable | undefined;
  private cache?: TechDocsCache;

  constructor({
    preparers,
    generators,
    publisher,
    entity,
    logger,
    config,
    scmIntegrations,
    logStream,
    cache,
  }: DocsBuilderArguments) {
    this.preparer = preparers.get(entity);
    this.generator = generators.get(entity);
    this.publisher = publisher;
    this.entity = entity;
    this.logger = logger;
    this.config = config;
    this.scmIntegrations = scmIntegrations;
    this.logStream = logStream;
    this.cache = cache;
  }

  /**
   * Resolves whether sources should be stored for this entity. The global
   * mode has the final say: entities can only opt in when the mode is
   * `allowed`, and only opt out when it is `enabled`.
   */
  private resolveSourceStorage(): {
    enabled: boolean;
    excludes?: string[];
    additionalFiles?: string[];
    fingerprint?: string;
  } {
    const mode =
      this.config.getOptionalString(
        'techdocs.generator.preserveSources.mode',
      ) ?? 'disabled';
    if (!['disabled', 'allowed', 'enabled'].includes(mode)) {
      throw new Error(
        `Invalid techdocs.generator.preserveSources.mode '${mode}', expected 'disabled', 'allowed' or 'enabled'`,
      );
    }
    const annotation =
      this.entity.metadata.annotations?.[SOURCE_STORAGE_ANNOTATION];
    if (annotation && annotation !== 'enabled' && annotation !== 'disabled') {
      this.logger.warn(
        `Ignoring unrecognized ${SOURCE_STORAGE_ANNOTATION} annotation value '${annotation}', expected 'enabled' or 'disabled'`,
      );
    }

    let enabled = false;
    if (mode === 'enabled') {
      enabled = annotation !== 'disabled';
    } else if (mode === 'allowed') {
      enabled = annotation === 'enabled';
    } else if (annotation === 'enabled') {
      this.logger.debug(
        `Ignoring ${SOURCE_STORAGE_ANNOTATION} annotation because techdocs.generator.preserveSources.mode is 'disabled'`,
      );
    }
    if (!enabled) {
      return { enabled };
    }

    const excludes = this.config.getOptionalStringArray(
      'techdocs.generator.preserveSources.excludes',
    );
    const additionalFiles = this.config.getOptionalStringArray(
      'techdocs.generator.preserveSources.additionalFiles',
    );
    const fingerprint = createHash('sha256')
      .update(JSON.stringify({ excludes, additionalFiles }))
      .digest('hex')
      .slice(0, 16);
    return { enabled, excludes, additionalFiles, fingerprint };
  }

  /**
   * Build the docs and return whether they have been newly generated or have been cached
   * @returns true, if the docs have been built. false, if the cached docs are still up-to-date.
   */
  public async build(): Promise<boolean> {
    if (!this.entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in software catalog',
      );
    }

    /**
     * Prepare (and cache check)
     */

    this.logger.info(
      `Step 1 of 3: Preparing docs for entity ${stringifyEntityRef(
        this.entity,
      )}`,
    );

    // If available, use the etag stored in techdocs_metadata.json to
    // check if docs are outdated and need to be regenerated.
    const sourceStorage = this.resolveSourceStorage();
    let storedEtag: string | undefined;
    if (await this.publisher.hasDocsBeenGenerated(this.entity)) {
      try {
        const metadata = await this.publisher.fetchTechDocsMetadata({
          namespace: this.entity.metadata.namespace ?? DEFAULT_NAMESPACE,
          kind: this.entity.kind,
          name: this.entity.metadata.name,
        });
        storedEtag = metadata.etag;
        // The stored site is only up to date if it was built with the same
        // source storage settings. Otherwise, skip the etag check so that
        // sources get added or removed even when the docs are unchanged.
        const storedFingerprint = (metadata as { source_storage?: string })
          .source_storage;
        if (storedFingerprint !== sourceStorage.fingerprint) {
          this.logger.info(
            'Source storage settings changed since the last build, rebuilding docs',
          );
          storedEtag = undefined;
        }
      } catch (err) {
        // Proceed with a fresh build
        this.logger.warn(
          `Unable to read techdocs_metadata.json, proceeding with fresh build, error ${err}.`,
        );
      }
    }

    let preparedDir: string | undefined;
    let outputDir: string | undefined;

    try {
      let newEtag: string;
      try {
        const preparerResponse = await this.preparer.prepare(this.entity, {
          etag: storedEtag,
          logger: this.logger,
        });

        preparedDir = preparerResponse.preparedDir;
        newEtag = preparerResponse.etag;
      } catch (err) {
        if (isError(err) && err.name === 'NotModifiedError') {
          // No need to prepare anymore since cache is valid.
          // Set last check happened to now
          new BuildMetadataStorage(this.entity.metadata.uid).setLastUpdated();
          this.logger.debug(
            `Docs for ${stringifyEntityRef(
              this.entity,
            )} are unmodified. Using cache, skipping generate and prepare`,
          );
          return false;
        }
        throw err;
      }

      this.logger.info(
        `Prepare step completed for entity ${stringifyEntityRef(
          this.entity,
        )}, stored at ${preparedDir}`,
      );

      /**
       * Generate
       */

      this.logger.info(
        `Step 2 of 3: Generating docs for entity ${stringifyEntityRef(
          this.entity,
        )}`,
      );

      const workingDir = this.config.getOptionalString(
        'backend.workingDirectory',
      );
      const tmpdirPath = workingDir || os.tmpdir();
      // Fixes a problem with macOS returning a path that is a symlink
      const tmpdirResolvedPath = fs.realpathSync(tmpdirPath);
      outputDir = await fs.mkdtemp(
        path.join(tmpdirResolvedPath, 'techdocs-tmp-'),
      );

      const parsedLocationAnnotation = getLocationForEntity(
        this.entity,
        this.scmIntegrations,
      );
      await this.generator.run({
        inputDir: preparedDir,
        outputDir,
        parsedLocationAnnotation,
        etag: newEtag,
        logger: this.logger,
        logStream: this.logStream,
        siteOptions: {
          name: this.entity.metadata.title ?? this.entity.metadata.name,
        },
      });

      if (sourceStorage.enabled) {
        await preserveTechDocsSources({
          inputDir: preparedDir,
          outputDir,
          logger: this.logger,
          excludes: sourceStorage.excludes,
          additionalFiles: sourceStorage.additionalFiles,
          etag: newEtag,
        });
        const metadataPath = path.join(outputDir, 'techdocs_metadata.json');
        const metadata = await fs.readJson(metadataPath);
        metadata.source_storage = sourceStorage.fingerprint;
        await fs.writeJson(metadataPath, metadata);
      }

      /**
       * Publish
       */

      this.logger.info(
        `Step 3 of 3: Publishing docs for entity ${stringifyEntityRef(
          this.entity,
        )}`,
      );

      const published = await this.publisher.publish({
        entity: this.entity,
        directory: outputDir,
      });

      // Invalidate the cache for any published objects.
      if (this.cache && published && published?.objects?.length) {
        this.logger.debug(
          `Invalidating ${published.objects.length} cache objects`,
        );
        await this.cache.invalidateMultiple(published.objects);
      }
    } finally {
      // Remove Prepared directory since it is no longer needed.
      // Caveat: Can not remove prepared directory in case of git preparer since the
      // local git repository is used to get etag on subsequent requests.
      if (preparedDir && this.preparer.shouldCleanPreparedDirectory()) {
        this.logger.debug(`Removing prepared directory ${preparedDir}`);
        try {
          // Not a blocker hence no need to await this.
          fs.remove(preparedDir);
        } catch (error) {
          this.logger.debug(
            `Error removing prepared directory ${toError(error).message}`,
          );
        }
      }

      if (outputDir) {
        this.logger.debug(`Removing generated directory ${outputDir}`);
        try {
          // Not a blocker hence no need to await this.
          fs.remove(outputDir);
        } catch (error) {
          this.logger.debug(
            `Error removing generated directory ${toError(error).message}`,
          );
        }
      }
    }

    // Update the last check time for the entity
    new BuildMetadataStorage(this.entity.metadata.uid).setLastUpdated();

    return true;
  }
}
