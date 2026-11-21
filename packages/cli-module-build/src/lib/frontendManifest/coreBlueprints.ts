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

import { FrontendExtensionManifest } from './types';

/** The package that the supported blueprints are imported from. */
export const CORE_BLUEPRINTS_PACKAGE = '@backstage/frontend-plugin-api';

/** The ID of the extension that pages are attached to. */
export const APP_ROUTES = { id: 'app/routes', input: 'routes' };

const ROUTE_PATH_DATA_ID = 'core.routing.path';
const TITLE_DATA_ID = 'core.title';

/** The default attachment point of a blueprint. */
export type BlueprintAttachTo =
  | { id: string; input: string }
  | { relative: { kind?: string; name?: string }; input: string };

/** How a param of a blueprint is read from the source of an extension. */
type ParamSpec = {
  /**
   * The type of the param. Params of the type `string` must be string
   * literals, and `routeRef` params are matched against the plugin routes.
   * Params of the type `ignored` only exist to be used by the loaded plugin.
   */
  type: 'string' | 'routeRef' | 'ignored';
  required?: boolean;
};

/** The params of an extension that are read from its source. */
export interface ReadBlueprintParams {
  path?: string;
  title?: string;
  /** The name of the plugin route that the route ref of the extension is */
  routeRefName?: string;
}

/**
 * A blueprint of `@backstage/frontend-plugin-api` that can be deferred. The
 * manifest of an extension made with one is created from its params, without
 * running the blueprint factory.
 */
export type CoreBlueprint = {
  kind: string;
  attachTo: BlueprintAttachTo;
} & (
  | {
      type: 'api';
    }
  | {
      type: 'page' | 'element';
      /** The params that the blueprint accepts, any other param is rejected */
      params: { [name: string]: ParamSpec };
      /** Whether the route ref must be one of the routes of the plugin */
      routeRefIsPluginRoute: boolean;
      /** Creates the part of the manifest that depends on the blueprint */
      createManifest(
        params: ReadBlueprintParams,
      ): Pick<FrontendExtensionManifest, 'page' | 'element'>;
    }
);

/**
 * The blueprints that extensions can be deferred with, keyed by the name of
 * their export. Extensions made with any other blueprint are not deferrable,
 * since their outputs can't be known without running the blueprint.
 */
export const CORE_BLUEPRINTS: { [exportName: string]: CoreBlueprint } = {
  ApiBlueprint: {
    type: 'api',
    kind: 'api',
    attachTo: { id: 'root', input: 'apis' },
  },
  PageBlueprint: {
    type: 'page',
    kind: 'page',
    attachTo: APP_ROUTES,
    params: {
      path: { type: 'string', required: true },
      title: { type: 'string' },
      routeRef: { type: 'routeRef' },
      loader: { type: 'ignored' },
      noHeader: { type: 'ignored' },
    },
    routeRefIsPluginRoute: false,
    // The path and title config of a page are applied by its stand-in
    createManifest: ({ path, title, routeRefName }) => ({
      page: {
        path: path!,
        ...(title !== undefined ? { title } : {}),
        ...(routeRefName ? { routeRefName } : {}),
      },
    }),
  },
  SubPageBlueprint: {
    type: 'element',
    kind: 'sub-page',
    attachTo: { relative: { kind: 'page' }, input: 'pages' },
    params: {
      path: { type: 'string', required: true },
      title: { type: 'string', required: true },
      routeRef: { type: 'routeRef' },
      loader: { type: 'ignored', required: true },
    },
    routeRefIsPluginRoute: true,
    createManifest: ({ path, title, routeRefName }) => ({
      element: {
        data: {
          [ROUTE_PATH_DATA_ID]: path,
          [TITLE_DATA_ID]: title,
        },
        ...(routeRefName ? { routeRefName } : {}),
        // The stand-in of a sub-page applies its path and title config
        configOutputs: {
          path: { dataRefId: ROUTE_PATH_DATA_ID, type: 'string' },
          title: { dataRefId: TITLE_DATA_ID, type: 'string' },
        },
      },
    }),
  },
};
