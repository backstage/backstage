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

import type { Transformer } from './transformer';

// See https://github.com/facebook/react/blob/f0cf832e1d0c8544c36aa8b310960885a11a847c/packages/react-dom-bindings/src/shared/sanitizeURL.js
const scriptProtocolPattern =
  // eslint-disable-next-line no-control-regex
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;

export const rewriteDocLinks = (): Transformer => {
  return dom => {
    const updateDom = <T extends Element>(
      list: Array<T>,
      attributeName: string,
    ): void => {
      Array.from(list)
        .filter(elem => elem.hasAttribute(attributeName))
        .forEach((elem: T) => {
          const elemAttribute = elem.getAttribute(attributeName);
          if (elemAttribute) {
            // if link is external, add target to open in a new window or tab
            if (elemAttribute.match(/^https?:\/\//i)) {
              elem.setAttribute('target', '_blank');
            }

            try {
              if (scriptProtocolPattern.test(elemAttribute)) {
                throw new TypeError(
                  `Invalid location ref '${elemAttribute}', target is a javascript: URL`,
                );
              }

              const normalizedWindowLocation = normalizeUrl(
                window.location.href,
              );
              elem.setAttribute(
                attributeName,
                new URL(elemAttribute, normalizedWindowLocation).toString(),
              );
            } catch (_e) {
              // Non-parseable links should be re-written as plain text.
              elem.replaceWith(elem.textContent || elemAttribute);
            }
          }
        });
    };

    updateDom(Array.from(dom.getElementsByTagName('a')), 'href');

    return dom;
  };
};

/** Make sure that the input url always ends with a '/' */
export function normalizeUrl(input: string): string {
  const url = new URL(input);

  if (!url.pathname.endsWith('/') && !url.pathname.endsWith('.html')) {
    url.pathname += '/';
  }

  return url.toString();
}
