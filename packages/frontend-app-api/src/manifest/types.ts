/*
 * Copyright 2026 The Backstage Authors
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

/**
 * A build-time description of a frontend plugin or module.
 *
 * @alpha
 */
export interface FrontendFeatureManifest {
  manifestVersion: 1;
  type: 'plugin' | 'module';
  pluginId: string;
  title?: string;
  /**
   * True only when every rule for deferring a plugin passes. A deferrable
   * plugin only provides pages, APIs and extensions that output a React
   * element along with JSON data, and it provides at least one page or
   * element that loads the plugin when it is rendered.
   */
  deferrable: boolean;
  /** Why the plugin isn't deferrable, for the CLI report. */
  notDeferrableReason?: string;
  /** Names of the keys in plugin.routes / plugin.externalRoutes. */
  routes: string[];
  externalRoutes: string[];
  extensions: FrontendExtensionManifest[];
}

/**
 * A build-time description of a single extension.
 *
 * @alpha
 */
export interface FrontendExtensionManifest {
  /** Full extension ID, e.g. "page:my-plugin" or "page:my-plugin/settings". */
  id: string;
  /** Parsed from the ID prefix before ":". */
  kind?: string;
  attachTo:
    | { id: string; input: string }
    | Array<{ id: string; input: string }>;
  disabled: boolean;
  /** From configSchema.schema(), draft-07. */
  configSchema?: { [key: string]: unknown };
  /** Only for kind "page". Comes from running the factory once at build time. */
  page?: {
    path: string;
    title?: string;
    /** The key in plugin.routes whose RouteRef the page outputs. */
    routeRefName?: string;
  };
  /**
   * Only for extensions that output a React element but aren't pages that
   * attach to app/routes, for example entity content. Comes from running the
   * factory once at build time with the default config.
   */
  element?: {
    /**
     * The JSON values of all other outputs, keyed by extension data ID. A
     * route ref output is stored as `routeRefName` instead.
     */
    data: { [dataRefId: string]: unknown };
    /** The key in plugin.routes whose RouteRef the extension outputs. */
    routeRefName?: string;
    /**
     * Config keys that change the data outputs. Setting them in app-config
     * prevents the plugin from being deferred, since the stub can only output
     * the data from the default config. Other config is applied when the
     * plugin is loaded.
     */
    dataConfigKeys?: string[];
  };
}
