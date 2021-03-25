import {
  AnyApiFactory, configApiRef, createApiFactory
} from '@backstage/core';
import {
  ScmIntegrationsApi, scmIntegrationsApiRef
} from '@backstage/integration-react';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
];
