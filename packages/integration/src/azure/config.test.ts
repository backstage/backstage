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

import { Config, ConfigReader } from '@backstage/config';
import { loadConfigSchema } from '@backstage/config-loader';
import {
  AzureDevOpsCredentialLike,
  AzureIntegrationConfig,
  readAzureIntegrationConfig,
  readAzureIntegrationConfigs,
} from './config';

type AzureIntegrationConfigLike = Partial<
  Omit<AzureIntegrationConfig, 'credential' | 'credentials'>
> & {
  credential?: Partial<AzureDevOpsCredentialLike>;
  credentials?: Partial<AzureDevOpsCredentialLike>[];
};

describe('readAzureIntegrationConfig', () => {
  const valid: any = {
    host: 'dev.azure.com',
    apiVersion: '6.0',
  };

  function buildConfig(data: AzureIntegrationConfigLike): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: AzureIntegrationConfigLike,
  ): Promise<Config> {
    const fullSchema = await loadConfigSchema({
      dependencies: ['@backstage/integration'],
    });
    const serializedSchema = fullSchema.serialize() as {
      schemas: { value: { properties?: { integrations?: object } } }[];
    };
    const schema = await loadConfigSchema({
      serialized: {
        ...serializedSchema, // only include schemas that apply to integrations
        schemas: serializedSchema.schemas.filter(
          s => s.value?.properties?.integrations,
        ),
      },
    });
    const processed = schema.process(
      [{ data: { integrations: { azure: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.azure[0]);
  }

  it('reads all values when using a personal access token credential', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        credentials: [
          {
            organizations: ['org1'],
            personalAccessToken: 't      ',
          },
        ],
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'PersonalAccessToken',
          organizations: ['org1'],
          personalAccessToken: 't',
        },
      ],
    });
  });

  it('reads all values when using a personal access token credential (without organizations)', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'a.com',
        credentials: [
          {
            personalAccessToken: 't',
          },
        ],
      }),
    );

    expect(output).toEqual({
      host: 'a.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'PersonalAccessToken',
          personalAccessToken: 't',
        },
      ],
    });
  });

  it('reads all values when using a client secret credential', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            organizations: ['org1', 'org2'],
            clientId: 'id',
            clientSecret: 'secret\n\n\n',
            tenantId: 'tenant',
          },
        ],
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'ClientSecret',
          organizations: ['org1', 'org2'],
          clientId: 'id',
          clientSecret: 'secret',
          tenantId: 'tenant',
        },
      ],
    });
  });

  it('reads all values when using a client secret credential (without organizations)', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            clientId: 'id',
            clientSecret: 'secret',
            tenantId: 'tenant',
          },
        ],
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'ClientSecret',
          clientId: 'id',
          clientSecret: 'secret',
          tenantId: 'tenant',
        },
      ],
    });
  });

  it('reads all values when using a managed identity credential', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            organizations: ['org1', 'org2'],
            clientId: 'id',
          },
        ],
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'ManagedIdentity',
          organizations: ['org1', 'org2'],
          clientId: 'id',
        },
      ],
    });
  });

  it('reads all values when using a managed identity credential (without organizations)', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            clientId: 'id',
          },
        ],
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'ManagedIdentity',
          clientId: 'id',
        },
      ],
    });
  });

  it('inserts the defaults if missing', () => {
    const output = readAzureIntegrationConfig(buildConfig({}));
    expect(output).toEqual({ host: 'dev.azure.com', apiVersion: '6.0' });
  });

  it('maps deprecated token to credentials', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        apiVersion: '6.0',
        token: 't',
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'PersonalAccessToken',
          personalAccessToken: 't',
        },
      ],
    });
  });

  it('maps deprecated credential to credentials', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credential: {
          clientId: 'id',
          clientSecret: 'secret',
          tenantId: 'tenantId',
        },
      }),
    );

    expect(output).toEqual({
      host: 'dev.azure.com',
      apiVersion: '6.0',
      credentials: [
        {
          kind: 'ClientSecret',
          clientId: 'id',
          clientSecret: 'secret',
          tenantId: 'tenantId',
        },
      ],
    });
  });

  it('rejects config when host is not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
  });

  it('rejects config when organizations is not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              organizations: [1, 2, 'org'],
            },
          ],
        }),
      ),
    ).toThrow(/credentials/);
  });

  it('rejects config when token is not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              personalAccessToken: 7,
            },
          ],
        }),
      ),
    ).toThrow(/credentials/);
  });

  it('rejects config when clientId is not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              clientId: 7,
            },
          ],
        }),
      ),
    ).toThrow(/credentials/);
  });

  it('rejects config when clientSecret is not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              clientId: 'id',
              clientSecret: 7,
              tenantId: 'tenant',
            },
          ],
        }),
      ),
    ).toThrow(/credentials/);
  });

  it('rejects config when tenantId is not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              clientId: 'id',
              clientSecret: 'secret',
              tenantId: 7,
            },
          ],
        }),
      ),
    ).toThrow(/credentials/);
  });

  it('rejects config when at least one credential not valid', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              personalAccessToken: 'token',
            },
            {
              clientId: 'id',
            },
            {
              clientId: 'id',
              clientSecret: 'secret',
              tenantId: 'tenant',
            },
            {
              clientId: 'id',
              personalAccessToken: 'token',
            },
          ],
        }),
      ),
    ).toThrow(/not a valid credential/);
  });

  it('rejects config when using a client secret credential for Azure DevOps server', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          host: 'a.com',
          credentials: [
            {
              clientId: 'id',
              clientSecret: 'secret',
              tenantId: 'tenant',
            },
          ],
        }),
      ),
    ).toThrow(/hosts/);
  });

  it('rejects config when using a managed identity for Azure DevOps server', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          host: 'a.com',
          credentials: [
            {
              organizations: ['org1', 'org2'],
              clientId: 'id',
            },
          ],
        }),
      ),
    ).toThrow(/personal access tokens/);
  });

  it('rejects config when using organizations for Azure DevOps server', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          host: 'a.com',
          credentials: [
            {
              clientId: 'id',
            },
          ],
        }),
      ),
    ).toThrow(/hosts/);
  });

  it('rejects config when both the credential and credentials field are specified', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credential: {
            clientId: 'id',
          },
          credentials: [
            {
              clientId: 'id',
            },
          ],
        }),
      ),
    ).toThrow(/credential/);
  });

  it('rejects config when both the token and credentials field are specified', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          token: 'token',
          credentials: [
            {
              clientId: 'id',
            },
          ],
        }),
      ),
    ).toThrow(/token/);
  });

  it('rejects config when more than one credential does not specify an organization', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              clientId: 'id',
            },
            {
              organizations: [],
              personalAccessToken: 'pat',
            },
          ],
        }),
      ),
    ).toThrow(/organizations/);
  });

  it('rejects config when multiple credentials specify the same organization', () => {
    expect(() =>
      readAzureIntegrationConfig(
        buildConfig({
          ...valid,
          credentials: [
            {
              organizations: ['org1', 'org2'],
              clientId: 'id',
            },
            {
              organizations: ['org2', 'org3'],
              personalAccessToken: 'pat',
            },
          ],
        }),
      ),
    ).toThrow(/organization org2/);
  });

  it('works on the frontend', async () => {
    expect(
      readAzureIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          apiVersion: '6.0',
          credentials: [
            {
              personalAccessToken: 't',
            },
          ],
        }),
      ),
    ).toEqual({
      host: 'a.com',
      apiVersion: '6.0',
    });
  });
});

