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

import http from 'node:http';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import fs from 'fs-extra';
import WebSocket from 'ws';
import { patchZensicalConfig } from '@backstage/plugin-techdocs-backend-module-zensical';
import { injectLiveReloadElement, setCorsHeaders } from '../livereload';
import { EngineConfig } from './types';

let ws: WebSocket | null = null;
type Waiter = {
  resolve: (filePath: string) => void;
  reject: (e: Error) => void;
};
let pending: Waiter[] = [];

function settleAll(settle: (waiter: Waiter) => void) {
  const queued = pending;
  pending = [];
  queued.forEach(settle);
}

function getWs(targetAddress: string): WebSocket {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    return ws;
  }

  const socket = new WebSocket(targetAddress.replace(/^http/, 'ws'));
  ws = socket;

  socket.on('message', (data: WebSocket.Data) => {
    const filePath = data.toString();
    settleAll(waiter => waiter.resolve(filePath));
  });

  const fail = (error: Error) => {
    if (ws === socket) {
      ws = null;
      settleAll(waiter => waiter.reject(error));
    }
  };
  socket.on('close', () => fail(new Error('Zensical WebSocket closed')));
  socket.on('error', fail);

  return socket;
}

function waitForReload(targetAddress: string): Promise<string> {
  return new Promise((resolve, reject) => {
    pending.push({ resolve, reject });
    getWs(targetAddress);
  });
}

const LIVERELOAD_EPOCH = '1';
const LIVERELOAD_REQUEST_ID = '1';
const RELOAD_EPOCH = '999999';

// Zensical injects a <script type="module"> that opens a WebSocket back to
// the dev server for livereload. When proxied through the embedded preview
// app, that script would try to connect to the wrong port. We strip it and
// replace it with the <live-reload> custom element that the preview app's
// LiveReloadAddon understands (HTTP long-poll at /.livereload).
const ZENSICAL_WS_SCRIPT_RE =
  /<script type="module">[\s\S]*?new WebSocket[\s\S]*?<\/script>/;

export const zensicalConfig: EngineConfig = {
  binary: 'zensical',
  defaultImage: 'ghcr.io/backstage/techdocs-zensical',
  serveCommand: 'serve',
  startupLogPattern: 'Serving',
  buildArgs(_outputDir: string, configFile: string): string[] {
    return ['build', '-f', configFile];
  },
  serveArgs(port: string, options): string[] {
    const addr = options.useDocker ? `0.0.0.0:${port}` : `127.0.0.1:${port}`;
    return [
      'serve',
      '--dev-addr',
      addr,
      ...(options.configFile ? ['-f', options.configFile] : []),
    ];
  },
  async prepareServeConfig(configPath, logger) {
    // Same patching the backend generator applies, so preview == published.
    const siteDir = `.techdocs-zensical-serve-${randomUUID()}`;
    const patchedPath = await patchZensicalConfig(configPath, siteDir, logger);
    return {
      configPath: patchedPath,
      cleanup() {
        fs.removeSync(patchedPath);
        fs.removeSync(path.join(path.dirname(configPath), siteDir));
      },
    };
  },
  transformHtml(html: string): string {
    return injectLiveReloadElement(
      html.replace(ZENSICAL_WS_SCRIPT_RE, ''),
      LIVERELOAD_EPOCH,
      LIVERELOAD_REQUEST_ID,
    );
  },
  handleReloadRequest(
    _req: http.IncomingMessage,
    res: http.ServerResponse,
    targetAddress: string,
    _onError: (error: Error) => void,
  ): void {
    setCorsHeaders(res);

    waitForReload(targetAddress)
      .then(() => {
        res.statusCode = 200;
        res.end(RELOAD_EPOCH);
      })
      .catch(() => {
        // Non-200 makes the preview app's LiveReloadAddon retry after 3s.
        res.statusCode = 503;
        res.end('0');
      });
  },
};
