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
  private readonly mkdocsPort: number;
  private readonly verbose: boolean;

  constructor(
    backstageBundleDir: string,
    backstagePort: number,
    mkdocsPort: number,
    verbose: boolean,
  ) {
    this.proxyEndpoint = '/api/techdocs/';
    this.backstageBundleDir = backstageBundleDir;
    this.backstagePort = backstagePort;
    this.mkdocsPort = mkdocsPort;
    this.verbose = verbose;
  }

  // Create a Proxy for mkdocs server
  private createProxy() {
    const proxy = httpProxy.createProxyServer({
      target: `http://localhost:${this.mkdocsPort}`,
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
