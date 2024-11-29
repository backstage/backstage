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

import {
  coreServices,
  createExtensionPoint,
  createServiceFactory,
  createServiceRef,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { DocumentTypeInfo } from '@backstage/plugin-search-common';
import {
  IndexBuilder,
  RegisterCollatorParameters,
  RegisterDecoratorParameters,
  Scheduler,
  SearchEngine,
} from '@backstage/plugin-search-backend-node';

/**
 * @alpha
 * Options for the init method on {@link SearchIndexService}.
 */
export type SearchIndexServiceInitOptions = {
  searchEngine: SearchEngine;
  collators: RegisterCollatorParameters[];
  decorators: RegisterDecoratorParameters[];
};

/**
 * @alpha
 * Interface for implementation of index service.
 */
export interface SearchIndexService {
  /**
   * Initializes state in preparation for starting the search index service
   */
  init(options: SearchIndexServiceInitOptions): void;

  /**
   * Starts indexing process
   */
  start(): Promise<void>;

  /**
   * Stops indexing process
   */
  stop(): Promise<void>;

  /**
   * Returns an index types list.
   */
  getDocumentTypes(): Record<string, DocumentTypeInfo>;
}

/**
 * @alpha
 * Interface for search index registry extension point.
 */
export interface SearchIndexRegistryExtensionPoint {
  addCollator(options: RegisterCollatorParameters): void;
  addDecorator(options: RegisterDecoratorParameters): void;
}

/**
 * @alpha
 * Interface for search engine registry extension point.
 */
export interface SearchEngineRegistryExtensionPoint {
  setSearchEngine(searchEngine: SearchEngine): void;
}

type DefaultSearchIndexServiceOptions = {
  logger: LoggerService;
};

/**
 * @alpha
 * Responsible for register the indexing task and start the schedule.
 */
class DefaultSearchIndexService implements SearchIndexService {
  private readonly logger: LoggerService;
  private indexBuilder: IndexBuilder | null = null;
  private scheduler: Scheduler | null = null;

  private constructor(options: DefaultSearchIndexServiceOptions) {
    this.logger = options.logger;
  }

  static fromConfig(options: DefaultSearchIndexServiceOptions) {
    return new DefaultSearchIndexService(options);
  }

  init(options: SearchIndexServiceInitOptions): void {
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
  }

  async start(): Promise<void> {
    if (!this.indexBuilder) {
      throw new Error('IndexBuilder is not initialized, call init first');
    }
    const { scheduler } = await this.indexBuilder.build();
    this.scheduler = scheduler;
    this.scheduler!.start();
  }

  async stop(): Promise<void> {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
    }
  }

  getDocumentTypes(): Record<string, DocumentTypeInfo> {
    return this.indexBuilder?.getDocumentTypes() ?? {};
  }
}

/**
 * @alpha
 * Service that builds a search index.
 */
export const searchIndexServiceRef = createServiceRef<SearchIndexService>({
  id: 'search.index.service',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        logger: coreServices.logger,
      },
      factory({ logger }) {
        return DefaultSearchIndexService.fromConfig({
          logger,
        });
      },
    }),
});

/**
 * @alpha
 * Extension point for register a search engine.
 */
export const searchEngineRegistryExtensionPoint =
  createExtensionPoint<SearchEngineRegistryExtensionPoint>({
    id: 'search.engine.registry',
  });

/**
 * @alpha
 * Extension point for registering collators and decorators
 */
export const searchIndexRegistryExtensionPoint =
  createExtensionPoint<SearchIndexRegistryExtensionPoint>({
    id: 'search.index.registry',
  });
