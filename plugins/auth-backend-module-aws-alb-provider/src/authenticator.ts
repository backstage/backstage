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
import { AwsAlbClaims, AwsAlbResult } from './types';
import { jwtVerify } from 'jose';
import {
  PassportProfile,
  createProxyAuthenticator,
} from '@backstage/plugin-auth-node';
import NodeCache from 'node-cache';
import { makeProfileInfo, provisionKeyCache } from './helpers';

export const ALB_JWT_HEADER = 'x-amzn-oidc-data';
export const ALB_ACCESS_TOKEN_HEADER = 'x-amzn-oidc-accesstoken';

/** @public */
export const awsAlbAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (result: AwsAlbResult) => {
    return {
      profile: makeProfileInfo(result.fullProfile, result.accessToken),
    };
  },
  initialize({ config }) {
    const issuer = config.getString('issuer');
    const region = config.getString('region');
    const keyCache = new NodeCache({ stdTTL: 3600 });
    const getKey = provisionKeyCache(region, keyCache);
    return { issuer, getKey };
  },
  async authenticate({ req }, { issuer, getKey }) {
    const jwt = req.header(ALB_JWT_HEADER);
    const accessToken = req.header(ALB_ACCESS_TOKEN_HEADER);

    if (jwt === undefined) {
      throw new AuthenticationError(
        `Missing ALB OIDC header: ${ALB_JWT_HEADER}`,
      );
    }

    if (accessToken === undefined) {
      throw new AuthenticationError(
        `Missing ALB OIDC header: ${ALB_ACCESS_TOKEN_HEADER}`,
      );
    }

    try {
      const verifyResult = await jwtVerify(jwt, getKey);
      const claims = verifyResult.payload as AwsAlbClaims;

      if (issuer && claims?.iss !== issuer) {
        throw new AuthenticationError('Issuer mismatch on JWT token');
      }

      const fullProfile: PassportProfile = {
        provider: 'unknown',
        id: claims.sub,
        displayName: claims.name,
        username: claims.email.split('@')[0].toLowerCase(),
        name: {
          familyName: claims.family_name,
          givenName: claims.given_name,
        },
        emails: [{ value: claims.email.toLowerCase() }],
        photos: [{ value: claims.picture }],
      };

      return {
        result: {
          fullProfile,
          expiresInSeconds: claims.exp,
          accessToken,
        },
      };
    } catch (e) {
      throw new Error(`Exception occurred during JWT processing: ${e}`);
    }
  },
});
