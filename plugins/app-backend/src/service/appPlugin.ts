/*
 * Copyright 2022 The Backstage Authors
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

import express from 'express';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { loggerToWinstonLogger } from '@backstage/backend-common';

/** @alpha */
export type AppPluginOptions = {
  /**
   * The name of the app package (in most Backstage repositories, this is the
   * "name" field in `packages/app/package.json`) that content should be served
   * from. The same app package should be added as a dependency to the backend
   * package in order for it to be accessible at runtime.
   *
   * In a typical setup with a single app package, this will default to 'app'.
   */
  appPackageName?: string;

  /**
   * A request handler to handle requests for static content that are not present in the app bundle.
   *
   * This can be used to avoid issues with clients on older deployment versions trying to access lazy
   * loaded content that is no longer present. Typically the requests would fall back to a long-term
   * object store where all recently deployed versions of the app are present.
   *
   * Another option is to provide a `database` that will take care of storing the static assets instead.
   *
   * If both `database` and `staticFallbackHandler` are provided, the `database` will attempt to serve
   * static assets first, and if they are not found, the `staticFallbackHandler` will be called.
   */
  staticFallbackHandler?: express.Handler;

  /**
   * Disables the configuration injection. This can be useful if you're running in an environment
   * with a read-only filesystem, or for some other reason don't want configuration to be injected.
   *
   * Note that this will cause the configuration used when building the app bundle to be used, unless
   * a separate configuration loading strategy is set up.
   *
   * This also disables configuration injection though `APP_CONFIG_` environment variables.
   */
  disableConfigInjection?: boolean;

  /**
   * By default the app backend plugin will cache previously deployed static assets in the database.
   * If you disable this, it is recommended to set a `staticFallbackHandler` instead.
   */
  disableStaticFallbackCache?: boolean;
};

/**
 * The App plugin is responsible for serving the frontend app bundle and static assets.
 * @alpha
 */
export const appPlugin = createBackendPlugin((options: AppPluginOptions) => ({
  id: 'app',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.config,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, config, database, httpRouter }) {
        const {
          appPackageName,
          staticFallbackHandler,
          disableConfigInjection,
          disableStaticFallbackCache,
        } = options;
        const winstonLogger = loggerToWinstonLogger(logger);

        const router = await createRouter({
          logger: winstonLogger,
          config,
          database: disableStaticFallbackCache ? undefined : database,
          appPackageName: appPackageName ?? 'app',
          staticFallbackHandler,
          disableConfigInjection,
        });
        httpRouter.use(router);
      },
    });
  },
}));
