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

const http = require('http');
const https = require('https');

const errorMessage = 'Network requests are not allowed in tests';

const origHttpAgent = http.globalAgent;
const origHttpsAgent = https.globalAgent;
const origFetch = global.fetch;
const origXMLHttpRequest = global.fetch;

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

if (global.fetch) {
  global.fetch = async () => {
    throw new Error(errorMessage);
  };
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
