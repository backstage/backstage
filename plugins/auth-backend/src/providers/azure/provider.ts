/*
 * Copyright 2020 Spotify AB
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

import { OIDCStrategy as AzureStrategy } from 'passport-azure-ad';

import {
  OAuthProviderHandlers,
  OAuthResponse,
  PassportDoneCallback,
  RedirectInfo,
  AuthProviderConfig,
  AzureProviderOptions,
} from '../types';

import {
  executeRedirectStrategy,
  executeFrameHandlerStrategy,
  executeRefreshTokenStrategy,
  executeFetchUserProfileStrategy,
  makeProfileInfo,
} from '../../lib/PassportStrategyHelper';

import { OAuthProvider } from '../../lib/OAuthProvider';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';
import { Config } from '@backstage/config';
import passport from 'passport';

import got from 'got';

type PrivateInfo = {
  refreshToken: string;
};

export class AzureAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: AzureStrategy;    

  static transformAuthResponse(
    rawProfile: any,
    accessToken: string,
    params: any,
    photoURL?: any,
  ): OAuthResponse {

    const passportProfile: passport.Profile = {
      id: rawProfile.oid,
      username: rawProfile._json.preferred_username,
      displayName: rawProfile.displayName,
      provider: 'azure',
      name: {
        familyName: rawProfile.name.familyName,
        givenName: rawProfile.name.givenName,
      },
      // If no email for user, fallback to preferred_username
      emails: [
        { value: rawProfile._json.email || rawProfile._json.preferred_username }
      ],
      photos: [
        { value: photoURL }
      ],
    };

    const profile = makeProfileInfo(passportProfile, params.id_token)
    
    const providerInfo = {
      idToken: params.id_token,
      accessToken,
      scope: params.scope,
      expiresInSeconds: Number(params.expires_in),
    };

    return {
      providerInfo,
      profile,
    };

  }

  constructor(options: AzureProviderOptions) {
    this._strategy = new AzureStrategy(
      { ...options },
      (
        _req,
        _sub,
        _iss,
        rawProfile,
        _jwtClaims,
        accessToken,
        refreshToken,
        params,
        done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
      ) => {

        got.get('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
          encoding: 'binary',
          responseType: 'buffer',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(photoData => {
          const photoURL = `data:image/jpeg;base64,${Buffer.from(photoData.body).toString('base64')}`          
          const authResponse = AzureAuthProvider.transformAuthResponse(
            rawProfile,
            accessToken,
            params,
            photoURL,
          );

          done(undefined, authResponse, { refreshToken });
        }).catch(error => {
          console.log(`Error retrieving user photo from Microsoft Graph API: ${error}`)
          const authResponse = AzureAuthProvider.transformAuthResponse(
            rawProfile,
            accessToken,
            params,
          );
  
          done(undefined, authResponse, { refreshToken });
        });
      },
    );
  }

  async start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo> {
    const providerOptions = {
      ...options,
      prompt: 'consent',
      customState: options.state
    };
    return await executeRedirectStrategy(req, this._strategy, providerOptions);
  }

  async handler(
    req: express.Request
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const { response, privateInfo } = await executeFrameHandlerStrategy<OAuthResponse, PrivateInfo>(req, this._strategy);
    return {
      response: await this.populateIdentity(response),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(
    refreshToken: string,
    scope: string,
  ): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      refreshToken,
      scope,
    );

    const profile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
      params.id_token,
    );

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
  }

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;
    if (!profile.email) {
      throw new Error('Azure AD profile contained no email.');
    }

    // As per Google implementation, set to local part of email for now
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }

}

export function createAzureProvider(
  { baseUrl }: AuthProviderConfig,
  _: string,
  envConfig: Config,
  logger: Logger,
  tokenIssuer: TokenIssuer,
) {

  const providerId = 'azure';
  const secure = envConfig.getBoolean('secure');
  const appOrigin = envConfig.getString('appOrigin');

  const clientID = envConfig.getString('clientId');
  const clientSecret = envConfig.getString('clientSecret');
  const tenantID = envConfig.getString('tenantId');

  // URL metadata (e.g. authorize and token endpoints) are retrieved from the OIDC config endpoint
  const identityMetadata = `https://login.microsoftonline.com/${tenantID}/v2.0/.well-known/openid-configuration`
  
  const responseType = 'code';
  const responseMode = 'query';
  const redirectUrl = `${baseUrl}/${providerId}/handler/frame`;

  /**
   * Space separated list of required scope values. 'openid' is sent by default so does not need to be specified here.
   * For more info, see:
   * - https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
   * - https://docs.microsoft.com/en-us/graph/permissions-reference
   */
  const scope = 'offline_access profile email User.Read';

  const passReqToCallback = true;

  // passport-azure-ad requires use of cookies to be session-free
  const useCookieInsteadOfSession = true;
  const cookieEncryptionKeys = [
    { key: '12345678901234567890123456789012', iv: '123456789012' },
    { key: 'abcdefghijklmnopqrstuvwxyzabcdef', iv: 'abcdefghijkl' },
  ];

  // passport-azure-ad disallows HTTP callbacks by default
  const allowHttpForRedirectUrl = !secure;

  // passport-azure-ad logging configuration
  const loggingNoPII = false;
  const loggingLevel = 'warn';

  const opts = {
    clientID,
    clientSecret,
    identityMetadata,
    responseType,
    responseMode,
    redirectUrl,
    scope,
    passReqToCallback,
    useCookieInsteadOfSession,
    cookieEncryptionKeys,
    allowHttpForRedirectUrl,
    loggingNoPII,
    loggingLevel,
  };

  if (!opts.clientID || !opts.clientSecret) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'Failed to initialize Azure auth provider, set AUTH_AZURE_CLIENT_ID and AUTH_AZURE_CLIENT_SECRET env vars.',
      );
    }

    logger.warn(
      'Azure auth provider disabled, set AUTH_AZURE_CLIENT_ID and AUTH_AZURE_CLIENT_SECRET env vars to enable.'
    );
    return undefined;
  }
  return new OAuthProvider(new AzureAuthProvider(opts), {
    disableRefresh: false,
    persistScopes: true,
    providerId,
    secure,
    baseUrl,
    appOrigin,
    tokenIssuer,
  });

}