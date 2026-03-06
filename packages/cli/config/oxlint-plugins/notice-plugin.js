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

const SHEBANG_REGEX = /^#![^\r\n]*\r?\n/;

const HEADER_REGEX =
  /^\/\*\r?\n \* Copyright 20\d{2} The Backstage Authors\r?\n \*\r?\n \* Licensed under the Apache License, Version 2\.0/;

const EXISTING_COMMENT_REGEX = /^\/\*[\s\S]*?\*\/\s*/;

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

module.exports = {
  meta: {
    name: 'notice',
  },
  rules: {
    notice: {
      meta: { fixable: 'code' },
      createOnce(context) {
        return {
          Program(node) {
            const sourceText = context.getSourceCode().getText();

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
                const match = textAfterShebang.match(EXISTING_COMMENT_REGEX);

                if (match && match.index === 0) {
                  return fixer.replaceTextRange(
                    [offset, offset + match[0].length],
                    headerText,
                  );
                }

                return fixer.insertTextBeforeRange(
                  [offset, offset],
                  headerText,
                );
              },
            });
          },
        };
      },
    },
  },
};
