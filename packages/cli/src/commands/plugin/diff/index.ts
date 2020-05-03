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
import { relative as relativePath, dirname } from 'path';
import { diffLines } from 'diff';
import handlebars from 'handlebars';
import recursiveReadDir from 'recursive-readdir';
import { paths } from 'lib/paths';
import { version } from 'lib/version';
import chalk from 'chalk';
import inquirer from 'inquirer';

type PluginInfo = {
  id: string;
  name: string;
};

// Reads info from the existing plugin
async function readPluginInfo(): Promise<PluginInfo> {
  let name: string;
  try {
    const pkg = require(paths.resolveTarget('package.json'));
    name = pkg.name;
  } catch (error) {
    throw new Error(`Failed to read target package, ${error}`);
  }

  const pluginTsContents = await fs.readFile(
    paths.resolveTarget('src/plugin.ts'),
    'utf8',
  );
  // TODO: replace with some proper parsing logic or plugin metadata file
  const pluginIdMatch = pluginTsContents.match(/id: ['"`](.+?)['"`]/);
  if (!pluginIdMatch) {
    throw new Error(`Failed to parse plugin.ts, no plugin ID found`);
  }

  const id = pluginIdMatch[1];

  return { id, name };
}

type TemplateFile = {
  // Relative path within the target directory
  targetPath: string;
  // Contents of the compiled template file
  templateContents: string;
} & (
  | {
      // Whether the template file exists in the target directory
      targetExists: true;
      // Contents of the file in the target directory, if it exists
      targetContents: string;
    }
  | {
      // Whether the template file exists in the target directory
      targetExists: false;
    }
);

async function readTemplateFile(
  templateFile: string,
  templateVars: any,
): Promise<string> {
  const contents = await fs.readFile(templateFile, 'utf8');

  if (!templateFile.endsWith('.hbs')) {
    return contents;
  }

  return handlebars.compile(contents)(templateVars);
}

async function readTemplate(
  templateDir: string,
  templateVars: any,
): Promise<TemplateFile[]> {
  const templateFilePaths = await recursiveReadDir(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  const templateFiles = new Array<TemplateFile>();
  for (const templateFile of templateFilePaths) {
    // Target file inside the target dir without template extension
    const targetFile = templateFile
      .replace(templateDir, paths.targetDir)
      .replace(/\.hbs$/, '');
    const targetPath = relativePath(paths.targetDir, targetFile);

    const templateContents = await readTemplateFile(templateFile, templateVars);

    const targetExists = await fs.pathExists(targetFile);
    if (targetExists) {
      const targetContents = await fs.readFile(targetFile, 'utf8');
      templateFiles.push({
        targetPath,
        targetExists,
        targetContents,
        templateContents,
      });
    } else {
      templateFiles.push({
        targetPath,
        targetExists,
        templateContents,
      });
    }
  }

  return templateFiles;
}

async function writeTargetFile(targetPath: string, contents: string) {
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
      JSON.stringify(this.targetPkg, null, 2),
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
async function addOnlyHandler(file: TemplateFile, prompt: PromptFunc) {
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

type PromptFunc = (msg: string) => Promise<boolean>;

const inquirerPromptFunc: PromptFunc = async msg => {
  const { result } = await inquirer.prompt({
    type: 'confirm',
    name: 'result',
    message: chalk.blue(msg),
  });
  return result;
};

type FileHandler = {
  patterns: Array<string | RegExp>;
  handler: (file: TemplateFile, prompt: PromptFunc) => Promise<void>;
};

const fileHandlers: FileHandler[] = [
  {
    patterns: ['package.json'],
    handler: PackageJsonHandler.handler,
  },
  {
    patterns: ['tsconfig.json'],
    handler: exactMatchHandler,
  },
  {
    // make sure files in 1st level of src/ and dev/ exist
    patterns: ['.eslintrc.js', /^(src|dev)\/[^/]+$/],
    handler: addOnlyHandler,
  },
  {
    patterns: ['README.md', /^src\//],
    handler: skipHandler,
  },
];

export default async () => {
  const pluginInfo = await readPluginInfo();
  const templateVars = { version, ...pluginInfo };

  const templateDir = paths.resolveOwn('templates/default-plugin');

  const templateFiles = await readTemplate(templateDir, templateVars);

  for (const templateFile of templateFiles) {
    const { targetPath } = templateFile;
    const fileHandler = fileHandlers.find(handler =>
      handler.patterns.some(pattern =>
        typeof pattern === 'string'
          ? pattern === targetPath
          : pattern.test(targetPath),
      ),
    );
    if (fileHandler) {
      await fileHandler.handler(templateFile, inquirerPromptFunc);
    } else {
      throw new Error(`No template file handler found for ${targetPath}`);
    }
  }
};
