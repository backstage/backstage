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
      path: ['catalog', 'list'],
      description: 'List catalog entities with optional kind/type filter',
      execute: { loader: () => import('./commands/catalogList') },
    });
    reg.addCommand({
      path: ['catalog', 'get'],
      description: 'Get a specific catalog entity by name',
      execute: { loader: () => import('./commands/catalogGet') },
    });
    reg.addCommand({
      path: ['catalog', 'validate'],
      description: 'Validate entity YAML against the catalog schema',
      execute: { loader: () => import('./commands/catalogValidate') },
    });
    reg.addCommand({
      path: ['catalog', 'register'],
      description: 'Register a catalog entity from a location URL',
      execute: { loader: () => import('./commands/catalogRegister') },
    });
    reg.addCommand({
      path: ['catalog', 'unregister'],
      description: 'Unregister a catalog entity by location',
      execute: { loader: () => import('./commands/catalogUnregister') },
    });
  },
});
