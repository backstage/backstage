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

import {
  lighthouseApiRef,
  LighthouseRestApi,
} from '@backstage/plugin-lighthouse';

import {
  GithubActionsClient,
  githubActionsApiRef,
} from '@backstage/plugin-github-actions';

import {
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs';

import { techRadarApiRef, TechRadar } from '@backstage/plugin-tech-radar';

import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';
import { CircleCIApi, circleCIApiRef } from '@backstage/plugin-circleci';

import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';



export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');
  const techdocsStorageUrl = config.getString('techdocs.storageUrl');

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
  builder.add(githubActionsApiRef, new GithubActionsClient());

  builder.add(lighthouseApiRef, new LighthouseRestApi('http://localhost:3003'));

  builder.add(
    circleCIApiRef,
    new CircleCIApi(`${backendUrl}/proxy/circleci/api`),
  );

  builder.add(scaffolderApiRef, new ScaffolderApi({ discoveryApi }));

  builder.add(
    techRadarApiRef,
    new TechRadar({
      width: 1500,
      height: 800,
    }),
  );

  builder.add(
    techdocsStorageApiRef,
    new TechDocsStorageApi({ apiOrigin: techdocsStorageUrl }),
  );

  return builder.build();
};
