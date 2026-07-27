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

    // Intent-based commands — domain subcommands wrapping actions
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
    reg.addCommand({
      path: ['api', 'list'],
      description: 'List API entities in the catalog',
      execute: { loader: () => import('./commands/apiList') },
    });
    reg.addCommand({
      path: ['api', 'get-spec'],
      description:
        'Get the full API specification (OpenAPI, AsyncAPI, GraphQL, gRPC)',
      execute: { loader: () => import('./commands/apiGetSpec') },
    });
    reg.addCommand({
      path: ['search'],
      description:
        'Search across all content types (catalog, TechDocs, templates)',
      execute: { loader: () => import('./commands/search') },
    });
    reg.addCommand({
      path: ['docs', 'search'],
      description: 'Search TechDocs content',
      execute: { loader: () => import('./commands/docsSearch') },
    });
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
