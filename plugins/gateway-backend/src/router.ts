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
import { DiscoveryService, LoggerService } from '@backstage/backend-plugin-api';
import { InstanceMetadataService } from '@backstage/backend-plugin-api/alpha';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { context } from '@opentelemetry/api';
import { getRPCMetadata } from '@opentelemetry/core';

export function createRouter({
  discovery,
  instanceMeta,
}: {
  discovery: DiscoveryService;
  instanceMeta: InstanceMetadataService;
  logger: LoggerService;
}) {
  const localPluginIds = new Set(
    instanceMeta
      .getInstalledFeatures()
      .filter(f => f.type === 'plugin')
      .map(f => f.pluginId),
  );

  const proxy = createProxyMiddleware({
    changeOrigin: true,
    router: async (req: Request<{ pluginId: string }>) => {
      const pluginId = req.params.pluginId;
      return discovery.getBaseUrl(pluginId);
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

    const rpcMetadata = getRPCMetadata(context.active());
    if (rpcMetadata) {
      rpcMetadata.route = req.baseUrl;
    }

    proxy(req, res, next);
  };
}
