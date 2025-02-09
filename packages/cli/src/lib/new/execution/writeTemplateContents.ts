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

import fs from 'fs-extra';
import { dirname, resolve as resolvePath } from 'path';

import { paths } from '../../paths';
import { PortableTemplate, PortableTemplateInput } from '../types';
import { ForwardedError, InputError } from '@backstage/errors';
import { isMonoRepo as getIsMonoRepo } from '@backstage/cli-node';
import { PortableTemplater } from './PortableTemplater';

export async function writeTemplateContents(
  template: PortableTemplate,
  input: PortableTemplateInput,
): Promise<{ targetDir: string }> {
  const targetDir = paths.resolveTargetRoot(input.packagePath);

  if (await fs.pathExists(targetDir)) {
    throw new InputError(`Package '${input.packagePath}' already exists`);
  }

  try {
    const isMonoRepo = await getIsMonoRepo();

    const { role, ...roleValues } = input.roleParams;

    const templater = await PortableTemplater.create({
      values: {
        ...roleValues,
        ...input.builtInParams,
        packageName: input.packageName,
        privatePackage: input.private,
        packageVersion: input.version,
        license: input.license,
      },
      templatedValues: template.templateValues,
    });

    for (const file of template.files) {
      if (isMonoRepo && file.path === 'tsconfig.json') {
        continue;
      }

      const destPath = resolvePath(targetDir, file.path);
      await fs.ensureDir(dirname(destPath));

      let content =
        file.syntax === 'handlebars'
          ? templater.template(file.content)
          : file.content;

      // Try to format JSON files
      if (file.path.endsWith('.json')) {
        try {
          content = JSON.stringify(JSON.parse(content), null, 2);
        } catch {
          /* ignore */
        }
      }

      await fs.writeFile(destPath, content).catch(error => {
        throw new ForwardedError(`Failed to copy file to ${destPath}`, error);
      });
    }

    return { targetDir };
  } catch (error) {
    await fs.rm(targetDir, { recursive: true, force: true, maxRetries: 10 });
    throw error;
  }
}
