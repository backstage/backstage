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

const knownBackendPluginIds = [
  'app',
  'auth',
  'catalog',
  'events',
  'kubernetes',
  'notifications',
  'permission',
  'proxy',
  'scaffolder',
  'search',
  'signals',
  'techdocs',
];

// Only includes plugin IDs that have a corresponding frontend package; some plugins are backend-only and not listed here.
const knownFrontendPluginIds = [
  'app',
  'auth',
  'catalog',
  'kubernetes',
  'notifications',
  'scaffolder',
  'search',
  'signals',
  'techdocs',
];

/**
 * Maps known plugin IDs to their corresponding backend package names.
 */
export const knownBackendPluginPackageNameByPluginId: Record<string, string> =
  Object.fromEntries(
    knownBackendPluginIds.map(pluginId => [
      pluginId,
      `@backstage/plugin-${pluginId}-backend`,
    ]),
  );

/**
 * Maps known plugin IDs to their corresponding frontend package names.
 */
export const knownFrontendPluginPackageNameByPluginId: Record<string, string> =
  Object.fromEntries(
    knownFrontendPluginIds.map(pluginId => [
      pluginId,
      `@backstage/plugin-${pluginId}`,
    ]),
  );
