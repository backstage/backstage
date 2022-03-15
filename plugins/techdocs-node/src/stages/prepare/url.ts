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

import { assertError } from '@backstage/errors';
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { getDocFilesFromRepository } from '../../helpers';
import {
  PreparerBase,
  PreparerConfig,
  PreparerOptions,
  PreparerResponse,
} from './types';

/**
 * Preparer used to retrieve documentation files from a remote repository
 * @public
 */
export class UrlPreparer implements PreparerBase {
  private readonly logger: Logger;
  private readonly reader: UrlReader;

  /**
   * Returns a directory preparer instance
   * @param config - A URL preparer config containing the a logger and reader
   */
  static fromConfig({ reader, logger }: PreparerConfig): UrlPreparer {
    return new UrlPreparer(reader, logger);
  }

  private constructor(reader: UrlReader, logger: Logger) {
    this.logger = logger;
    this.reader = reader;
  }

  /** {@inheritDoc PreparerBase.prepare} */
  async prepare(
    entity: Entity,
    options?: PreparerOptions,
  ): Promise<PreparerResponse> {
    try {
      return await getDocFilesFromRepository(this.reader, entity, {
        etag: options?.etag,
        logger: this.logger,
      });
    } catch (error) {
      assertError(error);
      // NotModifiedError means that etag based cache is still valid.
      if (error.name === 'NotModifiedError') {
        this.logger.debug(`Cache is valid for etag ${options?.etag}`);
      } else {
        this.logger.debug(
          `Unable to fetch files for building docs ${error.message}`,
        );
      }

      throw error;
    }
  }
}
