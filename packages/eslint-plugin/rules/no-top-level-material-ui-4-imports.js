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
  'ThemeProvider',
];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    messages: {
      topLevelImport: 'Top level imports for Material UI are not allowed',
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
      // Or if third level or deeper imports
      if (node.source.value?.split('/').length >= 3) return;

      // Report all other imports
      context.report({
        node,
        messageId: 'topLevelImport',
        fix: fixer => {
          const replacements = [];
          const styles = [];

          const specifiers = node.specifiers.filter(
            s => s.type === 'ImportSpecifier',
          );

          const specifiersMap = specifiers.map(s => {
            const value = s.local.name;
            const propsMatch = /^([A-Z]\w+)Props$/.exec(value);

            const emitProp = propsMatch !== null;
            const emitComponent = !emitProp;
            const emitComponentAndProp =
              emitProp && specifiers.some(s => s.local.name === propsMatch[1]);

            return {
              emitComponent: emitComponent || emitComponentAndProp,
              emitProp,
              value,
              componentValue: propsMatch ? propsMatch[1] : undefined,
            };
          });

          // Filter out duplicates where we have both component and component+prop
          const filteredMap = specifiersMap.filter(
            f => !specifiersMap.some(s => f.value === s.componentValue),
          );

          // We have 3 cases:
          // 1 - Just Prop: import { TabProps } from '@material-ui/core';
          // 2 - Just Component: import { Box } from '@material-ui/core';
          // 3 - Component and Prop: import { SvgIcon, SvgIconProps } from '@material-ui/core';

          for (const specifier of filteredMap) {
            // Just Component
            if (specifier.emitComponent && !specifier.emitProp) {
              if (KNOWN_STYLES.includes(specifier.value)) {
                styles.push(specifier.value);
              } else {
                const replacement = `import ${specifier.value} from '${node.source.value}/${specifier.value}';`;
                replacements.push(replacement);
              }
            }

            // Just Prop
            if (specifier.emitProp && !specifier.emitComponent) {
              const replacement = `import { ${specifier.value} } from '@material-ui/core/${specifier.componentValue}';`;
              replacements.push(replacement);
            }

            // Component and Prop
            if (specifier.emitComponent && specifier.emitProp) {
              replacements.push(
                `import ${specifier.componentValue}, { ${specifier.value} } from '@material-ui/core/${specifier.componentValue}';`,
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
