module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    'jest/expect-expect': 0,
  },
  overrides: [
    {
      // shadcn/ui primitives use native HTML elements by design (no MUI dependency)
      files: ['src/components/ui/**/*.[jt]s?(x)'],
      rules: {
        'react/forbid-elements': 'off',
      },
    },
  ],
  restrictedImports: [
    {
      name: '@backstage/core-components',
      message:
        "To avoid circular dependencies, use relative paths to import '@backstage/core-components' from its subdirectories.",
    },
    {
      name: '@material-ui/core',
      message:
        "MUI v4 has been replaced by shadcn/ui components. Use components from '../components/ui/' instead.",
    },
    {
      name: '@material-ui/icons',
      message:
        'MUI icons have been replaced by lucide-react. Use \'import { IconName } from "lucide-react"\' instead.',
    },
    {
      name: '@material-ui/lab',
      message: 'MUI Lab has been replaced by shadcn/ui components.',
    },
    {
      name: '@material-table/core',
      message:
        'material-table has been replaced by @tanstack/react-table with shadcn/ui DataTable.',
    },
    {
      name: '@material-ui/styles',
      message:
        'MUI styles have been replaced by Tailwind CSS utility classes.',
    },
  ],
});
