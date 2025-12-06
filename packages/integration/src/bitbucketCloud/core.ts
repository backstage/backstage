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

import fetch from 'cross-fetch';
import parseGitUrl from 'git-url-parse';
import { BitbucketCloudIntegrationConfig } from './config';
import { DateTime } from 'luxon';

type OAuthTokenData = {
  token: string;
  expiresAt: DateTime;
};

// In-memory token cache (single entry since there's only one Bitbucket Cloud integration)
let cachedToken: OAuthTokenData | undefined;

// Track in-flight token refresh request to prevent concurrent fetches
let refreshPromise: Promise<string> | undefined;

/**
 * Fetches an OAuth access token from Bitbucket Cloud using client credentials flow.
 * Tokens are cached with a 10-minute grace period to account for clock skew.
 * Implements concurrent refresh protection to prevent multiple simultaneous token requests.
 *
 * @param clientId - OAuth client ID
 * @param clientSecret - OAuth client secret
 * @public
 */
export async function getBitbucketCloudOAuthToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  // Check cache
  if (cachedToken && DateTime.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Check if there's already a refresh in progress
  if (refreshPromise) {
    return refreshPromise;
  }

  // Start a new token fetch and track it
  refreshPromise = (async () => {
    try {
      // Fetch new token
      const credentials = Buffer.from(
        `${clientId}:${clientSecret}`,
        'utf8',
      ).toString('base64');

      const response = await fetch(
        'https://bitbucket.org/site/oauth2/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
          body: 'grant_type=client_credentials',
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch OAuth token from Bitbucket Cloud: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error('OAuth token response missing access_token field');
      }

      // Calculate expiration with 10-minute grace period
      const expiresIn = data.expires_in || 3600; // Default to 1 hour
      const expiresAt = DateTime.now()
        .plus({ seconds: expiresIn })
        .minus({ minutes: 10 });

      // Cache the token
      cachedToken = {
        token: data.access_token,
        expiresAt,
      };

      return data.access_token;
    } catch (error) {
      throw new Error(
        `Failed to fetch OAuth token for Bitbucket Cloud: ${error}`,
      );
    } finally {
      // Clean up the in-flight promise tracking
      refreshPromise = undefined;
    }
  })();

  return refreshPromise;
}

/**
 * Given a URL pointing to a path on a provider, returns the default branch.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export async function getBitbucketCloudDefaultBranch(
  url: string,
  config: BitbucketCloudIntegrationConfig,
): Promise<string> {
  const { name: repoName, owner: project } = parseGitUrl(url);

  const branchUrl = `${config.apiBaseUrl}/repositories/${project}/${repoName}`;
  const response = await fetch(
    branchUrl,
    await getBitbucketCloudRequestOptions(config),
  );

  if (!response.ok) {
    const message = `Failed to retrieve default branch from ${branchUrl}, ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const repoInfo = await response.json();
  const defaultBranch = repoInfo.mainbranch.name;
  if (!defaultBranch) {
    throw new Error(
      `Failed to read default branch from ${branchUrl}. ` +
        `Response ${response.status} ${response.json()}`,
    );
  }
  return defaultBranch;
}

/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export async function getBitbucketCloudDownloadUrl(
  url: string,
  config: BitbucketCloudIntegrationConfig,
): Promise<string> {
  const {
    name: repoName,
    owner: project,
    ref,
    protocol,
    resource,
  } = parseGitUrl(url);

  let branch = ref;
  if (!branch) {
    branch = await getBitbucketCloudDefaultBranch(url, config);
  }
  return `${protocol}://${resource}/${project}/${repoName}/get/${branch}.tar.gz`;
}

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
 * to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export function getBitbucketCloudFileFetchUrl(
  url: string,
  config: BitbucketCloudIntegrationConfig,
): string {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUrl(url);
    if (!owner || !name || (filepathtype !== 'src' && filepathtype !== 'raw')) {
      throw new Error('Invalid Bitbucket Cloud URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');

    if (!ref) {
      throw new Error('Invalid Bitbucket Cloud URL or file path');
    }
    return `${config.apiBaseUrl}/repositories/${owner}/${name}/src/${ref}/${pathWithoutSlash}`;
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}

/**
 * Gets the request options necessary to make requests to a given provider.
 * Returns headers for authenticating with Bitbucket Cloud.
 * Supports OAuth (clientId/clientSecret), username/token, and username/appPassword auth.
 *
 * @param config - The relevant provider config
 * @public
 */
export async function getBitbucketCloudRequestOptions(
  config: BitbucketCloudIntegrationConfig,
): Promise<{
  headers: Record<string, string>;
}> {
  const headers: Record<string, string> = {};

  // OAuth authentication (clientId/clientSecret)
  if (config.clientId && config.clientSecret) {
    const token = await getBitbucketCloudOAuthToken(
      config.clientId,
      config.clientSecret,
    );
    headers.Authorization = `Bearer ${token}`;
    return { headers };
  }

  // Basic authentication (username + token/appPassword)
  // TODO: appPassword can be removed once fully
  // deprecated by BitBucket on 9th June 2026.
  if (config.username && (config.token ?? config.appPassword)) {
    const buffer = Buffer.from(
      `${config.username}:${config.token ?? config.appPassword}`,
      'utf8',
    );
    headers.Authorization = `Basic ${buffer.toString('base64')}`;
  }

  return { headers };
}
