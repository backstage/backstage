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

import { Extractor, ExtractorMessage } from '@microsoft/api-extractor';
import { AstDeclaration } from '@microsoft/api-extractor/lib/analyzer/AstDeclaration';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import type { Program } from 'typescript';

let applied = false;

export function patchApiReportGeneration() {
  // Make sure we only apply the patches once
  if (applied) {
    return;
  }
  applied = true;

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
              // so we try to strip that suffix and look up the symbol again.
              const [, trimmedSymbolName] = symbolName.match(/(.*)_\d+/) || [];
              localName = (sourceFile as any).identifiers?.get(
                trimmedSymbolName,
              );
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
            const type = program
              .getTypeChecker()
              .getDeclaredTypeOfSymbol(local);
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

      return originalGenerateReviewFileContent.call(
        this,
        collector,
        ...moreArgs,
      );
    };

  /**
   * API Extractor normally compares each report with the committed one and
   * copies it into place. Reports are instead formatted all at once after
   * extraction, and then compared by repo-tools, so this override only writes
   * the report to the temporary report folder.
   */
  if (typeof (Extractor as any)._writeApiReport !== 'function') {
    throw new Error(
      'Unable to patch API Extractor, Extractor._writeApiReport was not found. The installed version of @microsoft/api-extractor is not supported.',
    );
  }
  (Extractor as any)._writeApiReport = function writeApiReportToTempFolder(
    collector: unknown,
    _extractorConfig: unknown,
    _messageRouter: unknown,
    reportTempDirectoryPath: string,
    _reportDirectoryPath: string,
    reportConfig: { fileName: string; variant: string },
  ): boolean {
    const content: string = ApiReportGenerator.generateReviewFileContent(
      collector,
      reportConfig.variant,
    );
    fs.outputFileSync(
      resolvePath(reportTempDirectoryPath, reportConfig.fileName),
      content.replace(/\r\n?/g, '\n'),
    );
    // Whether the report changed is determined by repo-tools instead
    return false;
  };
}
