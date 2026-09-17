/*
 * Copyright 2026 The Backstage Authors
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

import type {
  AuditorService,
  AuditorServiceEvent,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type { Request, Response } from 'express';

const PROXY_WEBSOCKET_AUDIT = Symbol('kubernetesProxyWebSocketAudit');

type WebSocketAuditContext = {
  session: ProxyAuditSession;
  onSocketClose: () => void;
};

/**
 * Tracks a single proxy request through audit event creation and finalization.
 * When no auditor is configured every method is a no-op.
 */
export class ProxyAuditSession {
  private resolvedClusterName?: string;
  private finalized = false;

  private constructor(
    private readonly event: AuditorServiceEvent | undefined,
    private readonly initialClusterName: string,
    private readonly logger: LoggerService,
  ) {}

  static async start(
    auditor: AuditorService | undefined,
    options: {
      req: Request;
      clusterName: string;
      method: string | undefined;
      path: string;
      logger: LoggerService;
    },
  ): Promise<ProxyAuditSession> {
    if (!auditor) {
      return new ProxyAuditSession(
        undefined,
        options.clusterName,
        options.logger,
      );
    }

    const sanitizedUrl = (options.req.originalUrl ?? options.req.url).split(
      '?',
    )[0];
    const sanitizedRequest = Object.create(options.req, {
      originalUrl: { value: sanitizedUrl, enumerable: true },
      url: { value: sanitizedUrl, enumerable: true },
    });

    const event = await auditor.createEvent({
      eventId: 'cluster-fetch',
      severityLevel: 'medium',
      request: sanitizedRequest,
      meta: {
        queryType: 'proxy',
        clusterName: options.clusterName,
        method: options.method,
        path: options.path,
      },
    });

    return new ProxyAuditSession(event, options.clusterName, options.logger);
  }

  setResolvedClusterName(name: string): void {
    this.resolvedClusterName = name;
  }

  finalize(error?: Error): void {
    if (this.finalized) {
      return;
    }
    this.finalized = true;

    if (!this.event) {
      return;
    }

    const terminalMeta =
      this.resolvedClusterName &&
      this.resolvedClusterName !== this.initialClusterName
        ? { clusterName: this.resolvedClusterName }
        : undefined;

    const audit = error
      ? this.event.fail({
          error,
          ...(terminalMeta && { meta: terminalMeta }),
        })
      : this.event.success(terminalMeta ? { meta: terminalMeta } : undefined);

    audit.catch(err =>
      this.logger.error('Failed to emit proxy audit event', err),
    );
  }

  attachToHttpResponse(res: Response): void {
    const finalizeFromResponse = () => {
      if (!res.writableFinished) {
        this.finalize(
          new Error('Client disconnected before response completed'),
        );
      } else if (res.statusCode >= 400) {
        this.finalize(
          new Error(`Proxy responded with status ${res.statusCode}`),
        );
      } else {
        this.finalize();
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

  prepareForWebSocketUpgrade(req: Request, onSocketClose: () => void): void {
    (req as Request & { [PROXY_WEBSOCKET_AUDIT]?: WebSocketAuditContext })[
      PROXY_WEBSOCKET_AUDIT
    ] = { session: this, onSocketClose };
  }

  static handleWebSocketProxyReq(
    proxyReq: import('http').ClientRequest,
    req: import('http').IncomingMessage,
    socket: import('net').Socket,
  ): void {
    const typedReq = req as Request & {
      [PROXY_WEBSOCKET_AUDIT]?: WebSocketAuditContext;
    };
    const context = typedReq[PROXY_WEBSOCKET_AUDIT];
    if (!context) {
      return;
    }
    delete typedReq[PROXY_WEBSOCKET_AUDIT];

    const { session, onSocketClose } = context;
    const cleanups: (() => void)[] = [];
    const finalize = (error?: Error) => {
      session.finalize(error);
      cleanups.forEach(fn => fn());
      req.socket.removeListener('close', onSocketClose);
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
    const onSocketClosed = () =>
      finalize(
        new Error('Client closed connection during WebSocket handshake'),
      );

    proxyReq.once('upgrade', onUpgrade);
    proxyReq.once('response', onResponse);
    proxyReq.once('error', onProxyError);
    socket.once('error', onSocketError);
    socket.once('close', onSocketClosed);

    cleanups.push(
      () => proxyReq.removeListener('upgrade', onUpgrade),
      () => proxyReq.removeListener('response', onResponse),
      () => proxyReq.removeListener('error', onProxyError),
      () => socket.removeListener('error', onSocketError),
      () => socket.removeListener('close', onSocketClosed),
    );
  }
}
