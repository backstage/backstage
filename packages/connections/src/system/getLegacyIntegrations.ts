/*
 * Copyright 2026 The Backstage Authors
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
import { RootConfigService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { JsonObject, JsonValue } from '@backstage/types';

/**
 * Reads legacy `integrations.*` config and converts each entry to a connection
 * object in the same shape as `connections:` config. The result is a list of
 * unvalidated JsonObjects; the caller is expected to run them through the
 * normal connection-schema validation alongside the rest of the connections
 * config.
 */
export function getLegacyIntegrations(config: RootConfigService): JsonObject[] {
  const integrations = config.getOptionalConfig('integrations');
  if (!integrations) {
    return [];
  }

  return [
    ...convertAwsCodeCommit(
      integrations.getOptionalConfigArray('awsCodeCommit') ?? [],
    ),
    ...convertAwsS3(integrations.getOptionalConfigArray('awsS3') ?? []),
    ...convertAzure(integrations.getOptionalConfigArray('azure') ?? []),
    ...convertAzureBlobStorage(
      integrations.getOptionalConfigArray('azureBlobStorage') ?? [],
    ),
    ...convertBitbucketCloud(
      integrations.getOptionalConfigArray('bitbucketCloud') ?? [],
    ),
    ...convertBitbucketServer(
      integrations.getOptionalConfigArray('bitbucketServer') ?? [],
    ),
    ...convertGerrit(integrations.getOptionalConfigArray('gerrit') ?? []),
    ...convertGitea(integrations.getOptionalConfigArray('gitea') ?? []),
    ...convertGithub(integrations.getOptionalConfigArray('github') ?? []),
    ...convertGitlab(integrations.getOptionalConfigArray('gitlab') ?? []),
    ...convertGoogleGcs(integrations.getOptionalConfigArray('googleGcs') ?? []),
    ...convertHarness(integrations.getOptionalConfigArray('harness') ?? []),
  ];
}

function convertGithub(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const token = entry.getOptionalString('token');
    if (token !== undefined) {
      auth.push({ method: 'token', token });
    }

    for (const app of entry.getOptionalConfigArray('apps') ?? []) {
      auth.push(convertGithubApp(app));
    }

    return omitUndefined({
      type: 'github',
      host: entry.getOptionalString('host'),
      apiBaseUrl: entry.getOptionalString('apiBaseUrl'),
      rawBaseUrl: entry.getOptionalString('rawBaseUrl'),
      auth,
    });
  });
}

function convertGitlab(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const token = entry.getOptionalString('token');
    if (token !== undefined) {
      auth.push({ method: 'token', token });
    }

    return omitUndefined({
      type: 'gitlab',
      host: entry.getOptionalString('host'),
      apiBaseUrl: entry.getOptionalString('apiBaseUrl'),
      baseUrl: entry.getOptionalString('baseUrl'),
      auth,
    });
  });
}

function convertGithubApp(app: Config): JsonObject {
  return omitUndefined({
    method: 'app',
    appId: app.getOptional<JsonValue>('appId'),
    privateKey: app.getOptionalString('privateKey'),
    clientId: app.getOptionalString('clientId'),
    clientSecret: app.getOptionalString('clientSecret'),
    webhookSecret: app.getOptionalString('webhookSecret'),
    orgs: app.getOptionalStringArray('allowedInstallationOwners'),
    publicAccess: app.getOptionalBoolean('publicAccess'),
  });
}

function convertAzure(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];
    for (const credential of entry.getOptionalConfigArray('credentials') ??
      []) {
      const converted = convertAzureCredential(credential);
      if (converted) {
        auth.push(converted);
      }
    }

    return omitUndefined({
      type: 'azure',
      host: entry.getOptionalString('host'),
      auth,
    });
  });
}

function convertAzureCredential(credential: Config): JsonObject | undefined {
  const orgs = credential.getOptionalStringArray('organizations');
  const personalAccessToken = credential.getOptionalString(
    'personalAccessToken',
  );
  if (personalAccessToken !== undefined) {
    return omitUndefined({
      method: 'pat',
      personalAccessToken,
      orgs,
    });
  }

  const clientSecret = credential.getOptionalString('clientSecret');
  if (clientSecret !== undefined) {
    return omitUndefined({
      method: 'clientCredentials',
      clientId: credential.getOptionalString('clientId'),
      clientSecret,
      tenantId: credential.getOptionalString('tenantId'),
      orgs,
    });
  }

  const clientId = credential.getOptionalString('clientId');
  if (clientId !== undefined) {
    return omitUndefined({
      method: 'managedIdentity',
      clientId,
      tenantId: credential.getOptionalString('tenantId'),
      managedIdentityClientId: credential.getOptionalString(
        'managedIdentityClientId',
      ),
      orgs,
    });
  }

  return undefined;
}

function convertBitbucketCloud(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const username = entry.getOptionalString('username');
    const auth: JsonObject[] = [];

    const token = entry.getOptionalString('token');
    if (username !== undefined && token !== undefined) {
      auth.push({ method: 'token', username, token });
    }

    const appPassword = entry.getOptionalString('appPassword');
    if (username !== undefined && appPassword !== undefined) {
      auth.push({ method: 'appPassword', username, appPassword });
    }

    const clientId = entry.getOptionalString('clientId');
    const clientSecret = entry.getOptionalString('clientSecret');
    if (clientId !== undefined && clientSecret !== undefined) {
      auth.push({ method: 'oauth', clientId, clientSecret });
    }

    return {
      type: 'bitbucket-cloud',
      host: 'bitbucket.org',
      auth,
    };
  });
}

