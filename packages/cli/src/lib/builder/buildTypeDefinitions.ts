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

import fs from 'fs-extra';
import chalk from 'chalk';
import { relative as relativePath, resolve as resolvePath } from 'path';
import { paths } from '../paths';
import { buildTypeDefinitionsWorker } from './buildTypeDefinitionsWorker';
import { runWorkerThreads } from '../parallel';

// These message types are ignored since we want to avoid duplicating the logic of
// handling them correctly, and we already have the API Reports warning about them.
const ignoredMessages = new Set(['tsdoc-undefined-tag', 'ae-forgotten-export']);

export async function buildTypeDefinitions(
  targetDirs: string[] = [paths.targetDir],
) {
  const packageDirs = targetDirs.map(dir =>
    relativePath(paths.targetRoot, dir),
  );
  const entryPoints = await Promise.all(
    packageDirs.map(async dir => {
      const entryPoint = paths.resolveTargetRoot(
        'dist-types',
        dir,
        'src/index.d.ts',
      );

      const declarationsExist = await fs.pathExists(entryPoint);
      if (!declarationsExist) {
        throw new Error(
          `No declaration files found at ${entryPoint}, be sure to run ${chalk.bgRed.white(
            'yarn tsc',
          )} to generate .d.ts files before packaging`,
        );
      }
      return entryPoint;
    }),
  );

  const workerConfigs = packageDirs.map(packageDir => {
    const targetDir = paths.resolveTargetRoot(packageDir);
    const targetTypesDir = paths.resolveTargetRoot('dist-types', packageDir);
    const extractorOptions = {
      configObject: {
        mainEntryPointFilePath: resolvePath(targetTypesDir, 'src/index.d.ts'),
        bundledPackages: [],

        compiler: {
          skipLibCheck: true,
          tsconfigFilePath: paths.resolveTargetRoot('tsconfig.json'),
        },

        dtsRollup: {
          enabled: true,
          untrimmedFilePath: resolvePath(targetDir, 'dist/index.alpha.d.ts'),
          betaTrimmedFilePath: resolvePath(targetDir, 'dist/index.beta.d.ts'),
          publicTrimmedFilePath: resolvePath(targetDir, 'dist/index.d.ts'),
        },

        newlineKind: 'lf',

        projectFolder: targetDir,
      },
      configObjectFullPath: targetDir,
      packageJsonFullPath: resolvePath(targetDir, 'package.json'),
    };
    return { extractorOptions, targetTypesDir };
  });

  const typescriptDir = paths.resolveTargetRoot('node_modules/typescript');
  const hasTypescript = await fs.pathExists(typescriptDir);
  const typescriptCompilerFolder = hasTypescript ? typescriptDir : undefined;
  await runWorkerThreads({
    threadCount: 1,
    workerData: {
      entryPoints,
      workerConfigs,
      typescriptCompilerFolder,
    },
    worker: buildTypeDefinitionsWorker,
    onMessage: ({
      message,
      targetTypesDir,
    }: {
      message: any;
      targetTypesDir: string;
    }) => {
      if (ignoredMessages.has(message.messageId)) {
        return;
      }

      let text = `${message.text} (${message.messageId})`;
      if (message.sourceFilePath) {
        text += ' at ';
        text += relativePath(targetTypesDir, message.sourceFilePath);
        if (message.sourceFileLine) {
          text += `:${message.sourceFileLine}`;
          if (message.sourceFileColumn) {
            text += `:${message.sourceFileColumn}`;
          }
        }
      }
      if (message.logLevel === 'error') {
        console.error(chalk.red(`Error: ${text}`));
      } else if (
        message.logLevel === 'warning' ||
        message.category === 'Extractor'
      ) {
        console.warn(`Warning: ${text}`);
      } else {
        console.log(text);
      }
    },
  });
}
