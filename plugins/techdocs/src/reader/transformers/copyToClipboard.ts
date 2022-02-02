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

import type { Transformer } from './transformer';

/**
 * Recreates copy-to-clipboard functionality attached to <code> snippets that
 * is native to mkdocs-material theme.
 */
export const copyToClipboard = (): Transformer => {
  return dom => {
    Array.from(dom.querySelectorAll('pre > code')).forEach(codeElem => {
      const button = document.createElement('button');
      const toBeCopied = codeElem.textContent || '';
      button.className = 'md-clipboard md-icon';
      button.title = 'Copy to clipboard';
      button.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg>';
      button.addEventListener('click', () =>
        navigator.clipboard.writeText(toBeCopied),
      );
      codeElem?.parentElement?.prepend(button);
    });
    return dom;
  };
};
