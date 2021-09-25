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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { CatalogEntitiesRequest } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { DocumentCollatorFactory } from '@backstage/search-common';
import { Readable } from 'stream';
import { DefaultCatalogCollator } from './DefaultCatalogCollator';

type FactoryOptions = {
  discovery: PluginEndpointDiscovery;
  filter?: CatalogEntitiesRequest['filter'];
};

export class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'software-catalog';

  private options: any;
  private config: Config;

  private constructor(config: Config, options: FactoryOptions) {
    this.config = config;
    this.options = options;
  }

  static fromConfig(config: Config, options: FactoryOptions) {
    return new DefaultCatalogCollatorFactory(config, options);
  }

  async getCollator() {
    const collator = DefaultCatalogCollator.fromConfig(
      this.config,
      this.options,
    );
    return Readable.from(collator.execute());
  }
}
