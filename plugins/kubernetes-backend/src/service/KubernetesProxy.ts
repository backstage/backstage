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
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  SERVICEACCOUNT_CA_PATH,
  kubernetesProxyPermission,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import type { Cluster } from '@kubernetes/client-node';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import fs from 'fs-extra';

import {
  AuthenticationStrategy,
  ClusterDetails,
  KubernetesClustersSupplier,
} from '@backstage/plugin-kubernetes-node';

import type { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'node:http';
import {
  AuditorService,
  AuditorServiceEvent,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  PermissionsService,
} from '@backstage/backend-plugin-api';

const PROXY_AUDIT_FINALIZER = Symbol('kubernetesProxyAuditFinalizer');
const PROXY_SOCKET_CLOSE_LISTENER = Symbol(
  'kubernetesProxySocketCloseListener',
);
const PROXY_PREPARED_TARGET = Symbol('kubernetesProxyPreparedTarget');

type ProxyAuditFinalizer = (error?: Error) => void;

type PreparedProxyTarget = {
  proxyTarget: any;
  rewrittenPath: string;
  cluster: ClusterDetails;
};

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
  permissionApi: PermissionsService;
};

/**
 * Options accepted as a parameter by the KubernetesProxy
 *
 * @public
 */
export type KubernetesProxyOptions = {
  logger: LoggerService;
  clusterSupplier: KubernetesClustersSupplier;
  authStrategy: AuthenticationStrategy;
  discovery: DiscoveryService;
  httpAuth: HttpAuthService;
  auditor: AuditorService;
};

/**
 * A proxy that routes requests to the Kubernetes API.
 *
 * @public
 */
export class KubernetesProxy {
  private readonly middlewareForClusterName = new Map<string, RequestHandler>();
  private readonly logger: LoggerService;
  private readonly clusterSupplier: KubernetesClustersSupplier;
  private readonly authStrategy: AuthenticationStrategy;
  private readonly httpAuth: HttpAuthService;
  private readonly auditor: AuditorService;

  constructor(options: KubernetesProxyOptions) {
    this.logger = options.logger;
    this.clusterSupplier = options.clusterSupplier;
    this.authStrategy = options.authStrategy;
    this.httpAuth = options.httpAuth;
    this.auditor = options.auditor;
  }

  public createRequestHandler(
    options: KubernetesProxyCreateRequestHandlerOptions,
  ): RequestHandler {
    const { permissionApi } = options;
    return async (req, res, next) => {
      const clusterNameHeader =
        req.headers[HEADER_KUBERNETES_CLUSTER.toLowerCase()];
      const clusterName =
        typeof clusterNameHeader === 'string' && clusterNameHeader.length > 0
          ? clusterNameHeader
          : 'unknown';
      const path = req.path || req.url.split('?')[0] || '';

      let clientDisconnected = false;
      const onSocketClose = () => {
        clientDisconnected = true;
      };
      req.socket.once('close', onSocketClose);

      let finalizeAudit: ProxyAuditFinalizer | undefined;
      let finishListenerAttached = false;
      try {
        const sanitizedReq = KubernetesProxy.createSanitizedRequest(req);
        const auditorEvent = await this.auditor.createEvent({
          eventId: 'cluster-fetch',
          severityLevel: 'medium',
          request: sanitizedReq,
          meta: { queryType: 'proxy', clusterName, method: req.method, path },
        });

        const auditContext = KubernetesProxy.createAuditFinalizer(
          auditorEvent,
          clusterName,
          this.logger,
        );
        finalizeAudit = auditContext.finalizeAudit;

        finishListenerAttached = await this.authorizeAndDispatch(
          req,
          res,
          next,
          permissionApi,
          finalizeAudit,
          auditContext.setResolvedClusterName,
          onSocketClose,
          () => clientDisconnected,
        );
      } catch (error) {
        req.socket.removeListener('close', onSocketClose);
        const err = error instanceof Error ? error : new Error(String(error));
        if (finalizeAudit && !finishListenerAttached) {
          finalizeAudit(err);
        }
        throw error;
      }
    };
  }

