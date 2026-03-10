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
import { createCliPlugin } from '../../wiring/factory';

export default createCliPlugin({
  pluginId: 'translations',
  init: async reg => {
    reg.addCommand({
      path: ['translations', 'export'],
      description:
        'Export translation messages from an app and all of its frontend plugins to JSON files',
      execute: { loader: () => import('./commands/export') },
    });

    reg.addCommand({
      path: ['translations', 'import'],
      description:
        'Generate translation resource wiring from translated JSON files',
      execute: { loader: () => import('./commands/import') },
    });
  },
});
