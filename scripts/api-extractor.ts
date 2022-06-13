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
/* eslint-disable no-restricted-imports */

import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
  join,
} from 'path';
import { spawnSync } from 'child_process';
import prettier from 'prettier';
import fs from 'fs-extra';
import {
  Extractor,
  ExtractorConfig,
  CompilerState,
  ExtractorLogLevel,
  ExtractorMessage,
} from '@microsoft/api-extractor';
import { Program } from 'typescript';
import {
  DocNode,
  IDocNodeContainerParameters,
  TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import { ApiPackage, ApiModel, ApiItem } from '@microsoft/api-extractor-model';
import {
  IMarkdownDocumenterOptions,
  MarkdownDocumenter,
} from '@microsoft/api-documenter/lib/documenters/MarkdownDocumenter';
import { DocTable } from '@microsoft/api-documenter/lib/nodes/DocTable';
import { DocTableRow } from '@microsoft/api-documenter/lib/nodes/DocTableRow';
import { DocHeading } from '@microsoft/api-documenter/lib/nodes/DocHeading';
import { CustomMarkdownEmitter } from '@microsoft/api-documenter/lib/markdown/CustomMarkdownEmitter';
import { IMarkdownEmitterContext } from '@microsoft/api-documenter/lib/markdown/MarkdownEmitter';
import { AstDeclaration } from '@microsoft/api-extractor/lib/analyzer/AstDeclaration';

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

function patchFileMessageFetcher(
  router: any,
  transform: (messages: ExtractorMessage[], ast?: AstDeclaration) => void,
) {
  const {
    fetchAssociatedMessagesForReviewFile,
    fetchUnassociatedMessagesForReviewFile,
  } = router;

  router.fetchAssociatedMessagesForReviewFile =
    function patchedFetchAssociatedMessagesForReviewFile(ast) {
      const messages = fetchAssociatedMessagesForReviewFile.call(this, ast);
      return transform(messages, ast);
    };
  router.fetchUnassociatedMessagesForReviewFile =
    function patchedFetchUnassociatedMessagesForReviewFile() {
      const messages = fetchUnassociatedMessagesForReviewFile.call(this);
      return transform(messages);
    };
}

const originalGenerateReviewFileContent =
  ApiReportGenerator.generateReviewFileContent;
ApiReportGenerator.generateReviewFileContent =
  function decoratedGenerateReviewFileContent(collector, ...moreArgs) {
    const program = collector.program as Program;

    // The purpose of this override is to allow the @ignore tag to be used to ignore warnings
    // of the form "Warning: (ae-forgotten-export) The symbol "FooBar" needs to be exported by the entry point index.d.ts"
    patchFileMessageFetcher(
      collector.messageRouter,
      (messages: ExtractorMessage[]) => {
        return messages.filter(message => {
          if (message.messageId !== 'ae-forgotten-export') {
            return true;
          }

          // Symbol name has to be extracted from the message :(
          // There's frequently no AST for these exports because type literals
          // aren't traversed by the generator.
          const symbolMatch = message.text.match(/The symbol "([^"]+)"/);
          if (!symbolMatch) {
            throw new Error(
              `Failed to extract symbol name from message "${message.text}"`,
            );
          }
          const [, symbolName] = symbolMatch;

          const sourceFile = program.getSourceFile(message.sourceFilePath);
          if (!sourceFile) {
            throw new Error(
              `Failed to find source file in program at path "${message.sourceFilePath}"`,
            );
          }

          // The local name of the symbol within the file, rather than the exported name
          const localName = (sourceFile as any).identifiers?.get(symbolName);
          if (!localName) {
            throw new Error(
              `Unable to find local name of "${symbolName}" in ${sourceFile.fileName}`,
            );
          }

          // The local AST node of the export that we're missing
          const local = (sourceFile as any).locals?.get(localName);
          if (!local) {
            return true;
          }

          // Use the type checker to look up the actual declaration(s) rather than the one in the local file
          const type = program.getTypeChecker().getDeclaredTypeOfSymbol(local);
          if (!type) {
            throw new Error(
              `Unable to find type declaration of "${symbolName}" in ${sourceFile.fileName}`,
            );
          }
          const declarations = type.aliasSymbol?.declarations;
          if (!declarations || declarations.length === 0) {
            return true;
          }

          // If any of the TSDoc comments contain a @ignore tag, we ignore this message
          const isIgnored = declarations.some(declaration => {
            const tags = [(declaration as any).jsDoc]
              .flat()
              .filter(Boolean)
              .flatMap((tagNode: any) => tagNode.tags);

            return tags.some(tag => tag?.tagName.text === 'ignore');
          });

          return !isIgnored;
        });
      },
    );

    const content = originalGenerateReviewFileContent.call(
      this,
      collector,
      ...moreArgs,
    );
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
  join('packages', 'techdocs-cli-embedded-app'),
  join('packages', 'storybook'),
  join('packages', 'techdocs-cli'),
];

