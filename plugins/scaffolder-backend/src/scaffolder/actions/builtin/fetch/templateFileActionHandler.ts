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
import { ScmIntegrations } from '@backstage/integration';
import {
  ActionContext,
  TemplateActionOptions,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import createDefaultFilters from '../../../../lib/templating/filters';
import { convertFiltersToRecord } from '../../../../util/templating';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import path from 'path';
import { SecureTemplater } from '../../../../lib/templating/SecureTemplater';

export type TemplateFileActionInput = {
  targetPath: string;
  values: any;
  cookiecutterCompat?: boolean;
  replace?: boolean;
  trimBlocks?: boolean;
  lstripBlocks?: boolean;
};

export function createTemplateFileActionHandler<
  I extends TemplateFileActionInput = TemplateFileActionInput,
>(options: {
  resolveTemplateFile: (ctx: ActionContext<I>) => Promise<string>;
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}): TemplateActionOptions<I>['handler'] {
  const {
    resolveTemplateFile,
    integrations,
    additionalTemplateFilters,
    additionalTemplateGlobals: templateGlobals,
  } = options;

  const templateFilters = {
    ...convertFiltersToRecord(createDefaultFilters({ integrations })),
    ...additionalTemplateFilters,
  };

  return async (ctx: ActionContext<I>) => {
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
    const filePath = await resolveTemplateFile(ctx);

    const { cookiecutterCompat, values } = ctx.input;
    const context = {
      [cookiecutterCompat ? 'cookiecutter' : 'values']: values,
    };

    ctx.logger.info(
      `Processing template file with input values`,
      ctx.input.values,
    );

    const renderTemplate = await SecureTemplater.loadRenderer({
      cookiecutterCompat,
      templateFilters,
      templateGlobals,
      nunjucksConfigs: {
        trimBlocks: ctx.input.trimBlocks,
        lstripBlocks: ctx.input.lstripBlocks,
      },
    });

    const contents = await fs.readFile(filePath, 'utf-8');
    const result = renderTemplate(contents, context);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.outputFile(outputPath, result);

    ctx.logger.info(`Template file has been written to ${outputPath}`);
  };
}
