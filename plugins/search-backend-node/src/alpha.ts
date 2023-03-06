/*
 * Copyright 2023 The Backstage Authors
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

import { Logger } from 'winston';

import {
  createServiceRef,
  createServiceFactory,
  coreServices,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  DocumentTypeInfo,
  SearchEngine,
} from '@backstage/plugin-search-common';
import { createExtensionPoint } from '@backstage/backend-plugin-api';

import {
  RegisterCollatorParameters,
  RegisterDecoratorParameters,
} from './types';

import { IndexBuilder } from './IndexBuilder';
import { Scheduler } from './Scheduler';

export interface SearchIndexBuilderService {
  build(options: IndexBuilderServiceBuildOptions): Promise<{
    scheduler: Scheduler;
  }>;
  getDocumentTypes(): Record<string, DocumentTypeInfo>;
}

export interface SearchIndexRegistryExtensionPoint {
  addCollator(options: RegisterCollatorParameters): void;
  addDecorator(options: RegisterDecoratorParameters): void;
}

export interface SearchEngineRegistryExtensionPoint {
  setSearchEngine(searchEngine: SearchEngine): void;
}

type DefaultSearchIndexBuilderServiceOptions = {
  logger: Logger;
};

class DefaultSearchIndexBuilderService implements SearchIndexBuilderService {
  private logger: Logger;
  private indexBuilder: IndexBuilder | null = null;

  private constructor(options: DefaultSearchIndexBuilderServiceOptions) {
    this.logger = options.logger;
  }

  static fromConfig(options: DefaultSearchIndexBuilderServiceOptions) {
    return new DefaultSearchIndexBuilderService(options);
  }

  build(
    options: IndexBuilderServiceBuildOptions,
  ): Promise<{ scheduler: Scheduler }> {
    this.indexBuilder = new IndexBuilder({
      logger: this.logger,
      searchEngine: options.searchEngine,
    });

    options.collators.forEach(collator =>
      this.indexBuilder?.addCollator(collator),
    );

    options.decorators.forEach(decorator =>
      this.indexBuilder?.addDecorator(decorator),
    );

    return this.indexBuilder?.build();
  }

  getDocumentTypes(): Record<string, DocumentTypeInfo> {
    return this.indexBuilder?.getDocumentTypes() ?? {};
  }
}

export const searchIndexBuilderService =
  createServiceRef<SearchIndexBuilderService>({
    id: 'search.index.builder',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: {
          logger: coreServices.logger,
        },
        factory({ logger }) {
          return DefaultSearchIndexBuilderService.fromConfig({
            logger: loggerToWinstonLogger(logger),
          });
        },
      }),
  });

export const searchEngineRegistryExtensionPoint =
  createExtensionPoint<SearchEngineRegistryExtensionPoint>({
    id: 'search.engine.registry',
  });

export const searchIndexRegistryExtensionPoint =
  createExtensionPoint<SearchIndexRegistryExtensionPoint>({
    id: 'search.index.registry',
  });

export type IndexBuilderServiceBuildOptions = {
  searchEngine: SearchEngine;
  collators: RegisterCollatorParameters[];
  decorators: RegisterDecoratorParameters[];
};
