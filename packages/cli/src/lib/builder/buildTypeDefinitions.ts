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
import {
  relative as relativePath,
  resolve as resolvePath,
  dirname,
} from 'path';
import { paths } from '../paths';

// These message types are ignored since we want to avoid duplicating the logic of
// handling them correctly, and we already have the API Reports warning about them.
const ignoredMessages = new Set(['tsdoc-undefined-tag', 'ae-forgotten-export']);

let apiExtractor: undefined | typeof import('@microsoft/api-extractor');
function prepareApiExtractor() {
  if (apiExtractor) {
    return apiExtractor;
  }

  try {
    apiExtractor = require('@microsoft/api-extractor');
  } catch (error) {
    throw new Error(
      'Failed to resolve @microsoft/api-extractor, it must best installed ' +
        'as a dependency of your project in order to use experimental type builds',
    );
  }

  /**
   * All of this monkey patching below is because MUI has these bare package.json file as a method
   * for making TypeScript accept imports like `@material-ui/core/Button`, and improve tree-shaking
   * by declaring them side effect free.
   *
   * The package.json lookup logic in api-extractor really doesn't like that though, as it enforces
   * that the 'name' field exists in all package.json files that it discovers. This below is just
   * making sure that we ignore those file package.json files instead of crashing.
   */
  const {
    PackageJsonLookup,
    // eslint-disable-next-line import/no-extraneous-dependencies
  } = require('@rushstack/node-core-library/lib/PackageJsonLookup');

  const old = PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor;
  PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor =
    function tryGetPackageJsonFilePathForPatch(path: string) {
      if (
        path.includes('@material-ui') &&
        !dirname(path).endsWith('@material-ui')
      ) {
        return undefined;
      }
      return old.call(this, path);
    };

  return apiExtractor!;
}

export async function buildTypeDefinitions() {
  const { Extractor, ExtractorConfig } = prepareApiExtractor();

  const distTypesPackageDir = paths.resolveTargetRoot(
    'dist-types',
    relativePath(paths.targetRoot, paths.targetDir),
  );
  const entryPoint = resolvePath(distTypesPackageDir, 'src/index.d.ts');

  const declarationsExist = await fs.pathExists(entryPoint);
  if (!declarationsExist) {
    const path = relativePath(paths.targetDir, entryPoint);
    throw new Error(
      `No declaration files found at ${path}, be sure to run ${chalk.bgRed.white(
        'yarn tsc',
      )} to generate .d.ts files before packaging`,
    );
  }

  const extractorConfig = ExtractorConfig.prepare({
    configObject: {
      mainEntryPointFilePath: entryPoint,
      bundledPackages: [],

      compiler: {
        skipLibCheck: true,
        tsconfigFilePath: paths.resolveTargetRoot('tsconfig.json'),
      },

      dtsRollup: {
        enabled: true,
        untrimmedFilePath: paths.resolveTarget('dist/index.alpha.d.ts'),
        betaTrimmedFilePath: paths.resolveTarget('dist/index.beta.d.ts'),
        publicTrimmedFilePath: paths.resolveTarget('dist/index.d.ts'),
      },

      newlineKind: 'lf',

      projectFolder: paths.targetDir,
    },
    configObjectFullPath: paths.targetDir,
    packageJsonFullPath: paths.resolveTarget('package.json'),
  });

  const typescriptDir = paths.resolveTargetRoot('node_modules/typescript');
  const hasTypescript = await fs.pathExists(typescriptDir);
  const extractorResult = Extractor.invoke(extractorConfig, {
    typescriptCompilerFolder: hasTypescript ? typescriptDir : undefined,
    localBuild: false,
    showVerboseMessages: false,
    showDiagnostics: false,
    messageCallback(message) {
      message.handled = true;
      if (ignoredMessages.has(message.messageId)) {
        return;
      }

      let text = `${message.text} (${message.messageId})`;
      if (message.sourceFilePath) {
        text += ' at ';
        text += relativePath(distTypesPackageDir, message.sourceFilePath);
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

  if (!extractorResult.succeeded) {
    throw new Error(
      `Type definition build completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`,
    );
  }
}