  /**
   * Authorizes the request, resolves the target cluster, and dispatches
   * to either the HTTP or WebSocket proxy path. Returns `true` when
   * HTTP finish listeners have been attached.
   */
  private async authorizeAndDispatch(
    req: Request,
    res: Response,
    next: NextFunction,
    permissionApi: PermissionsService,
    finalizeAudit: ProxyAuditFinalizer,
    setResolvedClusterName: (name: string) => void,
    onSocketClose: () => void,
    isClientDisconnected: () => boolean,
  ): Promise<boolean> {
    const authorizeResponse = await permissionApi.authorize(
      [{ permission: kubernetesProxyPermission }],
      { credentials: await this.httpAuth.credentials(req) },
    );

    if (authorizeResponse[0].result === AuthorizeResult.DENY) {
      req.socket.removeListener('close', onSocketClose);
      finalizeAudit(new NotAllowedError('Unauthorized'));
      res.status(403).json({
        error: serializeError(new NotAllowedError('Unauthorized')),
      });
      return false;
    }

    if (isClientDisconnected()) {
      finalizeAudit(new Error('Client disconnected before proxy dispatch'));
      return false;
    }

    const prepared = await this.prepareProxyTarget(req);
    setResolvedClusterName(prepared.cluster.name);
    (req as any)[PROXY_PREPARED_TARGET] = prepared;
    const middleware = this.getOrCreateMiddleware(prepared.cluster);

    if (isClientDisconnected()) {
      finalizeAudit(new Error('Client disconnected before proxy dispatch'));
      return false;
    }

    return KubernetesProxy.dispatchToProxy(
      req,
      res,
      next,
      middleware,
      finalizeAudit,
      onSocketClose,
    );
  }

  /**
   * Resolves the cluster, credentials, and target URL for a proxy request
   * before dispatching to the middleware. This ensures all async preparation
   * completes under the caller's try/catch, avoiding unhandled rejections
   * from http-proxy-middleware's fire-and-forget upgrade() path.
   */
  private async prepareProxyTarget(req: Request): Promise<PreparedProxyTarget> {
    const cluster = await this.getClusterForRequest(req);
    const url = new URL(cluster.url);

    const { bufferFromFileOrString } = await import('@kubernetes/client-node');

    const target: any = {
      protocol: url.protocol,
      host: url.hostname,
      port: url.port,
      ca: bufferFromFileOrString(cluster.caFile, cluster.caData)?.toString(),
    };

    const authHeader =
      req.headers[HEADER_KUBERNETES_AUTH.toLocaleLowerCase('en-US')];
    if (typeof authHeader === 'string') {
      req.headers.authorization = authHeader;
    } else {
      const authObj = KubernetesProxy.authHeadersToKubernetesRequestAuth(
        req.headers,
      );

      const credential = await this.authStrategy.getCredential(
        cluster,
        authObj,
      );

      if (credential.type === 'bearer token') {
        req.headers.authorization = `Bearer ${credential.token}`;
      } else if (credential.type === 'x509 client certificate') {
        target.key = credential.key;
        target.cert = credential.cert;
      }
    }

    const requestPath = req.originalUrl || req.url || '';
    const rewrittenPath = requestPath.replace(
      new RegExp(`^${req.baseUrl || ''}`),
      url.pathname || '',
    );

    return { proxyTarget: target, rewrittenPath, cluster };
  }

  // We create one middleware per remote cluster and hold on to them, because
  // the secure property isn't possible to decide on a per-request basis with a
  // single middleware instance - and we don't expect it to change over time.
  // Target resolution and path rewriting are handled per-request via the
  // PROXY_PREPARED_TARGET symbol stashed on each req by prepareProxyTarget.
  private getOrCreateMiddleware(cluster: ClusterDetails): RequestHandler {
    let middleware = this.middlewareForClusterName.get(cluster.name);
    if (!middleware) {
      const logger = this.logger.child({ cluster: cluster.name });
      middleware = createProxyMiddleware({
        logProvider: () => ({
          log: logger.info.bind(logger),
          debug: logger.debug.bind(logger),
          info: logger.info.bind(logger),
          warn: logger.warn.bind(logger),
          error: logger.error.bind(logger),
        }),
        // ws must be false to prevent http-proxy-middleware from auto-subscribing
        // to the server's 'upgrade' event, which would bypass Express routing and
        // skip audit event creation for WebSocket requests.
        ws: false,
        secure: !cluster.skipTLSVerify,
        changeOrigin: true,
        router: req => {
          return (req as any)[PROXY_PREPARED_TARGET]?.proxyTarget;
        },
        pathRewrite: (_path, req) => {
          return (req as any)[PROXY_PREPARED_TARGET]?.rewrittenPath ?? _path;
        },
        onError: (error, req, res) => {
          const wrappedError = new ForwardedError(
            `Cluster '${cluster.name}' request error`,
            error,
          );

          logger.error('Kubernetes proxy error', wrappedError);

          if (typeof (res as { status?: unknown }).status !== 'function') {
            return;
          }

          const body: ErrorResponseBody = {
            error: serializeError(wrappedError, {
              includeStack: process.env.NODE_ENV === 'development',
            }),
            request: { method: req.method, url: req.originalUrl },
            response: { statusCode: 500 },
          };
          res.status(500).json(body);
        },
        onProxyReqWs: KubernetesProxy.onProxyReqWs,
      });
      this.middlewareForClusterName.set(cluster.name, middleware);
    }
    return middleware;
  }

