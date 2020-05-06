export const proxySettings = {
  '/circleci/api': {
    target: 'https://circleci.com/api/v1.1',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/circleci/api/': '/',
    },
  },
};
