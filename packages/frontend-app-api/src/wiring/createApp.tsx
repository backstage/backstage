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

import React, { JSX } from 'react';
import { ConfigReader, Config } from '@backstage/config';
import {
  BackstagePlugin,
  coreExtensionData,
  ExtensionDataRef,
  ExtensionOverrides,
} from '@backstage/frontend-plugin-api';
import { Core } from '../extensions/Core';
import { CoreRoutes } from '../extensions/CoreRoutes';
import { CoreLayout } from '../extensions/CoreLayout';
import { CoreNav } from '../extensions/CoreNav';
import {
  createExtensionInstance,
  ExtensionInstance,
} from './createExtensionInstance';
import {
  ExtensionInstanceParameters,
  mergeExtensionParameters,
  readAppExtensionParameters,
} from './parameters';
import {
  AnyApiFactory,
  ApiHolder,
  AppComponents,
  AppContext,
  appThemeApiRef,
  ConfigApi,
  configApiRef,
  IconComponent,
  RouteRef,
  BackstagePlugin as LegacyBackstagePlugin,
  featureFlagsApiRef,
  attachComponentData,
  useRouteRef,
  identityApiRef,
  AppTheme,
} from '@backstage/core-plugin-api';
import { getAvailableFeatures } from './discovery';
import {
  ApiFactoryRegistry,
  ApiProvider,
  ApiResolver,
  AppRouteBinder,
  AppThemeSelector,
} from '@backstage/core-app-api';

// TODO: Get rid of all of these
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppThemeProvider } from '../../../core-app-api/src/app/AppThemeProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppIdentityProxy } from '../../../core-app-api/src/apis/implementations/IdentityApi/AppIdentityProxy';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppContextProvider } from '../../../core-app-api/src/app/AppContext';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { LocalStorageFeatureFlags } from '../../../core-app-api/src/apis/implementations/FeatureFlagsApi/LocalStorageFeatureFlags';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../../core-app-api/src/app/overrideBaseUrlConfigs';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RoutingProvider } from '../../../core-app-api/src/routing/RoutingProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { resolveRouteBindings } from '../../../core-app-api/src/app/resolveRouteBindings';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi/AppLanguageSelector';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi/I18nextTranslationApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  apis as defaultApis,
  components as defaultComponents,
  icons as defaultIcons,
} from '../../../app-defaults/src/defaults';
import { BrowserRouter, Route } from 'react-router-dom';
import { SidebarItem } from '@backstage/core-components';
import { DarkTheme, LightTheme } from '../extensions/themes';
import { extractRouteInfoFromInstanceTree } from '../routing/extractRouteInfoFromInstanceTree';
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';
import {
  appLanguageApiRef,
  translationApiRef,
} from '@backstage/core-plugin-api/alpha';

/** @public */
export interface ExtensionTreeNode {
  id: string;
  getData<T>(ref: ExtensionDataRef<T>): T | undefined;
}

/** @public */
export interface ExtensionTree {
  getExtension(id: string): ExtensionTreeNode | undefined;
  getExtensionAttachments(id: string, inputName: string): ExtensionTreeNode[];
  getRootRoutes(): JSX.Element[];
  getSidebarItems(): JSX.Element[];
}

/** @public */
export function createExtensionTree(options: {
  config: Config;
}): ExtensionTree {
  const features = getAvailableFeatures();
  const { instances } = createInstances({
    features,
    config: options.config,
  });

  return {
    getExtension(id: string): ExtensionTreeNode | undefined {
      return instances.get(id);
    },
    getExtensionAttachments(
      id: string,
      inputName: string,
    ): ExtensionTreeNode[] {
      return instances.get(id)?.attachments.get(inputName) ?? [];
    },
    getRootRoutes(): JSX.Element[] {
      return this.getExtensionAttachments('core.routes', 'routes').map(node => {
        const path = node.getData(coreExtensionData.routePath);
        const element = node.getData(coreExtensionData.reactElement);
        const routeRef = node.getData(coreExtensionData.routeRef);
        if (!path || !element) {
          throw new Error(`Invalid route extension: ${node.id}`);
        }
        const Component = () => {
          return element;
        };
        attachComponentData(Component, 'core.mountPoint', routeRef);

        return <Route path={path} element={<Component />} />;
      });
    },
    getSidebarItems(): JSX.Element[] {
      const RoutedSidebarItem = (props: {
        title: string;
        routeRef: RouteRef;
        icon: IconComponent;
      }): React.JSX.Element => {
        const location = useRouteRef(props.routeRef);
        return (
          <SidebarItem icon={props.icon} to={location()} text={props.title} />
        );
      };

      return this.getExtensionAttachments('core.nav', 'items')
        .map((node, index) => {
          const target = node.getData(coreExtensionData.navTarget);
          if (!target) {
            return null;
          }
          return (
            <RoutedSidebarItem
              key={index}
              title={target.title}
              icon={target.icon}
              routeRef={target.routeRef}
            />
          );
        })
        .filter((x): x is JSX.Element => !!x);
    },
  };
}

