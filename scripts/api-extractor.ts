/*
 * Copyright 2021 The Backstage Authors
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
import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
  join,
} from 'path';
import prettier from 'prettier';
import fs from 'fs-extra';
import {
  Extractor,
  ExtractorConfig,
  CompilerState,
  ExtractorLogLevel,
} from '@microsoft/api-extractor';
import { DocNode, IDocNodeContainerParameters } from '@microsoft/tsdoc';
import { ApiPackage, ApiModel } from '@microsoft/api-extractor-model';
import {
  IMarkdownDocumenterOptions,
  MarkdownDocumenter,
} from '@microsoft/api-documenter/lib/documenters/MarkdownDocumenter';
import { DocTable } from '@microsoft/api-documenter/lib/nodes/DocTable';
import { DocTableRow } from '@microsoft/api-documenter/lib/nodes/DocTableRow';
import { DocHeading } from '@microsoft/api-documenter/lib/nodes/DocHeading';
import { CustomMarkdownEmitter } from '@microsoft/api-documenter/lib/markdown/CustomMarkdownEmitter';
import { IMarkdownEmitterContext } from '@microsoft/api-documenter/lib/markdown/MarkdownEmitter';

const tmpDir = resolvePath(__dirname, '../node_modules/.cache/api-extractor');

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

/**
 * Another monkey patch where we apply prettier to the API reports. This has to be patched into
 * the middle of the process as API Extractor does a comparison of the contents of the old
 * and new files during generation. This inserts the formatting just before that comparison.
 */
const {
  ApiReportGenerator,
} = require('@microsoft/api-extractor/lib/generators/ApiReportGenerator');

const originalGenerateReviewFileContent =
  ApiReportGenerator.generateReviewFileContent;
ApiReportGenerator.generateReviewFileContent =
  function decoratedGenerateReviewFileContent(...args) {
    const content = originalGenerateReviewFileContent.apply(this, args);
    return prettier.format(content, {
      ...require('@spotify/prettier-config'),
      parser: 'markdown',
    });
  };

const PACKAGE_ROOTS = ['packages', 'plugins'];

const SKIPPED_PACKAGES = [
  join('packages', 'app'),
  join('packages', 'backend'),
  join('packages', 'cli'),
  join('packages', 'codemods'),
  join('packages', 'create-app'),
  join('packages', 'e2e-test'),
  join('packages', 'storybook'),
  join('packages', 'techdocs-cli'),
];

async function findPackageDirs() {
  const packageDirs = new Array<string>();
  const projectRoot = resolvePath(__dirname, '..');

  for (const packageRoot of PACKAGE_ROOTS) {
    const dirs = await fs.readdir(resolvePath(projectRoot, packageRoot));
    for (const dir of dirs) {
      const fullPackageDir = resolvePath(projectRoot, packageRoot, dir);

      const stat = await fs.stat(fullPackageDir);
      if (!stat.isDirectory()) {
        continue;
      }

      try {
        const packageJsonPath = join(fullPackageDir, 'package.json');
        await fs.access(packageJsonPath);
      } catch (_) {
        continue;
      }

      const packageDir = relativePath(projectRoot, fullPackageDir);
      if (!SKIPPED_PACKAGES.includes(packageDir)) {
        packageDirs.push(packageDir);
      }
    }
  }

  return packageDirs;
}

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
    const packageFolder = resolvePath(__dirname, '../dist-types', packageDir);

    const extractorConfig = ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: resolvePath(packageFolder, 'src/index.d.ts'),
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
          // Silence compiler warnings, as these will prevent the CI build to work
          compilerMessageReporting: {
            default: {
              logLevel: 'none' as ExtractorLogLevel.None,
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
      packageJsonFullPath: resolvePath(projectFolder, 'package.json'),
    });

    // The `packageFolder` needs to point to the location within `dist-types` in order for relative
    // paths to be logged. Unfortunately the `prepare` method above derives it from the `packageJsonFullPath`,
    // which needs to point to the actual file, so we override `packageFolder` afterwards.
    (
      extractorConfig as {
        packageFolder: string;
      }
    ).packageFolder = packageFolder;

    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints,
      });
    }

    // Message verbosity can't be configured, so just skip the check instead
    (Extractor as any)._checkCompilerCompatibility = () => {};

    let shouldLogInstructions = false;
    let conflictingFile: undefined | string = undefined;

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
          const match = message.text.match(
            /Please copy the file "(.*)" to "api-report\.md"/,
          );
          if (match) {
            conflictingFile = match[1];
          }
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

        if (conflictingFile) {
          console.log('');
          console.log(
            `The conflicting file is ${relativePath(
              tmpDir,
              conflictingFile,
            )}, with the following content:`,
          );
          console.log('');

          const content = await fs.readFile(conflictingFile, 'utf8');
          console.log(content);
          console.log('');
        }
      }

      throw new Error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
    }
  }
}

/*
WARNING: Bring a blanket if you're gonna read the code below

There's some weird shit going on here, and it's because we cba
forking rushstash to modify the api-documenter markdown generation,
which otherwise is the recommended way to do customizations.
*/

