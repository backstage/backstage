/*
 * Copyright 2022 The Backstage Authors
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

/**
 * NOTE: This is a worker thread function that is stringified and executed
 *       within a `worker_threads.Worker`. Everything in this function must
 *       be self-contained.
 *       Using TypeScript is fine as it is transpiled before being stringified.
 */
export async function buildTypeDefinitionsWorker(
  workerData: any,
  sendMessage: (message: any) => void,
) {
  try {
    require('@microsoft/api-extractor');
  } catch (error) {
    throw new Error(
      'Failed to resolve @microsoft/api-extractor, it must best installed ' +
        'as a dependency of your project in order to use experimental type builds',
    );
  }

  const { dirname } = require('path');
  const { entryPoints, workerConfigs, typescriptCompilerFolder } = workerData;

  const { readFileSync, writeFileSync } = require('fs');

  const apiExtractor = require('@microsoft/api-extractor');
  const { Extractor, ExtractorConfig, CompilerState } = apiExtractor;

  const ts = require('typescript');
  const {
    transform: tsTransformImportPathRewrite,
  } = require('ts-transform-import-path-rewrite');

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

  const transformImports = (definitionFile: string, suffix: string) => {
    const sourceFile = ts.createSourceFile(
      definitionFile,
      readFileSync(definitionFile, 'utf-8'),
      ts.ScriptTarget.ES2019,
      /* setParentNodes */ true,
    );

    const {
      transformed: [transformedSourceFile],
    } = ts.transform(sourceFile, [
      tsTransformImportPathRewrite({
        rewrite: (importPath: string) =>
          /@backstage\/[a-z-]+/i.test(importPath)
            ? `${importPath}/${suffix}`
            : importPath,
      }),
    ]);

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    writeFileSync(definitionFile, printer.printFile(transformedSourceFile));
  };

  let compilerState;
  for (const { extractorOptions, targetTypesDir } of workerConfigs) {
    const extractorConfig = ExtractorConfig.prepare(extractorOptions);

    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints,
      });
    }

    const extractorResult = Extractor.invoke(extractorConfig, {
      compilerState,
      localBuild: false,
      typescriptCompilerFolder,
      showVerboseMessages: false,
      showDiagnostics: false,
      messageCallback: (message: any) => {
        message.handled = true;
        sendMessage({ message, targetTypesDir });
      },
    });

    transformImports(extractorConfig.untrimmedFilePath, 'alpha');
    transformImports(extractorConfig.betaTrimmedFilePath, 'beta');

    if (!extractorResult.succeeded) {
      throw new Error(
        `Type definition build completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
    }
  }
}