function convertBitbucketServer(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const token = entry.getOptionalString('token');
    if (token !== undefined) {
      auth.push({ method: 'token', token });
    }

    const username = entry.getOptionalString('username');
    const password = entry.getOptionalString('password');
    if (username !== undefined && password !== undefined) {
      auth.push({ method: 'basic', username, password });
    }

    return omitUndefined({
      type: 'bitbucket-server',
      host: entry.getOptionalString('host'),
      apiBaseUrl: entry.getOptionalString('apiBaseUrl'),
      auth,
    });
  });
}

function convertGerrit(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const username = entry.getOptionalString('username');
    const password = entry.getOptionalString('password');
    if (username !== undefined && password !== undefined) {
      auth.push({ method: 'basic', username, password });
    }

    return omitUndefined({
      type: 'gerrit',
      host: entry.getOptionalString('host'),
      baseUrl: entry.getOptionalString('baseUrl'),
      gitilesBaseUrl: entry.getOptionalString('gitilesBaseUrl'),
      cloneUrl: entry.getOptionalString('cloneUrl'),
      auth,
    });
  });
}

function convertGitea(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const username = entry.getOptionalString('username');
    const password = entry.getOptionalString('password');
    if (username !== undefined && password !== undefined) {
      auth.push({ method: 'basic', username, password });
    }

    return omitUndefined({
      type: 'gitea',
      host: entry.getOptionalString('host'),
      baseUrl: entry.getOptionalString('baseUrl'),
      auth,
    });
  });
}

function convertHarness(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const token = entry.getOptionalString('token');
    if (token !== undefined) {
      const apiKey = entry.getOptionalString('apiKey');
      auth.push(omitUndefined({ method: 'token', token, apiKey }));
    }

    return omitUndefined({
      type: 'harness',
      host: entry.getOptionalString('host'),
      auth,
    });
  });
}

function convertAwsCodeCommit(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const accessKeyId = entry.getOptionalString('accessKeyId');
    const secretAccessKey = entry.getOptionalString('secretAccessKey');
    if (accessKeyId !== undefined && secretAccessKey !== undefined) {
      auth.push({ method: 'accessKey', accessKeyId, secretAccessKey });
    }

    const roleArn = entry.getOptionalString('roleArn');
    if (roleArn !== undefined) {
      auth.push(
        omitUndefined({
          method: 'assumeRole',
          roleArn,
          externalId: entry.getOptionalString('externalId'),
        }),
      );
    }

    const region = entry.getString('region');
    const host =
      entry.getOptionalString('host') ?? `${region}.console.aws.amazon.com`;

    return { type: 'aws-codecommit', host, region, auth };
  });
}

function convertAwsS3(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const accessKeyId = entry.getOptionalString('accessKeyId');
    const secretAccessKey = entry.getOptionalString('secretAccessKey');
    if (accessKeyId !== undefined && secretAccessKey !== undefined) {
      auth.push({ method: 'accessKey', accessKeyId, secretAccessKey });
    }

    const roleArn = entry.getOptionalString('roleArn');
    if (roleArn !== undefined) {
      auth.push(
        omitUndefined({
          method: 'assumeRole',
          roleArn,
          externalId: entry.getOptionalString('externalId'),
        }),
      );
    }

    const endpoint = entry.getOptionalString('endpoint');
    const host = endpoint ? new URL(endpoint).host : 'amazonaws.com';

    return omitUndefined({
      type: 'aws-s3',
      host,
      endpoint,
      s3ForcePathStyle: entry.getOptionalBoolean('s3ForcePathStyle'),
      auth,
    });
  });
}

function convertAzureBlobStorage(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const accountKey = entry.getOptionalString('accountKey');
    if (accountKey !== undefined) {
      auth.push({ method: 'accountKey', accountKey });
    }

    const sasToken = entry.getOptionalString('sasToken');
    if (sasToken !== undefined) {
      auth.push({ method: 'sasToken', sasToken });
    }

    const connectionString = entry.getOptionalString('connectionString');
    if (connectionString !== undefined) {
      auth.push({ method: 'connectionString', connectionString });
    }

    if (entry.has('aadCredential')) {
      auth.push({
        method: 'aadCredential',
        clientId: entry.getString('aadCredential.clientId'),
        tenantId: entry.getString('aadCredential.tenantId'),
        clientSecret: entry.getString('aadCredential.clientSecret'),
      });
    }

    const endpoint = entry.getOptionalString('endpoint');
    const host = endpoint
      ? new URL(endpoint).host
      : entry.getOptionalString('host') ?? 'blob.core.windows.net';

    return omitUndefined({
      type: 'azure-blob-storage',
      host,
      accountName: entry.getOptionalString('accountName'),
      endpoint,
      endpointSuffix: entry.getOptionalString('endpointSuffix'),
      auth,
    });
  });
}

function convertGoogleGcs(entries: Config[]): JsonObject[] {
  return entries.map(entry => {
    const auth: JsonObject[] = [];

    const clientEmail = entry.getOptionalString('clientEmail');
    const privateKey = entry.getOptionalString('privateKey');
    if (clientEmail !== undefined && privateKey !== undefined) {
      auth.push({ method: 'serviceAccount', clientEmail, privateKey });
    }

    return { type: 'google-gcs', host: 'storage.cloud.google.com', auth };
  });
}

function omitUndefined(
  input: Record<string, JsonValue | undefined>,
): JsonObject {
  const out: JsonObject = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}
