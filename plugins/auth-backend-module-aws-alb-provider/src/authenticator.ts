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
import { AwsAlbClaims, AwsAlbProtectedHeader, AwsAlbResult } from './types';
import { jwtVerify } from 'jose';
import {
  createProxyAuthenticator,
  PassportProfile,
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
    const signer = config.getOptionalString('signer');
    const region = config.getString('region');
    const keyCache = new NodeCache({ stdTTL: 3600 });
    const getKey = provisionKeyCache(region, keyCache);
    return { issuer, signer, getKey };
  },
  async authenticate({ req }, { issuer, signer, getKey }) {
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
      const header = verifyResult.protectedHeader as AwsAlbProtectedHeader;
      const claims = verifyResult.payload as AwsAlbClaims;

      if (claims?.iss !== issuer) {
        throw new AuthenticationError('Issuer mismatch on JWT token');
      } else if (signer && header?.signer !== signer) {
        throw new AuthenticationError('Signer mismatch on JWT token');
      }

      if (!claims.email) {
        throw new AuthenticationError(`Missing email in the JWT token`);
      }

      const fullProfile: PassportProfile = {
        provider: 'unknown',
        id: claims.sub,
        displayName: claims.name,
        username: claims.email.split('@')[0],
        name: {
          familyName: claims.family_name,
          givenName: claims.given_name,
        },
        emails: [{ value: claims.email }],
        photos: [{ value: claims.picture }],
      };

      return {
        result: {
          fullProfile,
          accessToken: accessToken,
          expiresInSeconds: claims.exp,
        },
        providerInfo: {
          accessToken: accessToken,
          expiresInSeconds: claims.exp,
        },
      };
    } catch (e) {
      throw new Error(`Exception occurred during JWT processing: ${e}`);
    }
  },
});
