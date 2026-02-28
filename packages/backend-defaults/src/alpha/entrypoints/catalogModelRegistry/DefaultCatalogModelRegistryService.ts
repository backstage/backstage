/*
 * Copyright 2025 The Backstage Authors
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
import { PluginMetadataService } from '@backstage/backend-plugin-api';
import { z, AnyZodObject } from 'zod';
import {
  CatalogModelRegistryService,
  CatalogModelRegistryAnnotationOptions,
} from '@backstage/backend-plugin-api/alpha';
import { CatalogModelStore } from './CatalogModelStore';

export class DefaultCatalogModelRegistryService
  implements CatalogModelRegistryService
{
  private readonly store: CatalogModelStore;
  private readonly metadata: PluginMetadataService;

  constructor(store: CatalogModelStore, metadata: PluginMetadataService) {
    this.store = store;
    this.metadata = metadata;
  }

  registerAnnotations<TSchema extends AnyZodObject>(
    options: CatalogModelRegistryAnnotationOptions<TSchema>,
  ): void {
    const schema = options.annotations(z);
    this.store.addAnnotations({
      pluginId: this.metadata.getId(),
      entityKind: options.entityKind,
      schema,
    });
  }
}
