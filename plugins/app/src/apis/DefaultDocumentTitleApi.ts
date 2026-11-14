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

import { ConfigApi, DocumentTitleApi } from '@backstage/frontend-plugin-api';

const DEFAULT_APP_TITLE = 'Backstage';

function readAppTitle(configApi: ConfigApi) {
  return configApi.getOptionalString('app.title') || DEFAULT_APP_TITLE;
}

/**
 * Default implementation of the {@link DocumentTitleApi}, which formats the
 * title segments using a template and writes the result to `document.title`.
 *
 * @remarks
 *
 * The app title is read from the `app.title` configuration value, and the
 * document title is updated if that value changes.
 *
 * @internal
 */
export class DefaultDocumentTitleApi implements DocumentTitleApi {
  readonly #template: string;
  readonly #separator: string;
  readonly #order: 'innermost-first' | 'outermost-first';
  #appTitle: string;
  #segments: string[] | undefined;

  constructor(options: {
    configApi: ConfigApi;
    template: string;
    separator: string;
    order: 'innermost-first' | 'outermost-first';
  }) {
    this.#template = options.template;
    this.#separator = options.separator;
    this.#order = options.order;

    const { configApi } = options;
    this.#appTitle = readAppTitle(configApi);
    configApi.subscribe?.(() => {
      const appTitle = readAppTitle(configApi);
      if (appTitle !== this.#appTitle) {
        this.#appTitle = appTitle;
        // Only rewrite the title if it has been set at least once
        if (this.#segments) {
          this.#write();
        }
      }
    });
  }

  setTitle(options: { segments: string[] }): void {
    this.#segments = [...options.segments];
    this.#write();
  }

  format(segments: string[]): string {
    if (segments.length === 0) {
      return this.#appTitle;
    }
    const ordered =
      this.#order === 'innermost-first' ? segments.toReversed() : segments;
    const values: Record<string, string> = {
      page: ordered.join(this.#separator),
      app: this.#appTitle,
    };
    // Both placeholders are replaced in a single pass with a callback, so that
    // the titles are inserted literally even if they contain placeholders or
    // replacement patterns such as `$&`
    return this.#template.replace(/\{(page|app)\}/g, (_, key) => values[key]);
  }

  #write() {
    const title = this.format(this.#segments ?? []);
    if (document.title !== title) {
      document.title = title;
    }
  }
}
