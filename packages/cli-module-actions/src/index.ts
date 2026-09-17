/*
 * Copyright 2025 The Backstage Authors
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

import { createCliModule } from '@backstage/cli-node';
import packageJson from '../package.json';

export default createCliModule({
  packageJson,
  init: async reg => {
    reg.addCommand({
      path: ['actions', 'list'],
      description: 'List available actions from configured plugin sources',
      execute: { loader: () => import('./commands/list') },
    });
    reg.addCommand({
      path: ['actions', 'execute'],
      description: 'Execute an action',
      execute: { loader: () => import('./commands/execute') },
    });
    reg.addCommand({
      path: ['actions', 'sources', 'add'],
      description: 'Add a plugin source for action discovery',
      execute: { loader: () => import('./commands/sourcesAdd') },
    });
    reg.addCommand({
      path: ['actions', 'sources', 'list'],
      description: 'List configured plugin sources',
      execute: { loader: () => import('./commands/sourcesList') },
    });
    reg.addCommand({
      path: ['actions', 'sources', 'remove'],
      description: 'Remove a plugin source',
      execute: { loader: () => import('./commands/sourcesRemove') },
    });
  },
});
