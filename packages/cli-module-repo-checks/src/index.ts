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

import { createCliModule } from '@backstage/cli-node';
import packageJson from '../package.json';

export default createCliModule({
  packageJson,
  init: async reg => {
    reg.addCommand({
      path: ['type-deps'],
      description: 'Find inconsistencies in types of all packages and plugins',
      execute: {
        loader: () => import('./commands/type-deps'),
      },
    });

    reg.addCommand({
      path: ['peer-deps'],
      description:
        'Ensure your packages are using the correct peer dependency format.',
      execute: {
        loader: () => import('./commands/peer-deps'),
      },
    });

    reg.addCommand({
      path: ['generate-catalog-info'],
      description: 'Create or fix info yaml files for all backstage packages',
      execute: {
        loader: () => import('./commands/generate-catalog-info'),
      },
    });

    reg.addCommand({
      path: ['lint', 'legacy-backend-exports'],
      description:
        'Lint backend plugin packages for legacy exports and make sure it conforms to the new export pattern',
      execute: {
        loader: () => import('./commands/lint/legacy-backend-exports'),
      },
    });
  },
});
