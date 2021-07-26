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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { Logger } from 'winston';
import { parseReferenceAnnotation, transformDirLocation } from '../../helpers';
import { PreparerBase, PreparerResponse } from './types';

export class DirectoryPreparer implements PreparerBase {
  private readonly scmIntegrations: ScmIntegrationRegistry;
  private readonly reader: UrlReader;

  constructor(config: Config, _logger: Logger, reader: UrlReader) {
    this.reader = reader;
    this.scmIntegrations = ScmIntegrations.fromConfig(config);
  }

  async prepare(
    entity: Entity,
    options?: { logger?: Logger; etag?: string },
  ): Promise<PreparerResponse> {
    const annotation = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      entity,
    );
    const { type, target } = transformDirLocation(
      entity,
      annotation,
      this.scmIntegrations,
    );

    switch (type) {
      case 'url': {
        options?.logger?.debug(`Reading files from ${target}`);
        // the target is an absolute url since it has already been transformed
        const response = await this.reader.readTree(target, {
          etag: options?.etag,
        });
        const preparedDir = await response.dir();

        options?.logger?.debug(`Tree downloaded and stored at ${preparedDir}`);

        return {
          preparedDir,
          etag: response.etag,
        };
      }

      case 'dir': {
        return {
          // the transformation already validated that the target is in a safe location
          preparedDir: target,
          // Instead of supporting caching on local sources, use techdocs-cli for local development and debugging.
          etag: '',
        };
      }

      default:
        throw new InputError(`Unable to resolve location type ${type}`);
    }
  }
}
