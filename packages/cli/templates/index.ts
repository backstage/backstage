import { paths } from '../src/lib/paths';

export default [
  {
    id: 'backend-module',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/default-backend-module.yaml'),
  },
  {
    id: 'backend-plugin',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/default-backend-plugin.yaml'),
  },
  {
    id: 'plugin-common',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/default-common-plugin-package.yaml'),
  },
  {
    id: 'plugin-node',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/default-node-plugin-package.yaml'),
  },
  {
    id: 'frontend-plugin', // changed from 'plugin'
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/default-plugin.yaml'),
  },
  {
    id: 'plugin-react',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/default-react-plugin-package.yaml'),
  },
  {
    id: 'node-library',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/node-library-package.yaml'),
  },
  {
    id: 'scaffolder-module',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/scaffolder-module.yaml'),
  },
  {
    id: 'web-library',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/alpha/web-library-package.yaml'),
  },
];
