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

import { resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import {
  DocBlockTag,
  DocLinkTag,
  DocNode,
  DocPlainText,
  IDocNodeContainerParameters,
  Standardization,
  TSDocConfiguration,
  TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';
import {
  ApiItem,
  ApiItemKind,
  ApiModel,
  ApiPackage,
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
