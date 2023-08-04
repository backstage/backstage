import path from 'path';
// import { StorybookConfig } from '@storybook/react-webpack5';

const wrapForPnp = packageName =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')));

// const config: StorybookConfig = {
const config = {
  framework: {
    name: wrapForPnp('@storybook/react-webpack5'),
    options: {},
  },
  core: {
    builder: 'webpack5',
  },
  addons: [
    wrapForPnp('@storybook/addon-controls'),
    wrapForPnp('@storybook/addon-a11y'),
    wrapForPnp('@storybook/addon-actions'),
    wrapForPnp('@storybook/addon-links'),
    // wrapForPnp("@storybook/addon-storysource"),
    {
      name: wrapForPnp('@storybook/addon-storysource'),
      options: {
        rule: {
          // test: [/\.stories\.jsx?$/], This is default
          include: [path.resolve(__dirname, '../src')], // You can specify directories
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
        },
      },
    },
    wrapForPnp('storybook-addon-swc'),
    wrapForPnp('storybook-dark-mode'),
    {
      name: 'storybook-addon-swc',
      options: {
        enable: true,
        enableSwcLoader: true,
        enableSwcMinify: true,
        swcLoaderOptions: {},
        swcMinifyOptions: {},
      },
    },
  ],
  docs: {
    autodocs: 'true', // bool or string?
  },
  stories: [
    '../../packages/core-components/src/**/*.stories.*',
    '../../packages/app/src/**/*.stories.*',
    '../../plugins/org/src/**/*.stories.*',
    '../../plugins/search/src/**/*.stories.*',
    '../../plugins/search-react',
    '../../plugins/home/src/**/*.stories.*',
    '../../plugins/stack-overflow/src/**/*.stories.*',
    '../../plugins/catalog-react/src/**/*.stories.*',
  ],
};

export default config;
