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

const TECHDOCS_CSS = /main\.[A-Fa-f0-9]{8}\.min\.css$/;
const GOOGLE_FONTS = /^https:\/\/fonts\.googleapis\.com/;
const GSTATIC_FONTS = /^https:\/\/fonts\.gstatic\.com/;

export const safeLinksHook = (node: Element) => {
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

import DOMPurify from 'dompurify';
import type { Transformer } from './transformer';

export const sanitizeDOM = (): Transformer => {
  return dom => {
    DOMPurify.addHook('afterSanitizeAttributes', safeLinksHook);
    return DOMPurify.sanitize(dom.innerHTML, {
      ADD_TAGS: ['link'],
      FORBID_TAGS: ['style'],
      WHOLE_DOCUMENT: true,
      RETURN_DOM: true,
    });
  };
};