describe('readAzureIntegrationConfigs', () => {
  function buildConfig(data: AzureIntegrationConfigLike[]): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values when using a personal access token credential', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'dev.azure.com',
          apiVersion: '6.0',
          credentials: [
            {
              organizations: ['org1'],
              personalAccessToken: 't',
            },
          ],
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            kind: 'PersonalAccessToken',
            organizations: ['org1'],
            personalAccessToken: 't',
          },
        ],
      },
    ]);
  });

  it('reads all values when using a personal access token credential (without organizations)', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'dev.azure.com',
          apiVersion: '6.0',
          credentials: [
            {
              personalAccessToken: 't',
            },
          ],
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            kind: 'PersonalAccessToken',
            personalAccessToken: 't',
          },
        ],
      },
    ]);
  });

  it('reads all values when using a client secret credential', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'dev.azure.com',
          apiVersion: '6.0',
          credentials: [
            {
              organizations: ['org1', 'org2'],
              clientId: 'id',
              clientSecret: 'secret',
              tenantId: 'tenant',
            },
          ],
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            kind: 'ClientSecret',
            organizations: ['org1', 'org2'],
            clientId: 'id',
            clientSecret: 'secret',
            tenantId: 'tenant',
          },
        ],
      },
    ]);
  });

  it('reads all values when using a client secret credential (without organizations)', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'dev.azure.com',
          apiVersion: '6.0',
          credentials: [
            {
              clientId: 'id',
              clientSecret: 'secret',
              tenantId: 'tenant',
            },
          ],
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            kind: 'ClientSecret',
            clientId: 'id',
            clientSecret: 'secret',
            tenantId: 'tenant',
          },
        ],
      },
    ]);
  });

  it('reads all values when using a managed identity credential', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'dev.azure.com',
          apiVersion: '6.0',
          credentials: [
            {
              organizations: ['org1', 'org2'],
              clientId: 'id',
            },
          ],
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            kind: 'ManagedIdentity',
            organizations: ['org1', 'org2'],
            clientId: 'id',
          },
        ],
      },
    ]);
  });

  it('reads all values when using a managed identity credential (without organizations)', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'dev.azure.com',
          apiVersion: '6.0',
          credentials: [
            {
              clientId: 'id',
            },
          ],
        },
      ]),
    );

    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
        credentials: [
          {
            kind: 'ManagedIdentity',
            clientId: 'id',
          },
        ],
      },
    ]);
  });

  it('adds a default entry when missing', () => {
    const output = readAzureIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'dev.azure.com',
        apiVersion: '6.0',
      },
    ]);
  });
});
