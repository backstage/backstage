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
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';

import { catalogPlugin } from '@internal/plugin-catalog-customized';

import { catalogImportPlugin } from '@backstage/plugin-catalog-import';
import { GraphiQLPage } from '@backstage/plugin-graphiql';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import React, { ComponentType } from 'react';
import { Route } from 'react-router-dom';
import mapValues from 'lodash/mapValues';

/* core */

const discoverPackages = async () => {
  // stub for now, deferring package discovery til later
  return ['@backstage/plugin-graphiql'];
};

function createApp() {}

function createPlugin() {}

type AnyExtensionDataMap = Record<string, ExtensionDataRef<any>>;

type ExtensionDataBind<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: (value: TData[K]['T']) => void;
};

type ExtensionDataValue<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: TData[K]['T'];
};

interface CreateExtensionOptions<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
> {
  inputs?: TPoint;
  output: TData;
  factory(options: {
    bind: ExtensionDataBind<TData>;
    config?: unknown;
    inputs: {
      [pointName in keyof TPoint]: ExtensionDataValue<
        TPoint[pointName]['extensionData']
      >[];
    };
  }): void;
}

interface Extension {
  $$type: 'extension';
  inputs: Record<string, { extensionData: AnyExtensionDataMap }>;
  output: AnyExtensionDataMap;
  factory(options: {
    bind: ExtensionDataBind<AnyExtensionDataMap>;
    config?: unknown;
    inputs: Record<string, Array<Record<string, unknown>>>;
  }): void;
}

function createExtension<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
>(options: CreateExtensionOptions<TData, TPoint>): Extension {
  return { ...options, $$type: 'extension', inputs: options.inputs ?? {} };
}

interface ExtensionDataRef<T> {
  id: string;
  T: T;
  $$type: 'extension-data';
}

function createExtensionDataRef<T>(id: string) {
  return { id, $$type: 'extension-data' } as ExtensionDataRef<T>;
}

const coreExtensionData = {
  reactComponent: createExtensionDataRef<ComponentType>('core.reactComponent'),
  routePath: createExtensionDataRef<string>('core.routing.path'),
};

type ExtensionDataId = string;

interface ExtensionInstance {
  id: string;
  data: Map<ExtensionDataId, unknown>;
  $$type: 'extension-instance';
}

function createExtensionInstance(options: {
  id: string;
  extension: Extension;
  config: unknown;
  attachments: Record<string, ExtensionInstance[]>;
}): ExtensionInstance {
  const { extension, config, attachments } = options;
  const extensionData = new Map<ExtensionDataId, unknown>();
  extension.factory({
    config,
    bind: mapValues(extension.output, ref => {
      return (value: unknown) => extensionData.set(ref.id, value);
    }),
    inputs: mapValues(
      extension.inputs,
      ({ extensionData: pointData }, inputName) => {
        // TODO: validation
        return (attachments[inputName] ?? []).map(attachment =>
          mapValues(pointData, ref => attachment.data.get(ref.id)),
        );
      },
    ),
  });
  return { id: options.id, data: extensionData, $$type: 'extension-instance' };
}

/* graphiql package */

const GraphiqlRoute = createExtension({
  inputs: {
    extensionData: {
      component: coreExtensionData.reactComponent,
    },
  },
  factory({ bind, points }) {
    // ...
  },
});

/* app.tsx */

const app = createApp({
  // bindRoutes({ bind }) {
  //   bind(catalogPlugin.externalRoutes, {
  //     createComponent: scaffolderPlugin.routes.root,
  //   });
  //   bind(scaffolderPlugin.externalRoutes, {
  //     registerComponent: catalogImportPlugin.routes.importPage,
  //   });
  // },
});

const routes = (
  <FlatRoutes>
    {/* <Route path="/" element={<Navigate to="catalog" />} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
          <Grid container spacing={3} alignItems="stretch">
            <Grid item md={6} xs={12}>
              <EntityAboutCard variant="gridItem" />
            </Grid>

            <Grid item md={4} xs={12}>
              <EntityLinksCard />
            </Grid>
          </Grid>
        </EntityLayout.Route>

        <EntityLayout.Route path="/todos" title="TODOs">
          <EntityTodoContent />
        </EntityLayout.Route>
      </EntityLayout>
    </Route>
    <Route
      path="/catalog-import"
      element={
          <CatalogImportPage />
      }
    /> */}
    {/* <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    /> */}
    <Route path="/graphiql" element={<GraphiQLPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    {/* <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog /> */}
    <AppRouter>{routes}</AppRouter>
  </>,
);