const ALLOW_WARNINGS = [
  'packages/core-components',
  'plugins/allure',
  'plugins/apache-airflow',
  'plugins/api-docs',
  'plugins/app-backend',
  'plugins/auth-backend',
  'plugins/azure-devops',
  'plugins/azure-devops-backend',
  'plugins/azure-devops-common',
  'plugins/badges',
  'plugins/badges-backend',
  'plugins/bazaar',
  'plugins/bazaar-backend',
  'plugins/bitrise',
  'plugins/catalog',
  'plugins/catalog-graphql',
  'plugins/catalog-import',
  'plugins/cicd-statistics',
  'plugins/circleci',
  'plugins/cloudbuild',
  'plugins/code-climate',
  'plugins/code-coverage',
  'plugins/code-coverage-backend',
  'plugins/config-schema',
  'plugins/cost-insights',
  'plugins/dynatrace',
  'plugins/explore',
  'plugins/explore-react',
  'plugins/firehydrant',
  'plugins/fossa',
  'plugins/gcalendar',
  'plugins/gcp-projects',
  'plugins/git-release-manager',
  'plugins/github-actions',
  'plugins/github-deployments',
  'plugins/github-pull-requests-board',
  'plugins/gitops-profiles',
  'plugins/graphql-backend',
  'plugins/home',
  'plugins/ilert',
  'plugins/jenkins',
  'plugins/jenkins-backend',
  'plugins/kafka',
  'plugins/kafka-backend',
  'plugins/kubernetes',
  'plugins/kubernetes-backend',
  'plugins/kubernetes-common',
  'plugins/lighthouse',
  'plugins/newrelic',
  'plugins/newrelic-dashboard',
  'plugins/pagerduty',
  'plugins/proxy-backend',
  'plugins/rollbar',
  'plugins/rollbar-backend',
  'plugins/search-backend-module-pg',
  'plugins/sentry',
  'plugins/shortcuts',
  'plugins/sonarqube',
  'plugins/splunk-on-call',
  'plugins/tech-radar',
  'plugins/user-settings',
  'plugins/xcmetrics',
];

async function resolvePackagePath(
  packagePath: string,
): Promise<string | undefined> {
  const projectRoot = resolvePath(__dirname, '..');
  const fullPackageDir = resolvePath(projectRoot, packagePath);

  const stat = await fs.stat(fullPackageDir);
  if (!stat.isDirectory()) {
    return undefined;
  }

  try {
    const packageJsonPath = join(fullPackageDir, 'package.json');
    await fs.access(packageJsonPath);
  } catch (_) {
    return undefined;
  }

  return relativePath(projectRoot, fullPackageDir);
}

async function findSpecificPackageDirs(unresolvedPackageDirs: string[]) {
  const packageDirs = new Array<string>();

  for (const unresolvedPackageDir of unresolvedPackageDirs) {
    const packageDir = await resolvePackagePath(unresolvedPackageDir);
    if (!packageDir) {
      throw new Error(`'${unresolvedPackageDir}' is not a valid package path`);
    }
    if (SKIPPED_PACKAGES.includes(packageDir)) {
      throw new Error(`'${packageDir}' does not have an API report`);
    }
    packageDirs.push(packageDir);
  }

  if (packageDirs.length === 0) {
    return undefined;
  }

  return packageDirs;
}

