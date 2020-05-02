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
import { relative as relativePath } from 'path';
import handlebars from 'handlebars';
import recursiveReadDir from 'recursive-readdir';
import { paths } from 'lib/paths';
import { version } from 'lib/version';

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

export default async () => {
  const pluginInfo = await readPluginInfo();
  const templateVars = { version, ...pluginInfo };
  console.log('DEBUG: templateVars =', templateVars);

  const templateDir = paths.resolveOwn('templates/default-plugin');
  console.log('DEBUG: templateDir =', templateDir);

  const templateFiles = await readTemplate(templateDir, templateVars);
  console.log('DEBUG: templateFiles =', templateFiles);
};
