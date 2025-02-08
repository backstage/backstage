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
import chalk from 'chalk';
import handlebars from 'handlebars';
import recursive from 'recursive-readdir';
import {
  basename,
  dirname,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import lowerCase from 'lodash/lowerCase';
import snakeCase from 'lodash/snakeCase';
import startCase from 'lodash/startCase';
import upperCase from 'lodash/upperCase';
import upperFirst from 'lodash/upperFirst';
import lowerFirst from 'lodash/lowerFirst';

import { paths } from '../../paths';
import { Task } from '../../tasks';
import { Lockfile } from '../../versioning';
import { createPackageVersionProvider } from '../../version';

const helpers = {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
  lowerFirst,
};

export interface CreateContext {
  /** Whether we are creating something in a monorepo or not */
  isMonoRepo: boolean;

  /** Creates a temporary directory. This will always be deleted after creation is done. */
  createTemporaryDirectory(name: string): Promise<string>;

  /** Signal that the creation process got to a point where permanent modifications were made */
  markAsModified(): void;
}

export async function executePluginPackageTemplate(
  ctx: CreateContext,
  options: {
    templateValues: Record<string, string>;
    templateDir: string;
    targetDir: string;
    values: Record<string, unknown>;
  },
) {
  const { targetDir, templateDir, values } = options;

  let lockfile: Lockfile | undefined;
  try {
    lockfile = await Lockfile.load(paths.resolveTargetRoot('yarn.lock'));
  } catch {
    /* ignored */
  }

  Task.section('Checking Prerequisites');
  const shortPluginDir = relativePath(paths.targetRoot, targetDir);
  await Task.forItem('availability', shortPluginDir, async () => {
    if (await fs.pathExists(targetDir)) {
      throw new Error(
        `A package with the same plugin ID already exists at ${chalk.cyan(
          shortPluginDir,
        )}. Please try again with a different ID.`,
      );
    }
  });

  const tempDir = await Task.forItem('creating', 'temp dir', async () => {
    return await ctx.createTemporaryDirectory('backstage-create');
  });

  Task.section('Executing Template');
  await templatingTask(
    templateDir,
    options.templateValues,
    tempDir,
    values,
    createPackageVersionProvider(lockfile),
    ctx.isMonoRepo,
  );

  // Format package.json if it exists
  const pkgJsonPath = resolvePath(tempDir, 'package.json');
  if (await fs.pathExists(pkgJsonPath)) {
    const pkgJson = await fs.readJson(pkgJsonPath);
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  }

  Task.section('Installing');
  await Task.forItem('moving', shortPluginDir, async () => {
    await fs.move(tempDir, targetDir).catch(error => {
      throw new Error(
        `Failed to move package from ${tempDir} to ${targetDir}, ${error.message}`,
      );
    });
  });

  ctx.markAsModified();
}

export async function templatingTask(
  templateDir: string,
  templateValues: Record<string, string>,
  destinationDir: string,
  context: any,
  versionProvider: (name: string, versionHint?: string) => string,
  isMonoRepo: boolean,
) {
  const files = await recursive(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  const templatedValues = Object.fromEntries(
    Object.entries(templateValues).map(([name, tmpl]) => {
      return [name, handlebars.compile(tmpl)(context, { helpers })];
    }),
  );

  for (const file of files) {
    const destinationFile = file.replace(templateDir, destinationDir);
    await fs.ensureDir(dirname(destinationFile));

    if (file.endsWith('.hbs')) {
      await Task.forItem('templating', basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, '');

        const template = await fs.readFile(file);
        const compiled = handlebars.compile(template.toString(), {
          strict: true,
        });
        const contents = compiled(
          { name: basename(destination), ...context, ...templatedValues },
          {
            helpers: {
              versionQuery(name: string, versionHint: string | unknown) {
                return versionProvider(
                  name,
                  typeof versionHint === 'string' ? versionHint : undefined,
                );
              },
              ...helpers,
            },
          },
        );

        await fs.writeFile(destination, contents).catch(error => {
          throw new Error(
            `Failed to create file: ${destination}: ${error.message}`,
          );
        });
      });
    } else {
      if (isMonoRepo && file.match('tsconfig.json')) {
        continue;
      }

      await Task.forItem('copying', basename(file), async () => {
        await fs.copyFile(file, destinationFile).catch(error => {
          const destination = destinationFile;
          throw new Error(
            `Failed to copy file to ${destination} : ${error.message}`,
          );
        });
      });
    }
  }
}
