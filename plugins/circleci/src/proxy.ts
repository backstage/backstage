import type {Options} from 'http-proxy-middleware';

export const proxySettings: Record<string, Options> = {
  '/circleci/api': {
    target: 'https://circleci.com/api/v1.1',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/circleci/api/': '/',
    },
  },
};
