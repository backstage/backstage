/*
 * Copyright 2021 Spotify AB
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

/* eslint-disable import/no-extraneous-dependencies */

// eslint-disable-next-line no-restricted-imports
import { resolve as resolvePath, join as joinPath, dirname } from 'path';
import fs from 'fs-extra';
import {
  Extractor,
  ExtractorConfig,
  CompilerState,
  ExtractorLogLevel,
} from '@microsoft/api-extractor';
import { ApiPackage, ApiModel } from '@microsoft/api-extractor-model';
import { MarkdownDocumenter } from '@microsoft/api-documenter/lib/documenters/MarkdownDocumenter';

const tmpDir = resolvePath(__dirname, '../node_modules/.cache/api-extractor');

/**
 * Yup
 */
const {
  PackageJsonLookup,
} = require('@rushstack/node-core-library/lib/PackageJsonLookup');

const old = PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor;
PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor = function tryGetPackageJsonFilePathForPatch(
  path: string,
) {
  if (
    path.includes('@material-ui') &&
    !dirname(path).endsWith('@material-ui')
  ) {
    return undefined;
  }
  return old.call(this, path);
};

const DOCUMENTED_PACKAGES = [
  'packages/backend-common',
  'packages/catalog-client',
  'packages/catalog-model',
  'packages/cli-common',
  'packages/config',
  'packages/config-loader',
  // 'packages/core',
  // 'packages/core-api',
  'packages/dev-utils',
  'packages/errors',
  'packages/integration',
  'packages/integration-react',
  'packages/search-common',
  'packages/techdocs-common',
  'packages/test-utils',
  'packages/test-utils-core',
  'packages/theme',
];

interface ApiExtractionOptions {
  packageDirs: string[];
  outputDir: string;
  isLocalBuild: boolean;
}
async function runApiExtraction({
  packageDirs,
  outputDir,
  isLocalBuild,
}: ApiExtractionOptions) {
  await fs.remove(outputDir);

  const entryPoints = packageDirs.map(packageDir => {
    return resolvePath(__dirname, `../dist-types/${packageDir}/src/index.d.ts`);
  });

  let compilerState: CompilerState | undefined = undefined;

  for (const packageDir of packageDirs) {
    console.log(`## Processing ${packageDir}`);
    const projectFolder = resolvePath(__dirname, '..', packageDir);
    const packagePath = resolvePath(__dirname, `../${packageDir}/package.json`);

    const extractorConfig = ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: resolvePath(
          __dirname,
          '../dist-types/packages/<unscopedPackageName>/src/index.d.ts',
        ),
        bundledPackages: [],

        compiler: {
          tsconfigFilePath: resolvePath(__dirname, '../tsconfig.json'),
        },

        apiReport: {
          enabled: true,
          reportFileName: 'api-report.md',
          reportFolder: projectFolder,
          reportTempFolder: resolvePath(outputDir, '<unscopedPackageName>'),
        },

        docModel: {
          enabled: true,
          apiJsonFilePath: resolvePath(
            outputDir,
            '<unscopedPackageName>.api.json',
          ),
        },

        dtsRollup: {
          enabled: false,
        },

        tsdocMetadata: {
          enabled: false,
        },

        messages: {
          compilerMessageReporting: {
            default: {
              logLevel: 'warning' as ExtractorLogLevel.Warning,
              // These contain absolute file paths, so can't be included in the report
              // addToApiReportFile: true,
            },
          },
          extractorMessageReporting: {
            default: {
              logLevel: 'warning' as ExtractorLogLevel.Warning,
              addToApiReportFile: true,
            },
          },
          tsdocMessageReporting: {
            default: {
              logLevel: 'warning' as ExtractorLogLevel.Warning,
              addToApiReportFile: true,
            },
          },
        },

        newlineKind: 'lf',

        projectFolder,
      },
      configObjectFullPath: projectFolder,
      packageJsonFullPath: packagePath,
    });

    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints,
      });
    }

    // Message verbosity can't be configured, so just skip the check instead
    (Extractor as any)._checkCompilerCompatibility = () => {};

    let shouldLogInstructions = false;

    // Invoke API Extractor
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: isLocalBuild,
      showVerboseMessages: false,
      showDiagnostics: false,
      messageCallback(message) {
        if (
          message.text.includes(
            'You have changed the public API signature for this project.',
          )
        ) {
          shouldLogInstructions = true;
        }
      },
      compilerState,
    });

    if (!extractorResult.succeeded) {
      if (shouldLogInstructions) {
        console.log('');
        console.log(
          '*************************************************************************************',
        );
        console.log(
          '* You have uncommitted changes to the public API of a package.                      *',
        );
        console.log(
          '* To solve this, run `yarn build:api-reports` and commit all api-report.md changes. *',
        );
        console.log(
          '*************************************************************************************',
        );
        console.log('');
      }
      throw new Error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
    }
  }
}

function isComponentMember(member: any) {
  // React components are annotated with @components, and we want to skip those
  return Boolean(member.docComment.match(/\n\s*\**\s*@component/m));
}

async function buildDocs({
  inputDir,
  outputDir,
}: {
  inputDir: string;
  outputDir: string;
}) {
  const parseFile = async (filename: string): Promise<any> => {
    console.log(`Reading ${filename}`);
    return fs.readJson(resolvePath(inputDir, filename));
  };

  const filenames = await fs.readdir(inputDir);
  const serializedPackages = await Promise.all(
    filenames
      .filter(filename => filename.match(/\.api\.json$/i))
      .map(parseFile),
  );

  const newModel = new ApiModel();
  for (const serialized of serializedPackages) {
    serialized.members[0].members = serialized.members[0].members.filter(
      member => !isComponentMember(member),
    );

    const pkg = ApiPackage.deserialize(
      serialized,
      serialized.metadata,
    ) as ApiPackage;
    newModel.addMember(pkg);
  }

  await fs.remove(outputDir);
  await fs.ensureDir(outputDir);

  const documenter = new MarkdownDocumenter({
    apiModel: newModel,
    documenterConfig: {
      outputTarget: 'markdown',
      newlineKind: '\n',
      // De ba dålig kod
      configFilePath: '',
      configFile: {},
    } as any,
    outputFolder: outputDir,
  });

  documenter.generateFiles();
}

async function main() {
  const isCiBuild = process.argv.includes('--ci');
  const isDocsBuild = process.argv.includes('--docs');

  console.log('# Generating package API reports');
  await runApiExtraction({
    packageDirs: DOCUMENTED_PACKAGES,
    outputDir: tmpDir,
    isLocalBuild: !isCiBuild,
  });

  if (isDocsBuild) {
    console.log('# Generating package documentation');
    await buildDocs({
      inputDir: tmpDir,
      outputDir: resolvePath(__dirname, '..', 'docs/reference'),
    });
  }
}

main().catch(error => {
  console.error(error.stack || String(error));
  process.exit(1);
});
