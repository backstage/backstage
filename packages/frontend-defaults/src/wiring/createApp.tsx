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
import { isProtectedApp } from '../../../core-app-api/src/app/isProtectedApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '../../../core-app-api/src/app/AppThemeProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { LocalStorageFeatureFlags } from '../../../core-app-api/src/apis/implementations/FeatureFlagsApi/LocalStorageFeatureFlags';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../../core-app-api/src/app/overrideBaseUrlConfigs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi/AppLanguageSelector';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi/I18nextTranslationApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveExtensionDefinition } from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { apis as defaultApis } from '../../../app-defaults/src/defaults';
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
import { toInternalBackstagePlugin } from '../../../frontend-plugin-api/src/wiring/createPlugin';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtensionOverrides } from '../../../frontend-plugin-api/src/wiring/createExtensionOverrides';
import { DefaultComponentsApi } from '../apis/implementations/ComponentsApi';
import { DefaultIconsApi } from '../apis/implementations/IconsApi';
import { stringifyError } from '@backstage/errors';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { icons as defaultIcons } from '../../../app-defaults/src/defaults';
import { getBasePath } from '../routing/getBasePath';
import { createSpecializedApp } from '@backstage/frontend-app-api';

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

/** @public */
export function createApp(options?: {
  icons?: { [key in string]: IconComponent };
  features?: (FrontendFeature | CreateAppFeatureLoader)[];
  configLoader?: () => Promise<{ config: ConfigApi }>;
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;
  /**
   * The component to render while loading the app (waiting for config, features, etc)
   *
   * Is the text "Loading..." by default.
   * If set to "null" then no loading fallback component is rendered.   *
   */
  loadingComponent?: ReactNode;
}): {
  createRoot(): JSX.Element;
} {
  let suspenseFallback = options?.loadingComponent;
  if (suspenseFallback === undefined) {
    suspenseFallback = 'Loading...';
  }

  async function appLoader() {
    const config =
      (await options?.configLoader?.().then(c => c.config)) ??
      ConfigReader.fromConfigs(
        overrideBaseUrlConfigs(defaultConfigLoaderSync()),
      );

    const discoveredFeatures = getAvailableFeatures(config);

    const providedFeatures: FrontendFeature[] = [];
    for (const entry of options?.features ?? []) {
      if ('load' in entry) {
        try {
          const result = await entry.load({ config });
          providedFeatures.push(...result.features);
        } catch (e) {
          throw new Error(
            `Failed to read frontend features from loader '${entry.getLoaderName()}', ${stringifyError(
              e,
            )}`,
          );
        }
      } else {
        providedFeatures.push(entry);
      }
    }

    const features = deduplicateFeatures([
      ...discoveredFeatures,
      ...providedFeatures,
    ]);

    const tree = createAppTree({
      features,
      builtinExtensions,
      config,
    });

    const routeBindings = resolveRouteBindings(
      options?.bindRoutes,
      config,
      collectRouteIds(features),
    );

    const appIdentityProxy = new AppIdentityProxy();

    const routeInfo = extractRouteInfoFromAppNode(tree.root);

    const apiFactories = createApiFactories(
      tree,
      config,
      appIdentityProxy,
      new RouteResolver(
        routeInfo.routePaths,
        routeInfo.routeParents,
        routeInfo.routeObjects,
        routeBindings,
        getBasePath(config),
      ),
      options?.icons,
    );

    if (isProtectedApp()) {
      const discoveryApi = apiFactories.get(discoveryApiRef);
      const errorApi = apiFactories.get(errorApiRef);
      const fetchApi = apiFactories.get(fetchApiRef);
      if (!discoveryApi || !errorApi || !fetchApi) {
        throw new Error(
          'App is running in protected mode but missing required APIs',
        );
      }
      appIdentityProxy.enableCookieAuth({
        discoveryApi,
        errorApi,
        fetchApi,
      });
    }

    const app = createSpecializedApp({
      config,
      apiFactories,
      tree,
    }).createRoot();

    return { default: () => app };
  }

  return {
    createRoot() {
      const LazyApp = React.lazy(appLoader);
      return (
        <React.Suspense fallback={suspenseFallback}>
          <LazyApp />
        </React.Suspense>
      );
    },
  };
}

function createApiFactories(
  tree: AppTree,
  configApi: ConfigApi,
  appIdentityProxy: AppIdentityProxy,
  routeResolutionApi: RouteResolutionApi,
  icons?: { [key in string]: IconComponent },
): ApiFactoryHolder {
  const factoryRegistry = new ApiFactoryRegistry();

  // TODO: properly discovery feature flags, maybe rework the whole thing
  factoryRegistry.register('default', {
    api: featureFlagsApiRef,
    deps: {},
    factory: () => new LocalStorageFeatureFlags(),
  });

  factoryRegistry.register('static', {
    api: identityApiRef,
    deps: {},
    factory: () => appIdentityProxy,
  });

  factoryRegistry.register('static', {
    api: appTreeApiRef,
    deps: {},
    factory: () => ({
      getTree: () => ({ tree }),
    }),
  });

  factoryRegistry.register('static', {
    api: routeResolutionApiRef,
    deps: {},
    factory: () => routeResolutionApi,
  });

  factoryRegistry.register('static', {
    api: componentsApiRef,
    deps: {},
    factory: () => DefaultComponentsApi.fromTree(tree),
  });

  factoryRegistry.register('static', {
    api: iconsApiRef,
    deps: {},
    factory: () => new DefaultIconsApi({ ...defaultIcons, ...icons }),
  });

  factoryRegistry.register('static', {
    api: appLanguageApiRef,
    deps: {},
    factory: () => AppLanguageSelector.createWithStorage(),
  });

  factoryRegistry.register('static', {
    api: configApiRef,
    deps: {},
    factory: () => configApi,
  });

  factoryRegistry.register('static', {
    api: appLanguageApiRef,
    deps: {},
    factory: () => AppLanguageSelector.createWithStorage(),
  });

  return factoryRegistry;
}
