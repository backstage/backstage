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

import transformer from '../reader/transformers';
import type { Transformer } from '../reader/transformers';

export type CreateTestShadowDomOptions = {
  transformers: Transformer[];
};

export const createTestShadowDom = (
  fixture: string,
  opts: CreateTestShadowDomOptions = { transformers: [] },
): ShadowRoot => {
  const divElement = document.createElement('div');
  divElement.attachShadow({ mode: 'open' });
  document.body.appendChild(divElement);

  const domParser = new DOMParser().parseFromString(fixture, 'text/html');
  divElement.shadowRoot?.appendChild(domParser.documentElement);

  if (opts.transformers) {
    transformer(divElement.shadowRoot!.children[0], opts.transformers);
  }

  return divElement.shadowRoot!;
};

export const getSample = (
  shadowDom: ShadowRoot,
  elementName: string,
  elementAttribute: string,
  sampleSize = 2,
) => {
  const rootElement = shadowDom.children[0];

  return Array.from(rootElement.getElementsByTagName(elementName))
    .filter(elem => {
      return elem.hasAttribute(elementAttribute);
    })
    .slice(0, sampleSize)
    .map(elem => {
      return elem.getAttribute(elementAttribute);
    });
};
