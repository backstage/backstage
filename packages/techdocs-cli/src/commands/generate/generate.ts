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

import { resolve } from 'path';
import { OptionValues } from 'commander';
import fs from 'fs-extra';
import Docker from 'dockerode';
import {
  TechdocsGenerator,
  ParsedLocationAnnotation,
} from '@backstage/plugin-techdocs-node';
import { DockerContainerRunner } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  convertTechDocsRefToLocationAnnotation,
  createLogger,
} from '../../lib/utility';
import { stdout } from 'process';

export default async function generate(opts: OptionValues) {
  // Use techdocs-node package to generate docs. Keep consistency between Backstage and CI generating docs.
  // Docs can be prepared using actions/checkout or git clone, or similar paradigms on CI. The TechDocs CI workflow
  // will run on the CI pipeline containing the documentation files.

  const logger = createLogger({ verbose: opts.verbose });

  const sourceDir = resolve(opts.sourceDir);
  const outputDir = resolve(opts.outputDir);
  const omitTechdocsCorePlugin = opts.omitTechdocsCoreMkdocsPlugin;
  const dockerImage = opts.dockerImage;
  const pullImage = opts.pull;
  const legacyCopyReadmeMdToIndexMd = opts.legacyCopyReadmeMdToIndexMd;

  logger.info(`Using source dir ${sourceDir}`);
  logger.info(`Will output generated files in ${outputDir}`);

  logger.verbose('Creating output directory if it does not exist.');

  await fs.ensureDir(outputDir);

  const config = new ConfigReader({
    techdocs: {
      generator: {
        runIn: opts.docker ? 'docker' : 'local',
        dockerImage,
        pullImage,
        legacyCopyReadmeMdToIndexMd,
        mkdocs: {
          omitTechdocsCorePlugin,
        },
      },
    },
  });

  // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  let parsedLocationAnnotation = {} as ParsedLocationAnnotation;
  if (opts.techdocsRef) {
    try {
      parsedLocationAnnotation = convertTechDocsRefToLocationAnnotation(
        opts.techdocsRef,
      );
    } catch (err) {
      logger.error(err.message);
    }
  }

  // Generate docs using @backstage/plugin-techdocs-node
  const techdocsGenerator = await TechdocsGenerator.fromConfig(config, {
    logger,
    containerRunner,
  });

  logger.info('Generating documentation...');

  await techdocsGenerator.run({
    inputDir: sourceDir,
    outputDir,
    ...(opts.techdocsRef
      ? {
          parsedLocationAnnotation,
        }
      : {}),
    logger,
    etag: opts.etag,
    ...(process.env.LOG_LEVEL === 'debug' ? { logStream: stdout } : {}),
  });

  logger.info('Done!');
}
