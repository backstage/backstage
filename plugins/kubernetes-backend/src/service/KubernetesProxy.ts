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

import {
  ErrorResponseBody,
  ForwardedError,
  InputError,
  NotFoundError,
  serializeError,
} from '@backstage/errors';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import type { Request, RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from 'winston';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

export const APPLICATION_JSON: string = 'application/json';

/**
 * The header that is used to specify the cluster name.
 *
 * @public
 */
export const HEADER_KUBERNETES_CLUSTER: string = 'X-Kubernetes-Cluster';

/**
 * A proxy that routes requests to the Kubernetes API.
 *
 * @public
 */
export class KubernetesProxy {
  private readonly middlewareForClusterName = new Map<string, RequestHandler>();

  constructor(
    private readonly logger: Logger,
    private readonly clusterSupplier: KubernetesClustersSupplier,
  ) {}

  public createRequestHandler(): RequestHandler {
    return async (req, res, next) => {
      const middleware = await this.getMiddleware(req);
      middleware(req, res, next);
    };
  }

  // We create one middleware per remote cluster and hold on to them, because
  // the secure property isn't possible to decide on a per-request basis with a
  // single middleware instance - and we don't expect it to change over time.
  private async getMiddleware(originalReq: Request): Promise<RequestHandler> {
    const originalCluster = await this.getClusterForRequest(originalReq);
    let middleware = this.middlewareForClusterName.get(originalCluster.name);
    if (!middleware) {
      // Probably too risky without permissions protecting this endpoint
      // if (cluster.serviceAccountToken) {
      //   options.headers = {
      //     Authorization: `Bearer ${cluster.serviceAccountToken}`,
      //   };
      // }

      const logger = this.logger.child({ cluster: originalCluster.name });
      middleware = createProxyMiddleware({
        logProvider: () => logger,
        secure: !originalCluster.skipTLSVerify,
        router: async req => {
          // Re-evaluate the cluster on each request, in case it has changed
          const cluster = await this.getClusterForRequest(req);
          const url = new URL(cluster.url);
          return {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port,
            ca: bufferFromFileOrString('', cluster.caData)?.toString(),
          };
        },
        pathRewrite: { [`^${originalReq.baseUrl}`]: '' },
        onError: (error, req, res) => {
          const wrappedError = new ForwardedError(
            `Cluster '${originalCluster.name}' request error`,
            error,
          );

          logger.error(wrappedError);

          const body: ErrorResponseBody = {
            error: serializeError(wrappedError, {
              includeStack: process.env.NODE_ENV === 'development',
            }),
            request: { method: req.method, url: req.originalUrl },
            response: { statusCode: 500 },
          };

          res.status(500).json(body);
        },
      });

      this.middlewareForClusterName.set(originalCluster.name, middleware);
    }

    return middleware;
  }

  private async getClusterForRequest(req: Request): Promise<ClusterDetails> {
    const clusterName = req.header(HEADER_KUBERNETES_CLUSTER);
    if (!clusterName) {
      throw new InputError(`Missing '${HEADER_KUBERNETES_CLUSTER}' header.`);
    }

    const cluster = await this.clusterSupplier
      .getClusters()
      .then(clusters => clusters.find(c => c.name === clusterName));
    if (!cluster) {
      throw new NotFoundError(`Cluster '${clusterName}' not found`);
    }

    return cluster;
  }
}
