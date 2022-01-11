/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  costInsightsApiRef,
  ExampleCostInsightsClient,
} from '@backstage/plugin-cost-insights';
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';
import {
  AnyApiFactory,
  ConfigApi,
  configApiRef,
  createApiFactory,
  errorApiRef,
  githubAuthApiRef,
  DiscoveryApi,
  IdentityApi,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { EntityName } from '@backstage/catalog-model';
import {
  ScaffolderClient,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder';
import { JsonObject } from '@backstage/types';
import { ResponseError } from '@backstage/errors';

type TemplateParameterSchema = {
  title: string;
  steps: Array<{
    title: string;
    schema: JsonObject;
  }>;
};
class OverrideScaffolderClient extends ScaffolderClient {
  private readonly configApi: ConfigApi;
  private readonly internalDiscoveryApi: DiscoveryApi;
  private readonly internalIdentityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
    configApi: ConfigApi;
    useLongPollingLogs?: boolean;
  }) {
    super(options);
    this.configApi = options.configApi;
    this.internalDiscoveryApi = options.discoveryApi;
    this.internalIdentityApi = options.identityApi;
  }

  async getTemplateParameterSchema(
    templateName: EntityName,
  ): Promise<TemplateParameterSchema> {
    const { namespace, kind, name } = templateName;

    const token = await this.internalIdentityApi.getIdToken();
    const baseUrl = await this.internalDiscoveryApi.getBaseUrl('scaffolder');
    const templatePath = [namespace, kind, name]
      .map(s => encodeURIComponent(s))
      .join('/');
    const url = `${baseUrl}/v2/templates/${templatePath}/parameter-schema`;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const schema: TemplateParameterSchema = await response.json();

    console.log('do the check here', schema);
    return schema;
  }
}

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),

  ScmAuth.createDefaultApiFactory(),

  createApiFactory({
    api: graphQlBrowseApiRef,
    deps: { errorApi: errorApiRef, githubAuthApi: githubAuthApiRef },
    factory: ({ errorApi, githubAuthApi }) =>
      GraphQLEndpoints.from([
        GraphQLEndpoints.create({
          id: 'gitlab',
          title: 'GitLab',
          url: 'https://gitlab.com/api/graphql',
        }),
        GraphQLEndpoints.github({
          id: 'github',
          title: 'GitHub',
          errorApi,
          githubAuthApi,
        }),
      ]),
  }),
  createApiFactory({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      identityApi: identityApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, identityApi, scmIntegrationsApi, configApi }) =>
      new OverrideScaffolderClient({
        discoveryApi,
        identityApi,
        scmIntegrationsApi,
        configApi,
      }),
  }),
  createApiFactory(costInsightsApiRef, new ExampleCostInsightsClient()),
];
