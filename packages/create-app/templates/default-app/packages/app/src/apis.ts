import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  discoveryApiRef,
  UrlPatternDiscovery,
  oauthRequestApiRef,
  OAuthRequestManager,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');

  const builder = ApiRegistry.builder();

  const discoveryApi = builder.add(
    discoveryApiRef,
    UrlPatternDiscovery.compile(`${backendUrl}/{{ pluginId }}`),
  );
  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(oauthRequestApiRef, new OAuthRequestManager());

  builder.add(catalogApiRef, new CatalogClient({ discoveryApi }));

  builder.add(scaffolderApiRef, new ScaffolderApi({ discoveryApi }));

  return builder.build();
};
