import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname, posix } from 'path';

/**
 * This set of stories are the ones that we publish to backstage.io.
 */
const backstageCoreStories = [
  'packages/core-components',
  'packages/app',
  'plugins/org',
  'plugins/search',
  'plugins/search-react',
  'plugins/home',
  'plugins/catalog-react',
];

const rootPath = '../../';
const storiesSrcMdx = 'src/**/*.mdx';
const storiesSrcGlob = 'src/**/*.stories.@(js|jsx|mjs|ts|tsx)';

const getStoriesPath = (element: string, pattern: string) =>
  posix.join(rootPath, element, pattern);

const stories = backstageCoreStories.flatMap(element => [
  getStoriesPath(element, storiesSrcMdx),
  getStoriesPath(element, storiesSrcGlob),
]);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
};
export default config;
