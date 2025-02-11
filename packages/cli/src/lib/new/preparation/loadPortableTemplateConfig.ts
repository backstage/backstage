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
import { resolve as resolvePath, dirname, extname } from 'node:path';
import { paths } from '../../paths';
import { defaultTemplates } from '../defaultTemplates';
import { PortableTemplateConfig, PortableTemplatePointer } from '../types';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ForwardedError } from '@backstage/errors';

const defaults = {
  license: 'Apache-2.0',
  version: '0.1.0',
  private: true,
  publishRegistry: undefined,
  packageNamePrefix: '@internal/',
  packageNamePluginInfix: 'plugin-',
};

const newConfigSchema = z
  .object({
    templates: z.array(z.string()).optional(),
    globals: z
      .object({
        license: z.string().optional(),
        version: z.string().optional(),
        private: z.boolean().optional(),
        publishRegistry: z.string().optional(),
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

  const basePath = dirname(pkgPath);
  const templatePointers = await Promise.all(
    (config?.templates ?? defaultTemplates).map(async pointer => {
      try {
        const templatePath = resolveLocalTemplatePath(pointer, basePath);

        return await peekLocalTemplateDefinition(templatePath);
      } catch (error) {
        throw new ForwardedError(
          `Failed to load template definition '${pointer}'`,
          error,
        );
      }
    }),
  );

  return {
    isUsingDefaultTemplates: !config?.templates,
    templatePointers,
    license: overrides.license ?? config?.globals?.license ?? defaults.license,
    version: overrides.version ?? config?.globals?.version ?? defaults.version,
    private: overrides.private ?? config?.globals?.private ?? defaults.private,
    publishRegistry:
      overrides.publishRegistry ??
      config?.globals?.publishRegistry ??
      defaults.publishRegistry,
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

function resolveLocalTemplatePath(pointer: string, basePath: string): string {
  const isDirectoryPointer = extname(pointer) === '';

  if (pointer.startsWith('.')) {
    if (isDirectoryPointer) {
      return resolvePath(basePath, pointer, 'template.yaml');
    }
    return resolvePath(basePath, pointer);
  }

  if (isDirectoryPointer) {
    return require.resolve(`${pointer}/template.yaml`, { paths: [basePath] });
  }
  return require.resolve(pointer, { paths: [basePath] });
}

const partialTemplateDefinitionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

async function peekLocalTemplateDefinition(
  target: string,
): Promise<PortableTemplatePointer> {
  const content = await fs.readFile(target, 'utf8');

  const rawTemplate = parseYaml(content);
  const parsed = partialTemplateDefinitionSchema.safeParse(rawTemplate);
  if (!parsed.success) {
    throw fromZodError(parsed.error);
  }

  return {
    name: parsed.data.name,
    description: parsed.data.description,
    target,
  };
}
