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
import {
  dirname,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import handlebars from 'handlebars';
import recursiveReadDir from 'recursive-readdir';
import { paths } from '../paths';
import { version } from '../version';
import { FileDiff } from './types';

export type PluginInfo = {
  id: string;
  name: string;
};

export type TemplatedFile = {
  path: string;
  contents: string;
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
): Promise<TemplatedFile[]> {
  const templateFilePaths = await recursiveReadDir(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  const templatedFiles = new Array<TemplatedFile>();
  for (const templateFile of templateFilePaths) {
    const path = relativePath(templateDir, templateFile).replace(/\.hbs$/, '');
    const contents = await readTemplateFile(templateFile, templateVars);

    templatedFiles.push({ path, contents });
  }

  return templatedFiles;
}

async function diffTemplatedFiles(
  targetDir: string,
  templatedFiles: TemplatedFile[],
): Promise<FileDiff[]> {
  const fileDiffs = new Array<FileDiff>();
  for (const { path, contents: templateContents } of templatedFiles) {
    const targetPath = resolvePath(targetDir, path);
    const targetExists = await fs.pathExists(targetPath);

    const write = async (contents: string) => {
      await fs.ensureDir(dirname(targetPath));
      await fs.writeFile(targetPath, contents, 'utf8');
    };

    if (targetExists) {
      const targetContents = await fs.readFile(targetPath, 'utf8');
      fileDiffs.push({
        path,
        write,
        missing: false,
        targetContents,
        templateContents,
      });
    } else {
      fileDiffs.push({
        path,
        write,
        missing: true,
        targetContents: '',
        templateContents,
      });
    }
  }

  return fileDiffs;
}

// Read all template files for a given template, along with all matching files in the target dir
export async function diffTemplateFiles(template: string) {
  const pluginInfo = await readPluginInfo();
  const templateVars = { version, ...pluginInfo };

  const templateDir = paths.resolveOwn('templates', template);

  const templatedFiles = await readTemplate(templateDir, templateVars);
  const fileDiffs = await diffTemplatedFiles(paths.targetDir, templatedFiles);
  return fileDiffs;
}
