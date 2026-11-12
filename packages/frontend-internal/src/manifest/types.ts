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
 * The version of the manifest format. A manifest with any other version is
 * ignored, and the package it describes is loaded together with the app.
 */
export const FRONTEND_MANIFEST_VERSION = 1;

/**
 * A build-time description of a frontend plugin or module, created by static
 * analysis of its source code.
 */
export interface FrontendFeatureManifest {
  manifestVersion: typeof FRONTEND_MANIFEST_VERSION;
  type: 'plugin' | 'module';
  pluginId: string;
  title?: string;
  /**
   * True only when every rule for deferring a plugin passes. A deferrable
   * plugin only provides pages and extensions that output a React element
   * along with JSON data, and it provides at least one page or element that
   * loads the plugin when it is rendered. Plugins that provide APIs are never
   * deferrable.
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
 */
export interface FrontendExtensionManifest {
  /** Full extension ID, e.g. "page:my-plugin" or "page:my-plugin/settings". */
  id: string;
  /** The kind of the extension, which is the part of the ID before ":". */
  kind?: string;
  attachTo:
    | { id: string; input: string }
    | Array<{ id: string; input: string }>;
  disabled: boolean;
  /** Only for pages that attach to app/routes. */
  page?: {
    path: string;
    title?: string;
    /** The key in plugin.routes whose RouteRef the page outputs. */
    routeRefName?: string;
  };
  /**
   * Only for extensions that output a React element but aren't pages that
   * attach to app/routes. The stub of such an extension outputs this data
   * as it was declared in the source code, which means that it can't apply
   * any config from `app.extensions`.
   */
  element?: {
    /**
     * The JSON values of all other outputs, keyed by extension data ID. A
     * route ref output is stored as `routeRefName` instead.
     */
    data: { [dataRefId: string]: unknown };
    /** The key in plugin.routes whose RouteRef the extension outputs. */
    routeRefName?: string;
  };
}

/**
 * A plugin that is only loaded once one of its pages or elements is
 * rendered.
 */
export type DeferredFrontendFeature = {
  /** The package name of the plugin. */
  name: string;
  /** The build-time description of the plugin. */
  manifest: FrontendFeatureManifest;
  /** Loads the plugin, which must be the default export. */
  load: () => Promise<{ default: unknown }>;
};
