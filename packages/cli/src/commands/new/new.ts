/*
 * Copyright 2020 The Backstage Authors
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

import os from 'os';
import fs from 'fs-extra';
import { join as joinPath } from 'path';
import { OptionValues } from 'commander';
import inquirer from 'inquirer';
import { FactoryRegistry } from '../../lib/new/FactoryRegistry';
import { isMonoRepo } from '@backstage/cli-node';
import { paths } from '../../lib/paths';
import { assertError } from '@backstage/errors';
import { Task } from '../../lib/tasks';
import defaultTemplates from '../../../templates/alpha/all-default-templates';

interface TemplateLocation {
  id: string;
  target: string;
}

async function readCliConfig(
  cliConfig:
    | {
        defaults?: boolean;
        templates?: TemplateLocation[];
        globals?: Record<string, string>;
      }
    | undefined,
) {
  let templates: TemplateLocation[] = [];
  const cliTemplates = cliConfig?.templates;

  if (!cliConfig || cliConfig?.defaults) {
    templates = defaultTemplates;
  }
  if (cliTemplates?.length) {
    cliTemplates.forEach((template: TemplateLocation) => {
      templates.push({
        id: template.id,
        target: template.target,
      });
    });
  }
  return {
    templates,
    globals: { ...cliConfig?.globals },
  };
}

async function templateSelector(
  templates: TemplateLocation[],
): Promise<TemplateLocation> {
  const answer = await inquirer.prompt<{ name: TemplateLocation }>([
    {
      type: 'list',
      name: 'name',
      message: 'What do you want to create?',
      choices: templates.map(template => {
        return {
          name: template.id,
          value: template,
        };
      }),
    },
  ]);
  return answer.name;
}

export default async () => {
  const pkgJson = await fs.readJson(paths.resolveTargetRoot('package.json'));
  const cliConfig = pkgJson.backstage?.cli;

  const { templates, globals } = await readCliConfig(cliConfig);
  const template = await templateSelector(templates);
  console.log(template, globals);

  // let defaultVersion = '0.1.0';
  // if (opts.baseVersion) {
  //   defaultVersion = opts.baseVersion;
  // } else {
  //   const lernaVersion = await fs
  //     .readJson(paths.resolveTargetRoot('lerna.json'))
  //     .then(pkg => pkg.version)
  //     .catch(() => undefined);
  //   if (lernaVersion) {
  //     defaultVersion = lernaVersion;
  //   }
  // }

  // const tempDirs = new Array<string>();
  // async function createTemporaryDirectory(name: string): Promise<string> {
  //   const dir = await fs.mkdtemp(joinPath(os.tmpdir(), name));
  //   tempDirs.push(dir);
  //   return dir;
  // }

  // const license = opts.license ?? 'Apache-2.0';

  // let modified = false;
  // try {
  //   await factory.create(options, {
  //     isMonoRepo: await isMonoRepo(),
  //     defaultVersion,
  //     license,
  //     scope: opts.scope?.replace(/^@/, ''),
  //     npmRegistry: opts.npmRegistry,
  //     private: Boolean(opts.private),
  //     createTemporaryDirectory,
  //     markAsModified() {
  //       modified = true;
  //     },
  //   });

  //   Task.log();
  //   Task.log(`🎉  Successfully created ${factory.name}`);
  //   Task.log();
  // } catch (error) {
  //   assertError(error);
  //   Task.error(error.message);

  //   if (modified) {
  //     Task.log('It seems that something went wrong in the creation process 🤔');
  //     Task.log();
  //     Task.log(
  //       'We have left the changes that were made intact in case you want to',
  //     );
  //     Task.log(
  //       'continue manually, but you can also revert the changes and try again.',
  //     );

  //     Task.error(`🔥  Failed to create ${factory.name}!`);
  //   }
  // } finally {
  //   for (const dir of tempDirs) {
  //     try {
  //       await fs.remove(dir);
  //     } catch (error) {
  //       console.error(
  //         `Failed to remove temporary directory '${dir}', ${error}`,
  //       );
  //     }
  //   }
  // }
};
