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

// These types describe the same JSON format as the manifest types in
// @internal/frontend, which the app reads at runtime. They are kept separate
// since the CLI can't depend on frontend packages. Any change to the format
// must bump FRONTEND_MANIFEST_VERSION in both places.

/** The version of the manifest format of a frontend plugin or module. */
export const FRONTEND_MANIFEST_VERSION = 1;

/** The version of the envelope of the Backstage manifest. */
export const BACKSTAGE_MANIFEST_VERSION = 1;

/**
 * The name of the Backstage manifest file, which is written to the `dist`
 * folder of a package, and next to `mf-manifest.json` in the output directory
 * of a module federation remote.
 */
export const BACKSTAGE_MANIFEST_FILE_NAME = 'backstage-manifest.json';

export interface FrontendExtensionManifest {
  id: string;
  kind?: string;
  attachTo:
    | { id: string; input: string }
    | Array<{ id: string; input: string }>;
  disabled: boolean;
  page?: {
    path: string;
    title?: string;
    routeRefName?: string;
  };
  element?: {
    data: { [dataRefId: string]: unknown };
    routeRefName?: string;
  };
}

export interface FrontendFeatureManifest {
  manifestVersion: typeof FRONTEND_MANIFEST_VERSION;
  type: 'plugin' | 'module';
  pluginId: string;
  title?: string;
  deferrable: boolean;
  notDeferrableReason?: string;
  routes: string[];
  externalRoutes: string[];
  extensions: FrontendExtensionManifest[];
}

/**
 * The section of the Backstage manifest that describes the frontend plugins
 * and modules of a package, keyed by the name of the exposed module, for
 * example "." or "./alpha".
 */
export interface FrontendPackageManifest {
  exposedModules: { [name: string]: FrontendFeatureManifest };
}

/**
 * The contents of `backstage-manifest.json`. It has one optional section for
 * each kind of package that the manifest can describe.
 */
export interface BackstageManifest {
  manifestVersion: typeof BACKSTAGE_MANIFEST_VERSION;
  packageName: string;
  role: string;
  frontend?: FrontendPackageManifest;
}
