/*
 * Copyright 2021 The Backstage Authors
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
import { examples } from './template.examples';
import { createTemplateActionHandler } from './templateActionHandler';

/**
 * Templates variables into file and directory names and content of 'sourcePath' in the action context workspace.
 * Then places the result into a subdirectory of the workspace specified by the 'targetPath' input option.
 *
 * @public
 */
export function createWorkspaceTemplateAction(options: {
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}) {
  return createTemplateAction({
    id: 'workspace:template',
    description:
      'Templates variables into file and directory names and content of `sourcePath` in the action context workspace. Then places the result into a subdirectory of the workspace specified by the `targetPath` input option.',
    examples,
    schema: {
      input: {
        sourcePath: z =>
          z
            .string()
            .describe(
              'Path within the working directory denoting source template.',
            ),
        targetPath: z =>
          z
            .string()
            .describe(
              'Target path within the working directory to download the contents to; must not overlap `sourcePath`.',
            ),
        values: z =>
          z
            .record(z.any())
            .optional()
            .describe('Values to pass to the templating engine.'),
        copyWithoutTemplating: z =>
          z
            .array(z.string())
            .describe(
              'An array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.',
            ),
        cookiecutterCompat: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            ),
        templateFileExtension: z =>
          z
            .string()
            .or(z.boolean())
            .optional()
            .describe(
              'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
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
      createTemplateActionHandler({
        ctx,
        resolveTemplate: async () =>
          resolveSafeChildPath(ctx.workspacePath, ctx.input.sourcePath),
        ...options,
      }),
  });
}
