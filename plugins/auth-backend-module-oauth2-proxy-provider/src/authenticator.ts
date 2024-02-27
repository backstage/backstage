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

import { AuthenticationError } from '@backstage/errors';
import { createProxyAuthenticator } from '@backstage/plugin-auth-node';
import { decodeJwt } from 'jose';
import { OAuth2ProxyResult } from './types';

/**
 * NOTE: This may come in handy if you're doing work on this provider:
 * plugins/auth-backend/examples/docker-compose.oauth2-proxy.yaml
 *
 * @public
 */
export const OAUTH2_PROXY_JWT_HEADER = 'X-OAUTH2-PROXY-ID-TOKEN';

/** @public */
export const oauth2ProxyAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (result: OAuth2ProxyResult) => {
    return {
      profile: {
        email: result.getHeader('x-forwarded-email'),
        displayName:
          result.getHeader('x-forwarded-preferred-username') ||
          result.getHeader('x-forwarded-user'),
      },
    };
  },
  async initialize() {},
  async authenticate({ req }) {
    try {
      const authHeader = req.header(OAUTH2_PROXY_JWT_HEADER);
      const jwt = authHeader?.match(/^Bearer[ ]+(\S+)$/i)?.[1];
      const decodedJWT = jwt && decodeJwt(jwt);

      const result = {
        fullProfile: decodedJWT || {},
        accessToken: jwt || '',
        headers: req.headers,
        getHeader(name: string) {
          if (name.toLocaleLowerCase('en-US') === 'set-cookie') {
            throw new Error('Access Set-Cookie via the headers object instead');
          }
          return req.get(name);
        },
      };

      return {
        result,
        providerInfo: {
          accessToken: result.accessToken,
        },
      };
    } catch (e) {
      throw new AuthenticationError('Authentication failed', e);
    }
  },
});