async function findPackageDirs() {
  const packageDirs = new Array<string>();
  const projectRoot = resolvePath(__dirname, '..');

  for (const packageRoot of PACKAGE_ROOTS) {
    const dirs = await fs.readdir(resolvePath(projectRoot, packageRoot));
    for (const dir of dirs) {
      const packageDir = await resolvePackagePath(join(packageRoot, dir));
      if (!packageDir) {
        continue;
      }

      if (!SKIPPED_PACKAGES.includes(packageDir)) {
        packageDirs.push(packageDir);
      }
    }
  }

  return packageDirs;
}

async function createTemporaryTsConfig(includedPackageDirs: string[]) {
  const path = resolvePath(__dirname, '..', 'tsconfig.tmp.json');

  process.once('exit', () => {
    fs.removeSync(path);
  });

  await fs.writeJson(path, {
    extends: './tsconfig.json',
    include: [
      // These two contain global definitions that are needed for stable API report generation
      'packages/cli/asset-types/asset-types.d.ts',
      ...includedPackageDirs.map(dir => join(dir, 'src')),
    ],
  });

  return path;
}

async function countApiReportWarnings(projectFolder: string) {
  const path = resolvePath(projectFolder, 'api-report.md');
  try {
    const content = await fs.readFile(path, 'utf8');
    const lines = content.split('\n');

    const lineWarnings = lines.filter(line =>
      line.includes('// Warning:'),
    ).length;

    const trailerStart = lines.findIndex(
      line => line === '// Warnings were encountered during analysis:',
    );
    const trailerWarnings =
      trailerStart === -1
        ? 0
        : lines.length -
          trailerStart -
          4; /* 4 lines at the trailer and after are not warnings */

    return lineWarnings + trailerWarnings;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 0;
    }
    throw error;
  }
}

async function getTsDocConfig() {
  const tsdocConfigFile = await TSDocConfigFile.loadFile(
    require.resolve('@microsoft/api-extractor/extends/tsdoc-base.json'),
  );
  tsdocConfigFile.addTagDefinition({
    tagName: '@ignore',
    syntaxKind: TSDocTagSyntaxKind.ModifierTag,
  });
  tsdocConfigFile.setSupportForTag('@ignore', true);
  return tsdocConfigFile;
}

function logApiReportInstructions() {
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

interface ApiExtractionOptions {
  packageDirs: string[];
  outputDir: string;
  isLocalBuild: boolean;
  tsconfigFilePath: string;
}

async function runApiExtraction({
  packageDirs,
  outputDir,
  isLocalBuild,
  tsconfigFilePath,
}: ApiExtractionOptions) {
  await fs.remove(outputDir);

  const entryPoints = packageDirs.map(packageDir => {
    return resolvePath(__dirname, `../dist-types/${packageDir}/src/index.d.ts`);
  });

  let compilerState: CompilerState | undefined = undefined;

  const warnings = new Array<string>();

  for (const packageDir of packageDirs) {
    console.log(`## Processing ${packageDir}`);
    const projectFolder = resolvePath(__dirname, '..', packageDir);
    const packageFolder = resolvePath(__dirname, '../dist-types', packageDir);

    const warningCountBefore = await countApiReportWarnings(projectFolder);

    const extractorConfig = ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: resolvePath(packageFolder, 'src/index.d.ts'),
        bundledPackages: [],

        compiler: {
          tsconfigFilePath,
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
      tsdocConfigFile: await getTsDocConfig(),
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
        logApiReportInstructions();

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

          logApiReportInstructions();
        }
      }

      throw new Error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
    }

    const warningCountAfter = await countApiReportWarnings(projectFolder);
    if (warningCountAfter > 0 && !ALLOW_WARNINGS.includes(packageDir)) {
      throw new Error(
        `The API Report for ${packageDir} is not allowed to have warnings`,
      );
    }
    if (warningCountAfter > warningCountBefore) {
      warnings.push(
        `The API Report for ${packageDir} introduces new warnings. ` +
          'Please fix these warnings in order to keep the API Reports tidy.',
      );
    }
  }

  if (warnings.length > 0) {
    console.warn();
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.warn();
  }
}

/*
WARNING: Bring a blanket if you're gonna read the code below

There's some weird shit going on here, and it's because we cba
forking rushstack to modify the api-documenter markdown generation,
which otherwise is the recommended way to do customizations.
*/

