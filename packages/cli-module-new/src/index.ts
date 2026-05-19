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
import { NotImplementedError } from '@backstage/errors';
import packageJson from '../package.json';

export default createCliModule({
  packageJson,
  init: async reg => {
    reg.addCommand({
      path: ['new'],
      description:
        'Open up an interactive guide to creating new things in your app',
      execute: { loader: () => import('./commands/new') },
    });

    reg.addCommand({
      path: ['create'],
      description: 'Create a new Backstage app',
      deprecated: true,
      execute: async () => {
        throw new NotImplementedError(
          `This command has been removed, use 'backstage-cli new' instead`,
        );
      },
    });
    reg.addCommand({
      path: ['create-plugin'],
      description: 'Create a new Backstage plugin',
      deprecated: true,
      execute: async () => {
        throw new NotImplementedError(
          `This command has been removed, use 'backstage-cli new' instead`,
        );
      },
    });
  },
});
