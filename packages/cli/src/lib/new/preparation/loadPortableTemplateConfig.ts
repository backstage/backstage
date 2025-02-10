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

import fs from 'fs-extra';
import { paths } from '../../paths';
import { defaultTemplates } from '../defaultTemplates';
import { PortableTemplateConfig } from '../types';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ForwardedError } from '@backstage/errors';

const defaults = {
  license: 'Apache-2.0',
  version: '0.1.0',
  private: true,
  packageNamePrefix: '@internal/',
  packageNamePluginInfix: 'plugin-',
};

const builtInTemplateIds = defaultTemplates.map(t => `default-${t.id}`) as [
  string,
  ...string[],
];

const newConfigSchema = z
  .object({
    templates: z
      .array(
        z.union([
          z.enum(builtInTemplateIds),
          z
            .object({
              id: z.string(),
              description: z.string().optional(),
              target: z.string(),
            })
            .strict(),
        ]),
      )
      .optional(),
    globals: z
      .object({
        license: z.string().optional(),
        version: z.string().optional(),
        private: z.boolean().optional(),
        namePrefix: z.string().optional(),
        namePluginInfix: z.string().optional(),
      })
      .optional(),
  })
  .strict();

const pkgJsonWithNewConfigSchema = z.object({
  backstage: z
    .object({
      cli: z
        .object({
          new: newConfigSchema.optional(),
        })
        .optional(),
    })
    .optional(),
});

type LoadConfigOptions = {
  packagePath?: string;
  overrides?: Partial<PortableTemplateConfig>;
};

export async function loadPortableTemplateConfig(
  options: LoadConfigOptions = {},
): Promise<PortableTemplateConfig> {
  const { overrides = {} } = options;
  const pkgPath =
    options.packagePath ?? paths.resolveTargetRoot('package.json');
  const pkgJson = await fs.readJson(pkgPath);

  const parsed = pkgJsonWithNewConfigSchema.safeParse(pkgJson);
  if (!parsed.success) {
    throw new ForwardedError(
      `Failed to load templating configuration from '${pkgPath}'`,
      fromZodError(parsed.error),
    );
  }

  const config = parsed.data.backstage?.cli?.new;

  const templatePointers =
    config?.templates?.map(t => {
      if (typeof t === 'string') {
        const defaultTemplate = defaultTemplates.find(
          d => t === `default-${d.id}`,
        );
        if (!defaultTemplate) {
          throw new Error(`Built-in template '${t}' does not exist`);
        }
        return defaultTemplate;
      }
      return t;
    }) ?? defaultTemplates;

  return {
    isUsingDefaultTemplates: !config?.templates,
    templatePointers,
    license: overrides.license ?? config?.globals?.license ?? defaults.license,
    version: overrides.version ?? config?.globals?.version ?? defaults.version,
    private: overrides.private ?? config?.globals?.private ?? defaults.private,
    packageNamePrefix:
      overrides.packageNamePrefix ??
      config?.globals?.namePrefix ??
      defaults.packageNamePrefix,
    packageNamePluginInfix:
      overrides.packageNamePluginInfix ??
      config?.globals?.namePluginInfix ??
      defaults.packageNamePluginInfix,
  };
}
