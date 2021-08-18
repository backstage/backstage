/*
 * Copyright 2021 The Backstage Authors
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

import Router from 'express-promise-router';
import { Router as ExpressRouter } from 'express';
import { notFoundHandler } from '../middleware';
import { PluginEnvironment } from '../types';
import { useHotMemoize } from '../hot';

export type CreatePluginRouterOptions = {
  module: NodeModule;
  createEnv: (pluginId: string) => PluginEnvironment;
};

export type CreatePluginRouterPlugins = {
  [pluginId: string]: () => Promise<{
    default: (env: PluginEnvironment) => Promise<ExpressRouter>;
  }>;
};

export async function createPluginRouter(
  options: CreatePluginRouterOptions,
  plugins: CreatePluginRouterPlugins,
) {
  const router = Router();

  const pluginEnvs = useHotMemoize(
    options.module,
    () =>
      new Map(
        Object.keys(plugins).map(pluginId => {
          return [pluginId, options.createEnv(pluginId)];
        }),
      ),
  );

  await Promise.all(
    Object.entries(plugins).map(async ([pluginId, pluginLoader]) => {
      const pluginEnv = pluginEnvs.get(pluginId);
      if (!pluginEnv) {
        throw new Error(
          `An environment for the ${pluginId} plugin was not initialized at startup, a restart is needed`,
        );
      }
      const { default: pluginCreator } = await pluginLoader();
      const pluginRouter = await pluginCreator(pluginEnv);
      router.use(`/${pluginId}`, pluginRouter);
    }),
  );

  router.use(notFoundHandler);

  return router;
}
