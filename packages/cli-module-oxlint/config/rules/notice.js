/*
 * Copyright 2026 The Backstage Authors
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

// @ts-check

const SHEBANG_REGEX = /^#![^\r\n]*\r?\n/;

const EXISTING_COMMENT_REGEX = /^\/\*[\s\S]*?\*\/\s*/;
// An empty `//` line comment is a header placeholder, for example in files
// written by `backstage-repo-tools package schema openapi generate`, unless the
// next line is a line comment with text.
const PLACEHOLDER_COMMENT_REGEX =
  /^\/\/[ \t]*(?:\r?\n|$)(?![ \t]*\/\/[ \t]*\S)\s*/;
const LICENSE_COMMENT_REGEX = /Copyright|Apache License|@license/i;

function getHeaderText() {
  const year = new Date().getFullYear();
  return `/*
 * Copyright ${year} The Backstage Authors
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

`;
}
const HEADER_REGEX =
  /^\/\*\r?\n \* Copyright 20\d{2} The Backstage Authors\r?\n \*\r?\n \* Licensed under the Apache License, Version 2\.0/;

/** @param {string} sourceText */
function findLeadingComment(sourceText) {
  const match = sourceText.match(EXISTING_COMMENT_REGEX);
  return match && match.index === 0 ? match[0] : undefined;
}

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
module.exports = {
  meta: { fixable: 'code' },
  createOnce(context) {
    return {
      Program(node) {
        const sourceText = context.sourceCode.text;

        const shebangMatch = sourceText.match(SHEBANG_REGEX);
        const offset = shebangMatch ? shebangMatch[0].length : 0;
        const textAfterShebang = sourceText.substring(offset);
        const first1000 = textAfterShebang.substring(0, 1000);

        if (HEADER_REGEX.test(first1000)) {
          return;
        }

        context.report({
          node,
          message: 'Missing or incorrect Apache 2.0 copyright header',
          fix(fixer) {
            const headerText = getHeaderText();

            // Replace a placeholder, or an existing leading comment only when
            // it looks like a license header; pragma comments such as
            // `@jest-environment` or rule suppressions are kept and the header
            // is inserted in front of them instead.
            const placeholder = textAfterShebang.match(
              PLACEHOLDER_COMMENT_REGEX,
            );
            // A valid header after a placeholder only needs the placeholder
            // removed; any other license header after it is replaced too.
            const start = offset + (placeholder ? placeholder[0].length : 0);
            const rest = sourceText.substring(start);
            if (placeholder && HEADER_REGEX.test(rest.substring(0, 1000))) {
              return fixer.replaceTextRange([offset, start], '');
            }

            const leadingComment = findLeadingComment(rest);
            const end =
              leadingComment && LICENSE_COMMENT_REGEX.test(leadingComment)
                ? start + leadingComment.length
                : start;
            return fixer.replaceTextRange([offset, end], headerText);
          },
        });
      },
    };
  },
};
