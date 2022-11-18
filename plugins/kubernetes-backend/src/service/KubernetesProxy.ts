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
import {
  createProxyMiddleware,
  Options as ProxyMiddlewareOptions,
} from 'http-proxy-middleware';
import { Logger } from 'winston';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

export const APPLICATION_JSON: string = 'application/json';

/**
 * The header that is used to specify the cluster name.
 *
 * @alpha
 */
export const HEADER_KUBERNETES_CLUSTER: string = 'X-Kubernetes-Cluster';

/**
 * A proxy that routes requests to the Kubernetes API.
 *
 * @alpha
 */
export class KubernetesProxy {
  constructor(
    private readonly logger: Logger,
    private readonly clusterSupplier: KubernetesClustersSupplier,
  ) {}

  public proxyRequestHandler: RequestHandler = async (req, res, next) => {
    const requestedCluster = this.getKubernetesRequestedCluster(req);

    const clusterDetails = await this.getClusterDetails(requestedCluster);

    const clusterUrl = new URL(clusterDetails.url);
    const options: ProxyMiddlewareOptions = {
      logProvider: () => this.logger,
      secure: !clusterDetails.skipTLSVerify,
      target: {
        protocol: clusterUrl.protocol,
        host: clusterUrl.hostname,
        port: clusterUrl.port,
        ca: bufferFromFileOrString('', clusterDetails.caData)?.toString(),
      },
      pathRewrite: { [`^${req.baseUrl}`]: '' },
      onError: (error: Error) => {
        const wrappedError = new ForwardedError(
          `Cluster '${requestedCluster}' request error`,
          error,
        );

        this.logger.error(wrappedError);

        const body: ErrorResponseBody = {
          error: serializeError(wrappedError, {
            includeStack: process.env.NODE_ENV === 'development',
          }),
          request: { method: req.method, url: req.originalUrl },
          response: { statusCode: 500 },
        };

        res.status(500).json(body);
      },
    };

    // Probably too risky without permissions protecting this endpoint
    // if (clusterDetails.serviceAccountToken) {
    //   options.headers = {
    //     Authorization: `Bearer ${clusterDetails.serviceAccountToken}`,
    //   };
    // }
    createProxyMiddleware(options)(req, res, next);
  };

  private getKubernetesRequestedCluster(req: Request): string {
    const requestedClusterName = req.header(HEADER_KUBERNETES_CLUSTER);

    if (!requestedClusterName) {
      throw new InputError(`Missing '${HEADER_KUBERNETES_CLUSTER}' header.`);
    }

    return requestedClusterName;
  }

  private async getClusterDetails(
    requestedCluster: string,
  ): Promise<ClusterDetails> {
    const clusters = await this.clusterSupplier.getClusters();

    const clusterDetail = clusters.find(
      cluster => cluster.name === requestedCluster,
    );

    if (!clusterDetail) {
      throw new NotFoundError(`Cluster '${requestedCluster}' not found`);
    }

    return clusterDetail;
  }
}
