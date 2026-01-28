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

const http = require('node:http');
const https = require('node:https');

const errorMessage = 'Network requests are not allowed in tests';

const origHttpAgent = http.globalAgent;
const origHttpsAgent = https.globalAgent;
const origFetch = global.fetch;
const origXMLHttpRequest = global.XMLHttpRequest;

http.globalAgent = new http.Agent({
  lookup() {
    throw new Error(errorMessage);
  },
});

https.globalAgent = new https.Agent({
  lookup() {
    throw new Error(errorMessage);
  },
});

const BLOCKING_FETCH_SYMBOL = Symbol.for(
  'backstage.jestRejectNetworkRequests.blockingFetch',
);

if (global.fetch) {
  const blockingFetch = async (input, init) => {
    // If global.fetch still has our marker, block the request
    if (global.fetch[BLOCKING_FETCH_SYMBOL]) {
      throw new Error(errorMessage);
    }
    // MSW (or something else) wrapped us - pass through
    return origFetch(input, init);
  };
  blockingFetch[BLOCKING_FETCH_SYMBOL] = true;
  global.fetch = blockingFetch;
}

if (global.XMLHttpRequest) {
  global.XMLHttpRequest = class {
    constructor() {
      throw new Error(errorMessage);
    }
  };
}

// Reset overrides after each suite to make sure we don't pollute the test environment
afterAll(() => {
  http.globalAgent = origHttpAgent;
  https.globalAgent = origHttpsAgent;
  global.fetch = origFetch;
  global.XMLHttpRequest = origXMLHttpRequest;
});
