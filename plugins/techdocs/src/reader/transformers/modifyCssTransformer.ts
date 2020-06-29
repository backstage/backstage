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

import type { Transformer } from './index';

type ModifyCssTransformerOptions = {
  // Example: { '.md-container': { 'marginTop': '10px' }}
  cssTransforms: { [key: string]: { [key: string]: string }[] };
};

export const modifyCssTransformer = ({
  cssTransforms,
}: ModifyCssTransformerOptions): Transformer => {
  return dom => {
    Object.entries(cssTransforms).forEach(([cssSelector, cssChanges]) => {
      const elementsToChange = Array.from(
        dom.querySelectorAll<HTMLElement>(cssSelector),
      );
      if (elementsToChange.length < 1) return;

      cssChanges.forEach(changes => {
        elementsToChange.forEach((element: HTMLElement) => {
          Object.entries(changes).forEach(([cssProperty, cssValue]) => {
            element.style.setProperty(cssProperty, cssValue);
          });
        });
      });
    });

    return dom;
  };
};
