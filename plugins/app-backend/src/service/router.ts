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

import {
  notFoundHandler,
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import helmet from 'helmet';
import express from 'express';
import Router from 'express-promise-router';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { Logger } from 'winston';
import { injectConfig, readConfigs } from '../lib/config';
import {
  StaticAssetsStore,
  findStaticAssets,
  createStaticAssetMiddleware,
} from '../lib/assets';
import {
  CACHE_CONTROL_MAX_CACHE,
  CACHE_CONTROL_NO_CACHE,
  CACHE_CONTROL_REVALIDATE_CACHE,
} from '../lib/headers';

// express uses mime v1 while we only have types for mime v2
type Mime = { lookup(arg0: string): string };

/** @public */
export interface RouterOptions {
  config: Config;
  logger: Logger;

  /**
   * If a database is provided it will be used to cache previously deployed static assets.
   *
   * This is a built-in alternative to using a `staticFallbackHandler`.
   */
  database?: PluginDatabaseManager;

  /**
   * The name of the app package that content should be served from. The same app package should be
   * added as a dependency to the backend package in order for it to be accessible at runtime.
   *
   * In a typical setup with a single app package this would be set to 'app'.
   */
  appPackageName: string;

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
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, logger, appPackageName, staticFallbackHandler } = options;

  const disableConfigInjection =
    options.disableConfigInjection ??
    config.getOptionalBoolean('app.disableConfigInjection');
  const disableStaticFallbackCache = config.getOptionalBoolean(
    'app.disableStaticFallbackCache',
  );

  const appDistDir = resolvePackagePath(appPackageName, 'dist');
  const staticDir = resolvePath(appDistDir, 'static');

  if (!(await fs.pathExists(staticDir))) {
    if (process.env.NODE_ENV === 'production') {
      logger.error(
        `Can't serve static app content from ${staticDir}, directory doesn't exist`,
      );
    }

    return Router();
  }

  logger.info(`Serving static app content from ${appDistDir}`);

  let injectedConfigPath: string | undefined;
  if (!disableConfigInjection) {
    const appConfigs = await readConfigs({
      config,
      appDistDir,
      env: process.env,
    });

    injectedConfigPath = await injectConfig({ appConfigs, logger, staticDir });
  }

  const router = Router();

  router.use(helmet.frameguard({ action: 'deny' }));

  // Use a separate router for static content so that a fallback can be provided by backend
  const staticRouter = Router();
  staticRouter.use(
    express.static(resolvePath(appDistDir, 'static'), {
      setHeaders: (res, path) => {
        if (path === injectedConfigPath) {
          res.setHeader('Cache-Control', CACHE_CONTROL_REVALIDATE_CACHE);
        } else {
          res.setHeader('Cache-Control', CACHE_CONTROL_MAX_CACHE);
        }
      },
    }),
  );

  if (options.database && !disableStaticFallbackCache) {
    const store = await StaticAssetsStore.create({
      logger,
      database: options.database,
    });

    const assets = await findStaticAssets(staticDir);
    await store.storeAssets(assets);
    // Remove any assets that are older than 7 days
    await store.trimAssets({ maxAgeSeconds: 60 * 60 * 24 * 7 });

    staticRouter.use(createStaticAssetMiddleware(store));
  }

  if (staticFallbackHandler) {
    staticRouter.use(staticFallbackHandler);
  }
  staticRouter.use(notFoundHandler());

  router.use('/static', staticRouter);
  router.use(
    express.static(appDistDir, {
      setHeaders: (res, path) => {
        // The Cache-Control header instructs the browser to not cache html files since it might
        // link to static assets from recently deployed versions.
        if (
          (express.static.mime as unknown as Mime).lookup(path) === 'text/html'
        ) {
          res.setHeader('Cache-Control', CACHE_CONTROL_NO_CACHE);
        }
      },
    }),
  );
  router.get('/*', (_req, res) => {
    res.sendFile(resolvePath(appDistDir, 'index.html'), {
      headers: {
        // The Cache-Control header instructs the browser to not cache the index.html since it might
        // link to static assets from recently deployed versions.
        'cache-control': CACHE_CONTROL_NO_CACHE,
      },
    });
  });

  return router;
}
