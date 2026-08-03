/*
 * Copyright 2026 The Backstage Authors
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
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://backstage.io/',
});

Object.defineProperties(globalThis, {
  window: { configurable: true, value: dom.window },
  document: { configurable: true, value: dom.window.document },
  navigator: { configurable: true, value: dom.window.navigator },
  Node: { configurable: true, value: dom.window.Node },
  HTMLElement: { configurable: true, value: dom.window.HTMLElement },
  HTMLAnchorElement: {
    configurable: true,
    value: dom.window.HTMLAnchorElement,
  },
  Event: { configurable: true, value: dom.window.Event },
  MutationObserver: {
    configurable: true,
    value: dom.window.MutationObserver,
  },
  getComputedStyle: {
    configurable: true,
    value: dom.window.getComputedStyle.bind(dom.window),
  },
});

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

require.extensions['.scss'] = module => {
  const classNames = new Proxy(
    {},
    {
      get: (_target, property) => String(property),
    },
  );
  module.exports = { __esModule: true, default: classNames };
};

export function closeTestDom() {
  dom.window.close();
}
