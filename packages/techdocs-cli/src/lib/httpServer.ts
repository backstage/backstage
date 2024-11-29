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

import serveHandler from 'serve-handler';
import http from 'http';
import httpProxy from 'http-proxy';
import { createLogger } from './utility';

export default class HTTPServer {
  private readonly proxyEndpoint: string;
  private readonly backstageBundleDir: string;
  private readonly backstagePort: number;
  private readonly mkdocsTargetAddress: string;
  private readonly verbose: boolean;

  constructor(
    backstageBundleDir: string,
    backstagePort: number,
    mkdocsTargetAddress: string,
    verbose: boolean,
  ) {
    this.proxyEndpoint = '/api/techdocs/';
    this.backstageBundleDir = backstageBundleDir;
    this.backstagePort = backstagePort;
    this.mkdocsTargetAddress = mkdocsTargetAddress;
    this.verbose = verbose;
  }

  // Create a Proxy for mkdocs server
  private createProxy() {
    const proxy = httpProxy.createProxyServer({
      target: this.mkdocsTargetAddress,
    });

    return (request: http.IncomingMessage): [httpProxy, string] => {
      // If the request path is prefixed with this.proxyEndpoint, remove it.
      const proxyEndpointPath = new RegExp(`^${this.proxyEndpoint}`, 'i');
      const forwardPath = request.url?.replace(proxyEndpointPath, '') || '';

      return [proxy, forwardPath];
    };
  }

  public async serve(): Promise<http.Server> {
    return new Promise<http.Server>((resolve, reject) => {
      const proxyHandler = this.createProxy();
      const server = http.createServer(
        (request: http.IncomingMessage, response: http.ServerResponse) => {
          // This endpoind is used by the frontend to issue a cookie for the user.
          // But the MkDocs server doesn't expose it as a the Backestage backend does.
          // So we need to fake it here to prevent 404 errors.
          if (request.url === '/api/techdocs/.backstage/auth/v1/cookie') {
            const oneHourInMilliseconds = 60 * 60 * 1000;
            const expiresAt = new Date(Date.now() + oneHourInMilliseconds);
            const cookie = { expiresAt: expiresAt.toISOString() };
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(cookie));
            return;
          }

          if (request.url?.startsWith(this.proxyEndpoint)) {
            const [proxy, forwardPath] = proxyHandler(request);

            proxy.on('error', (error: Error) => {
              reject(error);
            });

            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

            request.url = forwardPath;
            proxy.web(request, response);
            return;
          }

          // This endpoint is used by the frontend to detect where the backend is running.
          if (request.url === '/.detect') {
            response.setHeader('Content-Type', 'text/plain');
            response.end('techdocs-cli-server');
            return;
          }

          serveHandler(request, response, {
            public: this.backstageBundleDir,
            trailingSlash: true,
            rewrites: [{ source: '**', destination: 'index.html' }],
          });
        },
      );

      const logger = createLogger({ verbose: false });
      server.listen(this.backstagePort, () => {
        if (this.verbose) {
          logger.info(
            `[techdocs-preview-bundle] Running local version of Backstage at http://localhost:${this.backstagePort}`,
          );
        }
        resolve(server);
      });

      server.on('error', (error: Error) => {
        reject(error);
      });
    });
  }
}
