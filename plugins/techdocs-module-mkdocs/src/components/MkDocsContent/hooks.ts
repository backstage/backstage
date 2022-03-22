/*
 * Copyright 2022 The Backstage Authors
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

const TECHDOCS_CSS = /main\.[A-Fa-f0-9]{8}\.min\.css$/;
const GOOGLE_FONTS = /^https:\/\/fonts\.googleapis\.com/;
const GSTATIC_FONTS = /^https:\/\/fonts\.gstatic\.com/;

export const afterSanitizeAttributes = (node: Element) => {
  if (node.nodeName && node.nodeName === 'LINK') {
    const href = node.getAttribute('href') || '';
    if (href.match(TECHDOCS_CSS)) {
      node.setAttribute('rel', 'stylesheet');
    }
    if (href.match(GOOGLE_FONTS)) {
      node.setAttribute('rel', 'stylesheet');
    }
    if (href.match(GSTATIC_FONTS)) {
      node.setAttribute('rel', 'preconnect');
    }
  }
  return node;
};

export const beforeSanitizeElements = (allowedIframeHosts: string[] = []) => {
  return (node: Element) => {
    if (node.nodeName === 'IFRAME') {
      const src = node.getAttribute('src');
      if (!src) {
        node.remove();
        return node;
      }

      try {
        const srcUrl = new URL(src);
        const isMatch = allowedIframeHosts.some(host => srcUrl.host === host);
        if (!isMatch) {
          node.remove();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid iframe src, ${error}`);
        node.remove();
      }
    }
    return node;
  };
};
