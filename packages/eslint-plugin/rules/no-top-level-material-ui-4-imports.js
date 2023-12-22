/*
 * Copyright 2023 The Backstage Authors
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

const KNOWN_STYLES = [
  'makeStyles',
  'withStyles',
  'createStyles',
  'styled',
  'useTheme',
  'Theme',
];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    messages: {
      topLevelImport: 'Top level imports for Material UI are not allowed',
      thirdLevelImport:
        'Third level or deeper imports for Material UI are not allowed',
    },
    docs: {
      description: 'Forbid top level import from Material UI v4 packages.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-top-level-material-ui-4-imports.md',
    },
  },
  create: context => ({
    ImportDeclaration: node => {
      // Anatomy of a Node
      // Example: import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
      // Specifiers are the part between the `import` and `from`, in the example that would be `SvgIcon, { SvgIconProps }`
      // Source is the part after the `from`, in the example that would be `'@material-ui/core/SvgIcon'`
      // Source value gets you `@material-ui/core/SvgIcon` without the quotes, where as Source raw gets it as is

      // Return if empty import
      if (node.specifiers.length === 0) return;
      // Return if empty source value
      if (!node.source.value) return;
      // Return if source value not a string
      if (typeof node.source.value !== 'string') return;
      // Return if import does not start with '@material-ui/'
      if (!node.source.value.startsWith('@material-ui/')) return;
      // Return if import is from '@material-ui/core/styles', as it's valid already
      if (node.source.value === '@material-ui/core/styles') return;
      // Return if proper import eg. `import Box from '@material-ui/core/Box'`
      if (
        node.specifiers.length >= 1 &&
        node.source.value?.split('/').length === 3
      )
        return;

      // Report third level or deeper imports
      if (
        node.specifiers.length === 1 &&
        node.source.value.split('/').length > 3
      ) {
        context.report({
          node,
          messageId: 'thirdLevelImport',
        });
        return;
      }

      // Report all other imports
      context.report({
        node,
        messageId: 'topLevelImport',
        fix: fixer => {
          const replacements = [];
          const styles = [];
          const svgIcon = [];

          const specifiers = node.specifiers.filter(
            s => s.type === 'ImportSpecifier',
          );

          for (const specifier of specifiers) {
            const propsMatch = /^([A-Z]\w+)Props$/.exec(specifier.local.name);
            if (propsMatch) {
              replacements.push(
                `import { ${specifier.local.name} } from '@material-ui/core/${propsMatch[1]}';`,
              );
            } else if (
              specifier.local.name === 'SvgIcon' ||
              specifier.local.name === 'SvgIconProps'
            ) {
              svgIcon.push(specifier.local.name);
            } else if (KNOWN_STYLES.includes(specifier.local.name)) {
              styles.push(specifier.local.name);
            } else {
              const replacement = `import ${specifier.local.name} from '${node.source.value}/${specifier.local.name}';`;
              replacements.push(replacement);
            }
          }

          if (svgIcon.length > 0) {
            if (svgIcon.every(s => ['SvgIcon', 'SvgIconProps'].includes(s))) {
              replacements.push(
                `import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';`,
              );
            }
          }

          if (styles.length > 0) {
            const stylesReplacement = `import { ${styles.join(
              ', ',
            )} } from '@material-ui/core/styles';`;
            replacements.push(stylesReplacement);
          }

          const result = fixer.replaceText(node, replacements.join('\n'));

          return result;
        },
      });
    },
  }),
};
