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

import React, { JSX, ReactNode } from 'react';
import {
  ConfigApi,
  coreExtensionData,
  ExtensionFactoryMiddleware,
  FrontendFeature,
  FrontendFeatureLoader,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../core-app-api/src/app/overrideBaseUrlConfigs';
import { ConfigReader } from '@backstage/config';
import {
  CreateAppRouteBinder,
  createSpecializedApp,
} from '@backstage/frontend-app-api';
import appPlugin from '@backstage/plugin-app';
import { discoverAvailableFeatures } from './discovery';
import { resolveAsyncFeatures } from './resolution';

/**
 * A source of dynamically loaded frontend features.
 *
 * @public
 * @deprecated Use the {@link @backstage/frontend-plugin-api#createFrontendFeatureLoader} function instead.
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
 * Options for {@link createApp}.
 *
 * @public
 */
export interface CreateAppOptions {
  features?: (
    | FrontendFeature
    | FrontendFeatureLoader
    | CreateAppFeatureLoader
  )[];
  configLoader?: () => Promise<{ config: ConfigApi }>;
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;
  /**
   * The component to render while loading the app (waiting for config, features, etc)
   *
   * Is the text "Loading..." by default.
   * If set to "null" then no loading fallback component is rendered.   *
   */
  loadingComponent?: ReactNode;
  extensionFactoryMiddleware?:
    | ExtensionFactoryMiddleware
    | ExtensionFactoryMiddleware[];
}

/**
 * Creates a new Backstage frontend app instance. See https://backstage.io/docs/frontend-system/building-apps/index
 *
 * @public
 */
export function createApp(options?: CreateAppOptions): {
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

    const { features: discoveredFeaturesAndLoaders } =
      discoverAvailableFeatures(config);
    const { features: loadedFeatures } = await resolveAsyncFeatures({
      config,
      features: [...discoveredFeaturesAndLoaders, ...(options?.features ?? [])],
    });

    const app = createSpecializedApp({
      config,
      features: [appPlugin, ...loadedFeatures],
      bindRoutes: options?.bindRoutes,
      extensionFactoryMiddleware: options?.extensionFactoryMiddleware,
    });

    const rootEl = app.tree.root.instance!.getData(
      coreExtensionData.reactElement,
    );

    return { default: () => rootEl };
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
