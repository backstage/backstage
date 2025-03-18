/*
 * Copyright 2024 The Backstage Authors
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

import {
  basename,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import fs from 'fs-extra';
import { createBinRunner } from '../../util';
import { CliHelpPage, CliModel } from './types';
import { paths as cliPaths } from '../../../lib/paths';
import { generateCliReport } from './generateCliReport';
import { logApiReportInstructions } from '../common';

function parseHelpPage(helpPageContent: string) {
  const [, usage] = helpPageContent.match(/^\s*Usage: (.*)$/im) ?? [];
  const lines = helpPageContent.split(/\r?\n/);

  let options = new Array<string>();
  let commands = new Array<string>();
  let commandArguments = new Array<string>();

  while (lines.length > 0) {
    while (lines.length > 0 && !lines[0].endsWith(':')) {
      lines.shift();
    }
    if (lines.length > 0) {
      // Start of a new section, e.g. "Options:"
      const sectionName = lines.shift();
      // Take lines until we hit the next section or the end
      const sectionEndIndex = lines.findIndex(
        line => line && !line.match(/^\s/),
      );
      const sectionLines = lines.slice(0, sectionEndIndex);
      lines.splice(0, sectionLines.length);

      // Trim away documentation
      const sectionItems = sectionLines
        .map(line => line.match(/^\s{1,8}(.*?)\s\s+/)?.[1])
        .filter(Boolean) as string[];

      if (sectionName?.toLocaleLowerCase('en-US') === 'options:') {
        options = sectionItems;
      } else if (sectionName?.toLocaleLowerCase('en-US') === 'commands:') {
        commands = sectionItems;
      } else if (sectionName?.toLocaleLowerCase('en-US') === 'arguments:') {
        commandArguments = sectionItems;
      } else {
        throw new Error(`Unknown CLI section: ${sectionName}`);
      }
    }
  }

  return {
    usage,
    options,
    commands,
    commandArguments,
  };
}

async function exploreCliHelpPages(
  run: (...args: string[]) => Promise<string>,
): Promise<CliHelpPage[]> {
  const helpPages = new Array<CliHelpPage>();

  async function exploreHelpPage(...path: string[]) {
    const content = await run(...path, '--help');
    const parsed = parseHelpPage(content);
    helpPages.push({ path, ...parsed });

    await Promise.all(
      parsed.commands.map(async fullCommand => {
        const command = fullCommand.split(/[|\s]/)[0];
        if (command !== 'help') {
          await exploreHelpPage(...path, command);
        }
      }),
    );
  }

  await exploreHelpPage();

  helpPages.sort((a, b) => a.path.join(' ').localeCompare(b.path.join(' ')));

  return helpPages;
}

interface CliExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

export async function runCliExtraction({
  packageDirs,
  isLocalBuild,
}: CliExtractionOptions) {
  for (const packageDir of packageDirs) {
    console.log(`## Processing ${packageDir}`);
    const fullDir = cliPaths.resolveTargetRoot(packageDir);
    const pkgJson = await fs.readJson(resolvePath(fullDir, 'package.json'));

    if (!pkgJson.bin) {
      throw new Error(`CLI Package in ${packageDir} has no bin field`);
    }

    const models = new Array<CliModel>();
    if (typeof pkgJson.bin === 'string') {
      const run = createBinRunner(fullDir, pkgJson.bin);
      const helpPages = await exploreCliHelpPages(run);
      models.push({ name: basename(pkgJson.bin), helpPages });
    } else {
      for (const [name, path] of Object.entries<string>(pkgJson.bin)) {
        const run = createBinRunner(fullDir, path);
        const helpPages = await exploreCliHelpPages(run);
        models.push({ name, helpPages });
      }
    }

    const report = generateCliReport({ packageName: pkgJson.name, models });

    const reportPath = resolvePath(fullDir, 'cli-report.md');
    const existingReport = await fs
      .readFile(reportPath, 'utf8')
      .catch(error => {
        if (error.code === 'ENOENT') {
          return undefined;
        }
        throw error;
      });

    if (existingReport !== report) {
      if (isLocalBuild) {
        console.warn(`CLI report changed for ${packageDir}`);
        await fs.writeFile(reportPath, report);
      } else {
        logApiReportInstructions();

        if (existingReport) {
          console.log('');
          console.log(
            `The conflicting file is ${relativePath(
              cliPaths.targetRoot,
              reportPath,
            )}, expecting the following content:`,
          );
          console.log('');

          console.log(report);

          logApiReportInstructions();
        }
        throw new Error(`CLI report changed for ${packageDir}, `);
      }
    }
  }
}
