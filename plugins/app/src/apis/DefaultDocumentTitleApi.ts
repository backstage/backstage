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

import { DocumentTitleApi } from '@backstage/frontend-plugin-api';

/**
 * Default implementation of the {@link DocumentTitleApi}, which formats the
 * title segments using a template and writes the result to `document.title`.
 *
 * @internal
 */
export class DefaultDocumentTitleApi implements DocumentTitleApi {
  readonly #appTitle: string;
  readonly #template: string;
  readonly #separator: string;
  readonly #order: 'innermost-first' | 'outermost-first';

  constructor(options: {
    appTitle: string;
    template: string;
    separator: string;
    order: 'innermost-first' | 'outermost-first';
  }) {
    this.#appTitle = options.appTitle;
    this.#template = options.template;
    this.#separator = options.separator;
    this.#order = options.order;
  }

  setTitle(options: { segments: string[] }): void {
    document.title = this.format(options.segments);
  }

  format(segments: string[]): string {
    if (segments.length === 0) {
      return this.#appTitle;
    }
    const ordered =
      this.#order === 'innermost-first' ? segments.toReversed() : segments;
    return this.#template
      .replaceAll('{page}', ordered.join(this.#separator))
      .replaceAll('{app}', this.#appTitle);
  }
}
