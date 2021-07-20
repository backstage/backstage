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

// @ts-ignore
import sanitizeHtml from 'sanitize-html';
import type { Transformer } from '../transformer';
import DOMPurify from 'dompurify';

// TODO(freben): move all of this out of index

export const sanitizeDOM = (): Transformer => {
  return dom => {
    return DOMPurify.sanitize(dom.innerHTML, {
      // TODO: hmm...  https://security.stackexchange.com/questions/205975/is-xss-in-canonical-link-possible
      ADD_TAGS: ['link'],
      WHOLE_DOCUMENT: true,
      RETURN_DOM: true,
    });
  };
};
