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

import {
  resolve as resolvePath,
  relative as relativePath,
  basename,
  join,
  extname,
} from 'path';
import { execFile } from 'child_process';
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
  TSDocConfiguration,
  Standardization,
  DocBlockTag,
  DocPlainText,
  DocLinkTag,
} from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import {
  ApiPackage,
  ApiModel,
  ApiItem,
  ApiItemKind,
} from '@microsoft/api-extractor-model';
import {
  IMarkdownDocumenterOptions,
  MarkdownDocumenter,
} from '@microsoft/api-documenter/lib/documenters/MarkdownDocumenter';
import { DocTable } from '@microsoft/api-documenter/lib/nodes/DocTable';
import { DocTableRow } from '@microsoft/api-documenter/lib/nodes/DocTableRow';
import { DocHeading } from '@microsoft/api-documenter/lib/nodes/DocHeading';
import {
  CustomMarkdownEmitter,
  ICustomMarkdownEmitterOptions,
} from '@microsoft/api-documenter/lib/markdown/CustomMarkdownEmitter';
import { IMarkdownEmitterContext } from '@microsoft/api-documenter/lib/markdown/MarkdownEmitter';
import { AstDeclaration } from '@microsoft/api-extractor/lib/analyzer/AstDeclaration';
import { paths as cliPaths } from '../../lib/paths';
import minimatch from 'minimatch';

const tmpDir = cliPaths.resolveTargetRoot(
  './node_modules/.cache/api-extractor',
);

/**
 * All of this monkey patching below is for apply prettier to the API reports. This has to be patched into
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
    function patchedFetchAssociatedMessagesForReviewFile(
      ast: AstDeclaration | undefined,
    ) {
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
  function decoratedGenerateReviewFileContent(
    collector: { program: Program; messageRouter: any },
    ...moreArgs: any[]
  ) {
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

          const sourceFile =
            message.sourceFilePath &&
            program.getSourceFile(message.sourceFilePath);
          if (!sourceFile) {
            throw new Error(
              `Failed to find source file in program at path "${message.sourceFilePath}"`,
            );
          }

          // The local name of the symbol within the file, rather than the exported name
          let localName = (sourceFile as any).identifiers?.get(symbolName);

          if (!localName) {
            // Sometimes the symbol name is suffixed with a number to disambiguate,
            // e.g. "Props_14" instead of "Props" if there are multiple Props interfaces
            // so we tyry to strip that suffix and look up the symbol again.
            const [, trimmedSymbolName] = symbolName.match(/(.*)_\d+/) || [];
            localName = (sourceFile as any).identifiers?.get(trimmedSymbolName);
          }

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

    try {
      const prettier = require('prettier') as typeof import('prettier');

      const config = prettier.resolveConfig.sync(cliPaths.targetRoot) ?? {};
      return prettier.format(content, {
        ...config,
        parser: 'markdown',
      });
    } catch (e) {
      return content;
    }
  };

export async function createTemporaryTsConfig(includedPackageDirs: string[]) {
  const path = cliPaths.resolveTargetRoot('tsconfig.tmp.json');

  process.once('exit', () => {
    fs.removeSync(path);
  });

  let assetTypeFile: string[] = [];

  try {
    assetTypeFile = [
      require.resolve('@backstage/cli/asset-types/asset-types.d.ts'),
    ];
  } catch {
    /** ignore */
  }

  await fs.writeJson(path, {
    extends: './tsconfig.json',
    include: [
      // These two contain global definitions that are needed for stable API report generation
      ...assetTypeFile,
      ...includedPackageDirs.map(dir => join(dir, 'src')),
    ],
    // we don't exclude node_modules so that we can use the asset-types.d.ts file
    exclude: [],
  });

  return path;
}