type ExcerptToken = {
  kind: string;
  text: string;
  canonicalReference?: string;
};

class ExcerptTokenMatcher {
  readonly #tokens: ExcerptToken[];

  constructor(tokens: ExcerptToken[]) {
    this.#tokens = tokens.slice();
  }

  nextContent() {
    const token = this.#tokens.shift();
    if (token?.kind === 'Content') {
      return token.text;
    }
    return undefined;
  }

  matchContent(expectedText: string) {
    const text = this.nextContent();
    return text !== expectedText;
  }

  getTokensUntilArrow() {
    const tokens = [];
    for (;;) {
      const token = this.#tokens.shift();
      if (token === undefined) {
        return undefined;
      }
      if (token.kind === 'Content' && token.text === ') => ') {
        return tokens;
      }
      tokens.push(token);
    }
  }

  getComponentReturnTokens() {
    const first = this.#tokens.shift();
    if (!first) {
      return undefined;
    }
    const second = this.#tokens.shift();

    if (this.#tokens.length !== 0) {
      return undefined;
    }
    if (first.kind !== 'Reference' || first.text !== 'JSX.Element') {
      return undefined;
    }
    if (!second) {
      return [first];
    } else if (second.kind === 'Content' && second.text === ' | null') {
      return [first, second];
    }
    return undefined;
  }
}

class ApiModelTransforms {
  static deserializeWithTransforms(
    serialized: any,
    transforms: Array<(member: any) => any>,
  ): ApiPackage {
    if (serialized.kind !== 'Package') {
      throw new Error(
        `Unexpected root kind in serialized ApiPackage, ${serialized.kind}`,
      );
    }
    if (serialized.members.length !== 1) {
      throw new Error(
        `Unexpected members in serialized ApiPackage, [${serialized.members
          .map(m => m.kind)
          .join(' ')}]`,
      );
    }
    const [entryPoint] = serialized.members;
    if (entryPoint.kind !== 'EntryPoint') {
      throw new Error(
        `Unexpected kind in serialized ApiPackage member, ${entryPoint.kind}`,
      );
    }

    const transformed = {
      ...serialized,
      members: [
        {
          ...entryPoint,
          members: entryPoint.members.map(member =>
            transforms.reduce((m, t) => t(m), member),
          ),
        },
      ],
    };

    return ApiPackage.deserialize(
      transformed,
      transformed.metadata,
    ) as ApiPackage;
  }

  static transformArrowComponents = (member: any) => {
    if (member.kind !== 'Variable') {
      return member;
    }

    const { name, excerptTokens } = member;

    // First letter in name must be uppercase
    const [firstChar] = name;
    if (firstChar.toLocaleUpperCase('en-US') !== firstChar) {
      return member;
    }

    // First content must match expected declaration format
    const tokens = new ExcerptTokenMatcher(excerptTokens);
    if (tokens.nextContent() !== `${name}: `) {
      return member;
    }

    // Next needs to be an arrow with `props` parameters or no parameters
    // followed by a return type of `JSX.Element | null` or just `JSX.Element`
    const declStart = tokens.nextContent();
    if (declStart === '(props: ' || declStart === '(_props: ') {
      const props = tokens.getTokensUntilArrow();
      const ret = tokens.getComponentReturnTokens();
      if (props && ret) {
        return this.makeComponentMember(member, ret, props);
      }
    } else if (declStart === '() => ') {
      const ret = tokens.getComponentReturnTokens();
      if (ret) {
        return this.makeComponentMember(member, ret);
      }
    }
    return member;
  };

  static makeComponentMember(
    member: any,
    ret: ExcerptToken[],
    props?: ExcerptToken[],
  ) {
    const declTokens = props
      ? [
          {
            kind: 'Content',
            text: `export declare function ${member.name}(props: `,
          },
          ...props,
          {
            kind: 'Content',
            text: '): ',
          },
        ]
      : [
          {
            kind: 'Content',
            text: `export declare function ${member.name}(): `,
          },
        ];

    return {
      kind: 'Function',
      name: member.name,
      releaseTag: member.releaseTag,
      docComment: member.docComment ?? '',
      canonicalReference: member.canonicalReference,
      excerptTokens: [...declTokens, ...ret],
      returnTypeTokenRange: {
        startIndex: declTokens.length,
        endIndex: declTokens.length + ret.length,
      },
      parameters: props
        ? [
            {
              parameterName: 'props',
              parameterTypeTokenRange: {
                startIndex: 1,
                endIndex: 1 + props.length,
              },
            },
          ]
        : [],
      overloadIndex: 1,
    };
  }

