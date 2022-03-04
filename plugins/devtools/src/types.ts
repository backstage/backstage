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

import type {
  BackstagePlugin,
  ExternalRouteRef,
  RouteRef,
} from '@backstage/core-plugin-api';

export interface DevToolsPluginRouteInfoPlugin {
  name: string;
  plugin: BackstagePlugin;
}

export interface DevToolsPluginRouteInfo {
  routeRefMap: Map<RouteRef, DevToolsPluginRouteInfoPlugin>;
  externalRouteRefMap: Map<ExternalRouteRef, DevToolsPluginRouteInfoPlugin>;
}

export interface DevToolPlugin {
  plugin: BackstagePlugin<any, any>;
  id: string;
  featureFlags: DevToolFeatureFlag[];
  providedApiIds: string[];
  apiIds: string[];
  parsedApis: DevToolApi[];
}

export interface DevToolPlugins extends DevToolsPluginRouteInfo {
  plugins: DevToolPlugin[];
  apiMap: Map<string, DevToolPlugin>;
}

export interface DevToolApiDependency {
  id: string;
  name: string;
}

export interface DevToolApi {
  id: string;
  dependencies: DevToolApiDependency[];
  dependents: DevToolApiDependency[];
}

export interface DevToolApiWithPlugin extends DevToolApi {
  plugin?: DevToolPlugin;
  loaded: boolean;
}

export interface DevToolFeatureFlag {
  name: string;
}
