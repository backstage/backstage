/*
 * Copyright 2020 Spotify AB
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

export default class HTTPServer {
  proxyEndpoint: string;

  constructor(public dir: string, public port: number) {
    this.proxyEndpoint = '/api/';
  }

  private createProxy() {
    const proxy = httpProxy.createProxyServer({
      target: 'http://localhost:8000',
    });

    return (request: http.IncomingMessage): [httpProxy, string] => {
      const [, ...pathChunks] =
        request.url?.substring(this.proxyEndpoint.length).split('/') ?? [];
      const forwardPath = pathChunks.join('/');

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

            request.url = forwardPath;
            return proxy.web(request, response);
          }

          return serveHandler(request, response, {
            public: this.dir,
            trailingSlash: true,
            rewrites: [{ source: '**', destination: 'index.html' }],
          });
        },
      );

      server.listen(this.port, () => {
        console.log(
          '[techdocs-preview-bundle] Running local version of Backstage at http://localhost:3000',
        );
        resolve(server);
      });

      server.on('error', (error: Error) => {
        reject(error);
      });
    });
  }
}
