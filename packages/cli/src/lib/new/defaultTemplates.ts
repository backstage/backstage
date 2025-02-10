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

export const defaultTemplates = [
  {
    id: 'backend-module',
    target: require.resolve(
      '@backstage/cli/templates/default-backend-module.yaml',
    ),
  },
  {
    id: 'backend-plugin',
    target: require.resolve(
      '@backstage/cli/templates/default-backend-plugin.yaml',
    ),
  },
  {
    id: 'plugin-common',
    target: require.resolve(
      '@backstage/cli/templates/default-common-plugin-package.yaml',
    ),
  },
  {
    id: 'plugin-node',
    target: require.resolve(
      '@backstage/cli/templates/default-node-plugin-package.yaml',
    ),
  },
  {
    id: 'frontend-plugin',
    target: require.resolve('@backstage/cli/templates/default-plugin.yaml'),
  },
  {
    id: 'plugin-react',
    target: require.resolve(
      '@backstage/cli/templates/default-react-plugin-package.yaml',
    ),
  },
  {
    id: 'node-library',
    target: require.resolve(
      '@backstage/cli/templates/node-library-package.yaml',
    ),
  },
  {
    id: 'web-library',
    target: require.resolve(
      '@backstage/cli/templates/web-library-package.yaml',
    ),
  },
  {
    id: 'scaffolder-module',
    target: require.resolve('@backstage/cli/templates/scaffolder-module.yaml'),
  },
];