  /**
   * Returns a copy of the request with query parameters stripped from both
   * `originalUrl` and `url` so that sensitive values (e.g. exec command
   * arguments) are not written to central audit logs.
   */
  private static createSanitizedRequest(req: Request): Request {
    const sanitizedUrl = (req.originalUrl ?? req.url).split('?')[0];
    return Object.create(req, {
      originalUrl: { value: sanitizedUrl, enumerable: true },
      url: { value: sanitizedUrl, enumerable: true },
    });
  }

  /**
   * Builds a once-only audit finalizer that resolves the auditor event as
   * either success or failure. Returns a setter for the resolved cluster
   * name so downstream code can enrich the terminal metadata.
   */
  private static createAuditFinalizer(
    auditorEvent: AuditorServiceEvent,
    initialClusterName: string,
    logger: LoggerService,
  ): {
    finalizeAudit: ProxyAuditFinalizer;
    setResolvedClusterName: (name: string) => void;
  } {
    let resolvedClusterName: string | undefined;
    let finalized = false;

    const finalizeAudit: ProxyAuditFinalizer = error => {
      if (finalized) {
        return;
      }
      finalized = true;

      const terminalMeta =
        resolvedClusterName && resolvedClusterName !== initialClusterName
          ? { clusterName: resolvedClusterName }
          : undefined;
      const audit = error
        ? auditorEvent.fail({
            error,
            ...(terminalMeta && { meta: terminalMeta }),
          })
        : auditorEvent.success(
            terminalMeta ? { meta: terminalMeta } : undefined,
          );
      audit.catch(err => logger.error('Failed to emit proxy audit event', err));
    };

    return {
      finalizeAudit,
      setResolvedClusterName: (name: string) => {
        resolvedClusterName = name;
      },
    };
  }

  /**
   * Branches to WebSocket upgrade or HTTP middleware dispatch and wires
   * up the appropriate audit listeners. Returns `true` when HTTP finish
   * listeners have been attached (used by the caller's catch block to
   * avoid double-finalizing).
   */
  private static dispatchToProxy(
    req: Request,
    res: Response,
    next: NextFunction,
    middleware: RequestHandler,
    finalizeAudit: ProxyAuditFinalizer,
    onSocketClose: () => void,
  ): boolean {
    const isWebSocketUpgrade =
      (req.header('connection') ?? '')
        .toLowerCase()
        .split(',')
        .some(t => t.trim() === 'upgrade') &&
      req.header('upgrade')?.toLowerCase() === 'websocket';

    if (isWebSocketUpgrade) {
      (
        req as Request & {
          [PROXY_AUDIT_FINALIZER]?: ProxyAuditFinalizer;
          [PROXY_SOCKET_CLOSE_LISTENER]?: () => void;
        }
      )[PROXY_AUDIT_FINALIZER] = finalizeAudit;
      (req as any)[PROXY_SOCKET_CLOSE_LISTENER] = onSocketClose;

      try {
        middleware.upgrade!(req, req.socket, undefined);
      } catch (error) {
        req.socket.removeListener('close', onSocketClose);
        finalizeAudit(
          error instanceof Error ? error : new Error(String(error)),
        );
        throw error;
      }
      return false;
    }

    // HTTP path: remove the early close listener; HTTP audit listeners
    // on the response take over from here.
    req.socket.removeListener('close', onSocketClose);
    KubernetesProxy.attachHttpAuditListeners(res, finalizeAudit);
    middleware(req, res, next);
    return true;
  }

