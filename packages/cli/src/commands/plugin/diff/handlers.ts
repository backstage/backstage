/*
 * Copyright 2020 Spotify AB
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
import { dirname } from 'path';
import { diffLines } from 'diff';
import { paths } from 'lib/paths';
import { TemplateFile, PromptFunc, FileHandler } from './types';

export async function writeTargetFile(targetPath: string, contents: string) {
  const path = paths.resolveTarget(targetPath);
  await fs.ensureDir(dirname(path));
  await fs.writeFile(path, contents, 'utf8');
}

class PackageJsonHandler {
  static async handler(file: TemplateFile, prompt: PromptFunc) {
    console.log('Checking package.json');

    if (!file.targetExists) {
      throw new Error(`${file.targetPath} doesn't exist`);
    }

    const pkg = JSON.parse(file.templateContents);
    const targetPkg = JSON.parse(file.targetContents);

    const handler = new PackageJsonHandler(file, prompt, pkg, targetPkg);
    await handler.handle();
  }

  constructor(
    private readonly file: TemplateFile,
    private readonly prompt: PromptFunc,
    private readonly pkg: any,
    private readonly targetPkg: any,
  ) {}

  async handle() {
    await this.syncField('main');
    await this.syncField('types');
    await this.syncField('files');
    await this.syncScripts();
    await this.syncDependencies('dependencies');
    await this.syncDependencies('devDependencies');
  }

  // Make sure a field inside package.json is in sync. This mutates the targetObj and writes package.json on change.
  private async syncField(
    fieldName: string,
    obj: any = this.pkg,
    targetObj: any = this.targetPkg,
    prefix?: string,
  ) {
    const fullFieldName = chalk.cyan(
      prefix ? `${prefix}[${fieldName}]` : prefix,
    );
    const newValue = obj[fieldName];

    if (fieldName in targetObj) {
      const oldValue = targetObj[fieldName];
      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        return;
      }

      const msg =
        `Outdated field, ${fullFieldName}, change from ` +
        `${chalk.cyan(oldValue)} to ${chalk.cyan(newValue)}?`;
      if (await this.prompt(msg)) {
        targetObj[fieldName] = newValue;
        await this.write();
      }
    } else {
      if (
        await this.prompt(
          `Missing field ${fullFieldName}, set to ${chalk.cyan(newValue)}?`,
        )
      ) {
        targetObj[fieldName] = newValue;
        await this.write();
      }
    }
  }

  private async syncScripts() {
    const pkgScripts = this.pkg.scripts;
    const targetScripts = (this.targetPkg.scripts =
      this.targetPkg.scripts || {});

    for (const key of Object.keys(pkgScripts)) {
      await this.syncField(key, pkgScripts, targetScripts, 'scripts');
    }
  }

  private async syncDependencies(fieldName: string) {
    const pkgDeps = this.pkg[fieldName];
    const targetDeps = (this.targetPkg[fieldName] =
      this.targetPkg[fieldName] || {});

    for (const key of Object.keys(pkgDeps)) {
      await this.syncField(key, pkgDeps, targetDeps, fieldName);
    }
  }

  private async write() {
    await fs.writeFile(
      paths.resolveTarget(this.file.targetPath),
      `${JSON.stringify(this.targetPkg, null, 2)}\n`,
    );
  }
}

// Make sure the file is an exact match of the template
async function exactMatchHandler(file: TemplateFile, prompt: PromptFunc) {
  console.log(`Checking ${file.targetPath}`);

  const { targetPath, templateContents } = file;
  const coloredPath = chalk.cyan(targetPath);

  if (!file.targetExists) {
    if (await prompt(`Missing ${coloredPath}, do you want to add it?`)) {
      await writeTargetFile(targetPath, templateContents);
    }
    return;
  }
  if (file.targetContents === templateContents) {
    return;
  }

  const diffs = diffLines(file.targetContents, templateContents);
  for (const diff of diffs) {
    if (diff.added) {
      process.stdout.write(chalk.green(`+${diff.value}`));
    } else if (diff.removed) {
      process.stdout.write(chalk.red(`-${diff.value}`));
    } else {
      process.stdout.write(` ${diff.value}`);
    }
  }

  if (
    await prompt(
      `Outdated ${coloredPath}, do you want to apply the above patch?`,
    )
  ) {
    await writeTargetFile(targetPath, templateContents);
  }
}

// Adds the file if it is missing, but doesn't check existing files
async function existsHandler(file: TemplateFile, prompt: PromptFunc) {
  console.log(`Making sure ${file.targetPath} exists`);

  const { targetPath, templateContents } = file;
  const coloredPath = chalk.cyan(targetPath);

  if (!file.targetExists) {
    if (await prompt(`Missing ${coloredPath}, do you want to add it?`)) {
      await writeTargetFile(targetPath, templateContents);
    }
    return;
  }
}

async function skipHandler(file: TemplateFile) {
  console.log(`Skipping ${file.targetPath}`);
}

export const handlers = {
  skip: skipHandler,
  exists: existsHandler,
  exactMatch: exactMatchHandler,
  packageJson: PackageJsonHandler.handler,
};

export async function handleAllFiles(
  fileHandlers: FileHandler[],
  files: TemplateFile[],
  promptFunc: PromptFunc,
) {
  for (const file of files) {
    const { targetPath } = file;
    const fileHandler = fileHandlers.find(handler =>
      handler.patterns.some(pattern =>
        typeof pattern === 'string'
          ? pattern === targetPath
          : pattern.test(targetPath),
      ),
    );
    if (fileHandler) {
      await fileHandler.handler(file, promptFunc);
    } else {
      throw new Error(`No template file handler found for ${targetPath}`);
    }
  }
}
