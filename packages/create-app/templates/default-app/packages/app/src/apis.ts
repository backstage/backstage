import {
  discoveryApiRef,
  UrlPatternDiscovery,
  createApiFactory,
  configApiRef,
} from '@backstage/core';

export const apis = [
  createApiFactory({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      UrlPatternDiscovery.compile(
        `${configApi.getString('backend.baseUrl')}/{{ pluginId }}`,
      ),
  }),
];
