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

import { Config } from '@backstage/config';
import { isValidHost } from '../helpers';

const AZURE_HOST = 'dev.azure.com';

/**
 * The configuration parameters for a single Azure provider.
 *
 * @public
 */
export type AzureIntegrationConfig = {
  /**
   * The host of the target that this matches on, e.g. "dev.azure.com".
   *
   * Currently only "dev.azure.com" is supported.
   */
  host: string;

  /**
   * The authorization token to use for requests.
   *
   * If no token is specified, anonymous access is used.
   *
   * @deprecated Use `credentials` instead.
   */
  token?: string;

  /**
   * The credential to use for requests.
   *
   * If no credential is specified anonymous access is used.
   *
   * @deprecated Use `credentials` instead.
   */
  credential?: AzureDevOpsCredential;

  /**
   * The credentials to use for requests. If multiple credentials are specified the first one that matches the organization is used.
   * If not organization matches the first credential without an organization is used.
   *
   * If no credentials are specified at all, either a default credential (for Azure DevOps) or anonymous access (for Azure DevOps Server) is used.
   */
  credentials?: AzureDevOpsCredential[];

  /**
   * Signing key for commits
   */
  commitSigningKey?: string;
};

/**
 * The kind of Azure DevOps credential.
 * @public
 */
export type AzureDevOpsCredentialKind =
  | 'PersonalAccessToken'
  | 'ClientSecret'
  | 'ManagedIdentity';

/**
 * Common fields for the Azure DevOps credentials.
 * @public
 */
export type AzureCredentialBase = {
  /**
   * The kind of credential.
   */
  kind: AzureDevOpsCredentialKind;
  /**
   * The Azure DevOps organizations for which to use this credential.
   */
  organizations?: string[];
};

/**
 * A client secret credential that was generated for an App Registration.
 * @public
 */
export type AzureClientSecretCredential = AzureCredentialBase & {
  kind: 'ClientSecret';
  /**
   * The Entra ID tenant
   */
  tenantId: string;
  /**
   * The client id
   */
  clientId: string;

  /**
   * The client secret
   */
  clientSecret: string;
};

/**
 * A managed identity credential.
 * @public
 */
export type AzureManagedIdentityCredential = AzureCredentialBase & {
  kind: 'ManagedIdentity';
  /**
   * The clientId
   */
  clientId: string;
};

/**
 * A personal access token credential.
 * @public
 */
export type PersonalAccessTokenCredential = AzureCredentialBase & {
  kind: 'PersonalAccessToken';
  personalAccessToken: string;
};

/**
 * The general shape of a credential that can be used to authenticate to Azure DevOps.
 * @public
 */
export type AzureDevOpsCredentialLike = Omit<
  Partial<AzureClientSecretCredential> &
    Partial<AzureManagedIdentityCredential> &
    Partial<PersonalAccessTokenCredential>,
  'kind'
>;

/**
 * Credential used to authenticate to Azure DevOps.
 * @public
 */
export type AzureDevOpsCredential =
  | AzureClientSecretCredential
  | AzureManagedIdentityCredential
  | PersonalAccessTokenCredential;

const AzureDevOpsCredentialFields = [
  'clientId',
  'clientSecret',
  'tenantId',
  'personalAccessToken',
] as const;
type AzureDevOpsCredentialField = (typeof AzureDevOpsCredentialFields)[number];

const AzureDevopsCredentialFieldMap = new Map<
  AzureDevOpsCredentialKind,
  AzureDevOpsCredentialField[]
>([
  ['ClientSecret', ['clientId', 'clientSecret', 'tenantId']],
  ['ManagedIdentity', ['clientId']],
  ['PersonalAccessToken', ['personalAccessToken']],
]);

function asAzureDevOpsCredential(
  credential: AzureDevOpsCredentialLike,
): AzureDevOpsCredential {
  for (const entry of AzureDevopsCredentialFieldMap.entries()) {
    const [kind, requiredFields] = entry;

    const forbiddenFields = AzureDevOpsCredentialFields.filter(
      field => !requiredFields.includes(field as AzureDevOpsCredentialField),
    );

    if (
      requiredFields.every(field => credential[field] !== undefined) &&
      forbiddenFields.every(field => credential[field] === undefined)
    ) {
      return {
        kind,
        organizations: credential.organizations,
        ...requiredFields.reduce((acc, field) => {
          acc[field] = credential[field];
          return acc;
        }, {} as Record<string, any>),
      } as AzureDevOpsCredential;
    }
  }
  throw new Error('is not a valid credential');
}

