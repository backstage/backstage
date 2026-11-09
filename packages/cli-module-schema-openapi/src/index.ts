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
      path: ['package', 'schema', 'openapi', 'generate'],
      description:
        'Command to generate a client and/or a server stub from an OpenAPI spec.',
      execute: {
        loader: () =>
          import('./commands/package/schema/openapi/generateCommand'),
      },
    });

    reg.addCommand({
      path: ['package', 'schema', 'openapi', 'validate'],
      description:
        'Validate that the OpenAPI spec is a valid OpenAPI 3.x document.',
      execute: {
        loader: () =>
          import('./commands/package/schema/openapi/validateCommand'),
      },
    });

    reg.addCommand({
      path: ['package', 'schema', 'openapi', 'fuzz'],
      description:
        'Fuzz an OpenAPI schema by generating random data and sending it to the server.',
      execute: {
        loader: () => import('./commands/package/schema/openapi/fuzzCommand'),
      },
    });

    reg.addCommand({
      path: ['package', 'schema', 'openapi', 'diff'],
      description: 'Diff the OpenAPI spec of a package against a specific ref.',
      execute: {
        loader: () => import('./commands/package/schema/openapi/diffCommand'),
      },
    });

    reg.addCommand({
      path: ['repo', 'schema', 'openapi', 'validate'],
      description:
        'Validate that all OpenAPI schemas are valid and set up correctly.',
      execute: {
        loader: () => import('./commands/repo/schema/openapi/validateCommand'),
      },
    });

    reg.addCommand({
      path: ['repo', 'schema', 'openapi', 'verify'],
      description: 'Deprecated: use validate instead.',
      deprecated: true,
      execute: {
        loader: () => import('./commands/repo/schema/openapi/verifyCommand'),
      },
    });

    reg.addCommand({
      path: ['repo', 'schema', 'openapi', 'lint'],
      description: 'Lint OpenAPI schemas.',
      execute: {
        loader: () => import('./commands/repo/schema/openapi/lintCommand'),
      },
    });

    reg.addCommand({
      path: ['repo', 'schema', 'openapi', 'fuzz'],
      description: 'Fuzz all packages',
      execute: {
        loader: () => import('./commands/repo/schema/openapi/fuzzCommand'),
      },
    });

    reg.addCommand({
      path: ['repo', 'schema', 'openapi', 'diff'],
      description:
        'Diff all OpenAPI specs in the repository against a specific ref.',
      execute: {
        loader: () => import('./commands/repo/schema/openapi/diffCommand'),
      },
    });
  },
});