  /**
   * Lifecycle handler for WebSocket proxy requests. Reads the audit
   * finalizer and the early socket-close listener from the request,
   * then wires once-only listeners on `upgrade` (success), `response`
   * (upstream rejection), `error`, `socket error`, and `socket close`
   * to resolve the audit event exactly once. The first terminal
   * callback removes all observers to prevent leaks and duplicate
   * finalization.
   */
  private static onProxyReqWs(
    proxyReq: import('http').ClientRequest,
    req: import('http').IncomingMessage,
    socket: import('net').Socket,
  ): void {
    const typedReq = req as Request & {
      [PROXY_AUDIT_FINALIZER]?: ProxyAuditFinalizer;
      [PROXY_SOCKET_CLOSE_LISTENER]?: () => void;
    };

    const finalizeAudit = typedReq[PROXY_AUDIT_FINALIZER];
    const earlyCloseListener = typedReq[PROXY_SOCKET_CLOSE_LISTENER];
    if (!finalizeAudit) {
      return;
    }
    delete typedReq[PROXY_AUDIT_FINALIZER];
    delete typedReq[PROXY_SOCKET_CLOSE_LISTENER];

    const cleanups: (() => void)[] = [];
    const finalize = (error?: Error) => {
      finalizeAudit(error);
      cleanups.forEach(fn => fn());
      if (earlyCloseListener) {
        (req as Request).socket.removeListener('close', earlyCloseListener);
      }
    };

    const onUpgrade = () => finalize();
    const onResponse = (proxyRes: import('http').IncomingMessage) => {
      finalize(
        new Error(
          `Upstream rejected WebSocket upgrade with status ${proxyRes.statusCode}`,
        ),
      );
    };
    const onProxyError = (err: Error) => finalize(err);
    const onSocketError = (err: Error | unknown) =>
      finalize(err instanceof Error ? err : new Error(String(err)));
    const onSocketClose = () =>
      finalize(
        new Error('Client closed connection during WebSocket handshake'),
      );

    proxyReq.once('upgrade', onUpgrade);
    proxyReq.once('response', onResponse);
    proxyReq.once('error', onProxyError);
    socket.once('error', onSocketError);
    socket.once('close', onSocketClose);

    cleanups.push(
      () => proxyReq.removeListener('upgrade', onUpgrade),
      () => proxyReq.removeListener('response', onResponse),
      () => proxyReq.removeListener('error', onProxyError),
      () => socket.removeListener('error', onSocketError),
      () => socket.removeListener('close', onSocketClose),
    );
  }

  private static attachHttpAuditListeners(
    res: Response,
    finalizeAudit: ProxyAuditFinalizer,
  ): void {
    const finalizeFromResponse = () => {
      if (!res.writableFinished) {
        finalizeAudit(
          new Error('Client disconnected before response completed'),
        );
      } else if (res.statusCode >= 400) {
        finalizeAudit(
          new Error(`Proxy responded with status ${res.statusCode}`),
        );
      } else {
        finalizeAudit();
      }
    };

    const finalizeOnce = () => {
      res.removeListener('finish', finalizeOnce);
      res.removeListener('close', finalizeOnce);
      finalizeFromResponse();
    };

    res.once('finish', finalizeOnce);
    res.once('close', finalizeOnce);
  }

  private async getClusterForRequest(req: Request): Promise<ClusterDetails> {
    const { KubeConfig } = await import('@kubernetes/client-node');

    const clusterName = req.headers[HEADER_KUBERNETES_CLUSTER.toLowerCase()];
    const clusters = await this.clusterSupplier.getClusters({
      credentials: await this.httpAuth.credentials(req),
    });

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

    const authProvider =
      cluster.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];

    if (
      authProvider === 'serviceAccount' &&
      fs.pathExistsSync(SERVICEACCOUNT_CA_PATH) &&
      !cluster.authMetadata.serviceAccountToken
    ) {
      const kc = new KubeConfig();
      kc.loadFromCluster();
      const clusterFromKubeConfig = kc.getCurrentCluster() as Cluster;

      const url = new URL(clusterFromKubeConfig.server);
      cluster.url = clusterFromKubeConfig.server;
      if (url.protocol === 'https:') {
        cluster.caFile = clusterFromKubeConfig.caFile;
      }
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
    const headerSplit = header.split('-');
    if (headerSplit.length >= 4) {
      const framework = headerSplit[3].toLowerCase();
      if (headerSplit.length >= 5) {
        const provider = headerSplit.slice(4).join('-').toLowerCase();
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
