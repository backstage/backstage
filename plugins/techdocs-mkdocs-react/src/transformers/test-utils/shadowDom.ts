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

import { SHADOW_DOM_STYLE_LOAD_EVENT } from '@backstage/plugin-techdocs-react';
import type { Transformer } from '..';
import { transform as transformer } from '..';

export type CreateTestShadowDomOptions = {
  preTransformers: Transformer[];
  postTransformers: Transformer[];
};

export const createTestShadowDom = async (
  fixture: string,
  opts: CreateTestShadowDomOptions = {
    preTransformers: [],
    postTransformers: [],
  },
): Promise<ShadowRoot> => {
  const divElement = document.createElement('div');
  divElement.attachShadow({ mode: 'open' });
  document.body.appendChild(divElement);

  // Transformers before the UI is rendered
  let dom: Element | HTMLElement = new DOMParser().parseFromString(
    fixture,
    'text/html',
  ).documentElement;
  if (opts.preTransformers) {
    dom = await transformer(dom, opts.preTransformers);
  }

  // Mount the UI
  divElement.shadowRoot?.appendChild(dom);

  // Transformers after the UI is rendered
  if (opts.postTransformers) {
    await transformer(dom, opts.postTransformers);
  }

  // Simulate event dispatched after all styles are loaded
  dom.dispatchEvent(new CustomEvent(SHADOW_DOM_STYLE_LOAD_EVENT));

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
