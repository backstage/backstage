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

/**
 * Extracts livereload parameters from mkdocs HTML and injects them as custom elements.
 * This function processes the HTML to add livereload support for the frontend addon.
 *
 * XXX(GabDug): Remove debug console.log
 */
function injectLivereloadParameters(html: string): string {
  // Extract livereload parameters from mkdocs HTML
  // XXX(GabDug): Test performance against very long docs
  // XXX(GabDug): Optimize, the script we read is always at the end of the body
  const livereloadMatch = html.match(/livereload\((\d+),\s*(\d+)\);/);

  if (livereloadMatch) {
    const [, epoch, requestId] = livereloadMatch;

    // Inject live-reload element in the body
    const liveReloadTag = `<live-reload live-reload-epoch="${epoch}" live-reload-request-id="${requestId}"></live-reload>`;
    const bodyEndIndex = html.indexOf('</body>');

    if (bodyEndIndex !== -1) {
      return (
        html.slice(0, bodyEndIndex) + liveReloadTag + html.slice(bodyEndIndex)
      );
    }
  }

  return html;
}

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
            // Handle HTML files with livereload parameter injection
            if (
              request.url?.endsWith('index.html') ||
              request.url?.endsWith('.html')
            ) {
              // Create a separate proxy for HTML files with selfHandleResponse
              const htmlProxy = httpProxy.createProxyServer({
                target: this.mkdocsTargetAddress,
                selfHandleResponse: true, // This allows us to handle the response ourselves
              });

              htmlProxy.on('error', (error: Error) => {
                reject(error);
              });

              // Set up response interception for HTML files
              htmlProxy.on('proxyRes', (proxyRes, _req, res) => {
                const contentType = proxyRes.headers['content-type'];
                if (
                  contentType &&
                  typeof contentType === 'string' &&
                  contentType.includes('text/html')
                ) {
                  let body = '';
                  proxyRes.on('data', chunk => {
                    body += chunk.toString();
                  });
                  proxyRes.on('end', () => {
                    const modifiedHtml = injectLivereloadParameters(body);
                    // Copy all headers from the original response, except Content-Length
                    Object.keys(proxyRes.headers).forEach(key => {
                      if (key.toLowerCase() !== 'content-length') {
                        res.setHeader(key, proxyRes.headers[key]!);
                      }
                    });
                    // Add CORS headers
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader(
                      'Access-Control-Allow-Methods',
                      'GET, OPTIONS',
                    );
                    res.end(modifiedHtml);
                  });
                } else {
                  // For non-HTML responses, copy headers and pipe the response
                  Object.keys(proxyRes.headers).forEach(key => {
                    res.setHeader(key, proxyRes.headers[key]!);
                  });
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                  proxyRes.pipe(res);
                }
              });

              const forwardPath =
                request.url?.replace(
                  new RegExp(`^${this.proxyEndpoint}`, 'i'),
                  '',
                ) || '';
              request.url = forwardPath;
              htmlProxy.web(request, response);
              return;
            }

            // Handle non-HTML files with regular proxy
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

          // This endpoint is used by the frontend to pass livereload parameters to the mkdocs server.
          if (request.url?.startsWith('/.livereload')) {
            // Proxy livereload requests to the mkdocs server
            // Transform /.livereload to /livereload for mkdocs server
            const livereloadPath = request.url.replace(
              '/.livereload',
              '/livereload',
            );
            const [proxy, _forwardPath] = proxyHandler(request);

            proxy.on('error', (error: Error) => {
              reject(error);
            });

            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            request.url = livereloadPath;
            proxy.web(request, response);
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
