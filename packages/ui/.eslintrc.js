module.exports = {
  ...require('@backstage/cli/config/eslint-factory')(__dirname, {
    restrictedSrcImports: [
      {
        name: '@remixicon/react',
        message:
          'Use @backstage/ui-icons instead for tree-shakeable icons. Example: import { RiCheckLine } from "@backstage/ui-icons/RiCheckLine"',
      },
    ],
  }),
  extends: ['plugin:storybook/recommended'],
  rules: {
    'react/forbid-elements': 'off',
    '@backstage/no-mixed-plugin-imports': 'off',
    '@backstage/no-deprecated-bui-tokens': 'warn',
  },
};

