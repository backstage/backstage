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
  PluginEndpointDiscovery,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import fs from 'fs-extra';
import os from 'os';
import createLimiter from 'p-limit';
import path from 'path';
import { Logger } from 'winston';
import {
  PublisherBase,
  PublishRequest,
  PublishResponse,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';
import {
  getFileTreeRecursively,
  getHeadersForFileExtension,
  lowerCaseEntityTripletInStoragePath,
} from './helpers';
import { assertError } from '@backstage/errors';

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
  // The try/catch is introduced so that techdocs-cli can import @backstage/plugin-techdocs-node
  // on CI/CD without installing techdocs backend plugin.
  staticDocsDir = os.tmpdir();
}

/**
 * Local publisher which uses the local filesystem to store the generated static files. It uses a directory
 * called "static" at the root of techdocs-backend plugin.
 */
export class LocalPublish implements PublisherBase {
  private readonly legacyPathCasing: boolean;
  private readonly logger: Logger;
  private readonly discovery: PluginEndpointDiscovery;

  // TODO: Move the logic of setting staticDocsDir based on config over to
  // fromConfig, and set the value as a class parameter.
  constructor(options: {
    logger: Logger;
    discovery: PluginEndpointDiscovery;
    legacyPathCasing: boolean;
  }) {
    this.logger = options.logger;
    this.discovery = options.discovery;
    this.legacyPathCasing = options.legacyPathCasing;
  }

  static fromConfig(
    config: Config,
    logger: Logger,
    discovery: PluginEndpointDiscovery,
  ): PublisherBase {
    const legacyPathCasing =
      config.getOptionalBoolean(
        'techdocs.legacyUseCaseSensitiveTripletPaths',
      ) || false;

    return new LocalPublish({
      logger,
      discovery,
      legacyPathCasing,
    });
  }

  async getReadiness(): Promise<ReadinessResponse> {
    return {
      isAvailable: true,
    };
  }

  async publish({
    entity,
    directory,
  }: PublishRequest): Promise<PublishResponse> {
    const entityNamespace = entity.metadata.namespace ?? 'default';

    const publishDir = this.staticEntityPathJoin(
      entityNamespace,
      entity.kind,
      entity.metadata.name,
    );

    if (!fs.existsSync(publishDir)) {
      this.logger.info(`Could not find ${publishDir}, creating the directory.`);
      fs.mkdirSync(publishDir, { recursive: true });
    }

    try {
      await fs.copy(directory, publishDir);
      this.logger.info(`Published site stored at ${publishDir}`);
    } catch (error) {
      this.logger.debug(
        `Failed to copy docs from ${directory} to ${publishDir}`,
      );
      throw error;
    }

    // Generate publish response.
    const techdocsApiUrl = await this.discovery.getBaseUrl('techdocs');
    const publishedFilePaths = (await getFileTreeRecursively(publishDir)).map(
      abs => {
        return abs.split(`${staticDocsDir}/`)[1];
      },
    );

    return {
      remoteUrl: `${techdocsApiUrl}/static/docs/${encodeURIComponent(
        entity.metadata.name,
      )}`,
      objects: publishedFilePaths,
    };
  }

  async fetchTechDocsMetadata(
    entityName: CompoundEntityRef,
  ): Promise<TechDocsMetadata> {
    const metadataPath = this.staticEntityPathJoin(
      entityName.namespace,
      entityName.kind,
      entityName.name,
      'techdocs_metadata.json',
    );

    try {
      return await fs.readJson(metadataPath);
    } catch (err) {
      assertError(err);
      this.logger.error(
        `Unable to read techdocs_metadata.json at ${metadataPath}. Error: ${err}`,
      );
      throw new Error(err.message);
    }
  }

  docsRouter(): express.Handler {
    const router = express.Router();

    // Redirect middleware ensuring that requests to case-sensitive entity
    // triplet paths are always sent to lower-case versions.
    router.use((req, res, next) => {
      // If legacy path casing is on, let the request immediately continue.
      if (this.legacyPathCasing) {
        return next();
      }

      // Generate a lower-case entity triplet path.
      const [_, namespace, kind, name, ...rest] = req.path.split('/');

      // Ignore non-triplet objects.
      if (!namespace || !kind || !name) {
        return next();
      }

      const newPath = [
        _,
        namespace.toLowerCase(),
        kind.toLowerCase(),
        name.toLowerCase(),
        ...rest,
      ].join('/');

      // If there was no change, then let express.static() handle the request.
      if (newPath === req.path) {
        return next();
      }

      // Otherwise, redirect to the new path.
      return res.redirect(req.baseUrl + newPath, 301);
    });

    router.use(
      express.static(staticDocsDir, {
        // Handle content-type header the same as all other publishers.
        setHeaders: (res, filePath) => {
          const fileExtension = path.extname(filePath);
          const headers = getHeadersForFileExtension(fileExtension);
          for (const [header, value] of Object.entries(headers)) {
            res.setHeader(header, value);
          }
        },
      }),
    );

    return router;
  }

  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    const namespace = entity.metadata.namespace ?? 'default';

    const indexHtmlPath = this.staticEntityPathJoin(
      namespace,
      entity.kind,
      entity.metadata.name,
      'index.html',
    );

    // Check if the file exists
    try {
      await fs.access(indexHtmlPath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * This code will never run in practice. It is merely here to illustrate how
   * to implement this method for other storage providers.
   */
  async migrateDocsCase({
    removeOriginal = false,
    concurrency = 25,
  }): Promise<void> {
    // Iterate through every file in the root of the publisher.
    const files = await getFileTreeRecursively(staticDocsDir);
    const limit = createLimiter(concurrency);

    await Promise.all(
      files.map(f =>
        limit(async file => {
          const relativeFile = file.replace(`${staticDocsDir}${path.sep}`, '');
          const newFile = lowerCaseEntityTripletInStoragePath(relativeFile);

          // If all parts are already lowercase, ignore.
          if (relativeFile === newFile) {
            return;
          }

          // Otherwise, copy or move the file.
          await new Promise<void>(resolve => {
            const migrate = removeOriginal ? fs.move : fs.copyFile;
            this.logger.verbose(`Migrating ${relativeFile}`);
            migrate(file, newFile, err => {
              if (err) {
                this.logger.warn(
                  `Unable to migrate ${relativeFile}: ${err.message}`,
                );
              }
              resolve();
            });
          });
        }, f),
      ),
    );
  }

  /**
   * Utility wrapper around path.join(), used to control legacy case logic.
   */
  protected staticEntityPathJoin(...allParts: string[]): string {
    if (this.legacyPathCasing) {
      const [namespace, kind, name, ...parts] = allParts;
      return path.join(staticDocsDir, namespace, kind, name, ...parts);
    }
    const [namespace, kind, name, ...parts] = allParts;
    return path.join(
      staticDocsDir,
      namespace.toLowerCase(),
      kind.toLowerCase(),
      name.toLowerCase(),
      ...parts,
    );
  }
}
