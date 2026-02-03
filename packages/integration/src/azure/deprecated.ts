/*
 * Copyright 2023 The Backstage Authors
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
import { AzureIntegrationConfig } from './config';
import { CachedAzureDevOpsCredentialsProvider } from './CachedAzureDevOpsCredentialsProvider';

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @param additionalHeaders - Additional headers for the request
 * @public
 * @deprecated Use {@link AzureDevOpsCredentialsProvider} instead.
 */
export async function getAzureRequestOptions(
  config: AzureIntegrationConfig,
  additionalHeaders?: Record<string, string>,
): Promise<{ headers: Record<string, string> }> {
  const headers: Record<string, string> = additionalHeaders
    ? { ...additionalHeaders }
    : {};

  /*
   * Since we do not have a way to determine which organization the request is for,
   * we will use the first credential that does not have an organization specified.
   */
  const credentialConfig = config.credentials?.filter(
    credential =>
      credential.organizations === undefined ||
      credential.organizations.length === 0,
  )[0];

  if (credentialConfig) {
    const credentialsProvider =
      CachedAzureDevOpsCredentialsProvider.fromAzureDevOpsCredential(
        credentialConfig,
      );
    const credentials = await credentialsProvider.getCredentials();

    return {
      headers: {
        ...credentials?.headers,
        ...headers,
      },
    };
  }

  return { headers };
}
