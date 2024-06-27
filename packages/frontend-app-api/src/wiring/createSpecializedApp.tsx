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

import React, { JSX, ReactNode } from 'react';
import { ConfigReader } from '@backstage/config';
import {
  AppTree,
  appTreeApiRef,
  componentsApiRef,
  coreExtensionData,
  createApiExtension,
  createThemeExtension,
  createTranslationExtension,
  FrontendFeature,
  iconsApiRef,
  RouteResolutionApi,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';
import { App } from '../extensions/App';
import { AppRoutes } from '../extensions/AppRoutes';
import { AppLayout } from '../extensions/AppLayout';
import { AppNav } from '../extensions/AppNav';
import {
  AnyApiFactory,
  ApiHolder,
  appThemeApiRef,
  ConfigApi,
  configApiRef,
  IconComponent,
  featureFlagsApiRef,
  identityApiRef,
  AppTheme,
  errorApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { getAvailableFeatures } from './discovery';
import {
  ApiFactoryHolder,
  ApiFactoryRegistry,
  ApiProvider,
  ApiResolver,
  AppThemeSelector,
} from '@backstage/core-app-api';

// TODO: Get rid of all of these
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { isProtectedApp } from '@backstage/core-app-api/src/app/isProtectedApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '@backstage/core-app-api/src/app/AppThemeProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '@backstage/core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { LocalStorageFeatureFlags } from '@backstage/core-app-api/src/apis/implementations/FeatureFlagsApi/LocalStorageFeatureFlags';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '@backstage/core-app-api/src/apis/implementations/AppLanguageApi/AppLanguageSelector';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '@backstage/core-app-api/src/apis/implementations/TranslationApi/I18nextTranslationApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '@backstage/frontend-plugin-api/src/wiring/resolveExtensionDefinition';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { apis as defaultApis } from '@backstage/app-defaults/src/defaults';
import { DarkTheme, LightTheme } from '../extensions/themes';
import {
  oauthRequestDialogAppRootElement,
  alertDisplayAppRootElement,
} from '../extensions/elements';
import { extractRouteInfoFromAppNode } from '../routing/extractRouteInfoFromAppNode';
import {
  appLanguageApiRef,
  translationApiRef,
} from '@backstage/core-plugin-api/alpha';
import { CreateAppRouteBinder } from '../routing';
import { RouteResolver } from '../routing/RouteResolver';
import { resolveRouteBindings } from '../routing/resolveRouteBindings';
import { collectRouteIds } from '../routing/collectRouteIds';
import { createAppTree } from '../tree';
import {
  DefaultProgressComponent,
  DefaultErrorBoundaryComponent,
  DefaultNotFoundErrorPageComponent,
} from '../extensions/components';
import { InternalAppContext } from './InternalAppContext';
import { AppRoot } from '../extensions/AppRoot';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalBackstagePlugin } from '@backstage/frontend-plugin-api/src/wiring/createPlugin';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtensionOverrides } from '@backstage/frontend-plugin-api/src/wiring/createExtensionOverrides';
import { DefaultComponentsApi } from '../apis/implementations/ComponentsApi';
import { DefaultIconsApi } from '../apis/implementations/IconsApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { icons as defaultIcons } from '@backstage/app-defaults/src/defaults';
import { getBasePath } from '../routing/getBasePath';

const DefaultApis = defaultApis.map(factory => createApiExtension({ factory }));

export const builtinExtensions = [
  App,
  AppRoot,
  AppRoutes,
  AppNav,
  AppLayout,
  DefaultProgressComponent,
  DefaultErrorBoundaryComponent,
  DefaultNotFoundErrorPageComponent,
  LightTheme,
  DarkTheme,
  oauthRequestDialogAppRootElement,
  alertDisplayAppRootElement,
  ...DefaultApis,
].map(def => resolveExtensionDefinition(def));

function deduplicateFeatures(
  allFeatures: FrontendFeature[],
): FrontendFeature[] {
  // Start by removing duplicates by reference
  const features = Array.from(new Set(allFeatures));

  // Plugins are deduplicated by ID, last one wins
  const seenIds = new Set<string>();
  return features
    .reverse()
    .filter(feature => {
      if (feature.$$type !== '@backstage/BackstagePlugin') {
        return true;
      }
      if (seenIds.has(feature.id)) {
        return false;
      }
      seenIds.add(feature.id);
      return true;
    })
    .reverse();
}

/**
 * A source of dynamically loaded frontend features.
 *
 * @public
 */
export interface CreateAppFeatureLoader {
  /**
   * Returns name of this loader. suitable for showing to users.
   */
  getLoaderName(): string;

  /**
   * Loads a number of features dynamically.
   */
  load(options: { config: ConfigApi }): Promise<{
    features: FrontendFeature[];
  }>;
}

/**
 * Synchronous version of {@link createApp}, expecting all features and
 * config to have been loaded already.
 *
 * @public
 */
export function createSpecializedApp(options: {
  config?: ConfigApi;
  apiFactories: ApiFactoryHolder;
  root: JSX.Element;
  tree: AppTree;
  apis?: {
    [scope: ApiFactoryScope];
  };
}): { createRoot(): JSX.Element } {
  const { apiFactories, root, tree } = options;

  const discoveredFactories = new ApiFactoryRegistry();

  const pluginApis =
    tree.root.edges.attachments
      .get('apis')
      ?.map(e => e.instance?.getData(createApiExtension.factoryDataRef))
      .filter((x): x is AnyApiFactory => !!x) ?? [];

  const themeExtensions =
    tree.root.edges.attachments
      .get('themes')
      ?.map(e => e.instance?.getData(createThemeExtension.themeDataRef))
      .filter((x): x is AppTheme => !!x) ?? [];

  const translationResources =
    tree.root.edges.attachments
      .get('translations')
      ?.map(e =>
        e.instance?.getData(createTranslationExtension.translationDataRef),
      )
      .filter(
        (x): x is typeof createTranslationExtension.translationDataRef.T => !!x,
      ) ?? [];

  for (const factory of pluginApis) {
    discoveredFactories.register('default', factory);
  }

  discoveredFactories.register('static', {
    api: appThemeApiRef,
    deps: {},
    // TODO: add extension for registering themes
    factory: () => AppThemeSelector.createWithStorage(themeExtensions),
  });

  discoveredFactories.register('static', {
    api: translationApiRef,
    deps: { languageApi: appLanguageApiRef },
    factory: ({ languageApi }) =>
      I18nextTranslationApi.create({
        languageApi,
        resources: translationResources,
      }),
  });

  const appFactories = [
    ...discoveredFactories.getAllApis(),
    ...apiFactories.getAllApis(),
  ];

  ApiResolver.validateFactories(appFactories, appFactories.getAllApis());
  const apiHolder = new ApiResolver(appFactories);

  // const AppComponent = () => (
  //   <ApiProvider apis={apiHolder}>
  //     <AppThemeProvider>
  //       <InternalAppContext.Provider
  //         value={{ appIdentityProxy, routeObjects: routeInfo.routeObjects }}
  //       >
  //         {rootEl}
  //       </InternalAppContext.Provider>
  //     </AppThemeProvider>
  //   </ApiProvider>
  // );

  const AppComponent = () => <ApiProvider apis={apiHolder}>{root}</ApiProvider>;

  return {
    createRoot() {
      return <AppComponent />;
    },
  };
}
