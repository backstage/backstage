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
import { Entity } from '@backstage/catalog-model';
import { PreparerBase } from './types';
import { getDocFilesFromRepository } from '../../helpers';
import { Logger } from 'winston';
import { UrlReader } from '@backstage/backend-common';

export class UrlPreparer implements PreparerBase {
  private readonly logger: Logger;
  private readonly reader: UrlReader;

  constructor(reader: UrlReader, logger: Logger) {
    this.logger = logger;
    this.reader = reader;
  }

  async prepare(entity: Entity): Promise<string> {
    try {
      return getDocFilesFromRepository(this.reader, entity);
    } catch (error) {
      this.logger.debug(
        `Unable to fetch files for building docs ${error.message}`,
      );
      throw error;
    }
  }
}
