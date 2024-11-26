import type { StorybookConfig } from '@storybook/react-webpack5';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import { merge } from 'webpack-merge';

import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: [
    '../docs/**/*.mdx',
    '../src/components-new/**/*.mdx',
    '../src/components-new/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: ['../static'],
  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      plugins: [new VanillaExtractPlugin()],
    },
  },
  webpackFinal: config => {
    return merge(config, {
      plugins: [new VanillaExtractPlugin()],
    });
  },
};
export default config;
