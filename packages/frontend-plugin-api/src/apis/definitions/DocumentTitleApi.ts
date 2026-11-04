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

import { createApiRef } from '../system';

/**
 * Writes the document title of the app.
 *
 * @remarks
 *
 * The app collects page title segments registered with
 * {@link PageTitle} and
 * {@link usePageTitle}, and passes them to this
 * API whenever they change. The default implementation formats the segments
 * using a configurable template and sets `document.title`. Replace this API to
 * change the format, or to write the title through a different library.
 *
 * Plugins should not call this API directly, but register title segments
 * instead.
 *
 * @alpha
 */
export interface DocumentTitleApi {
  /**
   * Updates the document title.
   */
  setTitle(options: {
    /**
     * The registered page title segments, ordered from the outermost page to
     * the innermost one.
     */
    segments: string[];
  }): void;
}

/**
 * The {@link ApiRef} of {@link DocumentTitleApi}.
 *
 * @alpha
 */
export const documentTitleApiRef = createApiRef<DocumentTitleApi>().with({
  id: 'core.document-title',
  pluginId: 'app',
});
