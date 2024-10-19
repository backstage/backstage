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
import { CliInitializer } from '../../wiring/Command';
import { z } from 'zod';

(async () => {
  const initializer = new CliInitializer();
  initializer.addCommand({
    path: ['config:docs'],
    description: 'Browse the configuration reference documentation',
    schema: z.object({
      package: z.string().optional(),
    }),
    execute: async options => {
      const m = await import('./commands/docs');
      await m.default(options);
    },
  });
  initializer.addCommand({
    path: ['config:print'],
    description: 'Print the app configuration for the current package',
    schema: z.object({
      package: z.string().optional(),
      lax: z.boolean().optional(),
      frontend: z.boolean().optional(),
      'with-secrets': z.boolean().optional(),
      format: z.enum(['json', 'yaml']).optional(),
      config: z.array(z.string()).optional(),
    }),
    execute: async options => {
      const m = await import('./commands/print');
      await m.default(options);
    },
  });
  initializer.addCommand({
    path: ['config:check'],
    description:
      'Validate that the given configuration loads and matches schema',
    schema: z.object({
      package: z.string().optional(),
      lax: z.boolean().optional(),
      frontend: z.boolean().optional(),
      deprecated: z.boolean().optional(),
      strict: z.boolean().optional(),
      config: z.array(z.string()).optional(),
    }),
    execute: async options => {
      const m = await import('./commands/validate');
      await m.default(options);
    },
  });
  await initializer.run();
})();
