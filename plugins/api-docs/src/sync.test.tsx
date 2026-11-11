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

import apiDocsPlugin from './alpha';
import apiDocsSyncPlugin from './sync';

describe('api-docs sync export', () => {
  it('holds the same extensions as the main export', () => {
    expect(apiDocsSyncPlugin.pluginId).toBe(apiDocsPlugin.pluginId);
    expect(apiDocsSyncPlugin.title).toBe(apiDocsPlugin.title);

    for (const id of [
      'api:api-docs/config',
      'entity-card:api-docs/has-apis',
    ] as const) {
      // The plugins wrap the same extension in a new object each, but the
      // functions inside are compared by reference, so this fails unless both
      // exports were built from the same extension.
      expect(apiDocsSyncPlugin.getExtension(id)).toEqual(
        apiDocsPlugin.getExtension(id),
      );
    }
    expect(() =>
      apiDocsSyncPlugin.getExtension(
        'entity-card:api-docs/definition' as 'api:api-docs/config',
      ),
    ).toThrow(/non-existent extension/);
  });
});
