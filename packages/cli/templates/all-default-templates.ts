import { paths } from '../src/lib/paths';

export default [
  {
    id: 'backend-module',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/default-backend-module.yaml'),
  },
  {
    id: 'backend-plugin',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/default-backend-plugin.yaml'),
  },
  {
    id: 'plugin-common',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/default-common-plugin-package.yaml'),
  },
  {
    id: 'plugin-node',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/default-node-plugin-package.yaml'),
  },
  {
    id: 'frontend-plugin', // changed from 'plugin'
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/default-plugin.yaml'),
  },
  {
    id: 'plugin-react',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/default-react-plugin-package.yaml'),
  },
  {
    id: 'node-library',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/node-library-package.yaml'),
  },
  {
    id: 'scaffolder-module',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/scaffolder-module.yaml'),
  },
  {
    id: 'web-library',
    target: paths.resolveTargetRoot('node_modules/@backstage/cli/templates/web-library-package.yaml'),
  },
];
