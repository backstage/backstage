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
import { resolve as resolvePath, dirname, isAbsolute } from 'node:path';
import { paths } from '../../../../lib/paths';
import { defaultTemplates } from '../defaultTemplates';
import {
  PortableTemplateConfig,
  PortableTemplatePointer,
  TEMPLATE_FILE_NAME,
} from '../types';
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
  const templatePointerEntries = await Promise.all(
    (config?.templates ?? defaultTemplates).map(async rawPointer => {
      try {
        const templatePath = resolveLocalTemplatePath(rawPointer, basePath);

        const pointer = await peekLocalTemplateDefinition(templatePath);
        return { pointer, rawPointer };
      } catch (error) {
        throw new ForwardedError(
          `Failed to load template definition '${rawPointer}'`,
          error,
        );
      }
    }),
  );

  const templateNameConflicts = new Map<string, string>();
  for (const { pointer, rawPointer } of templatePointerEntries) {
    const conflict = templateNameConflicts.get(pointer.name);
    if (conflict) {
      throw new Error(
        `Invalid template configuration, received conflicting template name '${pointer.name}' from '${conflict}' and '${rawPointer}'`,
      );
    }
    templateNameConflicts.set(pointer.name, rawPointer);
  }

  return {
    isUsingDefaultTemplates: !config?.templates,
    templatePointers: templatePointerEntries.map(({ pointer }) => pointer),
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
  if (isAbsolute(pointer)) {
    throw new Error(`Template target may not be an absolute path`);
  }

  if (pointer.startsWith('.')) {
    return resolvePath(basePath, pointer, TEMPLATE_FILE_NAME);
  }

  return require.resolve(`${pointer}/${TEMPLATE_FILE_NAME}`, {
    paths: [basePath],
  });
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
