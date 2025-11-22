/*
 * Copyright 2021 The Backstage Authors
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

import { Bitbucket } from 'bitbucket';
import { getBitbucketCloudOAuthToken } from '@backstage/integration';

export const getBitbucketClient = async (config: {
  token?: string;
  username?: string;
  appPassword?: string;
  clientId?: string;
  clientSecret?: string;
}) => {
  // If OAuth credentials provided, fetch token
  if (config.clientId && config.clientSecret) {
    const token = await getBitbucketCloudOAuthToken(
      config.clientId,
      config.clientSecret,
    );
    return new Bitbucket({
      auth: {
        token,
      },
    });
  }

  if (config.token) {
    return new Bitbucket({
      auth: {
        token: config.token,
      },
    });
  } else if (config.username && config.appPassword) {
    // TODO: appPassword can be removed once fully
    // deprecated by BitBucket on 9th June 2026.
    return new Bitbucket({
      auth: {
        username: config.username,
        password: config.appPassword,
      },
    });
  }
  throw new Error(
    `Authorization has not been provided for Bitbucket Cloud. Please provide either OAuth credentials (clientId/clientSecret), username and token, or username and appPassword in the Integrations config`,
  );
};

export const getAuthorizationHeader = async (config: {
  username?: string;
  appPassword?: string;
  token?: string;
  clientId?: string;
  clientSecret?: string;
}): Promise<string> => {
  // OAuth authentication
  if (config.clientId && config.clientSecret) {
    const token = await getBitbucketCloudOAuthToken(
      config.clientId,
      config.clientSecret,
    );
    return `Bearer ${token}`;
  }

  // TODO: appPassword can be removed once fully
  // deprecated by BitBucket on 9th June 2026.
  if (config.username && (config.token ?? config.appPassword)) {
    const buffer = Buffer.from(
      `${config.username}:${config.token ?? config.appPassword}`,
      'utf8',
    );
    return `Basic ${buffer.toString('base64')}`;
  }

  if (config.token) {
    return `Bearer ${config.token}`;
  }

  throw new Error(
    `Authorization has not been provided for Bitbucket Cloud. Please provide either OAuth credentials (clientId/clientSecret), username and token, or username and appPassword in the Integrations config`,
  );
};