/**
 * Reads a single Azure integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export function readAzureIntegrationConfig(
  config: Config,
): AzureIntegrationConfig {
  const host = config.getOptionalString('host') ?? AZURE_HOST;

  let credentialConfigs = config
    .getOptionalConfigArray('credentials')
    ?.map(credential => {
      const result: Partial<AzureDevOpsCredentialLike> = {
        organizations: credential.getOptionalStringArray('organizations'),
        personalAccessToken: credential
          .getOptionalString('personalAccessToken')
          ?.trim(),
        tenantId: credential.getOptionalString('tenantId'),
        clientId: credential.getOptionalString('clientId'),
        clientSecret: credential.getOptionalString('clientSecret')?.trim(),
      };

      return result;
    });

  const token = config.getOptionalString('token')?.trim();

  if (
    config.getOptional('credential') !== undefined &&
    config.getOptional('credentials') !== undefined
  ) {
    throw new Error(
      `Invalid Azure integration config, 'credential' and 'credentials' cannot be used together. Use 'credentials' instead.`,
    );
  }

  if (
    config.getOptional('token') !== undefined &&
    config.getOptional('credentials') !== undefined
  ) {
    throw new Error(
      `Invalid Azure integration config, 'token' and 'credentials' cannot be used together. Use 'credentials' instead.`,
    );
  }

  if (token !== undefined) {
    const mapped = [{ personalAccessToken: token }];
    credentialConfigs = credentialConfigs?.concat(mapped) ?? mapped;
  }

  if (config.getOptional('credential') !== undefined) {
    const mapped = [
      {
        organizations: config.getOptionalStringArray(
          'credential.organizations',
        ),
        token: config.getOptionalString('credential.token')?.trim(),
        tenantId: config.getOptionalString('credential.tenantId'),
        clientId: config.getOptionalString('credential.clientId'),
        clientSecret: config
          .getOptionalString('credential.clientSecret')
          ?.trim(),
      },
    ];
    credentialConfigs = credentialConfigs?.concat(mapped) ?? mapped;
  }

  if (!isValidHost(host)) {
    throw new Error(
      `Invalid Azure integration config, '${host}' is not a valid host`,
    );
  }

  let credentials: AzureDevOpsCredential[] | undefined = undefined;
  if (credentialConfigs !== undefined) {
    const errors = credentialConfigs
      ?.reduce((acc, credentialConfig, index) => {
        let error: string | undefined = undefined;
        try {
          asAzureDevOpsCredential(credentialConfig);
        } catch (e) {
          error = e.message;
        }

        if (error !== undefined) {
          acc.push(`credential at position ${index + 1} ${error}`);
        }

        return acc;
      }, Array.of<string>())
      .concat(
        Object.entries(
          credentialConfigs
            .filter(
              credential =>
                credential.organizations !== undefined &&
                credential.organizations.length > 0,
            )
            .reduce((acc, credential, index) => {
              credential.organizations?.forEach(organization => {
                if (!acc[organization]) {
                  acc[organization] = [];
                }

                acc[organization].push(index + 1);
              });

              return acc;
            }, {} as Record<string, number[]>),
        )
          .filter(([_, indexes]) => indexes.length > 1)
          .reduce((acc, [org, indexes]) => {
            acc.push(
              `organization ${org} is specified multiple times in credentials at positions ${indexes
                .slice(0, indexes.length - 1)
                .join(', ')} and ${indexes[indexes.length - 1]}`,
            );
            return acc;
          }, Array.of<string>()),
      );

    if (errors?.length > 0) {
      throw new Error(
        `Invalid Azure integration config for ${host}: ${errors.join('; ')}`,
      );
    }

    credentials = credentialConfigs.map(credentialConfig =>
      asAzureDevOpsCredential(credentialConfig),
    );

    if (
      credentials.some(
        credential => credential.kind !== 'PersonalAccessToken',
      ) &&
      host !== AZURE_HOST
    ) {
      throw new Error(
        `Invalid Azure integration config for ${host}, only personal access tokens can be used with hosts other than ${AZURE_HOST}`,
      );
    }

    if (
      credentials.filter(
        credential =>
          credential.organizations === undefined ||
          credential.organizations.length === 0,
      ).length > 1
    ) {
      throw new Error(
        `Invalid Azure integration config for ${host}, you cannot specify multiple credentials without organizations`,
      );
    }
  }

  return {
    host,
    credentials,
    commitSigningKey: config.getOptionalString('commitSigningKey'),
  };
}

/**
 * Reads a set of Azure integration configs, and inserts some defaults for
 * public Azure if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export function readAzureIntegrationConfigs(
  configs: Config[],
): AzureIntegrationConfig[] {
  // First read all the explicit integrations
  const result = configs.map(readAzureIntegrationConfig);

  // If no explicit dev.azure.com integration was added, put one in the list as
  // a convenience
  if (!result.some(c => c.host === AZURE_HOST)) {
    result.push({ host: AZURE_HOST });
  }

  return result;
}
