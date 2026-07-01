/*
 * Copyright 2025 The Backstage Authors
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

/** @type {string[]} */
const DEPRECATED_TOKENS = [
  '--bui-bg-solid',
  '--bui-bg-solid-hover',
  '--bui-bg-solid-pressed',
  '--bui-bg-solid-disabled',
  '--bui-bg-neutral-1-hover',
  '--bui-bg-neutral-1-pressed',
  '--bui-bg-neutral-1-disabled',
  '--bui-bg-neutral-2-hover',
  '--bui-bg-neutral-2-pressed',
  '--bui-bg-neutral-2-disabled',
  '--bui-bg-neutral-3-hover',
  '--bui-bg-neutral-3-pressed',
  '--bui-bg-neutral-3-disabled',
  '--bui-bg-neutral-4-hover',
  '--bui-bg-neutral-4-pressed',
  '--bui-bg-neutral-4-disabled',
  '--bui-bg-danger',
  '--bui-bg-warning',
  '--bui-bg-success',
  '--bui-bg-info',
  '--bui-fg-solid',
  '--bui-fg-solid-disabled',
  '--bui-fg-danger-on-bg',
  '--bui-fg-warning-on-bg',
  '--bui-fg-success-on-bg',
  '--bui-fg-info-on-bg',
  '--bui-fg-danger',
  '--bui-fg-success',
  '--bui-fg-info',
  '--bui-border-info',
  '--bui-border-danger',
  '--bui-border-warning',
  '--bui-border-success',
  '--bui-shadow',
];

const DEPRECATED_SET = new Set(DEPRECATED_TOKENS);

/**
 * Extracts all CSS custom property names referenced inside a string value,
 * e.g. "var(--bui-bg-solid)" → ["--bui-bg-solid"]
 * @param {string} value
 * @returns {string[]}
 */
function extractTokenNames(value) {
  const matches = value.match(/--bui-[\w-]+/g);
  return matches ?? [];
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when deprecated Backstage UI CSS tokens are referenced in JS/TS string literals.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-deprecated-bui-tokens.md',
    },
    messages: {
      deprecated:
        "'{{token}}' is a deprecated BUI token. Replace it with the appropriate current BUI token for its usage (for example, a semantic intent, surface/background, or shadow token); see this rule's migration guide for the correct mapping.",
    },
    schema: [],
  },

  create(context) {
    /**
     * @param {import('estree').Node} node
     * @param {string} value
     */
    function checkValue(node, value) {
      for (const token of extractTokenNames(value)) {
        if (DEPRECATED_SET.has(token)) {
          context.report({
            node,
            messageId: 'deprecated',
            data: { token },
          });
        }
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          checkValue(node, node.value);
        }
      },

      TemplateElement(node) {
        if (node.value?.cooked) {
          checkValue(node, node.value.cooked);
        }
      },
    };
  },
};
