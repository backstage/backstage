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

import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import {
  createTemplateAction,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './templateFile.examples';
import { createTemplateFileActionHandler } from './templateFileActionHandler';

/**
 * Templates variables into a single workspace file, placing the result into another location in the workspace.
 * @public
 */
export function createWorkspaceTemplateFileAction(options: {
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}) {
  return createTemplateAction({
    id: 'workspace:template:file',
    description:
      'Templates variables into a single workspace file, placing the result into another location in the workspace.',
    examples,
    schema: {
      input: {
        sourcePath: z =>
          z.string().describe('Path in workspace to source file.'),
        targetPath: z => z.string().describe('Target path in workspace.'),
        values: z =>
          z
            .record(z.any())
            .optional()
            .describe('Values to pass to the templating engine.'),
        cookiecutterCompat: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            ),
        replace: z =>
          z
            .boolean()
            .optional()
            .describe(
              'If set, replace files in targetPath instead of skipping existing ones.',
            ),
      },
    },
    supportsDryRun: true,
    handler: ctx =>
      createTemplateFileActionHandler({
        ctx,
        resolveTemplateFile: async () =>
          resolveSafeChildPath(ctx.workspacePath, ctx.input.sourcePath),
        ...options,
      }),
  });
}
