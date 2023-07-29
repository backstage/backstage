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
import crypto from 'crypto';
import { URL } from 'url';
import {
  AuthenticationError,
  InputError,
  isError,
  NotAllowedError,
} from '@backstage/errors';
import {
  encodeOAuthState,
  decodeOAuthState,
  OAuthStateTransform,
  OAuthState,
} from './state';
import { sendWebMessageResponse } from '../flow';
import { prepareBackstageIdentityResponse } from '../identity';
import { OAuthCookieManager } from './OAuthCookieManager';
import {
  AuthProviderRouteHandlers,
  AuthResolverContext,
  ClientAuthResponse,
  CookieConfigurer,
  SignInResolver,
} from '../types';
import {
  OAuthAuthenticator,
  OAuthAuthenticatorResult,
  OAuthProfileTransform,
} from './types';
import { Config } from '@backstage/config';

/** @public */
export interface OAuthRouteHandlersOptions<TProfile> {
  authenticator: OAuthAuthenticator<any, TProfile>;
  appUrl: string;
  baseUrl: string;
  isOriginAllowed: (origin: string) => boolean;
  providerId: string;
  config: Config;
  resolverContext: AuthResolverContext;
  stateTransform?: OAuthStateTransform;
  profileTransform?: OAuthProfileTransform<TProfile>;
  cookieConfigurer?: CookieConfigurer;
  signInResolver?: SignInResolver<OAuthAuthenticatorResult<TProfile>>;
}

/** @internal */
type ClientOAuthResponse = ClientAuthResponse<{
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  /**
   * (Optional) Id token issued for the signed in user.
   */
  idToken?: string;
  /**
   * Expiry of the access token in seconds.
   */
  expiresInSeconds?: number;
  /**
   * Scopes granted for the access token.
   */
  scope: string;
}>;

