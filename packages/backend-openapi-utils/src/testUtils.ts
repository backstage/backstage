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
import { Express } from 'express';
import { Server } from 'node:http';
import { Proxy } from './proxy/setup';

const proxiesToCleanup: Set<Proxy> = new Set();

/**
 * !!! THIS CURRENTLY ONLY SUPPORTS SUPERTEST !!!
 * Setup a server with a custom OpenAPI proxy. This proxy will capture all requests and responses and make sure they
 *  conform to the spec.
 * @param app - express server, needed to ensure we have the correct ports for the proxy.
 * @returns - a configured HTTP server that should be used with supertest.
 * @public
 */
export async function wrapServer(app: Express): Promise<Server> {
  const proxy = new Proxy();
  proxiesToCleanup.add(proxy);
  await proxy.setup();

  const server = app.listen(proxy.forwardTo.port);
  await proxy.initialize(`http://localhost:${proxy.forwardTo.port}`, server);

  return { ...server, address: () => new URL(proxy.url) } as any;
}

let registered = false;
function registerHooks() {
  if (typeof afterAll !== 'function' || typeof beforeAll !== 'function') {
    return;
  }
  if (registered) {
    return;
  }
  registered = true;

  afterAll(async () => {
    const stopPromises = Array.from(proxiesToCleanup).map(proxy =>
      proxy.stop(),
    );
    await Promise.allSettled(stopPromises);
    proxiesToCleanup.clear();
  });
}

registerHooks();
