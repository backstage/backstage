/*
 * Copyright 2024 The Backstage Authors
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

import * as mockttp from 'mockttp';
import { OpenApiProxyValidator } from '../schema/validation';

export class Proxy {
  server: mockttp.Mockttp;
  #openRequests: Record<string, mockttp.CompletedRequest> = {};
  requestResponsePairs = new Map<
    mockttp.CompletedRequest,
    mockttp.CompletedResponse
  >();
  validator: OpenApiProxyValidator;
  constructor() {
    this.server = mockttp.getLocal();
    this.validator = new OpenApiProxyValidator();
  }

  async setup() {
    await this.server.start();
    this.server
      .forAnyRequest()
      .thenForwardTo(`http://localhost:${process.env.PORT}`);
    await this.server.on('request', request => {
      this.#openRequests[request.id] = request;
    });
    await this.server.on('response', response => {
      const request = this.#openRequests[response.id];
      if (request) {
        this.requestResponsePairs.set(request, response);
      }
      delete this.#openRequests[response.id];
      this.validator.validate(request, response).catch(err => {
        if (process.env.THROW) {
          throw err;
        }
        console.error(err);
      });
    });
  }

  async initialize() {
    await this.validator.initialize(
      `http://localhost:${process.env.PORT}/openapi.json`,
    );
  }

  stop() {
    if (Object.keys(this.#openRequests).length > 0) {
      throw new Error('There are still open requests');
    }
    this.server.stop();
  }

  get url() {
    return this.server.proxyEnv.HTTP_PROXY;
  }
}
