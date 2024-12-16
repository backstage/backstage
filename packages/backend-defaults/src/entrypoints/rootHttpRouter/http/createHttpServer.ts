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

import * as http from 'http';
import * as https from 'https';
import { RequestListener } from 'http';
import { LoggerService } from '@backstage/backend-plugin-api';
import { HttpServerOptions, ExtendedHttpServer } from './types';
import { getGeneratedCertificate } from './getGeneratedCertificate';

/**
 * Creates a Node.js HTTP or HTTPS server instance.
 *
 * @public
 */
export async function createHttpServer(
  listener: RequestListener,
  options: HttpServerOptions,
  deps: { logger: LoggerService },
): Promise<ExtendedHttpServer> {
  const server = await createServer(listener, options, deps);
  return Object.assign(server, {
    start() {
      return new Promise<void>((resolve, reject) => {
        const handleStartupError = (error: Error) => {
          server.close();
          reject(error);
        };

        server.on('error', handleStartupError);

        const { host, port } = options.listen;
        server.listen(port, host, () => {
          server.off('error', handleStartupError);
          deps.logger.info(`Listening on ${host}:${port}`);
          resolve();
        });
      });
    },

    stop() {
      return new Promise<void>((resolve, reject) => {
        if (process.env.NODE_ENV === 'development') {
          // Ensure that various polling connections are shut down fast in development
          server.closeAllConnections();
        } else {
          server.closeIdleConnections();
        }
        server.close(error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },

    port() {
      const address = server.address();
      if (typeof address === 'string' || address === null) {
        throw new Error(`Unexpected server address '${address}'`);
      }
      return address.port;
    },
  });
}

async function createServer(
  listener: RequestListener,
  options: HttpServerOptions,
  deps: { logger: LoggerService },
): Promise<http.Server> {
  if (options.https) {
    const { certificate } = options.https;
    if (certificate.type === 'generated') {
      const credentials = await getGeneratedCertificate(
        certificate.hostname,
        deps.logger,
      );
      return https.createServer(credentials, listener);
    }
    return https.createServer(certificate, listener);
  }

  return http.createServer(listener);
}
