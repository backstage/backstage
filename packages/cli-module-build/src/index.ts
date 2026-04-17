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
      path: ['package', 'build'],
      description: 'Build a package for production deployment or publishing',
      execute: { loader: () => import('./commands/package/build') },
    });

    reg.addCommand({
      path: ['repo', 'build'],
      description:
        'Build packages in the project, excluding bundled app and backend packages.',
      execute: { loader: () => import('./commands/repo/build') },
    });

    reg.addCommand({
      path: ['package', 'bundle'],
      description:
        'Bundle a plugin for dynamic loading. Creates a self-contained plugin ' +
        'package that can be deployed and loaded dynamically by a Backstage application. ' +
        'Supports both backend and frontend plugins. Experimental.',
      experimental: true,
      execute: { loader: () => import('./commands/package/bundle') },
    });

    reg.addCommand({
      path: ['package', 'start'],
      description: 'Start a package for local development',
      execute: { loader: () => import('./commands/package/start') },
    });

    reg.addCommand({
      path: ['repo', 'start'],
      description: 'Starts packages in the repo for local development',
      execute: { loader: () => import('./commands/repo/start') },
    });

    reg.addCommand({
      path: ['package', 'clean'],
      description: 'Delete cache directories',
      execute: {
        loader: () => import('./commands/package/clean'),
      },
    });

    reg.addCommand({
      path: ['package', 'prepack'],
      description: 'Prepares a package for packaging before publishing',
      execute: {
        loader: () => import('./commands/package/prepack'),
      },
    });

    reg.addCommand({
      path: ['package', 'postpack'],
      description: 'Restores the changes made by the prepack command',
      execute: {
        loader: () => import('./commands/package/postpack'),
      },
    });

    reg.addCommand({
      path: ['repo', 'clean'],
      description: 'Delete cache and output directories',
      execute: {
        loader: () => import('./commands/repo/clean'),
      },
    });

    reg.addCommand({
      path: ['build-workspace'],
      description:
        'Builds a temporary dist workspace from the provided packages',
      execute: { loader: () => import('./commands/buildWorkspace') },
    });
  },
});
