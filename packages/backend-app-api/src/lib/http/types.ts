/*
 * Copyright 2023 The Backstage Authors
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

/**
 * An HTTP server extended with utility methods.
 *
 * @public
 */
export interface ExtendedHttpServer extends http.Server {
  start(): Promise<void>;

  stop(): Promise<void>;

  port(): number;
}

/**
 * Options for starting up an HTTP server.
 *
 * @public
 */
export type HttpServerOptions = {
  listen: {
    port: number;
    host: string;
  };
  https?: {
    certificate: HttpServerCertificateOptions;
  };
};

/**
 * Options for configuring HTTPS for an HTTP server.
 *
 * @public
 */
export type HttpServerCertificateOptions =
  | {
      type: 'plain';
      key: string;
      cert: string;
    }
  | {
      type: 'generated';
      hostname: string;
    };
