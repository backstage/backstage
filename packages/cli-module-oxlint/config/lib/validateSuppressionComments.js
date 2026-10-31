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

const RULE_ID = 'backstage/no-unexplained-suppressions';
const RULE_ID_PATTERN = /^@?[a-z\d_-]+(?:\/[a-z\d_-]+){0,2}$/i;
const PLACEHOLDER_EXPLANATIONS =
  /^(?:todo|fixme|ignore|false positive|temporary|n\/a)[.!?]*$/i;
const DIRECTIVE_PATTERN =
  /(?:^|[\r\n])[ \t]*\*?[ \t]*(?:eslint|oxlint)-disable(?:-(?:next-line|line))?\b[^\r\n]*/gi;
const MESSAGE =
  'Use a rule-specific disable directive with a useful explanation; blanket and self-suppressions are not allowed.';

/**
 * A parser comment; lines are 1-based, columns 0-based, and ranges use UTF-16
 * source offsets.
 * @typedef {{value: string, loc: {start: {line: number, column: number}}, range?: [number, number]}} SuppressionComment
 */

/**
 * A validation issue with an optional UTF-16 source span.
 * @typedef {{message: string, line: number, column: number, offset?: number, length?: number}} SuppressionIssue
 */

/**
 * Validates actual suppression directives without performing I/O or reporting.
 * @param {SuppressionComment[]} comments
 * @returns {SuppressionIssue[]}
 */
function validateSuppressionComments(comments) {
  /** @type {SuppressionIssue[]} */
  const issues = [];

  for (const comment of comments) {
    for (const match of comment.value.matchAll(DIRECTIVE_PATTERN)) {
      const text = match[0];
      const matchIndex = match.index ?? 0;
      const directiveOffset = text.search(/(?:eslint|oxlint)-disable/i);
      const directive = text.slice(directiveOffset);
      const separator = directive.indexOf('--');
      const rulesText =
        separator === -1 ? directive : directive.slice(0, separator);
      const ruleNames = rulesText
        .replace(/^(?:eslint|oxlint)-disable(?:-(?:next-line|line))?\b/i, '')
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean);
      const explanation =
        separator === -1 ? '' : directive.slice(separator + 2).trim();
      const validRules =
        ruleNames.length > 0 &&
        ruleNames.every(
          ruleName =>
            ruleName !== '*' &&
            ruleName.toLocaleLowerCase('en-US') !== 'all' &&
            RULE_ID_PATTERN.test(ruleName) &&
            ruleName.toLocaleLowerCase('en-US') !== RULE_ID,
        );
      const validExplanation =
        Boolean(explanation) && !PLACEHOLDER_EXPLANATIONS.test(explanation);

      if (!validRules || !validExplanation) {
        const prefix = comment.value.slice(0, matchIndex + directiveOffset);
        const newlines = [...prefix.matchAll(/\r\n|\r|\n/g)];
        const line = comment.loc.start.line + newlines.length;
        const lastNewline = Math.max(
          prefix.lastIndexOf('\n'),
          prefix.lastIndexOf('\r'),
        );
        const column =
          newlines.length > 0
            ? prefix.length - lastNewline - 1
            : comment.loc.start.column + 2 + prefix.length;
        const issue = { message: MESSAGE, line, column };
        if (comment.range) {
          issues.push({
            ...issue,
            offset: comment.range[0] + 2 + matchIndex + directiveOffset,
            length: text.length - directiveOffset,
          });
        } else {
          issues.push(issue);
        }
      }
    }
  }

  return issues;
}

module.exports = { validateSuppressionComments };
