/*
 * Copyright 2024 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import {
  PreparerBase,
  PreparerConfig,
  PreparerOptions,
  PreparerResponse,
} from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import { getDocFilesFromConfluence } from '../../helpers';
import { assertError } from '@backstage/errors';
import { Config } from '@backstage/config';

export class ConfluencePreparer implements PreparerBase {
  private readonly config: Config;
  private readonly logger: LoggerService;

  static fromConfig(
    config: Config,
    options: PreparerConfig,
  ): ConfluencePreparer {
    return new ConfluencePreparer(config, options.logger);
  }

  private constructor(config: Config, logger: LoggerService) {
    this.config = config;
    this.logger = logger;
  }

  async prepare(
    entity: Entity,
    options?: PreparerOptions,
  ): Promise<PreparerResponse> {
    try {
      return await getDocFilesFromConfluence(this.config, entity, {
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
  shouldCleanPreparedDirectory(): boolean {
    return false;
  }
}
