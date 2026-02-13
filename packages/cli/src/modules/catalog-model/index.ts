/*
 * Copyright 2024 The Backstage Authors
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
  pluginId: 'catalog-model',
  init: async reg => {
    reg.addCommand({
      path: ['repo', 'catalog-model', 'generate'],
      description:
        'Generate typed entity interfaces from catalog model extensions',
      execute: async ({ args }) => {
        const argv = await yargs()
          .options({
            config: {
              type: 'string',
              description: 'Path to app-config.yaml for config-driven kinds',
            },
            output: {
              type: 'string',
              description:
                'Output directory for generated types (default: packages/catalog-model-generated)',
            },
          })
          .help()
          .parse(args);
        await lazy(() => import('./commands/generate'), 'default')(argv);
      },
    });
  },
});
