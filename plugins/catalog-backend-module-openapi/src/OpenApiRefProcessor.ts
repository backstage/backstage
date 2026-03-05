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

import {
  LoggerService,
  RootConfigService,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { bundleFileWithRefs } from './lib';

/**
 * @public
 * @deprecated replaced by the openApiPlaceholderResolver
 */
export class OpenApiRefProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: LoggerService;
  private readonly reader: UrlReaderService;

  static fromConfig(
    config: RootConfigService,
    options: { logger: LoggerService; reader: UrlReaderService },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new OpenApiRefProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrations;
    logger: LoggerService;
    reader: UrlReaderService;
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
    const definition = entity.spec!.definition;

    if (!scmIntegration || !definition) {
      return entity;
    }

    const resolveUrl = (url: string, base: string): string => {
      return scmIntegration.resolveUrl({ url, base });
    };

    this.logger.debug(`Bundling OpenAPI specification from ${location.target}`);
    try {
      const read = async (url: string) => {
        const { buffer } = await this.reader.readUrl(url);
        return await buffer();
      };
      const bundledSpec = await bundleFileWithRefs(
        definition.toString(),
        location.target,
        read,
        resolveUrl,
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
