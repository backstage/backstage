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

import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { findCodeOwnerByTarget } from '../codeowners';
import { LoggerService, UrlReaderService } from '@backstage/backend-plugin-api';

const ALLOWED_KINDS = ['API', 'Component', 'Domain', 'Resource', 'System'];
const ALLOWED_LOCATION_TYPES = ['url'];

/** @public */
export class CodeOwnersProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly logger: LoggerService;
  private readonly reader: UrlReaderService;

  static fromConfig(
    config: Config,
    options: { logger: LoggerService; reader: UrlReaderService },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new CodeOwnersProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrationRegistry;
    logger: LoggerService;
    reader: UrlReaderService;
  }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
    this.reader = options.reader;
  }

  getProcessorName(): string {
    return 'CodeOwnersProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    // Only continue if the owner is not set
    if (
      !entity ||
      !ALLOWED_KINDS.includes(entity.kind) ||
      !ALLOWED_LOCATION_TYPES.includes(location.type) ||
      (entity.spec && entity.spec.owner)
    ) {
      return entity;
    }

    const scmIntegration = this.integrations.byUrl(location.target);
    if (!scmIntegration) {
      return entity;
    }

    const owner = await findCodeOwnerByTarget(
      this.reader,
      location.target,
      scmIntegration,
    );

    if (!owner) {
      this.logger.debug(
        `CodeOwnerProcessor could not resolve owner for ${location.target}`,
      );
      return entity;
    }

    return {
      ...entity,
      spec: { ...entity.spec, owner },
    };
  }
}
