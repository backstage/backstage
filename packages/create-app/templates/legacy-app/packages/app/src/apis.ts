import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { UserSettingsStorage } from '@backstage/plugin-user-settings';
import { signalApiRef } from '@backstage/plugin-signals-react';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  createApiFactory({
    api: storageApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      errorApi: errorApiRef,
      fetchApi: fetchApiRef,
      identityApi: identityApiRef,
      signalApi: signalApiRef,
    },
    factory: deps => UserSettingsStorage.create(deps),
  }),
  ScmAuth.createDefaultApiFactory(),
];
