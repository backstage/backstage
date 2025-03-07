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

export const getBitbucketClient = (config: {
  token?: string;
  username?: string;
  appPassword?: string;
}) => {
  if (config.username && config.appPassword) {
    return new Bitbucket({
      auth: {
        username: config.username,
        password: config.appPassword,
      },
    });
  } else if (config.token) {
    return new Bitbucket({
      auth: {
        token: config.token,
      },
    });
  }
  throw new Error(
    `Authorization has not been provided for Bitbucket Cloud. Please add either username + appPassword to the Integrations config or a user login auth token`,
  );
};

export const getAuthorizationHeader = (config: {
  username?: string;
  appPassword?: string;
  token?: string;
}) => {
  if (config.username && config.appPassword) {
    const buffer = Buffer.from(
      `${config.username}:${config.appPassword}`,
      'utf8',
    );

    return `Basic ${buffer.toString('base64')}`;
  }

  if (config.token) {
    return `Bearer ${config.token}`;
  }

  throw new Error(
    `Authorization has not been provided for Bitbucket Cloud. Please add either username + appPassword to the Integrations config or a user login auth token`,
  );
};
