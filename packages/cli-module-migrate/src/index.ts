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
import { createCliModule } from '@backstage/cli-node';
import packageJson from '../package.json';

export default createCliModule({
  packageJson,
  init: async reg => {
    reg.addCommand({
      path: ['versions:migrate'],
      description:
        'Migrate any plugins that have been moved to the @backstage-community namespace automatically',
      execute: { loader: () => import('./commands/versions/migrate') },
    });

    reg.addCommand({
      path: ['versions:bump'],
      description: 'Bump Backstage packages to the latest versions',
      execute: { loader: () => import('./commands/versions/bump') },
    });

    reg.addCommand({
      path: ['migrate', 'package-roles'],
      description: `Add package role field to packages that don't have it`,
      execute: {
        loader: () => import('./commands/packageRole'),
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-scripts'],
      description: 'Set package scripts according to each package role',
      execute: {
        loader: () => import('./commands/packageScripts'),
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-exports'],
      description: 'Synchronize package subpath export definitions',
      execute: {
        loader: () => import('./commands/packageExports'),
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-lint-configs'],
      description:
        'Migrates all packages to use @backstage/cli/config/eslint-factory',
      execute: {
        loader: () => import('./commands/packageLintConfigs'),
      },
    });

    reg.addCommand({
      path: ['migrate', 'react-router-deps'],
      description:
        'Migrates the react-router dependencies for all packages to be peer dependencies',
      execute: {
        loader: () => import('./commands/reactRouterDeps'),
      },
    });
  },
});