async function buildDocs({
  inputDir,
  outputDir,
}: {
  inputDir: string;
  outputDir: string;
}) {
  // We start by constructing our own model from the files so that
  // we get a change to modify them, as the model is otherwise read-only.
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
    // Add any docs filtering logic here

    const pkg = ApiPackage.deserialize(
      serialized,
      serialized.metadata,
    ) as ApiPackage;
    newModel.addMember(pkg);
  }

  // The doc AST need to be extended with custom nodes if we want to
  // add any extra content.
  // This one is for the YAML front matter that we need for the microsite.
  class DocFrontMatter extends DocNode {
    static kind = 'DocFrontMatter';

    public readonly values: { [name: string]: unknown };

    public constructor(
      parameters: IDocNodeContainerParameters & {
        values: { [name: string]: unknown };
      },
    ) {
      super(parameters);
      this.values = parameters.values;
    }

    /** @override */
    public get kind(): string {
      return DocFrontMatter.kind;
    }
  }

  // This is where we actually write the markdown and where we can hook
  // in the rendering of our own nodes.
  class CustomCustomMarkdownEmitter extends CustomMarkdownEmitter {
    /** @override */
    protected writeNode(
      docNode: DocNode,
      context: IMarkdownEmitterContext,
      docNodeSiblings: boolean,
    ): void {
      switch (docNode.kind) {
        case DocFrontMatter.kind: {
          const node = docNode as DocFrontMatter;
          context.writer.writeLine('---');
          for (const [name, value] of Object.entries(node.values)) {
            if (value) {
              context.writer.writeLine(`${name}: ${value}`);
            }
          }
          context.writer.writeLine('---');
          context.writer.writeLine();
          break;
        }
        default:
          super.writeNode(docNode, context, docNodeSiblings);
      }
    }

    /** @override */
    emit(stringBuilder, docNode, options) {
      // Hack to get rid of the leading comment of each file, since
      // we want the front matter to come first
      stringBuilder._chunks.length = 0;
      return super.emit(stringBuilder, docNode, options);
    }
  }

  class CustomMarkdownDocumenter extends (MarkdownDocumenter as any) {
    constructor(options: IMarkdownDocumenterOptions) {
      super(options);

      // It's a strict model, we gotta register the allowed usage of our new node
      this._tsdocConfiguration.docNodeManager.registerDocNodes(
        '@backstage/docs',
        [{ docNodeKind: DocFrontMatter.kind, constructor: DocFrontMatter }],
      );
      this._tsdocConfiguration.docNodeManager.registerAllowableChildren(
        'Paragraph',
        [DocFrontMatter.kind],
      );

      this._markdownEmitter = new CustomCustomMarkdownEmitter(newModel);
    }

    // We don't really get many chances to modify the generated AST
    // so we hook in wherever we can. In this case we add the front matter
    // just before writing the breadcrumbs at the top.
    /** @override */
    _writeBreadcrumb(output, apiItem) {
      let title;
      let description;

      const name = apiItem.getScopedNameWithinPackage();
      if (name) {
        title = name;
        description = `API reference for ${apiItem.getScopedNameWithinPackage()}`;
      } else if (apiItem.kind === 'Model') {
        title = 'Package Index';
        description = 'Index of all Backstage Packages';
      } else {
        title = apiItem.name;
        description = `API Reference for ${apiItem.name}`;
      }

      // Add our front matter
      output.appendNodeInParagraph(
        new DocFrontMatter({
          configuration: this._tsdocConfiguration,
          values: {
            id: this._getFilenameForApiItem(apiItem).slice(0, -3),
            title,
            description,
          },
        }),
      );

      // Now write the actual breadcrumbs
      super._writeBreadcrumb(output, apiItem);

      // We wanna ignore the header that always gets written after the breadcrumb
      // This otherwise becomes more or less a duplicate of the title in the front matter
      const oldAppendNode = output.appendNode;
      output.appendNode = () => {
        output.appendNode = oldAppendNode;
      };
    }

    _writeModelTable(output, apiModel): void {
      const configuration = this._tsdocConfiguration;

      const packagesTable = new DocTable({
        configuration,
        headerTitles: ['Package', 'Description'],
      });

      const pluginsTable = new DocTable({
        configuration,
        headerTitles: ['Package', 'Description'],
      });

      for (const apiMember of apiModel.members) {
        const row = new DocTableRow({ configuration }, [
          this._createTitleCell(apiMember),
          this._createDescriptionCell(apiMember),
        ]);

        if (apiMember.kind === 'Package') {
          this._writeApiItemPage(apiMember);

          if (apiMember.name.startsWith('@backstage/plugin-')) {
            pluginsTable.addRow(row);
          } else {
            packagesTable.addRow(row);
          }
        }
      }

      if (packagesTable.rows.length > 0) {
        output.appendNode(
          new DocHeading({
            configuration: this._tsdocConfiguration,
            title: 'Packages',
          }),
        );
        output.appendNode(packagesTable);
      }

      if (pluginsTable.rows.length > 0) {
        output.appendNode(
          new DocHeading({
            configuration: this._tsdocConfiguration,
            title: 'Plugins',
          }),
        );
        output.appendNode(pluginsTable);
      }
    }
  }

  // This is root of the documentation generation, but it's not directly
  // responsible for generating markdown, it just constructs an AST that
  // is the consumed by an emitter to actually write the files.
  const documenter = new CustomMarkdownDocumenter({
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

  // Clean up existing stuff and write ALL the docs!
  await fs.remove(outputDir);
  await fs.ensureDir(outputDir);
  documenter.generateFiles();
}

async function main() {
  const isCiBuild = process.argv.includes('--ci');
  const isDocsBuild = process.argv.includes('--docs');

  const packageDirs = await findPackageDirs();

  console.log('# Generating package API reports');
  await runApiExtraction({
    packageDirs,
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
