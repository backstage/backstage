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

import { JSX, lazy, ReactNode, Suspense, useEffect, useState } from 'react';
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
  prepareSpecializedApp,
  PreparedSpecializedApp,
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

    const preparedApp = prepareSpecializedApp({
      features: [appPlugin, ...loadedFeatures],
      config,
      bindRoutes: options?.bindRoutes,
      advanced: options?.advanced,
    });

    if (preparedApp.getSignIn()) {
      return {
        default: () => <PreparedAppRoot preparedApp={preparedApp} />,
      };
    }

    return {
      default: () => renderFinalizedApp(preparedApp.finalize()),
    };
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

function PreparedAppRoot(props: {
  preparedApp: PreparedSpecializedApp;
}): JSX.Element {
  const signIn = props.preparedApp.getSignIn();
  const [finalizeError, setFinalizeError] = useState<Error>();
  const [finalizedApp, setFinalizedApp] = useState<
    ReturnType<PreparedSpecializedApp['finalize']> | undefined
  >(undefined);

  useEffect(() => {
    let cancelled = false;
    const runFinalize = async () => {
      try {
        const predicateContext = await props.preparedApp.buildPredicateContext();
        if (cancelled) {
          return;
        }
        setFinalizedApp(props.preparedApp.finalize(predicateContext));
      } catch (error) {
        if (cancelled) {
          return;
        }
        setFinalizeError(error as Error);
      }
    };
    if (signIn) {
      void signIn.complete
        .then(() => {
          if (cancelled) {
            return;
          }
          void runFinalize();
        })
        .catch(error => {
          if (cancelled) {
            return;
          }
          setFinalizeError(error);
        });
    } else {
      void runFinalize();
    }
    return () => {
      cancelled = true;
    };
  }, [props.preparedApp, signIn]);

  if (finalizeError) {
    throw finalizeError;
  }

  if (!finalizedApp) {
    return signIn?.element ?? <></>;
  }

  return renderFinalizedApp(finalizedApp);
}

function renderFinalizedApp(
  app: ReturnType<PreparedSpecializedApp['finalize']>,
) {
  const errorPage = maybeCreateErrorPage(app);
  if (errorPage) {
    return errorPage;
  }

  return app.tree.root.instance!.getData(coreExtensionData.reactElement)!;
}
