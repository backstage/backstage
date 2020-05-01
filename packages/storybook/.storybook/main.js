const path = require('path');

module.exports = {
  stories: [
    '../../core/src/layout/**/*.stories.tsx',
    '../../core/src/components/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    'storybook-dark-mode/register',
  ],
  webpackFinal: async config => {
    const coreSrc = path.resolve(__dirname, '../../core/src');

    config.resolve.alias = {
      ...config.resolve.alias,
      // Resolves imports of @backstage/core inside the storybook config, pointing to src
      '@backstage/core': coreSrc,
      // Point to dist version of theme and any other packages that might be needed in the future
      '@backstage/theme': path.resolve(__dirname, '../../theme'),
    };
    config.resolve.modules.push(coreSrc);

    // Remove the default babel-loader for js files, we're using ts-loader instead
    const [jsLoader] = config.module.rules.splice(0, 1);
    if (jsLoader.use[0].loader !== 'babel-loader') {
      throw new Error(
        `Unexpected loader removed from storybook config, ${jsonLoader.use[0].loader}`,
      );
    }

    config.resolve.extensions.push('.ts', '.tsx');

    // Use ts-loader for all JS/TS files
    config.module.rules.push({
      test: /\.(ts|tsx|mjs|js|jsx)$/,
      include: [__dirname, coreSrc],
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    // Disable ProgressPlugin which logs verbose webpack build progress. Warnings and Errors are still logged.
    config.plugins = config.plugins.filter(
      ({ constructor }) => constructor.name !== 'ProgressPlugin',
    );

    return config;
  },
};
