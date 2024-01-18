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
  NotAllowedError,
  NotFoundError,
  serializeError,
} from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import {
  KubernetesRequestAuth,
  kubernetesProxyPermission,
} from '@backstage/plugin-kubernetes-common';
import {
  AuthorizeResult,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { bufferFromFileOrString } from '@kubernetes/client-node';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { Logger } from 'winston';

import { AuthenticationStrategy } from '../auth';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';

import type { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export const APPLICATION_JSON: string = 'application/json';

/**
 * The header that is used to specify the cluster name.
 *
 * @public
 */
export const HEADER_KUBERNETES_CLUSTER: string = 'Backstage-Kubernetes-Cluster';

/**
 * The header that is used to specify the Authentication Authorities token.
 * e.x if using the google auth provider as your authentication authority then this field would be the google provided bearer token.
 * @public
 */
export const HEADER_KUBERNETES_AUTH: string =
  'Backstage-Kubernetes-Authorization';

/**
 * The options object expected to be passed as a parameter to KubernetesProxy.createRequestHandler().
 *
 * @public
 */
export type KubernetesProxyCreateRequestHandlerOptions = {
  permissionApi: PermissionEvaluator;
};

/**
 * Options accepted as a parameter by the KubernetesProxy
 *
 * @public
 */
export type KubernetesProxyOptions = {
  logger: Logger;
  clusterSupplier: KubernetesClustersSupplier;
  authStrategy: AuthenticationStrategy;
};

/**
 * A proxy that routes requests to the Kubernetes API.
 *
 * @public
 */
export class KubernetesProxy {
  private readonly middlewareForClusterName = new Map<string, RequestHandler>();
  private readonly logger: Logger;
  private readonly clusterSupplier: KubernetesClustersSupplier;
  private readonly authStrategy: AuthenticationStrategy;

  constructor(options: KubernetesProxyOptions) {
    this.logger = options.logger;
    this.clusterSupplier = options.clusterSupplier;
    this.authStrategy = options.authStrategy;
  }

  public createRequestHandler(
    options: KubernetesProxyCreateRequestHandlerOptions,
  ): RequestHandler {
    const { permissionApi } = options;
    return async (req, res, next) => {
      const authorizeResponse = await permissionApi.authorize(
        [{ permission: kubernetesProxyPermission }],
        {
          token: getBearerTokenFromAuthorizationHeader(
            req.header('authorization'),
          ),
        },
      );
      const auth = authorizeResponse[0];

      if (auth.result === AuthorizeResult.DENY) {
        res.status(403).json({ error: new NotAllowedError('Unauthorized') });
        return;
      }

      const middleware = await this.getMiddleware(req);

      // If req is an upgrade handshake, use middleware upgrade instead of http request handler https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
      if (
        req.header('connection')?.toLowerCase() === 'upgrade' &&
        req.header('upgrade')?.toLowerCase() === 'websocket'
      ) {
        // Missing the `head`, since it's optional we pass undefined to avoid type issues
        middleware.upgrade!(req, req.socket, undefined);
      } else {
        middleware(req, res, next);
      }
    };
  }

  // We create one middleware per remote cluster and hold on to them, because
  // the secure property isn't possible to decide on a per-request basis with a
  // single middleware instance - and we don't expect it to change over time.
  private async getMiddleware(originalReq: Request): Promise<RequestHandler> {
    const originalCluster = await this.getClusterForRequest(originalReq);
    let middleware = this.middlewareForClusterName.get(originalCluster.name);
    if (!middleware) {
      const logger = this.logger.child({ cluster: originalCluster.name });
      middleware = createProxyMiddleware({
        logProvider: () => logger,
        ws: true,
        secure: !originalCluster.skipTLSVerify,
        changeOrigin: true,
        pathRewrite: async (path, req) => {
          // Re-evaluate the cluster on each request, in case it has changed
          const cluster = await this.getClusterForRequest(req);
          const url = new URL(cluster.url);
          return path.replace(
            new RegExp(`^${originalReq.baseUrl}`),
            url.pathname || '',
          );
        },
        router: async req => {
          // Re-evaluate the cluster on each request, in case it has changed
          const cluster = await this.getClusterForRequest(req);
          const url = new URL(cluster.url);

          const target: any = {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port,
            ca: bufferFromFileOrString(
              cluster.caFile,
              cluster.caData,
            )?.toString(),
          };

          const authHeader = req.header(HEADER_KUBERNETES_AUTH);
          if (authHeader) {
            req.headers.authorization = authHeader;
          } else {
            // Map Backstage-Kubernetes-Authorization-X-X headers to a KubernetesRequestAuth object
            const authObj = KubernetesProxy.authHeadersToKubernetesRequestAuth(
              req.headers,
            );

            const credential = await this.getClusterForRequest(req).then(cd => {
              return this.authStrategy.getCredential(cd, authObj);
            });

            if (credential.type === 'bearer token') {
              req.headers.authorization = `Bearer ${credential.token}`;
            } else if (credential.type === 'x509 client certificate') {
              target.key = credential.key;
              target.cert = credential.cert;
            }
          }

          return target;
        },
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
    const clusterName = req.headers[HEADER_KUBERNETES_CLUSTER.toLowerCase()];
    const clusters = await this.clusterSupplier.getClusters();

    if (!clusters || clusters.length <= 0) {
      throw new NotFoundError(`No Clusters configured`);
    }

    const hasClusterNameHeader =
      typeof clusterName === 'string' && clusterName.length > 0;

    let cluster: ClusterDetails | undefined;

    if (hasClusterNameHeader) {
      cluster = clusters.find(c => c.name === clusterName);
    } else if (clusters.length === 1) {
      cluster = clusters.at(0);
    }

    if (!cluster) {
      throw new NotFoundError(`Cluster '${clusterName}' not found`);
    }

    return cluster;
  }

  private static authHeadersToKubernetesRequestAuth(
    originalHeaders: IncomingHttpHeaders,
  ): KubernetesRequestAuth {
    return Object.keys(originalHeaders)
      .filter(header => header.startsWith('backstage-kubernetes-authorization'))
      .map(header =>
        KubernetesProxy.headerToDictionary(header, originalHeaders),
      )
      .filter(headerAsDic => Object.keys(headerAsDic).length !== 0)
      .reduce(KubernetesProxy.combineHeaders, {});
  }

  private static headerToDictionary(
    header: string,
    originalHeaders: IncomingHttpHeaders,
  ): KubernetesRequestAuth {
    const obj: KubernetesRequestAuth = {};
    const headerSplitted = header.split('-');
    if (headerSplitted.length >= 4) {
      const framework = headerSplitted[3].toLowerCase();
      if (headerSplitted.length >= 5) {
        const provider = headerSplitted.slice(4).join('-').toLowerCase();
        obj[framework] = { [provider]: originalHeaders[header] };
      } else {
        obj[framework] = originalHeaders[header];
      }
    }
    return obj;
  }

  private static combineHeaders(
    authObj: any,
    header: any,
  ): KubernetesRequestAuth {
    const framework = Object.keys(header)[0];

    if (authObj[framework]) {
      authObj[framework] = {
        ...authObj[framework],
        ...header[framework],
      };
    } else {
      authObj[framework] = header[framework];
    }

    return authObj;
  }
}
