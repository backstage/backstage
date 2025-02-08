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

import { z } from 'zod';
import fs from 'fs-extra';
import recursiveReaddir from 'recursive-readdir';
import { resolve as resolvePath, relative as relativePath } from 'path';
import { dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { paths } from '../../paths';
import {
  PortableTemplateFile,
  PortableTemplatePointer,
  TEMPLATE_ROLES,
} from '../types';
import { PortableTemplate } from '../types';
import { ForwardedError } from '@backstage/errors';
import { fromZodError } from 'zod-validation-error';

const templateDefinitionSchema = z
  .object({
    description: z.string().optional(),
    template: z.string(),
    targetPath: z.string(),
    role: z.enum(TEMPLATE_ROLES),
    prompts: z
      .array(
        z.object({
          id: z.string(),
          prompt: z.string(),
          validate: z.string().optional(),
          default: z.union([z.string(), z.boolean(), z.number()]).optional(),
        }),
      )
      .optional(),
    additionalActions: z.array(z.string()).optional(),
    templateValues: z.record(z.string()).optional(),
  })
  .strict();

export async function loadPortableTemplate({
  id,
  target,
}: PortableTemplatePointer): Promise<PortableTemplate> {
  if (target.match(/https?:\/\//)) {
    throw new Error('Remote templates are not supported yet');
  }
  const templateContent = await fs
    .readFile(paths.resolveTargetRoot(target), 'utf-8')
    .catch(error => {
      throw new ForwardedError(
        `Failed to load template definition from '${target}'`,
        error,
      );
    });
  const rawTemplate = parseYaml(templateContent);

  const parsed = templateDefinitionSchema.safeParse(rawTemplate);
  if (!parsed.success) {
    throw new ForwardedError(
      `Invalid template definition at '${target}'`,
      fromZodError(parsed.error),
    );
  }

  const { template, templateValues = {}, ...templateData } = parsed.data;

  const templatePath = resolvePath(dirname(target), template);
  const filePaths = await recursiveReaddir(templatePath).catch(error => {
    throw new ForwardedError(
      `Failed to load template contents from '${templatePath}'`,
      error,
    );
  });

  const files = new Array<PortableTemplateFile>();

  for (const filePath of filePaths) {
    const path = relativePath(templatePath, filePath);

    const content = await fs.readFile(filePath, 'utf-8').catch(error => {
      throw new ForwardedError(
        `Failed to load file contents from '${path}'`,
        error,
      );
    });

    if (path.endsWith('.hbs')) {
      files.push({ path: path.slice(0, -4), content, syntax: 'handlebars' });
    } else {
      files.push({ path, content });
    }
  }

  return { id, templateValues, ...templateData, files };
}
