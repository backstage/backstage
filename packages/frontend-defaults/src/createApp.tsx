/*
 * Copyright 2024 The Backstage Authors
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

import { JSX, lazy, ReactNode, Suspense } from 'react';
import {
  ConfigApi,
  coreExtensionData,
  ExtensionFactoryMiddleware,
  FrontendFeature,
  FrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
import { Progress } from '@backstage/core-components';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../core-app-api/src/app/overrideBaseUrlConfigs';
import { ConfigReader } from '@backstage/config';
import {
  CreateAppRouteBinder,
  createSpecializedApp,
  FrontendPluginInfoResolver,
} from '@backstage/frontend-app-api';
import appPlugin from '@backstage/plugin-app';
import { discoverAvailableFeatures } from './discovery';
import { resolveAsyncFeatures } from './resolution';
import { maybeCreateErrorPage } from './maybeCreateErrorPage';

/**
 * Options for {@link createApp}.
 *
 * @public
 */
export interface CreateAppOptions {
  /**
   * The list of features to load.
   */
  features?: (FrontendFeature | FrontendFeatureLoader)[];

  /**
   * Allows for the binding of plugins' external route refs within the app.
   */
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;

  /**
   * Advanced, more rarely used options.
   */
  advanced?: {
    /**
     * If set to true, the system will silently accept and move on if
     * encountering config for extensions that do not exist. The default is to
     * reject such config to help catch simple mistakes.
     *
     * This flag can be useful in some scenarios where you have a dynamic set of
     * extensions enabled at different times, but also increases the risk of
     * accidentally missing e.g. simple typos in your config.
     */
    allowUnknownExtensionConfig?: boolean;

    /**
     * Sets a custom config loader, replacing the builtin one.
     *
     * This can be used e.g. if you have the need to source config out of custom
     * storages.
     */
    configLoader?: () => Promise<{ config: ConfigApi }>;

    /**
     * Applies one or more middleware on every extension, as they are added to
     * the application.
     *
     * This is an advanced use case for modifying extension data on the fly as
     * it gets emitted by extensions being instantiated.
     */
    extensionFactoryMiddleware?:
      | ExtensionFactoryMiddleware
      | ExtensionFactoryMiddleware[];

    /**
     * The element to render while loading the app (waiting for config, features, etc).
     *
     * This is the `<Progress />` component from `@backstage/core-components` by default.
     * If set to `null` then no loading fallback element is rendered at all.
     */
    loadingElement?: ReactNode;

    /**
     * Allows for customizing how plugin info is retrieved.
     */
    pluginInfoResolver?: FrontendPluginInfoResolver;
  };
}

/**
 * Creates a new Backstage frontend app instance. See https://backstage.io/docs/frontend-system/building-apps/index
 *
 * @public
 */
export function createApp(options?: CreateAppOptions): {
  createRoot(): JSX.Element;
} {
  let suspenseFallback = options?.advanced?.loadingElement;
  if (suspenseFallback === undefined) {
    suspenseFallback = <Progress />;
  }

  async function appLoader() {
    const config =
      (await options?.advanced?.configLoader?.().then(c => c.config)) ??
      ConfigReader.fromConfigs(
        overrideBaseUrlConfigs(defaultConfigLoaderSync()),
      );

    const { features: discoveredFeaturesAndLoaders } =
      discoverAvailableFeatures(config);
    const { features: loadedFeatures } = await resolveAsyncFeatures({
      config,
      features: [...discoveredFeaturesAndLoaders, ...(options?.features ?? [])],
    });

    const app = createSpecializedApp({
      features: [appPlugin, ...loadedFeatures],
      config,
      bindRoutes: options?.bindRoutes,
      advanced: options?.advanced,
    });

    const errorPage = maybeCreateErrorPage(app);
    if (errorPage) {
      return { default: () => errorPage };
    }

    const rootEl = app.tree.root.instance!.getData(
      coreExtensionData.reactElement,
    );

    return { default: () => rootEl };
  }

  const LazyApp = lazy(appLoader);

  return {
    createRoot() {
      return (
        <Suspense fallback={suspenseFallback}>
          <LazyApp />
        </Suspense>
      );
    },
  };
}
