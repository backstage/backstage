/*
 * Copyright 2026 The Backstage Authors
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

import { Config } from '@backstage/config';
import fs from 'fs-extra';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getMkdocsYml } from '@backstage/plugin-techdocs-node';
import type {
  GeneratorBase,
  GeneratorOptions,
  GeneratorRunOptions,
  TechDocsContainerRunner,
} from '@backstage/plugin-techdocs-node';
import {
  createDockerContainerRunner,
  createOrUpdateMetadata,
  patchIndexPreBuild,
  runCommand,
  sanitizeMkdocsYml,
  storeEtagMetadata,
  validateInputDirectory,
  validateMkdocsYaml,
} from '@backstage/plugin-techdocs-node/alpha';
import type { ContainerRunnerPullOptions } from '@backstage/plugin-techdocs-node';

type ZensicalGeneratorConfig = {
  runIn: 'docker' | 'local';
  dockerImage?: string;
  pullImage?: boolean;
  pullOptions?: ContainerRunnerPullOptions;
  legacyCopyReadmeMdToIndexMd?: boolean;
  dangerouslyAllowAdditionalKeys?: string[];
  dangerouslyAllowAdditionalPlugins?: string[];
};
import { ForwardedError } from '@backstage/errors';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  patchZensicalConfig,
  cleanupZensicalConfig,
  normalizeSearchIndex,
} from './zensicalHelpers';

/**
 * Generates documentation files using Zensical.
 * @public
 */
export class TechdocsZensicalGenerator implements GeneratorBase {
  public static readonly defaultDockerImage =
    'ghcr.io/backstage/techdocs-zensical:latest';
  private readonly logger: LoggerService;
  private readonly containerRunner?: TechDocsContainerRunner;
  private readonly options: ZensicalGeneratorConfig;

  static fromConfig(config: Config, options: GeneratorOptions) {
    const { containerRunner, logger } = options;
    return new TechdocsZensicalGenerator({
      logger,
      containerRunner,
      config,
    });
  }

  constructor(options: {
    logger: LoggerService;
    containerRunner?: TechDocsContainerRunner;
    config: Config;
  }) {
    this.logger = options.logger;
    this.options = readZensicalGeneratorConfig(options.config);
    this.containerRunner = options.containerRunner;
  }

  public async run(options: GeneratorRunOptions): Promise<void> {
    const {
      inputDir,
      outputDir,
      etag,
      logger: childLogger,
      logStream,
      siteOptions,
      runAsDefaultUser,
    } = options;

    const { path: mkdocsYmlPath, content } = await getMkdocsYml(
      inputDir,
      siteOptions,
    );

    const docsDir = await validateMkdocsYaml(inputDir, content);

    if (this.options.legacyCopyReadmeMdToIndexMd) {
      await patchIndexPreBuild({ inputDir, logger: childLogger, docsDir });
    }

    await validateInputDirectory(inputDir);

    const mountDirs = {
      [inputDir]: '/input',
    };

    // Zensical requires site_dir to be within the project root.
    // Unique name so we never clobber a site/ directory committed to the repo.
    const relativeSiteDir = `.techdocs-zensical-site-${randomUUID()}`;
    const builtSiteDir = path.join(inputDir, relativeSiteDir);
    // Same allowlist as the MkDocs path: Zensical consumes the same
    // mkdocs.yml format and honors options like plantuml_cmd.
    await sanitizeMkdocsYml(
      mkdocsYmlPath,
      childLogger,
      this.options.dangerouslyAllowAdditionalKeys,
      this.options.dangerouslyAllowAdditionalPlugins,
    );

    const zensicalConfigPath = await patchZensicalConfig(
      mkdocsYmlPath,
      relativeSiteDir,
      childLogger,
    );

    try {
      switch (this.options.runIn) {
        case 'local':
          await runCommand({
            command: 'zensical',
            args: ['build', '-f', zensicalConfigPath],
            options: {
              cwd: inputDir,
            },
            logStream,
          });
          childLogger.info(
            `Successfully generated docs from ${inputDir} into ${outputDir} using local zensical`,
          );
          break;
        case 'docker': {
          const containerRunner =
            this.containerRunner || createDockerContainerRunner();
          await containerRunner.runContainer({
            imageName:
              this.options.dockerImage ??
              TechdocsZensicalGenerator.defaultDockerImage,
            // Set the entrypoint explicitly rather than relying on the image's.
            command: 'zensical',
            args: [
              'build',
              '-f',
              `/input/${path.basename(zensicalConfigPath)}`,
            ],
            logStream,
            mountDirs,
            workingDir: '/input',
            envVars: { HOME: '/tmp' },
            pullImage: this.options.pullImage,
            pullOptions: this.options.pullOptions,
            defaultUser: runAsDefaultUser,
          });
          childLogger.info(
            `Successfully generated docs from ${inputDir} into ${outputDir} using zensical container`,
          );
          break;
        }
        default:
          throw new Error(
            `Invalid config value "${this.options.runIn}" provided in 'techdocs.generator'.`,
          );
      }
    } catch (error) {
      await fs.remove(builtSiteDir);
      this.logger.debug(
        `Failed to generate docs from ${inputDir} into ${outputDir}`,
      );
      throw new ForwardedError(
        `Failed to generate docs from ${inputDir} into ${outputDir}`,
        error,
      );
    } finally {
      await cleanupZensicalConfig(zensicalConfigPath);
    }

    await fs.move(builtSiteDir, outputDir, { overwrite: true });

    await normalizeSearchIndex(outputDir, childLogger);

    await createOrUpdateMetadata(
      path.join(outputDir, 'techdocs_metadata.json'),
      childLogger,
      'zensical',
    );

    if (etag) {
      await storeEtagMetadata(
        path.join(outputDir, 'techdocs_metadata.json'),
        etag,
      );
    }
  }
}

function readZensicalGeneratorConfig(config: Config): ZensicalGeneratorConfig {
  return {
    runIn:
      (config.getOptionalString(
        'techdocs.generator.runIn',
      ) as ZensicalGeneratorConfig['runIn']) ?? 'docker',
    // Deliberately not falling back to techdocs.generator.dockerImage: that
    // is an MkDocs image and would build the site with MkDocs instead.
    dockerImage: config.getOptionalString(
      'techdocs.generator.zensical.dockerImage',
    ),
    pullImage: config.getOptionalBoolean('techdocs.generator.pullImage'),
    pullOptions: config.getOptional('techdocs.generator.pullOptions'),
    dangerouslyAllowAdditionalKeys: config.getOptionalStringArray(
      'techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys',
    ),
    dangerouslyAllowAdditionalPlugins: config.getOptionalStringArray(
      'techdocs.generator.mkdocs.dangerouslyAllowAdditionalPlugins',
    ),
    legacyCopyReadmeMdToIndexMd: config.getOptionalBoolean(
      'techdocs.generator.mkdocs.legacyCopyReadmeMdToIndexMd',
    ),
  };
}
