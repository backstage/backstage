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

interface Logger {
  log(message: string): void;
  child(fields: { [name: string]: string }): Logger;
}

interface ConfigApi {
  getString(key: string): string;
}

interface HttpRouterApi {
  get(path: string): void;
}

export const loggerApiRef = createServiceRef<Logger>({
  id: 'core.logger',
});

export const configApiRef = createServiceRef<ConfigApi>({
  id: 'core.config',
});

export const httpRouterApiRef = createServiceRef<HttpRouterApi>({
  id: 'core.apiRouter',
});

// export type PluginEnvironment = {
//   logger: Logger;
//   cache: PluginCacheManager;
//   database: PluginDatabaseManager;
//   config: Config;
//   reader: UrlReader;
//   discovery: PluginEndpointDiscovery;
//   tokenManager: TokenManager;
//   permissions: PermissionEvaluator | PermissionAuthorizer;
//   scheduler: PluginTaskScheduler;
// };
