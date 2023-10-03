/*
 * Copyright 2023 The Backstage Authors
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

import path from 'path';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { CopierRunner } from './CopierRunner';
import { examples } from './examples';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import { ContainerRunner } from '@backstage/backend-common';

export const ActionInput = z.object({
  url: z
    .string()
    .describe('Relative path or absolute URL to the template to render'),
  values: z
    .record(z.string().min(1), z.any())
    .describe(
      'Values to pass to the template.  To accept all defaults, pass an empty object (`{}`) and set `acceptDefaults: true`. ',
    ),
  answerFileDirectory: z
    .string()
    .optional()
    .describe('Directory to write the answerfile to.  DEFAULT: `.`'),
  answerFile: z
    .string()
    .optional()
    .describe(
      'name of the answerfile for this template run. DEFAULT: `.copier.answers.yml`',
    ),
  pretend: z
    .boolean()
    .default(false)
    .optional()
    .describe('Run copier in pretend (dry-run) mode.  DEFAULT: false'),

  imageName: z
    .string()
    .optional()
    .describe(
      'Name of the docker image to use for the copier container.  Only used when a local copier instance is not found',
    ),
});
/**
 * Creates a `fetch:copier` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://copier.readthedocs.io/en/stable/} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 * @param options - Templating configuration.
 * @public
 */ /**
 * Creates a `fetch:copier` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://copier.readthedocs.io/en/stable/} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 * @param options - Templating configuration.
 * @public
 */
export function createCopierFetchAction(options: {
  config: Config;
  containerRunner?: ContainerRunner;
}) {
  const { config, containerRunner } = options;
  return createTemplateAction({
    id: 'fetch:copier',
    examples,
    description:
      'Downloads a template from the given URL into the workspace, and runs copier on it.  See the [Copier Documentation](https://copier.readthedocs.io/en/stable/) for a complete overview of Copier',
    schema: {
      input: ActionInput,
    },
    supportsDryRun: true,
    async handler(ctx): Promise<void> {
      ctx.logger.info('Fetching and then templating using copier');
      const templatePath = await ctx.createTemporaryDirectory();
      const { logger, input, logStream, workspacePath } = ctx;
      const copierRunner = CopierRunner.fromConfig(config, {
        logger,
        logStream,
        containerRunner,
        workspacePath,
        templatePath,
        ...(containerRunner ? { containerRunner } : {}),
      });

      const answerFileDirectory = input.answerFileDirectory ?? workspacePath;
      const answerFile =
        input.answerFile ?? `.${parseAnswerFileName(input.url)}-answers.yaml`;

      await copierRunner.run({
        answerFileDirectory,
        values: input.values,
        imageName: input.imageName,
        args: {
          answerFile,
          pretend: input.pretend,
          url: input.url,
        },
      });
      ctx.logger.info(`Template result written to ${ctx.workspacePath}`);
    },
  });
}

function parseAnswerFileName(answerFile: string): string {
  const inferName = () => {
    try {
      const url = new URL(answerFile);
      return path.basename(url.pathname);
    } catch (e) {
      return path.basename(answerFile);
    }
  };
  const answerFileName = inferName();
  const badNames = new Set(['', '.', '..', 'tree', 'main', 'master', 'HEAD']);

  if (badNames.has(answerFileName)) {
    throw new InputError(
      `Could not infer answerfile name from url; got name ${answerFile}.  Please check the url property and ensure it points to a valid URL or path.  Please ensure that branch information (i.e. 'tree', 'main', 'master', 'HEAD') is not included in the url.)`,
    );
  }
  return answerFileName;
}
