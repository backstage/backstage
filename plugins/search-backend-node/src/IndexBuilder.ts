/*
 * Copyright 2021 The Backstage Authors
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
  DocumentDecoratorFactory,
  DocumentTypeInfo,
  SearchEngine,
} from '@backstage/plugin-search-common';
import { Transform, pipeline } from 'stream';
import { Logger } from 'winston';
import { Scheduler } from './Scheduler';
import {
  IndexBuilderOptions,
  RegisterCollatorParameters,
  RegisterDecoratorParameters,
} from './types';

/**
 * Used for adding collators, decorators and compile them into tasks which are added to a scheduler returned to the caller.
 * @public
 */
export class IndexBuilder {
  private collators: Record<string, RegisterCollatorParameters>;
  private decorators: Record<string, DocumentDecoratorFactory[]>;
  private documentTypes: Record<string, DocumentTypeInfo>;
  private searchEngine: SearchEngine;
  private logger: Logger;

  constructor({ logger, searchEngine }: IndexBuilderOptions) {
    this.collators = {};
    this.decorators = {};
    this.documentTypes = {};
    this.logger = logger;
    this.searchEngine = searchEngine;
  }

  /**
   * Responsible for returning the registered search engine.
   */
  getSearchEngine(): SearchEngine {
    return this.searchEngine;
  }

  /**
   * Responsible for returning the registered document types.
   */
  getDocumentTypes(): Record<string, DocumentTypeInfo> {
    return this.documentTypes;
  }

  /**
   * Makes the index builder aware of a collator that should be executed at the
   * given refresh interval.
   */
  addCollator({ factory, schedule }: RegisterCollatorParameters): void {
    this.logger.info(
      `Added ${factory.constructor.name} collator factory for type ${factory.type}`,
    );
    this.collators[factory.type] = {
      factory,
      schedule,
    };
    this.documentTypes[factory.type] = {
      visibilityPermission: factory.visibilityPermission,
    };
  }

  /**
   * Makes the index builder aware of a decorator. If no types are provided on
   * the decorator, it will be applied to documents from all known collators,
   * otherwise it will only be applied to documents of the given types.
   */
  addDecorator({ factory }: RegisterDecoratorParameters): void {
    const types = factory.types || ['*'];
    this.logger.info(
      `Added decorator ${factory.constructor.name} to types ${types.join(
        ', ',
      )}`,
    );
    types.forEach(type => {
      if (this.decorators.hasOwnProperty(type)) {
        this.decorators[type].push(factory);
      } else {
        this.decorators[type] = [factory];
      }
    });
  }

  /**
   * Compiles collators and decorators into tasks, which are added to a
   * scheduler returned to the caller.
   */
  async build(): Promise<{ scheduler: Scheduler }> {
    const scheduler = new Scheduler({
      logger: this.logger,
    });

    Object.keys(this.collators).forEach(type => {
      scheduler.addToSchedule({
        id: `search_index_${type.replace('-', '_').toLocaleLowerCase('en-US')}`,
        scheduledRunner: this.collators[type].schedule,
        task: async () => {
          // Instantiate the collator.
          const collator = await this.collators[type].factory.getCollator();
          this.logger.info(
            `Collating documents for ${type} via ${this.collators[type].factory.constructor.name}`,
          );

          // Instantiate all relevant decorators.
          const decorators: Transform[] = await Promise.all(
            (this.decorators['*'] || [])
              .concat(this.decorators[type] || [])
              .map(async factory => {
                const decorator = await factory.getDecorator();
                this.logger.info(
                  `Attached decorator via ${factory.constructor.name} to ${type} index pipeline.`,
                );
                return decorator;
              }),
          );

          // Instantiate the indexer.
          const indexer = await this.searchEngine.getIndexer(type);

          // Compose collator/decorators/indexer into a pipeline
          return new Promise<void>((resolve, reject) => {
            pipeline(
              [collator, ...decorators, indexer],
              (error: NodeJS.ErrnoException | null) => {
                if (error) {
                  this.logger.error(
                    `Collating documents for ${type} failed: ${error}`,
                  );
                  reject(error);
                } else {
                  // Signal index pipeline completion!
                  this.logger.info(`Collating documents for ${type} succeeded`);
                  resolve();
                }
              },
            );
          });
        },
      });
    });

    return {
      scheduler,
    };
  }
}