  static transformTrimDeclare = (member: any) => {
    const { excerptTokens } = member;
    const firstContent = new ExcerptTokenMatcher(excerptTokens).nextContent();
    if (firstContent && firstContent.startsWith('export declare ')) {
      return {
        ...member,
        excerptTokens: [
          {
            kind: 'Content',
            text: firstContent.slice('export declare '.length),
          },
          ...excerptTokens.slice(1),
        ],
      };
    }
    return member;
  };
}

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
    newModel.addMember(
      ApiModelTransforms.deserializeWithTransforms(serialized, [
        ApiModelTransforms.transformArrowComponents,
        ApiModelTransforms.transformTrimDeclare,
      ]),
    );
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
    // Until https://github.com/microsoft/rushstack/issues/2914 gets fixed or we change markdown renderer we need a fix
    // to render pipe | character correctly.
    protected getEscapedText(text: string): string {
      return text
        .replace(/\\/g, '\\\\') // first replace the escape character
        .replace(/[*#[\]_`~]/g, x => `\\${x}`) // then escape any special characters
        .replace(/---/g, '\\-\\-\\-') // hyphens only if it's 3 or more
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\|/g, '&#124;');
    }
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

    private _getFilenameForApiItem(apiItem: ApiItem): string {
      const filename: string = super._getFilenameForApiItem(apiItem);

      if (filename.includes('.html.')) {
        return filename.replace(/\.html\./g, '._html.');
      }

      return filename;
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
  const projectRoot = resolvePath(__dirname, '..');
  const isCiBuild = process.argv.includes('--ci');
  const isDocsBuild = process.argv.includes('--docs');
  const runTsc = process.argv.includes('--tsc');

  const selectedPackageDirs = await findSpecificPackageDirs(
    process.argv.slice(2).filter(arg => !arg.startsWith('--')),
  );
  if (selectedPackageDirs && isCiBuild) {
    throw new Error(
      'Package path arguments are not supported together with the --ci flag',
    );
  }
  if (!selectedPackageDirs && !isCiBuild && !isDocsBuild) {
    console.log('');
    console.log(
      'TIP: You can generate api-reports for select packages by passing package paths:',
    );
    console.log('');
    console.log(
      '       yarn build:api-reports packages/config packages/core-plugin-api',
    );
    console.log('');
  }

  let temporaryTsConfigPath: string | undefined;
  if (selectedPackageDirs) {
    temporaryTsConfigPath = await createTemporaryTsConfig(selectedPackageDirs);
  }
  const tsconfigFilePath =
    temporaryTsConfigPath ?? resolvePath(projectRoot, 'tsconfig.json');

  if (runTsc) {
    await fs.remove(resolvePath(projectRoot, 'dist-types'));
    const { status } = spawnSync(
      'yarn',
      [
        'tsc',
        ['--project', tsconfigFilePath],
        ['--skipLibCheck', 'false'],
        ['--incremental', 'false'],
      ].flat(),
      {
        stdio: 'inherit',
        shell: true,
        cwd: projectRoot,
      },
    );
    if (status !== 0) {
      process.exit(status);
    }
  }

  const packageDirs = selectedPackageDirs ?? (await findPackageDirs());

  console.log('# Generating package API reports');
  await runApiExtraction({
    packageDirs,
    outputDir: tmpDir,
    isLocalBuild: !isCiBuild,
    tsconfigFilePath,
  });

  if (isDocsBuild) {
    console.log('# Generating package documentation');
    await buildDocs({
      inputDir: tmpDir,
      outputDir: resolvePath(projectRoot, 'docs/reference'),
    });
  }
}

main().catch(error => {
  console.error(error.stack || String(error));
  process.exit(1);
});
