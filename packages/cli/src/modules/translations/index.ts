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
import yargs from 'yargs';
import { createCliPlugin } from '../../wiring/factory';
import { lazy } from '../../lib/lazy';

export default createCliPlugin({
  pluginId: 'translations',
  init: async reg => {
    reg.addCommand({
      path: ['translations', 'export'],
      description:
        'Export translation messages from all frontend plugins to JSON files',
      execute: async ({ args }) => {
        const argv = await yargs()
          .options({
            output: {
              type: 'string',
              default: 'translations',
              description:
                'Output directory for exported messages and manifest',
            },
          })
          .help()
          .parse(args);
        await lazy(() => import('./commands/export'), 'default')(argv);
      },
    });

    reg.addCommand({
      path: ['translations', 'import'],
      description:
        'Generate translation resource wiring from translated JSON files',
      execute: async ({ args }) => {
        const argv = await yargs()
          .options({
            input: {
              type: 'string',
              default: 'translations',
              description:
                'Input directory containing the manifest and translated message files',
            },
            output: {
              type: 'string',
              default: 'src/translations/resources.ts',
              description: 'Output path for the generated wiring module',
            },
          })
          .help()
          .parse(args);
        await lazy(() => import('./commands/import'), 'default')(argv);
      },
    });
  },
});
