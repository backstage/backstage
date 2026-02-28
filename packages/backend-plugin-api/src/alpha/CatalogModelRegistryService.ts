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
import { z, AnyZodObject } from 'zod';

/**
 * Options for registering annotation schemas on a specific entity kind.
 *
 * @alpha
 */
export type CatalogModelRegistryAnnotationOptions<
  TSchema extends AnyZodObject,
> = {
  entityKind: string;
  annotations: (zod: typeof z) => TSchema;
};

/**
 * Service for registering catalog model extensions such as annotations.
 * Plugin-scoped: each plugin gets its own instance, automatically namespaced
 * by the plugin ID.
 *
 * See {@link https://backstage.io/docs/backend-system/core-services/catalog-model-registry | the service docs}
 * for more information.
 *
 * @alpha
 */
export interface CatalogModelRegistryService {
  registerAnnotations<TSchema extends AnyZodObject>(
    options: CatalogModelRegistryAnnotationOptions<TSchema>,
  ): void;
}
