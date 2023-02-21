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
import type { CatalogClient } from '@backstage/catalog-client';
import type { CompoundEntityRef } from '@backstage/catalog-model';
import type { ResolverContext as CommonResolverContext } from '@backstage/plugin-graphql-common';

export type PromiseOrValue<T> = T | Promise<T>;

/** @public */
export interface ResolverContext extends CommonResolverContext {
  catalog: CatalogClient;
  refToId?: (ref: CompoundEntityRef | string) => string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type Logger = Record<LogLevel, (...args: any[]) => void>;
