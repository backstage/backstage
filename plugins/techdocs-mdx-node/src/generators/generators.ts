/*
 * Copyright 2022 The Backstage Authors
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

import path from 'path';

import { Logger } from 'winston';

import {
  createOrUpdateMetadata,
  GeneratorBase,
  GeneratorOptions,
  GeneratorRunOptions,
} from '@backstage/plugin-techdocs-node';

import { METADATA_FILE_NAME } from './constants';
import { getConfig, copyMarkdownFiles } from './helpers';

/**
 * Copy markdown files to static folder
 * @public
 */
export class TechDocsGenerator implements GeneratorBase {
  private readonly logger: Logger;

  /**
   * Returns a instance of TechDocs generator
   * @param options - Options to configure the generator
   */
  static fromConfig(options: GeneratorOptions) {
    const { logger } = options;
    return new TechDocsGenerator({ logger });
  }

  constructor(options: { logger: Logger }) {
    this.logger = options.logger;
  }

  /**
   * Runs the generator with the values
   * @public
   */
  public async run(options: GeneratorRunOptions): Promise<void> {
    const { inputDir, outputDir, etag, logger: childLogger } = options;

    try {
      const {
        site_name = '',
        site_description = '',
        nav = [],
        docs_dir = 'docs',
      } = await getConfig(inputDir);
      await copyMarkdownFiles(path.join(inputDir, docs_dir), outputDir);
      await createOrUpdateMetadata(
        path.join(outputDir, METADATA_FILE_NAME),
        childLogger,
        { site_name, site_description, nav, etag },
      );
      this.logger.info(
        `Successfully copied source from ${inputDir} into ${outputDir}`,
      );
    } catch (error) {
      this.logger.debug(
        `Failed to copy source from ${inputDir} into ${outputDir}`,
      );
      this.logger.error(`Build failed with error:`);
      throw new Error(
        `Failed to copy source from ${inputDir} into ${outputDir} with error ${error.message}`,
      );
    }
  }
}