/** @public */
export function createOAuthRouteHandlers<TProfile>(
  options: OAuthRouteHandlersOptions<TProfile>,
): AuthProviderRouteHandlers {
  const {
    authenticator,
    config,
    baseUrl,
    appUrl,
    providerId,
    isOriginAllowed,
    cookieConfigurer,
    resolverContext,
    signInResolver,
  } = options;

  const defaultAppOrigin = new URL(appUrl).origin;
  const callbackUrl =
    config.getOptionalString('callbackUrl') ??
    `${baseUrl}/${providerId}/handler/frame`;

  const stateTransform = options.stateTransform ?? (state => ({ state }));
  const profileTransform =
    options.profileTransform ?? authenticator.defaultProfileTransform;
  const authenticatorCtx = authenticator.initialize({ config, callbackUrl });
  const cookieManager = new OAuthCookieManager({
    baseUrl,
    callbackUrl,
    defaultAppOrigin,
    providerId,
    cookieConfigurer,
  });

  return {
    async start(
      this: never,
      req: express.Request,
      res: express.Response,
    ): Promise<void> {
      // retrieve scopes from request
      const scope = req.query.scope?.toString() ?? '';
      const env = req.query.env?.toString();
      const origin = req.query.origin?.toString();
      const redirectUrl = req.query.redirectUrl?.toString();
      const flow = req.query.flow?.toString();

      if (!env) {
        throw new InputError('No env provided in request query parameters');
      }

      const nonce = crypto.randomBytes(16).toString('base64');
      // set a nonce cookie before redirecting to oauth provider
      cookieManager.setNonce(res, nonce, origin);

      const state: OAuthState = { nonce, env, origin, redirectUrl, flow };

      // If scopes are persisted then we pass them through the state so that we
      // can set the cookie on successful auth
      if (authenticator.shouldPersistScopes) {
        state.scope = scope;
      }

      const { state: transformedState } = await stateTransform(state, { req });
      const encodedState = encodeOAuthState(transformedState);

      const { url, status } = await options.authenticator.start(
        { req, scope, state: encodedState },
        authenticatorCtx,
      );

      res.statusCode = status || 302;
      res.setHeader('Location', url);
      res.setHeader('Content-Length', '0');
      res.end();
    },

    async frameHandler(
      this: never,
      req: express.Request,
      res: express.Response,
    ): Promise<void> {
      let appOrigin = defaultAppOrigin;

      try {
        const state = decodeOAuthState(req.query.state?.toString() ?? '');

        if (state.origin) {
          try {
            appOrigin = new URL(state.origin).origin;
          } catch {
            throw new NotAllowedError('App origin is invalid, failed to parse');
          }
          if (!isOriginAllowed(appOrigin)) {
            throw new NotAllowedError(`Origin '${appOrigin}' is not allowed`);
          }
        }

        // The same nonce is passed through cookie and state, and they must match
        const cookieNonce = cookieManager.getNonce(req);
        const stateNonce = state.nonce;
        if (!cookieNonce) {
          throw new Error('Auth response is missing cookie nonce');
        }
        if (stateNonce.length === 0) {
          throw new Error('Auth response is missing state nonce');
        }
        if (cookieNonce !== stateNonce) {
          throw new Error('Invalid nonce');
        }

        const result = await authenticator.authenticate(
          { req },
          authenticatorCtx,
        );
        const { profile } = await profileTransform(result, resolverContext);

        const response: ClientOAuthResponse = {
          profile,
          providerInfo: {
            idToken: result.session.idToken,
            accessToken: result.session.accessToken,
            scope: result.session.scope,
            expiresInSeconds: result.session.expiresInSeconds,
          },
        };

        if (signInResolver) {
          const identity = await signInResolver(
            { profile, result },
            resolverContext,
          );
          response.backstageIdentity =
            prepareBackstageIdentityResponse(identity);
        }

        // Store the scope that we have been granted for this session. This is useful if
        // the provider does not return granted scopes on refresh or if they are normalized.
        if (authenticator.shouldPersistScopes && state.scope) {
          cookieManager.setGrantedScopes(res, state.scope, appOrigin);
          result.session.scope = state.scope;
        }

        if (result.session.refreshToken) {
          // set new refresh token
          cookieManager.setRefreshToken(
            res,
            result.session.refreshToken,
            appOrigin,
          );
        }

        // When using the redirect flow we rely on refresh token we just
        // acquired to get a new session once we're back in the app.
        if (state.flow === 'redirect') {
          if (!state.redirectUrl) {
            throw new InputError(
              'No redirectUrl provided in request query parameters',
            );
          }
          res.redirect(state.redirectUrl);
        }
        // post message back to popup if successful
        return sendWebMessageResponse(res, appOrigin, {
          type: 'authorization_response',
          response,
        });
      } catch (error) {
        const { name, message } = isError(error)
          ? error
          : new Error('Encountered invalid error'); // Being a bit safe and not forwarding the bad value
        // post error message back to popup if failure
        return sendWebMessageResponse(res, appOrigin, {
          type: 'authorization_response',
          error: { name, message },
        });
      }
    },

    async logout(
      this: never,
      req: express.Request,
      res: express.Response,
    ): Promise<void> {
      // We use this as a lightweight CSRF protection
      if (req.header('X-Requested-With') !== 'XMLHttpRequest') {
        throw new AuthenticationError('Invalid X-Requested-With header');
      }

      if (authenticator.logout) {
        const refreshToken = cookieManager.getRefreshToken(req);
        await authenticator.logout({ req, refreshToken }, authenticatorCtx);
      }

      // remove refresh token cookie if it is set
      cookieManager.removeRefreshToken(res, req.get('origin'));

      res.status(200).end();
    },

    async refresh(
      this: never,
      req: express.Request,
      res: express.Response,
    ): Promise<void> {
      // We use this as a lightweight CSRF protection
      if (req.header('X-Requested-With') !== 'XMLHttpRequest') {
        throw new AuthenticationError('Invalid X-Requested-With header');
      }

      try {
        const refreshToken = cookieManager.getRefreshToken(req);

        // throw error if refresh token is missing in the request
        if (!refreshToken) {
          throw new InputError('Missing session cookie');
        }

        let scope = req.query.scope?.toString() ?? '';
        if (authenticator.shouldPersistScopes) {
          scope = cookieManager.getGrantedScopes(req);
        }

        const result = await authenticator.refresh(
          { req, scope, refreshToken },
          authenticatorCtx,
        );

        const { profile } = await profileTransform(result, resolverContext);

        const newRefreshToken = result.session.refreshToken;
        if (newRefreshToken && newRefreshToken !== refreshToken) {
          cookieManager.setRefreshToken(
            res,
            newRefreshToken,
            req.get('origin'),
          );
        }

        const response: ClientOAuthResponse = {
          profile,
          providerInfo: {
            idToken: result.session.idToken,
            accessToken: result.session.accessToken,
            scope: result.session.scope,
            expiresInSeconds: result.session.expiresInSeconds,
          },
        };

        if (signInResolver) {
          const identity = await signInResolver(
            { profile, result },
            resolverContext,
          );
          response.backstageIdentity =
            prepareBackstageIdentityResponse(identity);
        }

        res.status(200).json(response);
      } catch (error) {
        throw new AuthenticationError('Refresh failed', error);
      }
    },
  };
}
