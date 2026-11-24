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
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import {
  ActionContext,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import path from 'node:path';
import { createTemplateRenderer, TemplateCapabilities } from 'nunjitsu';
import { collectActionTemplateCapabilities } from './templateActionHandler';

export type TemplateFileActionInput = {
  targetPath: string;
  values: any;
  cookiecutterCompat?: boolean;
  replace?: boolean;
  trimBlocks?: boolean;
  lstripBlocks?: boolean;
};

export async function createTemplateFileActionHandler<
  I extends TemplateFileActionInput = TemplateFileActionInput,
>(options: {
  ctx: ActionContext<I, any, any>;
  resolveTemplateFile: () => Promise<string>;
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
  templateCapabilities?: TemplateCapabilities;
}) {
  const { resolveTemplateFile, ctx } = options;
  const templateCapabilities =
    options.templateCapabilities ?? collectActionTemplateCapabilities(options);

  const outputPath = resolveSafeChildPath(
    ctx.workspacePath,
    ctx.input.targetPath,
  );

  if (fs.existsSync(outputPath) && !ctx.input.replace) {
    ctx.logger.info(
      `File ${ctx.input.targetPath} already exists in workspace, not replacing.`,
    );
    return;
  }
  const filePath = await resolveTemplateFile();

  const { cookiecutterCompat, values } = ctx.input;
  const context = {
    [cookiecutterCompat ? 'cookiecutter' : 'values']: values,
  };

  ctx.logger.info(
    `Processing template file with input values`,
    ctx.input.values,
  );

  const templateRenderer = createTemplateRenderer({
    ...templateCapabilities,
    allowRegexExecution: true,
    cookiecutterCompat,
    trimBlocks: ctx.input.trimBlocks,
    lstripBlocks: ctx.input.lstripBlocks,
  });

  const contents = await fs.readFile(filePath, 'utf-8');
  const result = templateRenderer.render(contents, context);
  await fs.ensureDir(path.dirname(outputPath));
  await fs.outputFile(outputPath, result);

  ctx.logger.info(`Template file has been written to ${outputPath}`);
}
