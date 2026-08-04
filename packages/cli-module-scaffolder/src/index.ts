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
      path: ['template', 'list'],
      description: 'List available software templates',
      execute: { loader: () => import('./commands/templateList') },
    });
    reg.addCommand({
      path: ['template', 'execute'],
      description: 'Execute a software template',
      execute: { loader: () => import('./commands/templateExecute') },
    });
    reg.addCommand({
      path: ['template', 'dry-run'],
      description: 'Validate a software template without making changes',
      execute: { loader: () => import('./commands/templateDryRun') },
    });
  },
});
