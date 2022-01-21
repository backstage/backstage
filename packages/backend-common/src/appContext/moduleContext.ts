/*
 * Copyright 2022 The Backstage Authors
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
import { createDependencyRef } from '@backstage/app-context-common';
import { PluginEndpointDiscovery } from '../discovery';
import { UrlReader } from '../reading';
import { TokenManager } from '../tokens';
import { DatabaseManager } from '../database';
import { CacheManager } from '../cache';

export const urlReaderDep = createDependencyRef<UrlReader>(
  Symbol.for('@backstage/backend-common.UrlReader'),
);
export const tokenManagerDep = createDependencyRef<TokenManager>(
  Symbol.for('@backstage/backend-common.TokenManager'),
);

export const databaseManagerDep = createDependencyRef<DatabaseManager>(
  Symbol.for('@backstage/backend-common.DatabaseManager'),
);
export const cacheManagerDep = createDependencyRef<CacheManager>(
  Symbol.for('@backstage/backend-common.CacheManager'),
);
export const pluginEndpointDiscoveryDep =
  createDependencyRef<PluginEndpointDiscovery>(
    Symbol.for('@backstage/backend-common.PluginEndpointDiscovery'),
  );
