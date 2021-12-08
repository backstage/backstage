// eslint-disable-next-line
module.exports = function (context, options) {
  return {
    name: 'custom-webpack-polyfills',
    // eslint-disable-next-line
    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          fallback: {
            fs: false,
            path: require.resolve('path-browserify'),
          },
        },
      };
    },
  };
};