/**
 * @internal
 */
export function createInstances(options: {
  features: (BackstagePlugin | ExtensionOverrides)[];
  config: Config;
}) {
  const builtinExtensions = [
    Core,
    CoreRoutes,
    CoreNav,
    CoreLayout,
    LightTheme,
    DarkTheme,
  ];

  // pull in default extension instance from discovered packages
  // apply config to adjust default extension instances and add more
  const extensionParams = mergeExtensionParameters({
    features: options.features,
    builtinExtensions,
    parameters: readAppExtensionParameters(options.config),
  });

  // TODO: validate the config of all extension instances
  // We do it at this point to ensure that merging (if any) of config has already happened

  // Create attachment map so that we can look attachments up during instance creation
  const attachmentMap = new Map<
    string,
    Map<string, ExtensionInstanceParameters[]>
  >();
  for (const instanceParams of extensionParams) {
    const extensionId = instanceParams.attachTo.id;
    const pointId = instanceParams.attachTo.input;
    let pointMap = attachmentMap.get(extensionId);
    if (!pointMap) {
      pointMap = new Map();
      attachmentMap.set(extensionId, pointMap);
    }

    let instances = pointMap.get(pointId);
    if (!instances) {
      instances = [];
      pointMap.set(pointId, instances);
    }

    instances.push(instanceParams);
  }

  const instances = new Map<string, ExtensionInstance>();

  function createInstance(
    instanceParams: ExtensionInstanceParameters,
  ): ExtensionInstance {
    const extensionId = instanceParams.extension.id;
    const existingInstance = instances.get(extensionId);
    if (existingInstance) {
      return existingInstance;
    }

    const attachments = new Map(
      Array.from(attachmentMap.get(extensionId)?.entries() ?? []).map(
        ([inputName, attachmentConfigs]) => {
          return [inputName, attachmentConfigs.map(createInstance)];
        },
      ),
    );

    const newInstance = createExtensionInstance({
      extension: instanceParams.extension,
      source: instanceParams.source,
      config: instanceParams.config,
      attachments,
    });

    instances.set(extensionId, newInstance);

    return newInstance;
  }

  const coreInstance = createInstance(
    extensionParams.find(p => p.extension.id === 'core')!,
  );

  return { coreInstance, instances };
}

/** @public */
export function createApp(options: {
  features?: (BackstagePlugin | ExtensionOverrides)[];
  configLoader?: () => Promise<ConfigApi>;
  bindRoutes?(context: { bind: AppRouteBinder }): void;
  featureLoader?: (ctx: {
    config: ConfigApi;
  }) => Promise<(BackstagePlugin | ExtensionOverrides)[]>;
}): {
  createRoot(): JSX.Element;
} {
  async function appLoader() {
    const config =
      (await options?.configLoader?.()) ??
      ConfigReader.fromConfigs(
        overrideBaseUrlConfigs(defaultConfigLoaderSync()),
      );

    const discoveredFeatures = getAvailableFeatures();
    const loadedFeatures = (await options.featureLoader?.({ config })) ?? [];
    const allFeatures = Array.from(
      new Set([
        ...discoveredFeatures,
        ...(options.features ?? []),
        ...loadedFeatures,
      ]),
    );

    const { coreInstance } = createInstances({
      features: allFeatures,
      config,
    });

    const appContext = createLegacyAppContext(
      allFeatures.filter(
        (f): f is BackstagePlugin => f.$$type === '@backstage/BackstagePlugin',
      ),
    );

    const App = () => (
      <ApiProvider apis={createApiHolder(coreInstance, config)}>
        <AppContextProvider appContext={appContext}>
          <AppThemeProvider>
            <RoutingProvider
              {...extractRouteInfoFromInstanceTree(coreInstance)}
              routeBindings={resolveRouteBindings(options.bindRoutes)}
            >
              {/* TODO: set base path using the logic from AppRouter */}
              <BrowserRouter>
                {coreInstance.getData(coreExtensionData.reactElement)}
              </BrowserRouter>
            </RoutingProvider>
          </AppThemeProvider>
        </AppContextProvider>
      </ApiProvider>
    );

    return { default: App };
  }

  return {
    createRoot() {
      const LazyApp = React.lazy(appLoader);
      return (
        <React.Suspense fallback="Loading...">
          <LazyApp />
        </React.Suspense>
      );
    },
  };
}

