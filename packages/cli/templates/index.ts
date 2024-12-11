export default [
  {
    id: 'backend-module',
    target: '@backstage/cli/templates/alpha/default-backend-module.yaml',
  },
  {
    id: 'backend-plugin',
    target: '@backstage/cli/templates/alpha/default-backend-plugin.yaml',
  },
  {
    id: 'plugin-common',
    target: '@backstage/cli/templates/alpha/default-common-plugin-package.yaml',
  },
  {
    id: 'plugin-node',
    target: '@backstage/cli/templates/alpha/default-node-plugin-package.yaml',
  },
  {
    id: 'frontend-plugin', // changed from 'plugin'
    target: '@backstage/cli/templates/alpha/default-plugin.yaml',
  },
  {
    id: 'plugin-react',
    target: '@backstage/cli/templates/alpha/default-react-plugin-package.yaml',
  },
  {
    id: 'node-library',
    target: '@backstage/cli/templates/alpha/node-library-package.yaml',
  },
  {
    id: 'scaffolder-module',
    target: '@backstage/cli/templates/alpha/scaffolder-module.yaml',
  },
  {
    id: 'web-library',
    target: '@backstage/cli/templates/alpha/web-library-package.yaml',
  },
];
