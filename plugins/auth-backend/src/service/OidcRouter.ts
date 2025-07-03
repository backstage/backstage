/*
 * Copyright 2025 The Backstage Authors
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
import Router from 'express-promise-router';
import { OidcService } from './OidcService';
import { AuthenticationError, isError } from '@backstage/errors';
import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { TokenIssuer } from '../identity/types';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { OidcDatabase } from '../database/OidcDatabase';
import { json } from 'express';

export class OidcRouter {
  private constructor(
    private readonly oidc: OidcService,
    private readonly logger: LoggerService,
  ) {}

  static create(options: {
    auth: AuthService;
    tokenIssuer: TokenIssuer;
    baseUrl: string;
    logger: LoggerService;
    userInfo: UserInfoDatabase;
    oidc: OidcDatabase;
  }) {
    return new OidcRouter(OidcService.create(options), options.logger);
  }

  public getRouter() {
    const router = Router();

    router.use(json());

    router.get('/.well-known/openid-configuration', (_req, res) => {
      res.json(this.oidc.getConfiguration());
    });

    router.get('/.well-known/jwks.json', async (_req, res) => {
      const { keys } = await this.oidc.listPublicKeys();
      res.json({ keys });
    });

    router.get('/v1/authorize', async (req, res) => {
      // todo(blam): maybe add zod types for validating input
      const {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType,
        scope,
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
      } = req.query;

      if (!clientId || !redirectUri || !responseType) {
        this.logger.error(`Failed to authorize: Missing required parameters`);
        return res.status(400).json({
          error: 'invalid_request',
          error_description:
            'Missing required parameters: client_id, redirect_uri, response_type',
        });
      }

      try {
        // use default user entity ref for now, as we need a redirect to the frontend plugin
        // for the consent flow in order to issue the right token for the right user.
        const userEntityRef = 'user:default/guest';

        const { redirectUrl } = await this.oidc.authorize({
          clientId: clientId as string,
          redirectUri: redirectUri as string,
          responseType: responseType as string,
          scope: scope as string,
          state: state as string,
          nonce: nonce as string,
          codeChallenge: codeChallenge as string,
          codeChallengeMethod: codeChallengeMethod as string,
          userEntityRef,
        });

        return res.redirect(redirectUrl);
      } catch (error) {
        const errorParams = new URLSearchParams();
        errorParams.append(
          'error',
          isError(error) ? error.name : 'server_error',
        );
        errorParams.append(
          'error_description',
          isError(error) ? error.message : 'Unknown error',
        );
        if (state) {
          errorParams.append('state', state as string);
        }

        const redirectUrl = new URL(redirectUri as string);
        redirectUrl.search = errorParams.toString();
        return res.redirect(redirectUrl.toString());
      }
    });

    router.post('/v1/token', async (req, res) => {
      // todo(blam): maybe add zod types for validating input
      const {
        grant_type: grantType,
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      } = req.body;

      if (!grantType || !code || !clientId || !clientSecret || !redirectUri) {
        this.logger.error(
          `Failed to exchange code for token: Missing required parameters`,
        );
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters',
        });
      }

      try {
        const result = await this.oidc.exchangeCodeForToken({
          code,
          clientId,
          clientSecret,
          redirectUri,
          codeVerifier,
          grantType,
        });

        return res.json(result);
      } catch (error) {
        const description = isError(error) ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to exchange code for token: ${description}`,
          error,
        );

        if (isError(error)) {
          if (error.name === 'AuthenticationError') {
            return res.status(401).json({
              error: 'invalid_client',
              error_description: error.message,
            });
          }
          if (error.name === 'InputError') {
            return res.status(400).json({
              error: 'invalid_request',
              error_description: error.message,
            });
          }
        }

        return res.status(500).json({
          error: 'server_error',
          error_description: isError(error) ? error.message : 'Unknown error',
        });
      }
    });

    // This endpoint doesn't use the regular HttpAuth, since the contract
    // is specifically for the header to be communicated in the Authorization
    // header, regardless of token type
    router.get('/v1/userinfo', async (req, res) => {
      const matches = req.headers.authorization?.match(/^Bearer[ ]+(\S+)$/i);
      const token = matches?.[1];
      if (!token) {
        throw new AuthenticationError('No token provided');
      }

      const userInfo = await this.oidc.getUserInfo({ token });

      if (!userInfo) {
        res.status(404).send('User info not found');
        return;
      }

      res.json(userInfo);
    });

    router.post('/v1/register', async (req, res) => {
      // todo(blam): maybe add zod types for validating input
      const registrationRequest = req.body;

      if (!registrationRequest.redirect_uris?.length) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'redirect_uris is required',
        });
        return;
      }

      try {
        const client = await this.oidc.registerClient({
          clientName: registrationRequest.client_name,
          redirectUris: registrationRequest.redirect_uris,
          responseTypes: registrationRequest.response_types,
          grantTypes: registrationRequest.grant_types,
          scope: registrationRequest.scope,
        });

        res.status(201).json({
          client_id: client.clientId,
          redirect_uris: client.redirectUris,
          client_secret: client.clientSecret,
        });
      } catch (e) {
        const description = isError(e) ? e.message : 'Unknown error';
        this.logger.error(`Failed to register client: ${description}`, e);

        res.status(500).json({
          error: 'server_error',
          error_description: `Failed to register client: ${description}`,
        });
      }
    });

    return router;
  }
}
