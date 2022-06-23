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
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  CatalogProcessor,
  LocationSpec,
} from '@backstage/plugin-catalog-backend';
import { bundleOpenApiSpecification } from './lib';
import { Logger } from 'winston';

/** @public */
export class OpenApiRefProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;
  private readonly reader: UrlReader;

  static fromConfig(
    config: Config,
    options: { logger: Logger; reader: UrlReader },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new OpenApiRefProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrations;
    logger: Logger;
    reader: UrlReader;
  }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
    this.reader = options.reader;
  }

  getProcessorName(): string {
    return 'OpenApiRefProcessor';
  }

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    if (
      !entity ||
      entity.kind !== 'API' ||
      (entity.spec && entity.spec.type !== 'openapi')
    ) {
      return entity;
    }

    const scmIntegration = this.integrations.byUrl(location.target);
    if (!scmIntegration) {
      return entity;
    }

    this.logger.debug(`Bundling OpenAPI specification from ${location.target}`);
    try {
      const bundledSpec = await bundleOpenApiSpecification(
        entity.spec!.definition?.toString(),
        location.target,
        this.reader,
        scmIntegration,
      );

      return {
        ...entity,
        spec: { ...entity.spec, definition: bundledSpec },
      };
    } catch (error) {
      this.logger.error(`Unable to bundle OpenAPI specification`, error);
      return entity;
    }
  }
}
