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

import { Config } from '@backstage/config';
import path from 'node:path';
import {
  createOrUpdateMetadata,
  getMkdocsYml,
  runCommand,
  storeEtagMetadata,
  validateDocsDirectory,
  validateMkdocsYaml,
} from './helpers';

import {
  GeneratorBase,
  GeneratorConfig,
  GeneratorOptions,
  GeneratorRunInType,
  GeneratorRunOptions,
} from './types';
import { ForwardedError } from '@backstage/errors';
import { DockerContainerRunner } from './DockerContainerRunner';
import { LoggerService } from '@backstage/backend-plugin-api';
import { TechDocsContainerRunner } from './types';

/**
 * Generates documentation files using Zensical (MkDocs Material fork)
 * @public
 */
export class TechdocsZensicalGenerator implements GeneratorBase {
  /**
   * The default docker image for Zensical-based documentation generation.
   */
  public static readonly defaultDockerImage =
    'spotify/techdocs-zensical:latest';
  private readonly logger: LoggerService;
  private readonly containerRunner?: TechDocsContainerRunner;
  private readonly options: GeneratorConfig;

  /**
   * Returns a instance of TechDocs Zensical generator
   * @param config - A Backstage configuration
   * @param options - Options to configure the generator
   */
  static fromConfig(
    config: Config,
    options: GeneratorOptions,
  ): TechdocsZensicalGenerator {
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

  /** {@inheritDoc GeneratorBase.run} */
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

    const { content } = await getMkdocsYml(inputDir, siteOptions);
    const docsDir = await validateMkdocsYaml(inputDir, content);

    const resolvedDocsDir = path.join(inputDir, docsDir ?? 'docs');
    await validateDocsDirectory(resolvedDocsDir, inputDir);

    const mountDirs = {
      [inputDir]: '/input',
      [outputDir]: '/output',
    };

    try {
      switch (this.options.runIn) {
        case 'local':
          await runCommand({
            command: 'zensical',
            args: ['build', '-d', outputDir, '-v'],
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
            this.containerRunner || new DockerContainerRunner();
          await containerRunner.runContainer({
            imageName:
              this.options.dockerImage ??
              TechdocsZensicalGenerator.defaultDockerImage,
            args: ['build', '-d', '/output'],
            logStream,
            mountDirs,
            workingDir: '/input',
            envVars: { HOME: '/tmp' },
            pullImage: this.options.pullImage,
            defaultUser: runAsDefaultUser,
          });
          childLogger.info(
            `Successfully generated docs from ${inputDir} into ${outputDir} using techdocs-zensical container`,
          );
          break;
        }
        default:
          throw new Error(
            `Invalid config value "${this.options.runIn}" provided in 'techdocs.generator'.`,
          );
      }
    } catch (error) {
      this.logger.debug(
        `Failed to generate docs from ${inputDir} into ${outputDir}`,
      );
      throw new ForwardedError(
        `Failed to generate docs from ${inputDir} into ${outputDir}`,
        error,
      );
    }

    await createOrUpdateMetadata(
      path.join(outputDir, 'techdocs_metadata.json'),
      childLogger,
    );

    if (etag) {
      await storeEtagMetadata(
        path.join(outputDir, 'techdocs_metadata.json'),
        etag,
      );
    }
  }
}

export function readZensicalGeneratorConfig(config: Config): GeneratorConfig {
  return {
    type:
      (config.getOptionalString('techdocs.generator.type') as
        | GeneratorConfig['type']
        | undefined) ?? 'techdocs-zensical',
    runIn:
      (config.getOptionalString('techdocs.generator.runIn') as
        | GeneratorRunInType
        | undefined) ?? 'docker',
    dockerImage: config.getOptionalString('techdocs.generator.dockerImage'),
    pullImage: config.getOptionalBoolean('techdocs.generator.pullImage'),
  };
}