// Make sure that we only convert each new plugin instance to its legacy equivalent once
const legacyPluginStore = getOrCreateGlobalSingleton(
  'legacy-plugin-compatibility-store',
  () => new WeakMap<BackstagePlugin, LegacyBackstagePlugin>(),
);

export function toLegacyPlugin(plugin: BackstagePlugin): LegacyBackstagePlugin {
  let legacy = legacyPluginStore.get(plugin);
  if (legacy) {
    return legacy;
  }

  const errorMsg = 'Not implemented in legacy plugin compatibility layer';
  const notImplemented = () => {
    throw new Error(errorMsg);
  };

  legacy = {
    getId(): string {
      return plugin.id;
    },
    get routes() {
      return {};
    },
    get externalRoutes() {
      return {};
    },
    getApis: notImplemented,
    getFeatureFlags: notImplemented,
    provide: notImplemented,
  };

  legacyPluginStore.set(plugin, legacy);
  return legacy;
}

function createLegacyAppContext(plugins: BackstagePlugin[]): AppContext {
  return {
    getPlugins(): LegacyBackstagePlugin[] {
      return plugins.map(toLegacyPlugin);
    },

    getSystemIcon(key: string): IconComponent | undefined {
      return key in defaultIcons
        ? defaultIcons[key as keyof typeof defaultIcons]
        : undefined;
    },

    getSystemIcons(): Record<string, IconComponent> {
      return defaultIcons;
    },

    getComponents(): AppComponents {
      return defaultComponents;
    },
  };
}

function createApiHolder(
  coreExtension: ExtensionInstance,
  configApi: ConfigApi,
): ApiHolder {
  const factoryRegistry = new ApiFactoryRegistry();

  const pluginApis =
    coreExtension.attachments
      .get('apis')
      ?.map(e => e.getData(coreExtensionData.apiFactory))
      .filter((x): x is AnyApiFactory => !!x) ?? [];

  const themeExtensions =
    coreExtension.attachments
      .get('themes')
      ?.map(e => e.getData(coreExtensionData.theme))
      .filter((x): x is AppTheme => !!x) ?? [];

  for (const factory of [...defaultApis, ...pluginApis]) {
    factoryRegistry.register('default', factory);
  }

  // TODO: properly discovery feature flags, maybe rework the whole thing
  factoryRegistry.register('default', {
    api: featureFlagsApiRef,
    deps: {},
    factory: () => new LocalStorageFeatureFlags(),
  });

  factoryRegistry.register('static', {
    api: identityApiRef,
    deps: {},
    factory: () => {
      const appIdentityProxy = new AppIdentityProxy();
      // TODO: Remove this when sign-in page is migrated
      appIdentityProxy.setTarget(
        {
          getUserId: () => 'guest',
          getIdToken: async () => undefined,
          getProfile: () => ({
            email: 'guest@example.com',
            displayName: 'Guest',
          }),
          getProfileInfo: async () => ({
            email: 'guest@example.com',
            displayName: 'Guest',
          }),
          getBackstageIdentity: async () => ({
            type: 'user',
            userEntityRef: 'user:default/guest',
            ownershipEntityRefs: ['user:default/guest'],
          }),
          getCredentials: async () => ({}),
          signOut: async () => {},
        },
        { signOutTargetUrl: '/' },
      );
      return appIdentityProxy;
    },
  });

  factoryRegistry.register('static', {
    api: appThemeApiRef,
    deps: {},
    // TODO: add extension for registering themes
    factory: () => AppThemeSelector.createWithStorage(themeExtensions),
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

  factoryRegistry.register('default', {
    api: translationApiRef,
    deps: { languageApi: appLanguageApiRef },
    factory: ({ languageApi }) =>
      I18nextTranslationApi.create({
        languageApi,
      }),
  });

  // TODO: ship these as default extensions instead
  for (const factory of defaultApis as AnyApiFactory[]) {
    if (!factoryRegistry.register('app', factory)) {
      throw new Error(
        `Duplicate or forbidden API factory for ${factory.api} in app`,
      );
    }
  }

  ApiResolver.validateFactories(factoryRegistry, factoryRegistry.getAllApis());

  return new ApiResolver(factoryRegistry);
}
