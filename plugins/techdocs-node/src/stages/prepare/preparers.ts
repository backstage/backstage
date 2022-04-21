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
import { parseReferenceAnnotation } from '../../helpers';
import { DirectoryPreparer } from './dir';
import { UrlPreparer } from './url';
import {
  PreparerBase,
  PreparerBuilder,
  PreparerConfig,
  RemoteProtocol,
} from './types';

/**
 * Collection of docs preparers (dir and url)
 * @public
 */
export class Preparers implements PreparerBuilder {
  private preparerMap = new Map<RemoteProtocol, PreparerBase>();

  /**
   * Returns a generators instance containing a generator for TechDocs
   * @public
   * @param backstageConfig - A Backstage configuration
   * @param preparerConfig - Options to configure preparers
   */
  static async fromConfig(
    backstageConfig: Config,
    { logger, reader }: PreparerConfig,
  ): Promise<PreparerBuilder> {
    const preparers = new Preparers();

    const urlPreparer = UrlPreparer.fromConfig({ reader, logger });
    preparers.register('url', urlPreparer);

    /**
     * Dir preparer is a syntactic sugar for users to define techdocs-ref annotation.
     * When using dir preparer, the docs will be fetched using URL Reader.
     */
    const directoryPreparer = DirectoryPreparer.fromConfig(backstageConfig, {
      logger,
      reader,
    });
    preparers.register('dir', directoryPreparer);

    return preparers;
  }

  /**
   * Register a preparer in the preparers collection
   * @param protocol - url or dir to associate with preparer
   * @param preparer - The preparer instance to set
   */
  register(protocol: RemoteProtocol, preparer: PreparerBase) {
    this.preparerMap.set(protocol, preparer);
  }

  /**
   * Returns the preparer for a given TechDocs entity
   * @param entity - A TechDocs entity instance
   * @returns
   */
  get(entity: Entity): PreparerBase {
    const { type } = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      entity,
    );
    const preparer = this.preparerMap.get(type);

    if (!preparer) {
      throw new Error(`No preparer registered for type: "${type}"`);
    }

    return preparer;
  }
}
