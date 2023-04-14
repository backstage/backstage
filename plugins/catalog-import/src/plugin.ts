/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import {
  AnyApiFactory,
  AnyApiRef,
  BackstagePlugin,
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogImportApiRef, CatalogImportClient } from './api';
import { ImportInfoCard } from './components/ImportInfoCard';
import { ImportPage } from './components/ImportPage';

export const rootRouteRef = createRouteRef({
  id: 'catalog-import',
});

const catalogImportClient = createApiFactory({
  api: catalogImportApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    scmAuthApi: scmAuthApiRef,
    identityApi: identityApiRef,
    scmIntegrationsApi: scmIntegrationsApiRef,
    catalogApi: catalogApiRef,
    configApi: configApiRef,
  },
  factory: ({
    discoveryApi,
    scmAuthApi,
    identityApi,
    scmIntegrationsApi,
    catalogApi,
    configApi,
  }) =>
    new CatalogImportClient({
      discoveryApi,
      scmAuthApi,
      scmIntegrationsApi,
      identityApi,
      catalogApi,
      configApi,
    }),
});

/**
 * A plugin that helps the user in importing projects and YAML files into the
 * catalog.
 *
 * @public
 */
export const catalogImportPlugin = createPlugin({
  id: 'catalog-import',
  apis: [catalogImportClient],
  routes: {
    importPage: rootRouteRef,
  },
});

/**
 * The page for importing projects and YAML files into the catalog.
 *
 * @public
 */
export const CatalogImportPage = catalogImportPlugin.provide(
  createRoutableExtension({
    name: 'CatalogImportPage',
    component: () => import('./components/ImportPage').then(m => m.ImportPage),
    mountPoint: rootRouteRef,
  }),
);

// // v1 scaffolder plugin
// interface V1ScaffExt {
//   name: string;
//   type: "scaffolder",
//   component: () => JSX.Element; // the input field shown
//   fieldName: string;
// }

// // v2 scaffolder plugin
// interface V2ScaffExt {
//   name: string;
//   type: "scaffolder",
//   component: () => JSX.Element; // the input field shown
//   keyName: string;
//   autocompleteSuggestion: [string];
// }

// interface Component {
//   name: string;
//   // CustomFieldExtension
//   type: string;
//   component: () => JSX.Element;
// }

// // v1 scaffolder plugin runtime
// const component: any = extensions[0];
// // do some validation to make sure it fits
// // ???
// const component: V1ScaffExt;

// interface RegistryComponent<T> {
//   type: T.type,
//   component: <></>,
//   facts: T
// }

// interface PluginManifest {
//   author: string;
//   license: string;
//   apis: AnyApiRef[];
//   pages: [() => JSX.Element];
//   plugins: BackstagePlugin[];
//   searchComponents: [() => [string, JSX.Element];
//   catalogEntityPageComponents: [() => JSX.Element];
//   techDocsAddons?: [() => {type: string, index: SomeType[], bork: foo, JSX.Element}];
//   homepageComponents?: [() => JSX.Element];

//   components?: Component[];
// };

// const manifest: PluginManifest = {
//   author: '',
//   license: 'GPLv2',
//   // Should this be part of the manifest or rather take it from the `package.json`?
//   version: 1,
//   // Alternative: requiresAtLeast: '1.2.3'  /* for Backstage Version */
//   supportedQuickstartVersion: '~1.4.0',
//   plugins: [catalogImportPlugin],
//   apis: [catalogImportApiRef],
//   pages: [CatalogImportPage],
// };

// Generic type for a plugin manifest

/*
const [components] = useComponents({scope: 'EntityPage');

const [registry] = useRegistry();
const AboutCardThing = registry.get({scope: 'EntityPage', name: 'AboutCard'});
const propsSchema = AboutCard.propsSchema;
const AboutCard = AboutCardThing.component;
return (
  <>
    <AboutCard props={propsFromConfigBackedByDatabase}/>
  </>
)
*/

/*
 plugin.yaml <-- package.json????
   name: Catalog
   description: This is the catalog plugin, you want it
   iconUrl: ...
   authorUrl: ...
   compatibleBackstageVersions: '~1.2.3'
 */

// *************************************
// ************* route *****************
// *************************************

export type PluginRoute = {
  path: string;
  component: React.ComponentType;
};

function createPluginRoute(options: {
  path: string;
  component: React.ComponentType;
}): PluginRoute {
  return { ...options };
}

// *************************************
// ************* component *************
// *************************************

export type PluginComponent = {
  name: string;
  description?: string;
  scope: string;
  component: React.ComponentType;
  // optionsSchema?: any; // JSONSchema
};

function createPluginComponent(options: {
  name: string;
  description?: string;
  scope: string;
  component: React.ComponentType;
}): PluginComponent {
  return { ...options };
}

// *************************************
// ************* plugin ****************
// *************************************

export const manifest = createPluginManifest({
  id: 'catalog-import',
  pages: [CatalogImportPage],
  apis: [catalogImportClient],
  components: [
    createPluginComponent({
      name: 'foo',
      scope: 'EntityPage',
      component: ImportPage,
    }),
  ],
});

export type PluginManifest = {
  id: string;
  pages?: [() => JSX.Element];
  apis?: AnyApiFactory[];
  components?: PluginComponent;
  externalRouteBindings?: {
    createComponent: { bindByRouteRefId: 'scaffolder' };
  };
};

export type PluginManifestConfig = {
  id: string;
  pages?: [() => JSX.Element];
  apis?: AnyApiFactory[];
  components?: PluginComponent;
  externalRouteBindings?: {
    createComponent: { bindByRouteRefId: 'scaffolder' };
  };
};

export function createPluginManifest(
  config: PluginManifestConfig,
): PluginManifest {
  return {
    ...config,
  };
}

export default manifest;
