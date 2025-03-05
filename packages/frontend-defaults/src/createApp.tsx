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
import { ConfigApi, FrontendFeature } from '@backstage/frontend-plugin-api';
import { stringifyError } from '@backstage/errors';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { defaultConfigLoaderSync } from '../../core-app-api/src/app/defaultConfigLoader';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { overrideBaseUrlConfigs } from '../../core-app-api/src/app/overrideBaseUrlConfigs';
import { getAvailableFeatures } from './discovery';
import { ConfigReader } from '@backstage/config';
import appPlugin from '@backstage/plugin-app';
import {
  CreateAppRouteBinder,
  createSpecializedApp,
} from '@backstage/frontend-app-api';

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  InternalFrontendFeatureLoader,
  isInternalFrontendFeatureLoader,
} from '../../frontend-plugin-api/src/wiring/createFrontendFeatureLoader';

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
  features?: (FrontendFeature | CreateAppFeatureLoader)[];
  featureLoaderRecursionDepth?: number;
  configLoader?: () => Promise<{ config: ConfigApi }>;
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;
  /**
   * The component to render while loading the app (waiting for config, features, etc)
   *
   * Is the text "Loading..." by default.
   * If set to "null" then no loading fallback component is rendered.   *
   */
  loadingComponent?: ReactNode;
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

    const loadedFeatures: FrontendFeature[] = [];

    // Separate deprecated CreateAppFeatureLoader elements from the frontend features,
    // and manage the deprecated elements first.
    const [providedFeatures, createAppFeatureLoaders] = (
      options?.features ?? []
    ).reduce<[FrontendFeature[], CreateAppFeatureLoader[]]>(
      (acc, item) => {
        if ('$$type' in item) {
          acc[0].push(item);
        } else {
          acc[1].push(item);
        }
        return acc;
      },
      [[], []],
    );
    for (const entry of createAppFeatureLoaders) {
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
    }

    const featureLoaderNames: InternalFrontendFeatureLoader[] = [];
    const maxRecursionDepth = options?.featureLoaderRecursionDepth ?? 10;

    async function applyFeatureLoaders(
      features: FrontendFeature[],
      recursionDepth: number,
    ) {
      if (features.length === 0) {
        return;
      }
      const [featureLoaders, otherFeatures] = features.reduce<
        [InternalFrontendFeatureLoader[], FrontendFeature[]]
      >(
        (acc, item) => {
          if (isInternalFrontendFeatureLoader(item)) {
            acc[0].push(item);
          } else {
            acc[1].push(item);
          }
          return acc;
        },
        [[], []],
      );
      loadedFeatures.push(...otherFeatures);
      for (const featureLoader of featureLoaders) {
        if (featureLoaderNames.some(l => l === featureLoader)) {
          throw new Error(
            `Added several instances of feature loader ${featureLoader.description}`,
          );
        }
        if (recursionDepth > maxRecursionDepth) {
          throw new Error(
            `Maximum feature loading recursion depth (${maxRecursionDepth}) reached for the feature loader ${featureLoader.description}`,
          );
        }
        featureLoaderNames.push(featureLoader);
        let result: FrontendFeature[];
        try {
          result = await featureLoader.loader({ config });
        } catch (e) {
          throw new Error(
            `Failed to read frontend features from loader ${
              featureLoader.description
            }: ${stringifyError(e)}`,
          );
        }
        await applyFeatureLoaders(result, recursionDepth + 1);
      }
    }

    const discoveredFeatures = getAvailableFeatures(config);

    await applyFeatureLoaders([...discoveredFeatures, ...providedFeatures], 1);

    const app = createSpecializedApp({
      config,
      features: [appPlugin, ...loadedFeatures],
      bindRoutes: options?.bindRoutes,
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
