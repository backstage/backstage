/*
 * Copyright 2025 The Backstage Authors
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
  DiscoveryService,
  RootInstanceMetadataService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { context } from '@opentelemetry/api';
import { getRPCMetadata } from '@opentelemetry/core';

const MAX_HOPS = 3;
const HOPS_HEADER = 'backstage-gateway-hops';

export async function createRouter({
  discovery,
  instanceMeta,
  logger,
}: {
  discovery: DiscoveryService;
  instanceMeta: RootInstanceMetadataService;
  logger: LoggerService;
}) {
  const plugins = await instanceMeta.getInstalledPlugins();
  const localPluginIds = new Set(plugins.map(f => f.pluginId));

  const proxy = createProxyMiddleware({
    changeOrigin: true,
    router: async (req: Request<{ pluginId: string }>) => {
      const pluginId = req.params.pluginId;
      return discovery.getBaseUrl(pluginId);
    },
    on: {
      proxyReq(proxyReq, req: Request<{ pluginId: string }>) {
        const currentHops =
          Math.max(parseInt(req.headers[HOPS_HEADER] as string, 10), 0) || 0;

        proxyReq.setHeader(HOPS_HEADER, currentHops + 1);
      },
      proxyRes(proxyRes, _req, res) {
        // https://github.com/chimurai/http-proxy-middleware/discussions/765
        proxyRes.on('close', () => {
          if (!res.writableEnded) {
            res.end();
          }
        });
      },
    },
  });

  return function proxyMiddleware(
    req: Request<{ pluginId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    if (localPluginIds.has(req.params.pluginId)) {
      next();
      return;
    }

    const currentHops = parseInt(req.headers[HOPS_HEADER] as string, 10) || 0;
    if (currentHops >= MAX_HOPS) {
      logger.warn(
        `Proxy loop detected for plugin '${req.params.pluginId}': request exceeded maximum hop count (${currentHops})`,
      );
      res.status(508).json({
        error: {
          name: 'LoopDetectedError',
          message: `Maximum proxy hop count exceeded (${currentHops})`,
        },
      });
      return;
    }

    const rpcMetadata = getRPCMetadata(context.active());
    if (rpcMetadata) {
      rpcMetadata.route = req.baseUrl;
    }

    proxy(req, res, next);
  };
}
