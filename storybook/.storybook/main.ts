import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname, posix } from 'path';

// This set of stories are the ones that we publish to backstage.io.
const backstageCoreStories = [
  'packages/ui',
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

// Resolve absolute path of a package. Needed in monorepos.
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: async config => {
    // Add Node.js polyfills for browser environment
    config.define = {
      ...config.define,
      global: 'globalThis',
      'process.env': '{}',
      process: '{}',
    };

    return config;
  },
};

export default config;
