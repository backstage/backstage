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

import express from 'express';
import Router from 'express-promise-router';
import { TokenIssuer } from './types';
import { AuthService } from '@backstage/backend-plugin-api';
import { decodeJwt } from 'jose';
import { AuthenticationError, InputError } from '@backstage/errors';
import { UserInfoDatabaseHandler } from './UserInfoDatabaseHandler';

export function bindOidcRouter(
  targetRouter: express.Router,
  options: {
    baseUrl: string;
    auth: AuthService;
    tokenIssuer: TokenIssuer;
    userInfoDatabaseHandler: UserInfoDatabaseHandler;
  },
) {
  const { baseUrl, auth, tokenIssuer, userInfoDatabaseHandler } = options;

  const router = Router();
  targetRouter.use(router);

  const config = {
    issuer: baseUrl,
    token_endpoint: `${baseUrl}/v1/token`,
    userinfo_endpoint: `${baseUrl}/v1/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    response_types_supported: ['id_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: [
      'RS256',
      'RS384',
      'RS512',
      'ES256',
      'ES384',
      'ES512',
      'PS256',
      'PS384',
      'PS512',
      'EdDSA',
    ],
    scopes_supported: ['openid'],
    token_endpoint_auth_methods_supported: [],
    claims_supported: ['sub', 'ent'],
    grant_types_supported: [],
  };

  router.get('/.well-known/openid-configuration', (_req, res) => {
    res.json(config);
  });

  router.get('/.well-known/jwks.json', async (_req, res) => {
    const { keys } = await tokenIssuer.listPublicKeys();
    res.json({ keys });
  });

  router.get('/v1/token', (_req, res) => {
    res.status(501).send('Not Implemented');
  });

  // This endpoint doesn't use the regular HttpAuthService, since the contract
  // is specifically for the header to be communicated in the Authorization
  // header, regardless of token type
  router.get('/v1/userinfo', async (req, res) => {
    const matches = req.headers.authorization?.match(/^Bearer[ ]+(\S+)$/i);
    const token = matches?.[1];
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const credentials = await auth.authenticate(token, {
      allowLimitedAccess: true,
    });
    if (!auth.isPrincipal(credentials, 'user')) {
      throw new InputError(
        'Userinfo endpoint must be called with a token that represents a user principal',
      );
    }

    const { sub: userEntityRef } = decodeJwt(token);

    if (typeof userEntityRef !== 'string') {
      throw new Error('Invalid user token, user entity ref must be a string');
    }

    const userInfo = await userInfoDatabaseHandler.getUserInfo(userEntityRef);
    if (!userInfo) {
      res.status(404).send('User info not found');
      return;
    }

    res.json(userInfo);
  });
}
