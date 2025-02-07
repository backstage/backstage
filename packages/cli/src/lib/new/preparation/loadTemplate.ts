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
import { resolve as resolvePath } from 'path';
import { dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { paths } from '../../paths';
import { NewTemplatePointer } from '../types';
import { NewTemplate } from '../types';
import { ForwardedError } from '@backstage/errors';
import { fromZodError } from 'zod-validation-error';
import { PackageRoles } from '@backstage/cli-node';

const templateDefinitionSchema = z
  .object({
    description: z.string().optional(),
    template: z.string(),
    targetPath: z.string(),
    role: z.string(),
    prompts: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            prompt: z.string(),
            validate: z.string().optional(),
            default: z.union([z.string(), z.boolean(), z.number()]).optional(),
          }),
        ]),
      )
      .optional(),
    additionalActions: z.array(z.string()).optional(),
  })
  .strict();

export async function loadTemplate({
  id,
  target,
}: NewTemplatePointer): Promise<NewTemplate> {
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

  const { template, role: rawRole, ...templateData } = parsed.data;
  const templatePath = resolvePath(dirname(target), template);

  try {
    const { role } = PackageRoles.getRoleInfo(rawRole);

    if (!fs.existsSync(templatePath)) {
      throw new Error('Template directory does not exist');
    }
    return { id, templatePath, role, ...templateData };
  } catch (error) {
    throw new ForwardedError(
      `Failed to load template contents from '${templatePath}'`,
      error,
    );
  }
}