export async function countApiReportWarnings(reportPath: string) {
  try {
    const content = await fs.readFile(reportPath, 'utf8');
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

export async function getTsDocConfig() {
  const tsdocConfigFile = await TSDocConfigFile.loadFile(
    require.resolve('@microsoft/api-extractor/extends/tsdoc-base.json'),
  );
  tsdocConfigFile.addTagDefinition({
    tagName: '@ignore',
    syntaxKind: TSDocTagSyntaxKind.ModifierTag,
  });
  tsdocConfigFile.addTagDefinition({
    tagName: '@config',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
  });
  tsdocConfigFile.setSupportForTag('@ignore', true);
  tsdocConfigFile.setSupportForTag('@config', true);
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

async function findPackageEntryPoints(
  packageDirs: string[],
): Promise<Array<{ packageDir: string; name: string }>> {
  return Promise.all(
    packageDirs.map(async packageDir => {
      const pkg = await fs.readJson(
        cliPaths.resolveTargetRoot(packageDir, 'package.json'),
      );

      if (pkg.exports && typeof pkg.exports !== 'string') {
        return Object.entries(pkg.exports).flatMap(([mount, path]) => {
          const ext = extname(String(path));
          if (!['.ts', '.tsx', '.cts', '.mts'].includes(ext)) {
            return []; // Ignore non-TS entry points
          }
          let name = mount;
          if (name.startsWith('./')) {
            name = name.slice(2);
          }
          if (!name || name === '.') {
            return [{ packageDir, name: 'index' }];
          }
          return [{ packageDir, name }];
        });
      }

      return { packageDir, name: 'index' };
    }),
  ).then(results => results.flat());
}

interface ApiExtractionOptions {
  packageDirs: string[];
  outputDir: string;
  isLocalBuild: boolean;
  tsconfigFilePath: string;
  allowWarnings?: boolean | string[];
  omitMessages?: string[];
  validateReleaseTags?: boolean;
}

export async function runApiExtraction({
  packageDirs,
  outputDir,
  isLocalBuild,
  tsconfigFilePath,
  allowWarnings = false,
  omitMessages = [],
  validateReleaseTags = false,
}: ApiExtractionOptions) {
  await fs.remove(outputDir);

  const packageEntryPoints = await findPackageEntryPoints(packageDirs);

  const entryPoints = packageEntryPoints.map(({ packageDir, name }) => {
    return cliPaths.resolveTargetRoot(
      `./dist-types/${packageDir}/src/${name}.d.ts`,
    );
  });

  let compilerState: CompilerState | undefined = undefined;

  const allowWarningPkg = Array.isArray(allowWarnings) ? allowWarnings : [];

  const messagesConf: { [key: string]: { logLevel: string } } = {};
  for (const messageCode of omitMessages) {
    messagesConf[messageCode] = {
      logLevel: 'none',
    };
  }
  const warnings = new Array<string>();

  for (const { packageDir, name } of packageEntryPoints) {
    console.log(`## Processing ${packageDir}`);
    const noBail = Array.isArray(allowWarnings)
      ? allowWarnings.some(aw => aw === packageDir || minimatch(packageDir, aw))
      : allowWarnings;

    const projectFolder = cliPaths.resolveTargetRoot(packageDir);
    const packageFolder = cliPaths.resolveTargetRoot(
      './dist-types',
      packageDir,
    );

    const prefix = name === 'index' ? '' : `${name}-`;
    const reportFileName = `${prefix}api-report.md`;
    const reportPath = resolvePath(projectFolder, reportFileName);

    const warningCountBefore = await countApiReportWarnings(reportPath);

    const extractorConfig = ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: resolvePath(packageFolder, `src/${name}.d.ts`),
        bundledPackages: [],

        compiler: {
          tsconfigFilePath,
        },

        apiReport: {
          enabled: true,
          reportFileName,
          reportFolder: projectFolder,
          reportTempFolder: resolvePath(
            outputDir,
            `${prefix}<unscopedPackageName>`,
          ),
        },

        docModel: {
          enabled: true,
          apiJsonFilePath: resolvePath(
            outputDir,
            `${prefix}<unscopedPackageName>.api.json`,
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
            ...messagesConf,
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
      ignoreMissingEntryPoint: true,
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

    // This release tag validation makes sure that the release tag of known entry points match expectations.
    // The root index entrypoint is only allowed @public exports, while /alpha and /beta only allow @alpha and @beta.
    if (validateReleaseTags) {
      if (['index', 'alpha', 'beta'].includes(name)) {
        const report = await fs.readFile(
          extractorConfig.reportFilePath,
          'utf8',
        );
        const lines = report.split(/\r?\n/);
        const expectedTag = name === 'index' ? 'public' : name;
        for (let i = 0; i < lines.length; i += 1) {
          const line = lines[i];
          const match = line.match(/^\/\/ @(alpha|beta|public)/);
          if (match && match[1] !== expectedTag) {
            throw new Error(
              `Unexpected release tag ${match[1]} in ${
                extractorConfig.reportFilePath
              } at line ${i + 1}`,
            );
          }
        }
      }
    }

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

    const warningCountAfter = await countApiReportWarnings(reportPath);
    if (noBail) {
      console.log(`Skipping warnings check for ${packageDir}`);
    }
    if (warningCountAfter > 0 && !noBail) {
      throw new Error(
        `The API Report for ${packageDir} is not allowed to have warnings`,
      );
    }
    if (warningCountAfter === 0 && allowWarningPkg.includes(packageDir)) {
      console.log(
        `No need to allow warnings for ${packageDir}, it does not have any`,
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
          .map((m: { kind: any }) => m.kind)
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
          members: entryPoint.members.map((member: any) =>
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

export async function buildDocs({
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

  // This class only propose is to have a different kind and be able to render links with backticks
  class DocCodeSpanLink extends DocLinkTag {
    static kind = 'DocCodeSpanLink';

    /** @override */
    public get kind(): string {
      return DocCodeSpanLink.kind;
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
      context: IMarkdownEmitterContext<ICustomMarkdownEmitterOptions>,
      docNodeSiblings: boolean,
    ): void {
      switch (docNode.kind) {
        case DocFrontMatter.kind: {
          const node = docNode as DocFrontMatter;
          context.writer.writeLine('---');
          for (const [name, value] of Object.entries(node.values)) {
            if (value) {
              context.writer.writeLine(
                `${name}: "${String(value).replace(/\"/g, '')}"`,
              );
            }
          }
          context.writer.writeLine('---');
          context.writer.writeLine();
          break;
        }
        case 'BlockTag': {
          const node = docNode as DocBlockTag;
          if (node.tagName === '@config') {
            context.writer.writeLine('## Related config ');
          }
          break;
        }
        case DocCodeSpanLink.kind: {
          const node = docNode as DocLinkTag;
          if (node.codeDestination) {
            // TODO @sarabadu understand if we need `codeDestination` at all on this custom DocCodeSpanLink
            super.writeLinkTagWithCodeDestination(node, context);
          } else if (node.urlDestination) {
            const linkText =
              node.linkText !== undefined ? node.linkText : node.urlDestination;
            const encodedLinkText = this.getEscapedText(
              linkText.replace(/\s+/g, ' '),
            );
            context.writer.write('[');
            context.writer.write(`\`${encodedLinkText}\``);
            context.writer.write(`](${node.urlDestination})`);
          } else if (node.linkText) {
            this.writePlainText(node.linkText, context);
          }
          break;
        }
        default:
          super.writeNode(docNode, context, docNodeSiblings);
      }
    }

    /** @override */
    emit(
      stringBuilder: any,
      docNode: DocNode,
      options: ICustomMarkdownEmitterOptions,
    ) {
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
      (
        this._tsdocConfiguration as TSDocConfiguration
      ).docNodeManager.registerDocNodes('@backstage/docs', [
        { docNodeKind: DocFrontMatter.kind, constructor: DocFrontMatter },
      ]);
      (
        this._tsdocConfiguration as TSDocConfiguration
      ).docNodeManager.registerDocNodes('@backstage/docs', [
        { docNodeKind: DocCodeSpanLink.kind, constructor: DocCodeSpanLink },
      ]);
      (
        this._tsdocConfiguration as TSDocConfiguration
      ).docNodeManager.registerAllowableChildren('Paragraph', [
        DocFrontMatter.kind,
        DocCodeSpanLink.kind,
      ]);

      const def = {
        tagName: '@config',
        syntaxKind: TSDocTagSyntaxKind.BlockTag,
        tagNameWithUpperCase: '@CONFIG',
        standardization: Standardization.Extended,
        allowMultiple: false,
      };
      (this._tsdocConfiguration as TSDocConfiguration).addTagDefinition(def);
      (this._tsdocConfiguration as TSDocConfiguration).setSupportForTag(
        def,
        true,
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
    _writeBreadcrumb(output: any, apiItem: ApiItem & { name: string }) {
      let title;
      let description;

      const name = apiItem.getScopedNameWithinPackage();
      if (name) {
        title = name;
        description = `API reference for ${apiItem.getScopedNameWithinPackage()}`;
      } else if (apiItem.kind === 'Model') {
        title = 'Package Index';
        description = 'Index of all Backstage Packages';
      } else if (apiItem.name) {
        title = apiItem.name;
        description = `API Reference for ${apiItem.name}`;
      } else {
        title = apiItem.displayName;
        description = `API Reference for ${apiItem.displayName}`;
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

      const configuration: TSDocConfiguration = this._tsdocConfiguration;

      output.appendNodeInParagraph(
        new DocLinkTag({
          configuration,
          tagName: '@link',
          linkText: 'Home',
          urlDestination: this._getLinkFilenameForApiItem(this._apiModel),
        }),
      );

      for (const hierarchyItem of apiItem.getHierarchy()) {
        switch (hierarchyItem.kind) {
          case ApiItemKind.Model:
          case ApiItemKind.EntryPoint:
            // We don't show the model as part of the breadcrumb because it is the root-level container.
            // We don't show the entry point because today API Extractor doesn't support multiple entry points;
            // this may change in the future.
            break;
          default:
            output.appendNodesInParagraph([
              new DocPlainText({
                configuration,
                text: ' > ',
              }),
              new DocCodeSpanLink({
                configuration,
                tagName: '@link',
                linkText: hierarchyItem.displayName,
                urlDestination: this._getLinkFilenameForApiItem(hierarchyItem),
              }),
            ]);
        }
      }

      // We wanna ignore the header that always gets written after the breadcrumb
      // This otherwise becomes more or less a duplicate of the title in the front matter
      const oldAppendNode = output.appendNode;
      output.appendNode = () => {
        output.appendNode = oldAppendNode;
      };
    }

    _writeModelTable(
      output: { appendNode: (arg0: DocTable | DocHeading) => void },
      apiModel: { members: any },
    ): void {
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

export async function categorizePackageDirs(packageDirs: any[]) {
  const dirs = packageDirs.slice();
  const tsPackageDirs = new Array<string>();
  const cliPackageDirs = new Array<string>();

  await Promise.all(
    Array(10)
      .fill(0)
      .map(async () => {
        for (;;) {
          const dir = dirs.pop();
          if (!dir) {
            return;
          }

          const pkgJson = await fs
            .readJson(cliPaths.resolveTargetRoot(dir, 'package.json'))
            .catch(error => {
              if (error.code === 'ENOENT') {
                return undefined;
              }
              throw error;
            });
          const role = pkgJson?.backstage?.role;
          if (!role) {
            return; // Ignore packages without roles
          }
          if (role === 'cli') {
            cliPackageDirs.push(dir);
          } else if (role !== 'frontend' && role !== 'backend') {
            tsPackageDirs.push(dir);
          }
        }
      }),
  );

  return { tsPackageDirs, cliPackageDirs };
}

function createBinRunner(cwd: string, path: string) {
  return async (...command: string[]) =>
    new Promise<string>((resolve, reject) => {
      execFile(
        'node',
        [path, ...command],
        {
          cwd,
          shell: true,
          timeout: 60000,
          maxBuffer: 1024 * 1024,
        },
        (err, stdout, stderr) => {
          if (err) {
            reject(new Error(`${err.message}\n${stderr}`));
          } else if (stderr) {
            reject(new Error(`Command printed error output: ${stderr}`));
          } else {
            resolve(stdout);
          }
        },
      );
    });
}

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

// Represents the help page os a CLI command
interface CliHelpPage {
  // Path of commands to reach this page
  path: string[];
  // Parsed content
  usage: string | undefined;
  options: string[];
  commands: string[];
  commandArguments: string[];
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

// The API model for a CLI entry point
interface CliModel {
  name: string;
  helpPages: CliHelpPage[];
}

function generateCliReport(name: string, models: CliModel[]): string {
  const content = [
    `## CLI Report file for "${name}"`,
    '',
    '> Do not edit this file. It is a report generated by `yarn build:api-reports`',
    '',
  ];

  for (const model of models) {
    for (const helpPage of model.helpPages) {
      content.push(
        `### \`${[model.name, ...helpPage.path].join(' ')}\``,
        '',
        '```',
        `Usage: ${helpPage.usage ?? '<none>'}`,
      );

      if (helpPage.options.length > 0) {
        content.push('', 'Options:', ...helpPage.options.map(l => `  ${l}`));
      }

      if (helpPage.commands.length > 0) {
        content.push('', 'Commands:', ...helpPage.commands.map(l => `  ${l}`));
      }
      content.push('```', '');
    }
  }

  return content.join('\n');
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

    const report = generateCliReport(pkgJson.name, models);

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
